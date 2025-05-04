import { drumSettings } from "../global/drumSettings";

window.AudioContext = window.AudioContext || window.webkitAudioContext;

const ctxRef = { current: null };
const buffersRef = { current: {} };
const analyserRef = { current: null };
const destinationRef = { current: null };
const recorderRef = { current: null };
const recorderChunksRef = { current: [] };
const recorderStateRef = { current: "inactive" };

const drumSamples = {
  36: "/DRUM_KIT_1/Kick_1_DRY.wav",
  38: "/DRUM_KIT_1/Snare.wav",
  46: "/DRUM_KIT_1/HAT_CLOSED_1.wav",
  48: "/DRUM_KIT_1/TOM_1.wav",
  45: "/DRUM_KIT_1/TOM_2.wav",
  43: "/DRUM_KIT_1/TOM_3.wav",
  49: "/DRUM_KIT_1/Crash_1.wav",
};

export const initAudioContext = async () => {
  if (!ctxRef.current) {
    ctxRef.current = new AudioContext();

    analyserRef.current = ctxRef.current.createAnalyser();
    analyserRef.current.fftSize = 256;
    destinationRef.current = ctxRef.current.createMediaStreamDestination();

    analyserRef.current.connect(ctxRef.current.destination);
    analyserRef.current.connect(destinationRef.current);

    await loadSamples();
  }
};

const loadSamples = async () => {
  if (!ctxRef.current) return;

  for (const [note, url] of Object.entries(drumSamples)) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${url}`);

      const arrayBuffer = await response.arrayBuffer();
      const decoded = await ctxRef.current.decodeAudioData(arrayBuffer);
      buffersRef.current[note] = decoded;
    } catch (error) {
      console.error(`Error loading sample for note ${note}:`, error);
    }
  }
};

const handleMIDIInput = (input) => {
  const [status] = input.data;
  if (status === 0xf8) return;

  const command = input.data[0];
  const note = input.data[1];
  const velocity = input.data[2];

  switch (command) {
    case 153:
      if (velocity > 0) playDrum(note, velocity);
      break;
    default:
      console.log("Unknown MIDI command:", command);
      break;
  }
};

const draw = () => {
  const canvas = document.getElementById("audioCanvas");
  const context = canvas.getContext("2d");
  const analyser = analyserRef.current;
  if (!analyser || !canvas) return;
  const parentDiv = canvas.parentElement;
  canvas.width = parentDiv.clientWidth;
  canvas.height = parentDiv.clientHeight;
  canvas.style.background = "transparent";
  const frequencyData = new Uint8Array(analyser.frequencyBinCount);
  function render() {
    analyser.getByteFrequencyData(frequencyData);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.strokeStyle = "#FF4C02";
    const margin = canvas.width / frequencyData.length;
    let x = 0;
    for (let i = 0; i < frequencyData.length; ++i) {
      const y = canvas.height - (frequencyData[i] / 255) * canvas.height;
      if (i === 0) context.moveTo(x, canvas.height);
      else context.lineTo(x, y);
      x += margin;
    }
    context.stroke();
    requestAnimationFrame(render);
  }
  render();
};

const playDrum = (note, velocity) => {
  if (!ctxRef.current || !buffersRef.current[note]) {
    return;
  }

  const source = ctxRef.current.createBufferSource();
  const gainNode = ctxRef.current.createGain();
  const pannerNode = ctxRef.current.createStereoPanner();

  const settings = drumSettings[note] || { volume: 1.0, pan: 0.0 };

  source.buffer = buffersRef.current[note];

  gainNode.gain.setValueAtTime(
    (velocity / 127) * settings.volume,
    ctxRef.current.currentTime
  );
  pannerNode.pan.setValueAtTime(settings.pan, ctxRef.current.currentTime);

  source.connect(pannerNode);
  pannerNode.connect(gainNode);
  gainNode.connect(analyserRef.current);
  gainNode.connect(destinationRef.current);

  source.start();

  draw();
};

export const startRecording = () => {
  if (!destinationRef.current) return;

  if (recorderRef.current && recorderStateRef.current === "paused") {
    recorderRef.current.resume();
    recorderStateRef.current = "recording";
    console.log("Recording resumed");
    return;
  }

  recorderChunksRef.current = [];
  recorderRef.current = new MediaRecorder(destinationRef.current.stream, {
    mimeType: "audio/webm;codecs=opus",
  });
  recorderRef.current.ondataavailable = (e) => {
    if (e.data.size > 0) {
      recorderChunksRef.current.push(e.data);
    }
  };
  recorderRef.current.start();
  recorderStateRef.current = "recording";
  console.log("Recording started");
};

export const pauseRecording = () => {
  if (!recorderRef.current || recorderStateRef.current !== "recording") return;

  recorderRef.current.pause();
  recorderStateRef.current = "paused";
  console.log("Recording paused");
};

export const resumeRecording = () => {
  if (recorderStateRef.current !== "paused") return;

  recorderRef.current.resume();
  recorderStateRef.current = "recording";
  console.log("Recording resumed");
};

export const downloadRecording = (name) => {
  if (!recorderRef.current) return;

  return new Promise((resolve) => {
    recorderRef.current.onstop = () => {
      const audioBlob = new Blob(recorderChunksRef.current, {
        type: "audio/webm",
      });
      const audioUrl = URL.createObjectURL(audioBlob);

      const a = document.createElement("a");
      a.href = audioUrl;
      a.download = `${name}.webm`;
      a.click();

      URL.revokeObjectURL(audioUrl);
      console.log("Recording stopped");

      recorderRef.current = null;
      resolve({ name: `${name}.webm`, blob: audioBlob });
    };

    recorderRef.current.requestData();
    recorderRef.current.stop();
  });
};

export const connectMIDI = () => {
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
  }
};

export const disconnectMIDI = async () => {
  try {
    if (navigator.requestMIDIAccess) {
      const midiAccess = await navigator.requestMIDIAccess();
      const inputs = midiAccess.inputs;
      inputs.forEach((input) => {
        console.log("Disconnecting MIDI Input:", input);
        input.removeEventListener("midimessage", handleMIDIInput);
      });
      midiAccess.removeEventListener("statechange", updateDevices);
    }
    ctxRef.current = null;
    buffersRef.current = {};
    analyserRef.current = null;
    destinationRef.current = null;
    recorderRef.current = null;
    recorderChunksRef.current = [];
    recorderStateRef.current = "inactive";

    if (ctxRef.current) {
      await ctxRef.current.close();
      console.log("AudioContext closed");
    }

    console.log("Audio and MIDI resources cleared");
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
};

const onMIDISuccess = (midiAccess) => {
  midiAccess.addEventListener("statechange", updateDevices);
  const inputs = midiAccess.inputs;
  inputs.forEach((input) => {
    input.addEventListener("midimessage", handleMIDIInput);
  });
};

const updateDevices = (event) => {
  console.log("MIDI Device Update:", event);
  console.log(`Name: ${event.port.name}, Brand: ${event.port.manufacturer}`);
};

const onMIDIFailure = (error) => {
  console.error("MIDI Access Failed:", error);
};

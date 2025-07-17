<h1 align="center">🎧 JamLine</h1>
<p align="center"><strong>Author:</strong> <a href="https://github.com/Pasha1007">Pasha1007</a></p>

<p align="center">
  The <strong>JamLine</strong> web application enables you to record electronic musical instruments, edit the audio output, and store your tracks. It also integrates AI tools to automatically segment uploaded audio files into separate tracks.
</p>

<hr/>

<h2>🚀 Quick Start</h2>

<ol>
  <li><strong>Clone the repository:</strong><br/>
    <code>git clone https://github.com/Pasha1007/JamLine.git</code>
  </li>
  <li><strong>Navigate to the project root folder:</strong><br/>
    <code>cd JamLine</code>
  </li>
  <li><strong>Set up environment files:</strong>
    <ul>
      <li>Create an <code>.env</code> file in both <code>/backend</code> and <code>/frontend</code> folders.</li>
      <li>In <code>/backend/.env</code> add:<br/>
        <pre>
JWT_SECRET_KEY=rweqtwqfdsagqrwgfsre87423huiu2u243h932y4b38g28b
MUSIC_AI_API_KEY=34aa4a5c-ae46-48d2-a967-5de6c3aa7695
        </pre>
      </li>
      <li>In <code>/frontend/.env</code> add:<br/>
        <pre>VITE_BASE_URL=http://localhost:5200/api</pre>
      </li>
    </ul>
  </li>
  <li><strong>Start the backend:</strong>
    <ol>
      <li><code>cd backend</code></li>
      <li><code>npm i</code> – install dependencies</li>
      <li><code>npm run dev</code> – launch server on port 5200</li>
    </ol>
  </li>
  <li><strong>Start the frontend:</strong>
    <ol>
      <li><code>cd ../frontend</code></li>
      <li><code>npm i</code> – install dependencies</li>
      <li><code>npm run dev</code> – launch frontend on port 3000</li>
    </ol>
  </li>
</ol>

<p>✅ The application will be running at <a href="http://localhost:3000" target="_blank">http://localhost:3000</a></p>

<hr/>

<h2>📁 Project Structure</h2>

<ul>
  <li><code>frontend/</code> – React client with Vite and audio interface</li>
  <li><code>backend/</code> – Node.js/Express API with AI integration</li>
</ul>

<hr/>

<h2>🧠 Features</h2>

<ul>
  <li>🎙️ Record electronic instruments</li>
  <li>✂️ Edit and trim recorded audio</li>
  <li>☁️ Save tracks to local storage</li>
  <li>🤖 AI-based audio segmentation</li>
</ul>

<hr/>

<h2>💡 Tips</h2>

<ul>
  <li>Make sure ports <code>3000</code> (frontend) and <code>5200</code> (backend) are free</li>
  <li>Check <code>.env</code> formatting – no quotes around values</li>
</ul>

<hr/>

<p align="center">🎵 Made with passion by <a href="https://github.com/Pasha1007">Pasha1007</a> 🎶</p>

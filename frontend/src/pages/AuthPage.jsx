import React, { useState } from "react";
import bgImage from "../assets/auth-bg.png";
import { AppButton } from "../components/atoms/AppButton";
import { IconNote1 } from "../components/icons/IconNote1";
import { IconNote2 } from "../components/icons/IconNote2";
import { AppInput } from "../components/atoms/AppInput";
import IconLogo from "../assets/logo.svg";
import { authUser } from "../services/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const authorization = async () => {
    try {
      const data = await authUser(email, password);
      navigate("/");
      toast.success("Welcome to JamLine!");
    } catch (error) {
      console.error("Error during authorization:", error);
      toast.warning("Check credentials");
    }
  };
  return (
    <div
      className="w-[100vw] h-[100vh] bg-[#1E1E1E] bg-cover bg-no-repeat flex justify-center items-center shadow-[inset_0_0_250px_-71px_rgba(0,0,0,0.58)]"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="app-card text-white w-[450px]">
        <div className="flex items-center justify-center py-4">
          <img src={IconLogo} alt="Logo" className="w-6 mr-2" />
          <span className="tektur-xl">JamLine</span>
        </div>
        <div className="flex flex-col items-center mt-2">
          <p className="tektur-lg">Log in or sign up</p>
          <p className="ibm-md-secondary">
            Welcome to JamLine. Sign in with your email
          </p>
        </div>
        <div className="flex flex-col items-center mt-6 gap-4 pb-10">
          <AppInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <AppInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="divider"></div>
        <AppButton
          className="group hover:shadow-[0_0_10px_1px_rgba(255,255,255,0.34)] transition-all ease-in-out"
          onClick={authorization}
        >
          <IconNote2 />
          <span className="text-lg font-semibold mx-2 group-hover:mx-4 transition-all ease-in-out">
            Continue
          </span>
          <IconNote1 />
        </AppButton>
      </div>
    </div>
  );
};

export default AuthPage;

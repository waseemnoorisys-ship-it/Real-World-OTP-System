import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const sendOtp = async () => {
    try {
      await api.post("/auth/send-otp", {
        email,
      });

      navigate("/verify", {
        state: { email },
      });
    } catch (error) {
      //   alert(error.response.data.message)
      alert(error?.response?.data?.message || error.message);
    }
  };

  

  return (
    <div>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={sendOtp}>Send OTP</button>

      <br />
      <br />

      <button
        onClick={() => {
          window.location.href = "http://localhost:5000/api/auth/google";
        }}
      >
        Sign in with Google
      </button>

      <br />
      <br />
      <button onClick={() => {navigate("/forgot-password")}}>
        Forgot Password
        
      </button>

      
    </div>
  );
}

export default Login;

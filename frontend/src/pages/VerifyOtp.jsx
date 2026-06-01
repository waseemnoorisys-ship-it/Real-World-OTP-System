import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import api from "../services/api";

function VerifyOtp() {
  const [otp, setOtp] = useState("");

  const location = useLocation();

  const navigate = useNavigate();

  const email = location.state?.email;

  const verifyOtp = async () => {
    try {
      const res = await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      // localStorage.setItem("token", res.data.token);
      localStorage.setItem("token", res.data.accessToken);

      navigate("/dashboard");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div>
      <h1>Verify OTP</h1>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button onClick={verifyOtp}>Verify</button>
    </div>
  );
}

export default VerifyOtp;

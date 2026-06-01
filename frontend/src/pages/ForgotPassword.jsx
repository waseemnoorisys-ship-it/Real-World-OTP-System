import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const sendResetLink = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        {
          email,
        },
      );
      alert(res.data.message);
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  return (
    <div>
      <h1>Forgot Password</h1>
      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={sendResetLink}>Send Reset Link</button>
    </div>
  );
};

export default ForgotPassword;

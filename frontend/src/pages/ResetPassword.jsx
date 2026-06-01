import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const resetPassword = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          password,
        },
      );
      alert(res.data.message);
      navigate("/");
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  return (
    <div>
      <h1>Reset Password</h1>
      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={resetPassword}>Reset Password</button>
    </div>
  );
};

export default ResetPassword;

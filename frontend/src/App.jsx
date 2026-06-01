import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import VerifyOtp from "./pages/VerifyOtp";
import Dashboard from "./pages/Dashboard";
import OAuthSuccess from "./pages/OAuthSuccess";
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route path="/verify" element={<VerifyOtp />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/oauth-success" element={<OAuthSuccess />} />
    </Routes>
  );
}

export default App;

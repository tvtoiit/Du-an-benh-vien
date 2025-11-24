import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// pages
import Home from "./pages/user/Home";
import MedicalDashboard from "./pages/admin/MedicalDashboard";
import Login from "./pages/user/login/Login";
import Register from "./pages/user/register/Register";

function App() {
  return (
    <>
      {/* đặt ToastContainer ở đây */}
      <ToastContainer position="top-right" autoClose={2000} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<MedicalDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;

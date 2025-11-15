import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

// pages
import Home from "./pages/user/Home";
import MedicalDashboard from "./pages/admin/MedicalDashboard";
import Login from "./pages/user/login/Login";
import Register from "./pages/user/register/Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <Home />
      } />
      <Route path="/admin" element={
        <MedicalDashboard />
      } />
      <Route path="/login" element={
        <Login />
      } />
      <Route path="/register" element={
        <Register />
      } />
    </Routes>
  );
}

export default App;

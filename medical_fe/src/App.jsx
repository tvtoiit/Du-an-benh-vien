import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

// pages
import Home from "./pages/user/Home";
import MedicalDashboard from "./pages/admin/MedicalDashboard";
import Login from "./pages/user/Login";

function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={
        // <Home />
        <MedicalDashboard />
      } />
      <Route path="/login" element={
        <Login />
      } />

      {/* User routes */}

    </Routes>
  );
}

export default App;

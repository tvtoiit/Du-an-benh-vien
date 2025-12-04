import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layout
import MainLayout from "./pages/user/MainLayout";

// pages
import Home from "./pages/user/Home";
import MedicalDashboard from "./pages/admin/MedicalDashboard";
import Login from "./pages/user/login/Login";
import Register from "./pages/user/register/Register";
import ResetPassword from "./pages/user/reset/ResetPassword";
import ForgotPassword from "./pages/user/forgot/ForgotPassword";
import VerifyOtp from "./pages/user/reset/VerifyOtp";
import BookingPage from "./pages/user/booking/BookingPage";
import TraCuu from "./pages/user/tracuu/tracuu";
import ProfilePage from "./pages/user/profile/ProfilePage";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />

        <Route
          path="/profile"
          element={
            <MainLayout>
              <ProfilePage />
            </MainLayout>} />

        <Route
          path="/login"
          element={
            <MainLayout>
              <Login />
            </MainLayout>
          }
        />

        <Route
          path="/register"
          element={
            <MainLayout>
              <Register />
            </MainLayout>
          }
        />

        <Route
          path="/lichkham"
          element={
            <MainLayout>
              <TraCuu />
            </MainLayout>
          }
        />

        <Route path="/forgot-password" element={<MainLayout><ForgotPassword /></MainLayout>} />
        <Route path="/reset-password" element={<MainLayout><ResetPassword /></MainLayout>} />
        <Route path="/verify-otp" element={<MainLayout><VerifyOtp /></MainLayout>} />
        <Route path="/booking" element={<MainLayout><BookingPage /></MainLayout>} />


        <Route
          path="/admin"
          element={
            <MedicalDashboard />
          }
        />
      </Routes >
    </>
  );
}

export default App;

import Home from "./pages/Home";
import Appointment from "./pages/user/Appointment";
import Profile from "./pages/user/Profile";
import MedicalHistory from "./pages/user/MedicalHistory";

import Reception from "./pages/staff/Reception";
import Services from "./pages/staff/Services";
import Payment from "./pages/staff/Payment";
import Pharmacy from "./pages/staff/Pharmacy";

import DoctorConsultation from "./pages/doctor/Consultation";
import DoctorFinalization from "./pages/doctor/Finalization";

import AdminDashboard from "./pages/admin/Dashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageServices from "./pages/admin/ManageServices";

export const routes = {
  user: [
    { path: "/", element: <Home /> },
    { path: "/appointment", element: <Appointment /> },
    { path: "/profile", element: <Profile /> },
    { path: "/history", element: <MedicalHistory /> },
  ],
  staff: [
    { path: "/reception", element: <Reception /> },
    { path: "/services", element: <Services /> },
    { path: "/payment", element: <Payment /> },
    { path: "/pharmacy", element: <Pharmacy /> },
  ],
  doctor: [
    { path: "/consultation", element: <DoctorConsultation /> },
    { path: "/finalization", element: <DoctorFinalization /> },
  ],
  admin: [
    { path: "/admin", element: <AdminDashboard /> },
    { path: "/admin/users", element: <ManageUsers /> },
    { path: "/admin/services", element: <ManageServices /> },
  ]
};
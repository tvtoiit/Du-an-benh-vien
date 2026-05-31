import React, { useState, useEffect } from 'react';
import "../../styles/MedicalDash.css";
import PatientList from './Patient/PatientList';
import BacSi from './bacsi/BacSiList';
import ExamDashboard from '../features/Dashboard/ExamDashboard';
import UserManagement from '../admin/users/UserManagement';
import permissions from '../../config/permissions';
import loginService from "../../services/loginService";
import { useNavigate } from "react-router-dom";
import ListThuoc from '../admin/thuoc/ThuocList';
import ServiceList from '../admin/dichvu/ServiceList';
import RoomList from '../admin/phong/RoomList'
import ThongKeDashboard from './thongke/ThongKeDashboard';
import logo from "../../assets/logo.jpg";
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MedicationIcon from '@mui/icons-material/Medication';
import ApartmentIcon from '@mui/icons-material/Apartment';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import BarChartIcon from '@mui/icons-material/BarChart';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';

const MedicalDashboard = () => {
    const [role, setRole] = useState(null);
    const [userPermissions, setUserPermissions] = useState([]);
    // Sử dụng state để quản lý vai trò đang được chọn
    const [activeRole, setActiveRole] = useState('Người dùng');

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // get token từ localstorage
    const getlocalStorage = localStorage.getItem("token");
    const navigate = useNavigate();


    // call api get role user từ token
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userlogin = await loginService.loginCheckUser(getlocalStorage);

                if (userlogin) {
                    const roleResult = userlogin.role;
                    // Lấy quyền theo vai trò
                    const userPermission = permissions[roleResult];
                    setRole(roleResult);
                    setUserPermissions(userPermission);

                    // Chọn activeRole đầu tiên dựa trên quyền
                    if (userPermission.Thongke) setActiveRole('Thongke');
                    else if (userPermission.quanLyUser) setActiveRole('Người dùng');
                    else if (userPermission.quanLyBenhNhan) setActiveRole('Bệnh nhân');
                    else if (userPermission.chiDinhKham) setActiveRole('Khám bệnh');
                    else if (userPermission.quanLyKho) setActiveRole('Cận lâm sàng');
                    else if (userPermission.thanhToan) setActiveRole('Thu ngân');
                    else if (userPermission.Phong) setActiveRole('Phong');
                    else setActiveRole(null);
                }
            } catch (error) {
                console.error("Lỗi gọi API:", error);
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const can = (permissionKey) => {
        return userPermissions && userPermissions[permissionKey];
    };

    const roleDisplayMap = {
        "ROLE_LETAN": "Lễ tân",
        "ROLE_BACSI": "Bác sĩ",
        "ROLE_CANLAMSANG": "Cận lâm sàng",
        "ROLE_NHATHUOC": "Nhà thuốc",
        "ROLE_THUNGAN": "Thu ngân",
        "ROLE_ADMIN": "Quản trị viên",
        "ROLE_USER": "Người dùng"
    };
    // Một hàm để xác định nội dung chính dựa trên vai trò đang hoạt động
    const renderMainContent = () => {
        switch (activeRole) {

            case 'Người dùng':
                if (!can("quanLyUser")) return <p>Bạn không có quyền truy cập chức năng Quản lý người dùng.</p>;
                return (
                    <div className="main-content-box">
                        <UserManagement currentRole={role} />
                    </div>
                );

            case 'Bệnh nhân':
                if (!can("quanLyBenhNhan")) return <p>Bạn không có quyền truy cập Quản lý bệnh nhân.</p>;
                return (
                    <div className="main-content-box">
                        <PatientList />
                    </div>
                );

            case 'Bác Sĩ':
                if (!can("quanLyBacSi")) return <p>Bạn không có quyền truy cập Quản lý bệnh nhân.</p>;
                return (
                    <div className="main-content-box">
                        <BacSi />
                    </div>
                );

            case 'Khám bệnh':
                if (!can("chiDinhKham")) return <p>Bạn không có quyền truy cập Khám bệnh.</p>;
                return (
                    <div className="main-content-box">
                        <ExamDashboard userPermissions={userPermissions} />
                    </div>
                );

            case 'Thuoc':
                if (!can("Thuoc")) return <p>Bạn không có quyền truy cập Thuốc</p>;
                return (
                    <div className="main-content-box">
                        <ListThuoc />
                    </div>
                );

            case 'dichVu':
                if (!can("dichVu")) return <p>Bạn không có quyền truy cập Dịch vụ.</p>;
                return (
                    <div className="main-content-box">
                        <ServiceList />
                    </div>
                );

            case 'Phong':
                if (!can("Phong")) return <p>Bạn không có quyền truy cập Phong</p>;
                return (
                    <div className="main-content-box">
                        <RoomList />
                    </div>
                );
            case 'Thongke':
                if (!can("Thongke")) return <p>Bạn không có quyền truy cập Thongke</p>;
                return (
                    <div className="main-content-box">
                        <ThongKeDashboard />
                    </div>
                );

            default:
                return null;
        }


    };

    return (
        <div className="app-container">
            <header className="header-container">
                <MenuIcon
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    style={{
                        cursor: "pointer",
                        marginRight: "15px",
                        fontSize: "28px"
                    }}
                />
                <div className="logo">
                    <img
                        width="200"
                        src={logo}
                        alt="Logo"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/")}
                    />
                </div>

                <nav className="header-nav">
                    <ul className="logout-list">
                        <li className="logout-btn" onClick={handleLogout}>
                            Đăng xuất
                        </li>
                    </ul>


                </nav>
            </header>

            <div className="main-layout">
                <aside className={`sidebar-menu ${isSidebarOpen ? "open" : "collapsed"}`}>
                    {isSidebarOpen && (
                        <h2>{roleDisplayMap[role] || role}</h2>
                    )}
                    <ul>
                        {can("Thongke") && (
                            <li
                                className={activeRole === 'Thongke' ? 'active' : ''}
                                onClick={() => setActiveRole('Thongke')}
                                title="Thống kê"
                            >
                                <BarChartIcon style={{ marginRight: isSidebarOpen ? 10 : 0 }} />
                                {isSidebarOpen && "Thống kê"}
                            </li>
                        )}

                        {can("quanLyUser") && (
                            <li
                                className={activeRole === 'Người dùng' ? 'active' : ''}
                                onClick={() => setActiveRole('Người dùng')}
                                title="Quản lý người dùng"
                            >
                                <PeopleIcon style={{ marginRight: isSidebarOpen ? 10 : 0 }} />
                                {isSidebarOpen && "Quản lý người dùng"}
                            </li>
                        )}

                        {can("quanLyBenhNhan") && (
                            <li
                                className={activeRole === 'Bệnh nhân' ? 'active' : ''}
                                onClick={() => setActiveRole('Bệnh nhân')}
                                title="Quản lý bệnh nhân"
                            >
                                <LocalHospitalIcon style={{ marginRight: isSidebarOpen ? 10 : 0 }} />
                                {isSidebarOpen && "Quản lý bệnh nhân"}
                            </li>
                        )}

                        {can("quanLyBacSi") && (
                            <li
                                className={activeRole === 'Bác Sĩ' ? 'active' : ''}
                                onClick={() => setActiveRole('Bác Sĩ')}
                                title="Quản lý bác sĩ"
                            >
                                <MedicalServicesIcon style={{ marginRight: isSidebarOpen ? 10 : 0 }} />
                                {isSidebarOpen && "Quản lý bác sĩ"}
                            </li>
                        )}

                        {(can("tiepNhan") || can("phieuKham") || can("canLamSang") || can("keDonThuoc") || can("thanhToan")) && (
                            <li
                                className={activeRole === 'Khám bệnh' ? 'active' : ''}
                                onClick={() => setActiveRole('Khám bệnh')}
                                title="Quản lý khám bệnh"
                            >
                                <DashboardIcon style={{ marginRight: isSidebarOpen ? 10 : 0 }} />
                                {isSidebarOpen && "Quản lý khám bệnh"}
                            </li>
                        )}

                        {can("Thuoc") && (
                            <li
                                className={activeRole === 'Thuoc' ? 'active' : ''}
                                onClick={() => setActiveRole('Thuoc')}
                                title="Quản lý thuốc"
                            >
                                <MedicationIcon style={{ marginRight: isSidebarOpen ? 10 : 0 }} />
                                {isSidebarOpen && "Quản lý thuốc"}
                            </li>
                        )}

                        {can("dichVu") && (
                            <li
                                className={activeRole === 'dichVu' ? 'active' : ''}
                                onClick={() => setActiveRole('dichVu')}
                                title="Quản lý dịch vụ"
                            >
                                <MiscellaneousServicesIcon style={{ marginRight: isSidebarOpen ? 10 : 0 }} />
                                {isSidebarOpen && "Quản lý dịch vụ"}
                            </li>
                        )}

                        {can("Phong") && (
                            <li
                                className={activeRole === 'Phong' ? 'active' : ''}
                                onClick={() => setActiveRole('Phong')}
                                title="Quản lý phòng"
                            >
                                <MeetingRoomIcon style={{ marginRight: isSidebarOpen ? 10 : 0 }} />
                                {isSidebarOpen && "Quản lý phòng"}
                            </li>
                        )}
                    </ul>
                </aside>


                <main className="main-content-area">
                    {renderMainContent()}
                </main>
            </div>
        </div>
    );
};

export default MedicalDashboard;

import React, { useState, useEffect } from 'react';
import "../../styles/MedicalDash.css";
import PatientList from './Patient/PatientList';
import BacSi from './bacsi/BacSiList';
import ExamDashboard from '../features/Dashboard/ExamDashboard';
import UserManagement from '../admin/users/UserManagement';
import permissions from '../../config/permissions';
import loginService from "../../services/loginService";

const MedicalDashboard = () => {
    const [role, setRole] = useState(null);
    const [userPermissions, setUserPermissions] = useState([]);
    // Sử dụng state để quản lý vai trò đang được chọn
    const [activeRole, setActiveRole] = useState('Người dùng');
    // get token từ localstorage
    const getlocalStorage = localStorage.getItem("token");

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
                    if (userPermission.quanLyUser) setActiveRole('Người dùng');
                    else if (userPermission.quanLyBenhNhan) setActiveRole('Bệnh nhân');
                    else if (userPermission.chiDinhKham) setActiveRole('Khám bệnh');
                    else if (userPermission.quanLyKho) setActiveRole('Cận lâm sàng');
                    else if (userPermission.thanhToan) setActiveRole('Thu ngân');
                    else setActiveRole(null);
                }
            } catch (error) {
                console.error("Lỗi gọi API:", error);
            }
        };

        fetchData();
    }, []);

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
                        <UserManagement />
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

            case 'Cận lâm sàng':
                if (!can("quanLyKho")) return <p>Bạn không có quyền truy cập Cận lâm sàng.</p>;
                return (
                    <div className="main-content-box">
                        <h3>Kết quả xét nghiệm</h3>
                        <p>Khu vực này để nhập và xem các kết quả xét nghiệm.</p>
                    </div>
                );

            case 'Thu ngân':
                if (!can("thanhToan")) return <p>Bạn không có quyền truy cập Thanh toán.</p>;
                return (
                    <div className="main-content-box">
                        <h3>Hóa đơn</h3>
                        <p>Quản lý các hóa đơn thanh toán cho bệnh nhân.</p>
                    </div>
                );

            case 'Nhà thuốc':
                if (!can("quanLyKho")) return <p>Bạn không có quyền truy cập Nhà thuốc.</p>;
                return (
                    <div className="main-content-box">
                        <h3>Đơn thuốc</h3>
                        <p>Hiển thị và quản lý các đơn thuốc đã được kê.</p>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="app-container">
            <header className="header-container">
                <div className="logo">LOGO</div>
                <nav className="header-nav">
                    <ul>
                        <li><a href="#">Lễ tân</a></li>
                        <li><a href="#">Cận lâm sàng</a></li>
                        <li><a href="#">Bác sĩ</a></li>
                        <li><a href="#">Nhà thuốc</a></li>
                        <li><a href="#">Thu ngân</a></li>
                        <li><a href="#">Đăng xuất</a></li>
                    </ul>
                </nav>
            </header>

            <div className="main-layout">
                <aside className="sidebar-menu">
                    <h2>({roleDisplayMap[role] || role})</h2>
                    <ul>
                        {can("quanLyUser") && (
                            <li className={activeRole === 'Người dùng' ? 'active' : ''} onClick={() => setActiveRole('Người dùng')}>
                                [Quản lí người dùng]
                            </li>
                        )}
                        {can("quanLyBenhNhan") && (
                            <li className={activeRole === 'Bệnh nhân' ? 'active' : ''} onClick={() => setActiveRole('Bệnh nhân')}>
                                [Quản lí bệnh nhân]
                            </li>
                        )}
                        {can("quanLyBacSi") && (
                            <li className={activeRole === 'Bác Sĩ' ? 'active' : ''} onClick={() => setActiveRole('Bác Sĩ')}>
                                [Quản lí bác sĩ]
                            </li>
                        )}
                        {can("chiDinhKham") && (
                            <li className={activeRole === 'Khám bệnh' ? 'active' : ''} onClick={() => setActiveRole('Khám bệnh')}>
                                [Quản lí khám bệnh]
                            </li>
                        )}
                        {can("quanLyKho") && (
                            <li className={activeRole === 'Cận lâm sàng' ? 'active' : ''} onClick={() => setActiveRole('Cận lâm sàng')}>
                                [Quản lí dược kho]
                            </li>
                        )}
                        {can("thanhToan") && (
                            <li className={activeRole === 'Thu ngân' ? 'active' : ''} onClick={() => setActiveRole('Thu ngân')}>
                                [Quản lí thu ngân]
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

import React, { useState } from 'react';
import PatientList from './Patient/PatientList';
import ExamDashboard from '../features/Dashboard/ExamDashboard';
import UserManagement from '../admin/users/UserManagement';

const MedicalDashboard = () => {
    // Sử dụng state để quản lý vai trò đang được chọn
    const [activeRole, setActiveRole] = useState('Người dùng');

    // Một hàm để xác định nội dung chính dựa trên vai trò đang hoạt động
    const renderMainContent = () => {
        switch (activeRole) {
            case 'Người dùng':
                return (
                    <div className="main-content-box">
                        <UserManagement />
                    </div>
                );
            case 'Bệnh nhân':
                return (
                    <div className="main-content-box">
                        <PatientList />
                    </div>
                );
            case 'Khám bệnh':
                return (
                    <div className="main-content-box">
                        <ExamDashboard />
                    </div>
                );
            case 'Cận lâm sàng':
                return (
                    <div className="main-content-box">
                        <h3>Kết quả xét nghiệm</h3>
                        <p>Khu vực này để nhập và xem các kết quả xét nghiệm.</p>
                        {/* Thêm form/bảng kết quả xét nghiệm ở đây */}
                    </div>
                );
            case 'Thu ngân':
                return (
                    <div className="main-content-box">
                        <h3>Hóa đơn</h3>
                        <p>Quản lý các hóa đơn thanh toán cho bệnh nhân.</p>
                        {/* Thêm bảng hóa đơn và chức năng thanh toán ở đây */}
                    </div>
                );
            case 'Nhà thuốc':
                return (
                    <div className="main-content-box">
                        <h3>Đơn thuốc</h3>
                        <p>Hiển thị và quản lý các đơn thuốc đã được kê.</p>
                        {/* Thêm danh sách/form đơn thuốc ở đây */}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <style>
                {`
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f0f2f5;
                        color: #333;
                    }

                    .app-container {
                        display: flex;
                        flex-direction: column;
                        height: 100vh;
                        overflow: hidden;
                    }

                    .header-container {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        background-color: #fff;
                        padding: 10px 20px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        flex-wrap: wrap;
                    }

                    .logo {
                        font-size: 24px;
                        font-weight: bold;
                        color: #007bff;
                        margin-right: 20px;
                    }

                    .header-nav {
                        display: flex;
                        flex-grow: 1;
                        justify-content: flex-end;
                        flex-wrap: wrap;
                    }

                    .header-nav ul {
                        list-style: none;
                        margin: 0;
                        padding: 0;
                        display: flex;
                    }

                    .header-nav li {
                        margin-left: 20px;
                        white-space: nowrap;
                    }

                    .header-nav a {
                        text-decoration: none;
                        color: #555;
                        font-weight: 600;
                        transition: color 0.3s;
                    }

                    .header-nav a:hover {
                        color: #0056b3;
                    }

                    .main-layout {
                        display: flex;
                        flex-grow: 1;
                        overflow: hidden;
                    }

                    .sidebar-menu {
                        width: 250px;
                        background-color: #2c3e50;
                        color: #ecf0f1;
                        padding: 20px;
                        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
                        flex-shrink: 0;
                        overflow-y: auto;
                    }

                    .sidebar-menu h2 {
                        margin-top: 0;
                        font-size: 1.5rem;
                        color: #fff;
                        padding-bottom: 10px;
                        border-bottom: 1px solid #34495e;
                        margin-bottom: 15px;
                    }

                    .sidebar-menu ul {
                        list-style: none;
                        margin: 0;
                        padding: 0;
                    }

                    .sidebar-menu li {
                        padding: 12px 15px;
                        cursor: pointer;
                        border-radius: 5px;
                        margin-bottom: 5px;
                        transition: background-color 0.2s, color 0.2s;
                    }

                    .sidebar-menu li:hover {
                        background-color: #34495e;
                    }

                    .sidebar-menu li.active {
                        background-color: #007bff;
                        color: #fff;
                        font-weight: bold;
                    }

                    .main-content-area {
                        flex-grow: 1;
                        padding: 20px;
                        background-color: #f9f9f9;
                        overflow-y: auto;
                    }

                    .main-content-box {
                        background-color: #fff;
                        padding: 25px;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }

                    .main-content-box h3 {
                        margin-top: 0;
                        color: #007bff;
                        font-size: 1.8rem;
                        border-bottom: 2px solid #eee;
                        padding-bottom: 10px;
                        margin-bottom: 15px;
                    }
                `}
            </style>
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
                        <h2>Sidebar Menu (vai trò)</h2>
                        <ul>
                            <li className={activeRole === 'Người dùng' ? 'active' : ''} onClick={() => setActiveRole('Người dùng')}>
                                [Quản lí người dùng]
                            </li>
                            <li className={activeRole === 'Bệnh nhân' ? 'active' : ''} onClick={() => setActiveRole('Bệnh nhân')}>
                                [Quản lí bệnh nhân]
                            </li>
                            <li className={activeRole === 'Khám bệnh' ? 'active' : ''} onClick={() => setActiveRole('Khám bệnh')}>
                                [Quản lí khám bệnh]
                            </li>
                            <li className={activeRole === 'Cận lâm sàng' ? 'active' : ''} onClick={() => setActiveRole('Cận lâm sàng')}>
                                [Quản lí dược kho]
                            </li>
                            <li className={activeRole === 'Thu ngân' ? 'active' : ''} onClick={() => setActiveRole('Thu ngân')}>
                                [Quản lí thu ngân]
                            </li>
                        </ul>
                    </aside>

                    <main className="main-content-area">
                        {renderMainContent()}
                    </main>
                </div>
            </div>
        </>
    );
};

export default MedicalDashboard;

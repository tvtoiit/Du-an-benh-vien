import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
// Giả định sử dụng React Router để lấy ID
// import { useParams } from 'react-router-dom';

const PatientProfile = () => {
    // const { patientId } = useParams(); // Lấy ID từ URL
    const [patientData, setPatientData] = useState(null);
    const [activeTab, setActiveTab] = useState('info'); // Tab hiện tại

    // Mô phỏng dữ liệu chi tiết của BN
    useEffect(() => {
        // Gọi API để lấy dữ liệu chi tiết theo patientId
        const mockDetail = {
            id: 'BN001',
            name: 'Nguyễn Văn A',
            dob: '1990-01-15',
            phone: '090xxxxxx',
            bloodType: 'A+',
            allergies: 'Penicillin',
            history: [/* lịch sử khám bệnh */],
            results: [/* kết quả xét nghiệm */],
            billing: [/* hóa đơn */]
        };
        setPatientData(mockDetail);
    }, [/* patientId */]);

    if (!patientData) return <div>Đang tải hồ sơ...</div>;

    const renderContent = () => {
        switch (activeTab) {
            case 'info':
                return (
                    <div>
                        <h3>Thông tin Cơ bản</h3>
                        <p>Nhóm máu: **{patientData.bloodType}**</p>
                        <p style={{ color: 'red', fontWeight: 'bold' }}>Dị ứng: **{patientData.allergies}**</p>
                        {/* Các chi tiết khác */}
                    </div>
                );
            case 'history':
                return (
                    <div>
                        <h3>Lịch sử Khám Bệnh</h3>
                        <p>Hiển thị bảng các lần khám: Ngày, Bác sĩ, Chẩn đoán.</p>
                    </div>
                );
            case 'results':
                return (
                    <div>
                        <h3>Kết quả Xét nghiệm</h3>
                        <p>Danh sách các file kết quả (có nút tải xuống).</p>
                    </div>
                );
            case 'billing':
                return (
                    <div>
                        <h3>Viện Phí & Thanh toán</h3>
                        <p>Bảng các hóa đơn và trạng thái thanh toán.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ flexGrow: 1, padding: '20px' }}>
                <Header title={`Hồ Sơ Bệnh Nhân: ${patientData.name} (${patientData.id})`} />

                {/* Thông tin Header cố định */}
                <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
                    <h2>{patientData.name}</h2>
                    <p>SĐT: **{patientData.phone}** | Ngày sinh: **{patientData.dob}**</p>
                    <button style={{ backgroundColor: '#28a745', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px', marginTop: '10px' }}>Tạo Lịch Hẹn Mới</button>
                </div>

                {/* Khu vực Tabs */}
                <div className="tabs" style={{ display: 'flex', borderBottom: '2px solid #ccc' }}>
                    {['info', 'history', 'results', 'billing'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '10px 15px',
                                marginRight: '5px',
                                cursor: 'pointer',
                                backgroundColor: activeTab === tab ? '#007bff' : 'transparent',
                                color: activeTab === tab ? 'white' : 'black',
                                border: 'none',
                                borderTopLeftRadius: '4px',
                                borderTopRightRadius: '4px'
                            }}
                        >
                            {tab === 'info' && 'Thông Tin Cơ Bản'}
                            {tab === 'history' && 'Lịch Sử Khám'}
                            {tab === 'results' && 'Xét Nghiệm/Hình Ảnh'}
                            {tab === 'billing' && 'Viện Phí'}
                        </button>
                    ))}
                </div>

                {/* Nội dung Tab */}
                <div style={{ border: '1px solid #ccc', borderTop: 'none', padding: '20px' }}>
                    {renderContent()}
                </div>

            </div>
        </div>
    );
};

export default PatientProfile;
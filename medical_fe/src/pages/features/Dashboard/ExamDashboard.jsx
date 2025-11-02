import React, { useState } from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardActionArea,
    CardContent,
    Button,
} from "@mui/material";
import {
    FaUserPlus,
    FaStethoscope,
    FaMicroscope,
    FaPrescriptionBottleAlt,
    FaCashRegister,
} from "react-icons/fa";
import TiepNhan from "../Appointments/TiepNhan";
import DsbenhNhanKham from "../khambenh/DsBenhNhanKham";
import DsCanLamSangList from "../canlamsang/DsCanLamSangList";
import DsBenhNhanCoKetQua from "../thuoc/DsBenhNhanCoKetQua";
import DsBenhNhanThanhToan from "../thanhtoan/DsBenhNhanThanhToan";

const features = [
    {
        id: 1,
        title: "Tiếp nhận & chỉ định khám",
        icon: <FaUserPlus size={36} color="#1976d2" />,
        description: "Đăng ký bệnh nhân, tiếp nhận thông tin và tạo chỉ định khám ban đầu.",
        key: "tiepnhan",
    },
    {
        id: 2,
        title: "Khám bệnh (phiếu khám)",
        icon: <FaStethoscope size={36} color="#2e7d32" />,
        description: "Bác sĩ thực hiện khám và ghi nhận phiếu khám, chẩn đoán ban đầu.",
        key: "phieukham",
    },
    {
        id: 3,
        title: "Chỉ định cận lâm sàng",
        icon: <FaMicroscope size={36} color="#0288d1" />,
        description: "Gửi chỉ định xét nghiệm, chẩn đoán hình ảnh và xem kết quả.",
        key: "canlamsang",
    },
    {
        id: 4,
        title: "Kê đơn thuốc",
        icon: <FaPrescriptionBottleAlt size={36} color="#f57c00" />,
        description: "Tạo đơn thuốc cho bệnh nhân sau khi có kết quả khám.",
        key: "kedonthuoc",
    },
    {
        id: 5,
        title: "Thanh toán & hoàn tất",
        icon: <FaCashRegister size={36} color="#c2185b" />,
        description: "Thực hiện thanh toán và kết thúc quy trình khám bệnh.",
        key: "thanhtoan",
    },
];

const ExamDashboard = () => {
    const [selectedFeature, setSelectedFeature] = useState(null); // ✅ ĐÃ SỬA LẠI

    const handleClick = (featureKey) => {
        setSelectedFeature(featureKey);
    };

    const handleBack = () => {
        setSelectedFeature(null);
    };

    return (
        <Box sx={{ p: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
            {!selectedFeature ? (
                <>
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        textAlign="center"
                        mb={4}
                        color="primary"
                    >
                        Quản lý khám bệnh
                    </Typography>

                    <Grid
                        container
                        spacing={3}
                        justifyContent="center"
                        alignItems="center"
                        sx={{ maxWidth: 1200, margin: "0 auto" }}
                    >
                        {features.map((f) => (
                            <Grid item key={f.id}>
                                <Card
                                    sx={{
                                        width: 280, // 👈 fix cứng độ rộng
                                        height: 230, // 👈 fix cứng độ cao
                                        borderRadius: 4,
                                        boxShadow: 3,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        textAlign: "center",
                                        transition: "0.3s",
                                        "&:hover": {
                                            transform: "translateY(-5px)",
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    <CardActionArea
                                        onClick={() => handleClick(f.key)}
                                        sx={{
                                            height: "100%",
                                            width: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <CardContent>
                                            <Box sx={{ mb: 2 }}>{f.icon}</Box>
                                            <Typography
                                                variant="subtitle1"
                                                fontWeight="bold"
                                                gutterBottom
                                            >
                                                {f.title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    px: 1,
                                                    whiteSpace: "normal",
                                                    wordBreak: "break-word",
                                                }}
                                            >
                                                {f.description}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </>
            ) : (
                <Box>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleBack}
                        sx={{ mb: 2 }}
                    >
                        ← Quay lại
                    </Button>
                    {selectedFeature === "tiepnhan" && <TiepNhan />}
                    {selectedFeature === "phieukham" && <DsbenhNhanKham />}
                    {selectedFeature === "canlamsang" && <DsCanLamSangList />}
                    {selectedFeature === "kedonthuoc" && <DsBenhNhanCoKetQua />}
                    {selectedFeature === "thanhtoan" && <DsBenhNhanThanhToan />}
                </Box>
            )}
        </Box>
    );
};

export default ExamDashboard;

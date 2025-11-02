import React, { useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
} from "@mui/material";
import MedicalExamForm from "./MedicalExamForm";

// Danh sách giả lập bệnh nhân cần khám
const mockPatients = [
    { id: 1, name: "Nguyễn Văn A", gender: "Nam", birth: "1988-03-12", status: "Chờ khám" },
    { id: 2, name: "Trần Thị B", gender: "Nữ", birth: "1995-06-22", status: "Đang khám" },
    { id: 3, name: "Lê Văn C", gender: "Nam", birth: "2000-01-10", status: "Đã khám" },
];

const DsBenhNhanKham = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);

    if (selectedPatient) {
        // Khi chọn 1 bệnh nhân → hiển thị form khám
        return (
            <MedicalExamForm
                patient={selectedPatient}
                onBack={() => setSelectedPatient(null)}
            />
        );
    }

    // Hàm đổi màu chip theo trạng thái
    const getStatusColor = (status) => {
        switch (status) {
            case "Chờ khám":
                return "warning";
            case "Đang khám":
                return "info";
            case "Đã khám":
                return "success";
            default:
                return "default";
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" mb={3} color="primary">
                Danh sách bệnh nhân chờ khám
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3, maxWidth: 900, mx: "auto" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>STT</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Họ và tên</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Giới tính</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Ngày sinh</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Trạng thái</TableCell>
                            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mockPatients.map((p, index) => (
                            <TableRow key={p.id} hover>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{p.name}</TableCell>
                                <TableCell>{p.gender}</TableCell>
                                <TableCell>{p.birth}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={p.status}
                                        color={getStatusColor(p.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => setSelectedPatient(p)}
                                    >
                                        {p.status === "Đã khám" ? "Xem phiếu" : "Khám"}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default DsBenhNhanKham;

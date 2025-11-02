import React, { useState } from "react";
import {
    Box, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button
} from "@mui/material";
import PrescriptionForm from "./KeDonForm";

const mockPatientsWithResults = [
    { id: 1, name: "Nguyễn Văn A", gender: "Nam", birth: "1988-03-12", status: "Đã có kết quả" },
    { id: 2, name: "Trần Thị B", gender: "Nữ", birth: "1995-06-22", status: "Đã có kết quả" },
    { id: 3, name: "Lê Văn C", gender: "Nam", birth: "2000-01-10", status: "Đã kê đơn" },
];

const DsBenhNhanCoKetQua = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);

    if (selectedPatient) {
        return (
            <PrescriptionForm
                patient={selectedPatient}
                onBack={() => setSelectedPatient(null)}
            />
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" mb={3} color="primary">
                Danh sách bệnh nhân có kết quả cận lâm sàng
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Họ và tên</b></TableCell>
                            <TableCell><b>Giới tính</b></TableCell>
                            <TableCell><b>Ngày sinh</b></TableCell>
                            <TableCell><b>Trạng thái</b></TableCell>
                            <TableCell align="center"><b>Thao tác</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mockPatientsWithResults.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell>{p.name}</TableCell>
                                <TableCell>{p.gender}</TableCell>
                                <TableCell>{p.birth}</TableCell>
                                <TableCell>{p.status}</TableCell>
                                <TableCell align="center">
                                    {p.status === "Đã kê đơn" ? (
                                        <Button variant="outlined" disabled>Đã kê đơn</Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => setSelectedPatient(p)}
                                        >
                                            Kê đơn
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default DsBenhNhanCoKetQua;

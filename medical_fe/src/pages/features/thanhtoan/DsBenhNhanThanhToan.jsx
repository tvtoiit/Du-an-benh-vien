import React, { useState } from "react";
import {
    Box, Typography, Paper, Table, TableHead, TableRow,
    TableCell, TableBody, Button, TableContainer
} from "@mui/material";
import PaymentForm from "./PaymentForm";

const mockPaymentList = [
    { id: 1, name: "Nguyễn Văn A", total: 350000, status: "Chưa thanh toán" },
    { id: 2, name: "Trần Thị B", total: 420000, status: "Chưa thanh toán" },
    { id: 3, name: "Lê Văn C", total: 410000, status: "Đã thanh toán" },
];

const DsBenhNhanThanhToan = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);

    if (selectedPatient) {
        return <PaymentForm patient={selectedPatient} onBack={() => setSelectedPatient(null)} />;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" mb={3} fontWeight="bold" color="primary">
                Danh sách bệnh nhân chờ thanh toán
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Tên bệnh nhân</b></TableCell>
                            <TableCell align="right"><b>Tổng tiền (VNĐ)</b></TableCell>
                            <TableCell><b>Trạng thái</b></TableCell>
                            <TableCell align="center"><b>Thao tác</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mockPaymentList.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell>{p.name}</TableCell>
                                <TableCell align="right">{p.total.toLocaleString()}</TableCell>
                                <TableCell>{p.status}</TableCell>
                                <TableCell align="center">
                                    {p.status === "Đã thanh toán" ? (
                                        <Button variant="outlined" disabled>Đã TT</Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => setSelectedPatient(p)}
                                        >
                                            Thanh toán
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

export default DsBenhNhanThanhToan;

import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    TableContainer,
} from "@mui/material";
import PaymentForm from "./PaymentForm";
import paymentService from "../../../services/paymentService";

const DsBenhNhanThanhToan = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const res = await paymentService.getWaitingList();
            const list = Array.isArray(res) ? res : res.data ?? [];
            setPatients(list);
        } catch (error) {
            console.error("Error fetching waiting payments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    if (selectedPatient) {
        return (
            <PaymentForm
                patient={selectedPatient}
                onBack={() => {
                    setSelectedPatient(null);
                    fetchPatients(); //Bây giờ gọi được
                }}
            />
        );
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
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">Đang tải...</TableCell>
                            </TableRow>
                        )}

                        {!loading && patients.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    Không có bệnh nhân nào chờ thanh toán
                                </TableCell>
                            </TableRow>
                        )}

                        {!loading &&
                            patients.map((p) => (
                                <TableRow key={p.patientId}>
                                    <TableCell>{p.fullName}</TableCell>

                                    <TableCell align="right">
                                        {(p.totalCost || 0).toLocaleString()}
                                    </TableCell>

                                    <TableCell>
                                        {p.status || "Chưa thanh toán"}
                                    </TableCell>

                                    <TableCell align="center">
                                        {p.status === "Đã thanh toán" ? (
                                            <Button variant="outlined" disabled>
                                                Đã Thanh Toán
                                            </Button>
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

import React, { useEffect, useState } from "react";
import {
    Box, Typography, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow,
    Button
} from "@mui/material";

import advancePaymentService from "../../../services/advancePaymentService";
import AdvanceForm from "./AdvanceForm.jsx";

const DsBenhNhanUngTien = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const load = async () => {
            const res = await advancePaymentService.getPatients();
            setPatients(Array.isArray(res) ? res : res.data ?? []);
        };
        load();
    }, [refresh]);

    if (selectedPatient) {
        return (
            <AdvanceForm
                patient={selectedPatient}
                onBack={(needRefresh) => {
                    setSelectedPatient(null);

                    if (needRefresh) {
                        setRefresh(prev => !prev);
                    }
                }}
            />
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" mb={3} color="primary">
                Bệnh nhân cần ứng tiền
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell>Họ tên</TableCell>
                            <TableCell>Đã ứng</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {patients.map((p, idx) => (
                            <TableRow key={p.patientId}>
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell>{p.fullName}</TableCell>
                                <TableCell>{p.totalAdvance} đ</TableCell>

                                <TableCell align="center">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => setSelectedPatient(p)}
                                    >
                                        Ứng tiền
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}

                        {patients.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    Không có bệnh nhân cần ứng tiền
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default DsBenhNhanUngTien;

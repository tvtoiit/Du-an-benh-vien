import React, { useEffect, useState } from "react";
import {
    Box, Typography, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow,
    Button, TextField
} from "@mui/material";

import advancePaymentService from "../../../services/advancePaymentService";
import AdvanceForm from "./AdvanceForm.jsx";

const DsBenhNhanUngTien = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const load = async () => {
            const res = await advancePaymentService.getPatients();
            setPatients(Array.isArray(res) ? res : res.data ?? []);
        };
        load();
    }, [refresh]);

    const keyword = search.trim();

    const filteredPatients = keyword
        ? patients.filter((p) => p.ccCongDan?.includes(keyword))
        : patients;

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
            <Box sx={{ mb: 2 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2
                    }}
                >
                    <Typography variant="h5" fontWeight="bold" color="primary">
                        Bệnh nhân cần ứng tiền
                    </Typography>

                    <TextField
                        size="small"
                        label="Tìm theo CCCD"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ width: "300px" }}
                    />
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell>Họ tên</TableCell>
                            <TableCell>CCCD</TableCell>
                            <TableCell>Đã ứng</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filteredPatients.map((p, idx) => (
                            <TableRow key={p.patientId}>
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell>{p.fullName}</TableCell>
                                <TableCell>{p.ccCongDan}</TableCell>
                                <TableCell>{p.totalAdvance?.toLocaleString()} đ</TableCell>

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

                        {filteredPatients.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    Không tìm thấy bệnh nhân
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

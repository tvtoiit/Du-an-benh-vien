import React, { useState, useEffect } from "react";
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
import ConclusionForm from "./ConclusionForm";
import serviceResultService from "../../../services/serviceResultService";

const DsBenhNhanCoKetQua = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const doctorId = localStorage.getItem("doctorId");
                const res = await serviceResultService.getPatientsWithResults(doctorId);
                const list = Array.isArray(res) ? res : res.data ?? [];
                setPatients(list);
            } catch (error) {
                console.error("Failed to fetch patients with results", error);
            }
        };
        fetchPatients();
    }, []);

    if (selectedPatient) {
        return (
            <ConclusionForm
                patient={selectedPatient}
                onBack={() => setSelectedPatient(null)}
            />
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" mb={3} color="primary">
                Bệnh nhân đã có kết quả cận lâm sàng
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>STT</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Họ và tên</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Ngày sinh</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>SĐT</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Trạng thái</TableCell>
                            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                                Thao tác
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients.map((p, index) => (
                            <TableRow key={p.patientId} hover>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{p.fullName}</TableCell>
                                <TableCell>
                                    {p.dateOfBirth?.split("T")[0] ?? "—"}
                                </TableCell>
                                <TableCell>{p.contactNumber ?? "—"}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={p.status}
                                        color="success"
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => setSelectedPatient(p)}
                                    >
                                        Gặp bác sĩ kết luận
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

export default DsBenhNhanCoKetQua;

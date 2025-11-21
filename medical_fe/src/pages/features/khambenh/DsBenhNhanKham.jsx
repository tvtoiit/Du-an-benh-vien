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
import appointmentService from "../../../services/appointmentService";
import MedicalExamForm from "./MedicalExamForm";

const DsBenhNhanCoKetQua = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const fetchData = async () => {
        try {
            const doctorId = localStorage.getItem("doctorId");

            const results = await serviceResultService.getPatientsWithResults(doctorId);
            // const accepted = await appointmentService.getAll();

            const listResults = Array.isArray(results) ? results : [];
            // const listAccepted = Array.isArray(accepted) ? accepted : [];

            // const merged = [...listResults];

            // listAccepted.forEach(p => {
            //     if (!merged.some(m => m.patientId === p.patientId)) {
            //         merged.push(p);
            //     }
            // });

            setPatients(listResults);
        } catch (error) {
            console.error("Lỗi khi load danh sách", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Check kiểm tra th để vào status
    if (selectedPatient) {
        // Nếu là bệnh nhân đã tiếp nhận → mở phiếu khám (MedicalExamForm)
        if (selectedPatient.status === "Đã tiếp nhận") {
            return (
                <MedicalExamForm
                    appointment={{ patient: selectedPatient }}
                    onBack={() => setSelectedPatient(null)}
                />
            );
        }

        // Nếu là bệnh nhân có kết quả CLS → mở kết luận
        if (selectedPatient.status === "kết quả CLS") {
            return (
                <ConclusionForm
                    patient={selectedPatient}
                    onBack={() => setSelectedPatient(null)}
                />
            );
        }

        // Nếu hoàn thành → không mở gì (trả về NULL)
        return null;
    }


    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" mb={3} color="primary">
                Danh sách bệnh nhân tiếp nhận & đã có kết quả
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>STT</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Họ và tên</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Ngày khám</TableCell>
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

                                {/* Full name */}
                                <TableCell>{p.fullName}</TableCell>

                                {/* Date of birth */}
                                <TableCell>{p.dateOfBirth?.split("T")[0] ?? "—"}</TableCell>

                                {/* Contact number */}
                                <TableCell>{p.contactNumber ?? "—"}</TableCell>

                                {/* Status */}
                                <TableCell>
                                    <Chip
                                        label={p.status}
                                        color="warning"
                                        size="small"
                                    />
                                </TableCell>

                                <TableCell align="center">
                                    {p.status === "Hoàn thành" && (
                                        <Button variant="contained" color="success" disabled>
                                            Đã hoàn thành
                                        </Button>
                                    )}

                                    {p.status === "kết quả CLS" && (
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            onClick={() => setSelectedPatient(p)}
                                        >
                                            Kết luận
                                        </Button>
                                    )}

                                    {p.status === "Đã tiếp nhận" && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => setSelectedPatient(p)}
                                        >
                                            Khám bệnh
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

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
import { TextField } from "@mui/material";

const DsBenhNhanCoKetQua = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [search, setSearch] = useState("");

    const handleBack = (needRefresh) => {
        setSelectedPatient(null);

        if (needRefresh) {
            fetchData();
        };
    };

    const keyword = search.trim();

    const filteredPatients = keyword
        ? patients.filter((p) => p.cccd?.includes(keyword))
        : patients;

    const fetchData = async () => {
        try {
            const doctorId = localStorage.getItem("doctorId");

            const results = await serviceResultService.getPatientsWithResults(doctorId);

            const listResults = Array.isArray(results) ? results : [];

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
                    onBack={handleBack}
                />
            );
        }

        // Nếu là bệnh nhân có kết quả CLS → mở kết luận
        if (selectedPatient.status === "Kết quả CLS") {
            return (
                <ConclusionForm
                    patient={selectedPatient}
                    onBack={handleBack}
                />
            );
        }

        // Nếu hoàn thành → không mở gì (trả về NULL)
        return null;
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
                        Danh sách bệnh nhân tiếp nhận & đã có kết quả
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

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>STT</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Họ và tên</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Ngày khám</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>SĐT</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>CCCD</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Trạng thái</TableCell>
                            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                                Thao tác
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filteredPatients.map((p, index) => (
                            <TableRow key={p.patientId} hover>
                                <TableCell>{index + 1}</TableCell>

                                {/* Full name */}
                                <TableCell>{p.fullName}</TableCell>

                                {/* Date of birth */}
                                <TableCell>{p.dateOfBirth?.split("T")[0] ?? "—"}</TableCell>

                                {/* Contact number */}
                                <TableCell>{p.contactNumber ?? "—"}</TableCell>
                                <TableCell>{p.cccd}</TableCell>

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

                                    {p.status === "Kết quả CLS" && (
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

                        {filteredPatients.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
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

export default DsBenhNhanCoKetQua;

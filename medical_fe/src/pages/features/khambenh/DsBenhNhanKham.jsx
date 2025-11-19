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
import MedicalExamForm from "./MedicalExamForm";
import appointmentService from "../../../services/appointmentService";

const DsBenhNhanKham = () => {
    const [patients, setPatients] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {

                const res = await appointmentService.getAll();

                const doctorId = localStorage.getItem("doctorId");


                // Tùy backend của bạn, giả sử status dùng:
                // "waiting for censorship" / "approved" / "done"
                const waiting = res.filter(
                    (item) =>
                    (item.status === "waiting for censorship" ||
                        item.status === "approved")
                );


                setPatients(waiting);
            } catch (error) {
                console.error("Failed to fetch appointments", error);
            }
        };

        fetchAppointments();
    }, []);

    if (selectedAppointment) {
        return (
            <MedicalExamForm
                appointment={selectedAppointment}
                onBack={() => setSelectedAppointment(null)}
            />
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "waiting for censorship":
                return "warning";
            case "approved":
                return "info";
            case "done":
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
                        {patients.map((item, index) => {
                            const p = item.patient;

                            return (
                                <TableRow key={item.appointmentScheduleId} hover>
                                    <TableCell>{index + 1}</TableCell>

                                    <TableCell>{p.fullName}</TableCell>

                                    <TableCell>
                                        {p.dateOfBirth?.split("T")[0] ?? "—"}
                                    </TableCell>

                                    <TableCell>{p.contactNumber ?? "—"}</TableCell>

                                    <TableCell>
                                        <Chip
                                            label={item.status}
                                            color={getStatusColor(item.status)}
                                            size="small"
                                        />
                                    </TableCell>

                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => setSelectedAppointment(item)}
                                        >
                                            Khám
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default DsBenhNhanKham;

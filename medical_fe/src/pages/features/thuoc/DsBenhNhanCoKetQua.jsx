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
import PrescriptionForm from "./KeDonForm";
import serviceResultService from "../../../services/serviceResultService";

const DsBenhNhanCoKetQua = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await serviceResultService.getPatientsWithResultsKeDon();
                const list = Array.isArray(res) ? res : res.data ?? [];
                setPatients(list);
            } catch (e) {
                console.error("Lỗi tải danh sách bệnh nhân có kết quả CLS:", e);
            }
        };
        fetchPatients();
    }, [selectedPatient]);


    // Nếu đã chọn bệnh nhân để kê đơn -> hiển thị form kê đơn
    if (selectedPatient) {
        return (
            <PrescriptionForm
                patient={selectedPatient.patient}
                appointmentId={selectedPatient.appointmentId}
                onBack={() => setSelectedPatient(null)}
            />
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" mb={3} color="primary">
                Danh sách bệnh nhân chờ kê đơn
            </Typography>

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><b>STT</b></TableCell>
                            <TableCell><b>Họ và tên</b></TableCell>
                            <TableCell><b>Giới tính</b></TableCell>
                            <TableCell><b>Ngày sinh</b></TableCell>
                            <TableCell><b>SĐT</b></TableCell>
                            <TableCell><b>Trạng thái</b></TableCell>
                            <TableCell align="center"><b>Thao tác</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients.map((p, index) => (
                            <TableRow key={p.patientId || p.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{p.fullName || p.name}</TableCell>
                                <TableCell>{p.gender || "—"}</TableCell>
                                <TableCell>
                                    {(p.dateOfBirth || p.birth || "").toString().split("T")[0]}
                                </TableCell>
                                <TableCell>{p.contactNumber || p.phone || "—"}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={p.status || "Đã có kết quả"}
                                        color="success"
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={p.status === "Đã kê đơn"}
                                        onClick={() =>
                                            setSelectedPatient({
                                                patient: p,
                                                appointmentId: p.appointmentScheduleId,
                                            })
                                        }
                                    >
                                        Kê đơn
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {patients.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    Không có bệnh nhân chờ kê đơn
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

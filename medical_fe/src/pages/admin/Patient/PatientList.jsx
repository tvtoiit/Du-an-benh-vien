// src/components/Patient/PatientList.jsx
import React, { useEffect, useState } from "react";
import parentService from "../../../services/parentService";
import "../Patient/ModalPatient.css";
import EditPatientModal from "./EditPatientModal";
import patientService from "../../../services/parentService";
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
    Stack,
    IconButton,
    Tooltip,
    CircularProgress,
} from "@mui/material";
import { FaPlus } from "react-icons/fa";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import RegisterModal from "./RegisterModal";

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);

    const loadPatients = async () => {
        try {
            const response = await parentService.getAll();
            setPatients(response);
        } finally {
            setLoading(false);
        }
    };
    // Kiểm tra có data không để ẩn button thêm bệnh nhân
    useEffect(() => {
        patientService
            .getWaitingPatients()
            .then((data) => {
                setUsers(data);
            })
            .catch((err) => console.error("Lỗi load danh sách user:", err));
    }, []);

    useEffect(() => {
        loadPatients();
    }, []);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = (reload = false) => {
        setIsModalOpen(false);
        if (reload) loadPatients();
    };

    const formatDate = (isoString) => {
        return isoString ? isoString.substring(0, 10) : "";
    };

    // Xem chi tiết
    const handleView = (p) => {
        alert(
            `Thông tin bệnh nhân:\n\n` +
            `Họ tên: ${p.fullName}\n` +
            `Email: ${p.email}\n` +
            `Địa chỉ: ${p.address}\n` +
            `Ngày sinh: ${p.dateOfBirth}`
        );
    };

    // Sửa thông tin bệnh nhân
    const handleEdit = (p) => {
        setEditingPatient(p);
    };

    if (loading) return <CircularProgress sx={{ m: 4 }} />;

    return (
        <Box sx={{ p: 4 }}>
            <Paper sx={{ p: 2, mb: 3, display: "flex", justifyContent: "space-between" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Quản lý danh sách bệnh nhân
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenModal}
                    startIcon={<FaPlus />}
                    disabled={!users || users.length === 0}
                >
                    Thêm Bệnh Nhân Mới
                </Button>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                            <TableCell>Mã BN</TableCell>
                            <TableCell>Họ tên</TableCell>
                            <TableCell>Ngày khám</TableCell>
                            <TableCell>Địa chỉ</TableCell>
                            <TableCell>Triệu chứng</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {patients.map((p) => (
                            <TableRow key={p.patientId} hover>
                                <TableCell>{p.patientId}</TableCell>
                                <TableCell>{p.fullName}</TableCell>
                                <TableCell>{formatDate(p.dateOfBirth)}</TableCell>
                                <TableCell>{p.address}</TableCell>
                                <TableCell>{p.otherInfo}</TableCell>

                                <TableCell align="center">
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                        <Tooltip title="Xem chi tiết">
                                            <IconButton color="primary" onClick={() => handleView(p)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Sửa thông tin">
                                            <IconButton color="warning" onClick={() => handleEdit(p)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {isModalOpen && <RegisterModal onClose={handleCloseModal} />}
            {editingPatient && (
                <EditPatientModal
                    patient={editingPatient}
                    onClose={() => {
                        setEditingPatient(null);
                        loadPatients();
                    }}
                />
            )}

        </Box>
    );
};

export default PatientList;

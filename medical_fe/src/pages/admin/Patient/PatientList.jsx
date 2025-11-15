import React, { useEffect, useState } from "react";
import parentService from "../../../services/parentService";
import "../Patient/ModalPatient.css";
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
import DeleteIcon from "@mui/icons-material/Delete";
import RegisterModal from "../../user/RegisterModal";

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await parentService.getAll();
                setPatients(response);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleView = (patient) => {
        alert(`Xem chi tiết bệnh nhân: ${patient.name}`);
    };

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const diff = new Date() - birthDate;
        return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    };

    const handleEdit = (patient) => {
        // Chỉnh sủa bệnh nhân
    };

    const handleDelete = (patientId) => {
        // Xóa bệnh nhân
    };

    if (loading) return <CircularProgress sx={{ m: 4 }} />;
    if (error) return <Typography color="error">{error}</Typography>;

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
                            <TableCell>Tuổi</TableCell>
                            <TableCell>Địa chỉ</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients.map((p) => (
                            <TableRow key={p.patientId} hover>
                                <TableCell>{p.patientId}</TableCell>
                                <TableCell>{p.fullName}</TableCell>
                                <TableCell>{calculateAge(p.dateOfBirth)}</TableCell>
                                <TableCell>{p.address}</TableCell>
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
                                        <Tooltip title="Xóa bệnh nhân">
                                            <IconButton color="error" onClick={() => handleDelete(p.patientId)}>
                                                <DeleteIcon />
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
        </Box>
    );
};

export default PatientList;

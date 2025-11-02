import React, { useState } from "react";
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
} from "@mui/material";
import { FaPlus } from "react-icons/fa";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RegisterModal from "../../user/RegisterModal";

const PatientList = () => {
    const [patients, setPatients] = useState([
        { id: 1, name: "Nguyễn Văn A", age: 30, gender: "Nam", address: "TP.HCM" },
        { id: 2, name: "Trần Thị B", age: 27, gender: "Nữ", address: "Hà Nội" },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    // 🔹 Các hàm xử lý hành động
    const handleView = (patient) => {
        alert(`Xem chi tiết bệnh nhân: ${patient.name}`);
    };

    const handleEdit = (patient) => {
        alert(`Chỉnh sửa thông tin: ${patient.name}`);
    };

    const handleDelete = (patientId) => {
        if (window.confirm("Bạn có chắc muốn xóa bệnh nhân này không?")) {
            setPatients(patients.filter((p) => p.id !== patientId));
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" mb={3}>
                Danh sách bệnh nhân
            </Typography>

            {/* Thanh công cụ */}
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

            {/* Bảng dữ liệu bệnh nhân */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                            <TableCell>Mã BN</TableCell>
                            <TableCell>Họ tên</TableCell>
                            <TableCell>Tuổi</TableCell>
                            <TableCell>Giới tính</TableCell>
                            <TableCell>Địa chỉ</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients.map((p) => (
                            <TableRow key={p.id} hover>
                                <TableCell>{p.id}</TableCell>
                                <TableCell>{p.name}</TableCell>
                                <TableCell>{p.age}</TableCell>
                                <TableCell>{p.gender}</TableCell>
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
                                            <IconButton color="error" onClick={() => handleDelete(p.id)}>
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

import React, { useEffect, useState } from "react";
import doctorService from "../../../services/doctorService";
import "../Patient/ModalPatient.css";
import { TextField, MenuItem } from "@mui/material";
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

import ModalDoctor from "./ModalDoctor";
import ModalDoctorView from "./ModalDoctorView";

const BacSiList = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewDoctor, setViewDoctor] = useState(null);


    // ======================== LOAD DANH SÁCH BÁC SĨ ==========================
    const fetchDoctors = async () => {
        try {
            const response = await doctorService.getAll();
            setDoctors(response);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    // ======================== MODAL ==========================
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    // Xem chi tiết bác sĩ
    const handleView = (doctor) => setViewDoctor(doctor);

    // ======================== DELETE ==========================
    const handleDelete = async (doctorId) => {
        if (window.confirm("Bạn có chắc muốn xoá bác sĩ này?")) {
            try {
                await doctorService.delete(doctorId);
                setDoctors(doctors.filter((d) => d.doctorId !== doctorId));
            } catch (err) {
                alert("Không thể xoá bác sĩ!");
            }
        }
    };

    if (loading) return <CircularProgress sx={{ m: 4 }} />;

    return (
        <Box sx={{ p: 4 }}>
            {/* HEADER */}
            <Paper
                sx={{
                    p: 2,
                    mb: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Quản lý danh sách bác sĩ
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenModal}
                    startIcon={<FaPlus />}
                >
                    Thêm Bác Sĩ Mới
                </Button>
            </Paper>

            {/* TABLE */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                            <TableCell>Mã BS</TableCell>
                            <TableCell>Họ và tên</TableCell>
                            <TableCell>Kinh nghiệm</TableCell>
                            <TableCell>SĐT</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {doctors.map((d) => (
                            <TableRow key={d.doctorId} hover>
                                <TableCell>{d.doctorId}</TableCell>
                                <TableCell>{d.doctorName}</TableCell>
                                <TableCell>{d.experience}</TableCell>
                                <TableCell>{d.contactNumber}</TableCell>
                                <TableCell>{d.email}</TableCell>

                                <TableCell align="center">
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                        {/* XEM */}
                                        <Tooltip title="Xem chi tiết">
                                            <IconButton color="primary" onClick={() => handleView(d)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>

                                        {/* SỬA */}
                                        <Tooltip title="Sửa thông tin">
                                            <IconButton color="warning">
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>

                                        {/* XOÁ */}
                                        <Tooltip title="Xóa bác sĩ">
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(d.doctorId)}
                                            >
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

            {/* MODAL THÊM BÁC SĨ */}
            {isModalOpen && (
                <ModalDoctor
                    onClose={handleCloseModal}
                    onSuccess={fetchDoctors} // load lại danh sách
                />
            )}

            {/* MODAL XEM CHI TIẾT */}
            {viewDoctor && (
                <ModalDoctorView
                    doctor={viewDoctor}
                    onClose={() => setViewDoctor(null)}
                />
            )}
        </Box>
    );
};

export default BacSiList;

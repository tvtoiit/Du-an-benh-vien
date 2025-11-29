// src/pages/features/Department/DepartmentList.jsx
import React, { useEffect, useState } from "react";
import departmentService from "../../../services/departmentService";
import RegisterDepartmentModal from "./RegisterDepartmentModal";
import EditDepartmentModal from "./EditDepartmentModal";

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
    TextField,
} from "@mui/material";

import { FaPlus } from "react-icons/fa";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

const DepartmentList = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);

    const [search, setSearch] = useState("");

    const loadDepartments = async () => {
        setLoading(true);
        try {
            const res = await departmentService.getAll();
            setDepartments(Array.isArray(res) ? res : []);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDepartments();
    }, []);

    const handleOpenModal = () => setIsModalOpen(true);

    const handleCloseModal = (reload = false) => {
        setIsModalOpen(false);
        if (reload) loadDepartments();
    };

    const handleEdit = (d) => {
        setEditingDepartment(d);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xoá khoa này?")) return;
        try {
            await departmentService.delete(id);
            setDepartments((prev) => prev.filter((d) => d.departmentId !== id));
            toast.success("Đã xoá khoa.");
        } catch (err) {
            console.error(err);
            toast.error("Xoá khoa thất bại!");
        }
    };

    const filteredDepartments = departments.filter((d) =>
        d.name?.toLowerCase().includes(search.toLowerCase())
    );

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
                    gap: 2,
                }}
            >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Quản lý khoa phòng
                </Typography>

                <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                        size="small"
                        label="Tìm theo tên khoa"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenModal}
                        startIcon={<FaPlus />}
                    >
                        Thêm Khoa
                    </Button>
                </Box>
            </Paper>

            {/* TABLE */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                            <TableCell>Mã khoa</TableCell>
                            <TableCell>Tên khoa</TableCell>
                            <TableCell>Mô tả</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filteredDepartments.map((d) => (
                            <TableRow key={d.departmentId} hover>
                                <TableCell>{d.departmentId}</TableCell>
                                <TableCell>{d.name}</TableCell>
                                <TableCell>{d.description}</TableCell>

                                <TableCell align="center">
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                        <Tooltip title="Sửa thông tin">
                                            <IconButton color="warning" onClick={() => handleEdit(d)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Xoá khoa">
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(d.departmentId)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}

                        {filteredDepartments.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    Không có khoa nào.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* MODAL THÊM KHOA */}
            {isModalOpen && (
                <RegisterDepartmentModal onClose={handleCloseModal} />
            )}

            {/* MODAL SỬA KHOA */}
            {editingDepartment && (
                <EditDepartmentModal
                    department={editingDepartment}
                    onClose={(reload) => {
                        setEditingDepartment(null);
                        if (reload) loadDepartments();
                    }}
                />
            )}
        </Box>
    );
};

export default DepartmentList;

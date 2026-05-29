import React, { useEffect, useState } from "react";

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
    Chip,
    Avatar,
    InputAdornment
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

import { FaPlus } from "react-icons/fa";

import doctorService from "../../../services/doctorService";

import ModalDoctor from "./ModalDoctor";
import ModalDoctorEdit from "./ModalDoctorEdit";

const BacSiList = () => {

    const [doctors, setDoctors] = useState([]);

    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [editingDoctor, setEditingDoctor] = useState(null);

    const [searchCccd, setSearchCccd] = useState("");

    // ==========================================
    // LOAD DATA
    // ==========================================
    const fetchDoctors = async () => {

        try {

            const response =
                await doctorService.getAll();

            setDoctors(response);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        fetchDoctors();

    }, []);

    // ==========================================
    // FILTER
    // ==========================================
    const filteredDoctors = doctors.filter((d) =>
        d.cccd?.includes(searchCccd)
    );

    // ==========================================
    // DEGREE COLOR
    // ==========================================
    const getDegreeColor = (degree) => {

        switch (degree) {

            case "Tiến sĩ":
                return "error";

            case "Thạc sĩ":
                return "warning";

            default:
                return "primary";
        }
    };

    if (loading) {

        return (
            <Box
                display="flex"
                justifyContent="center"
                mt={5}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, background: "#f5f7fb", minHeight: "100vh" }}>

            {/* HEADER */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background:
                        "linear-gradient(135deg, #1976d2, #42a5f5)",
                    color: "#fff"
                }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >
                        Quản lý bác sĩ
                    </Typography>

                    <Typography variant="body2">
                        Danh sách thông tin bác sĩ phòng khám
                    </Typography>

                </Box>

                <Button
                    variant="contained"
                    startIcon={<FaPlus />}
                    onClick={() => setIsModalOpen(true)}
                    sx={{
                        backgroundColor: "#fff",
                        color: "#1976d2",
                        fontWeight: "bold",
                        "&:hover": {
                            backgroundColor: "#e3f2fd"
                        }
                    }}
                >
                    Thêm bác sĩ
                </Button>

            </Paper>

            {/* SEARCH */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 3
                }}
            >

                <TextField
                    fullWidth
                    size="small"
                    placeholder="Tìm kiếm theo CCCD..."
                    value={searchCccd}
                    onChange={(e) =>
                        setSearchCccd(e.target.value)
                    }
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />

            </Paper>

            {/* TABLE */}
            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    borderRadius: 3
                }}
            >

                <Table>

                    <TableHead>

                        <TableRow
                            sx={{
                                backgroundColor: "#f1f5f9"
                            }}
                        >

                            <TableCell>
                                <strong>Bác sĩ</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Trình độ</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Phí khám</strong>
                            </TableCell>

                            <TableCell>
                                <strong>SĐT</strong>
                            </TableCell>

                            <TableCell>
                                <strong>CCCD</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Email</strong>
                            </TableCell>

                            <TableCell align="center">
                                <strong>Thao tác</strong>
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {filteredDoctors.map((d) => (

                            <TableRow
                                key={d.doctorId}
                                hover
                            >

                                {/* DOCTOR */}
                                <TableCell>

                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        alignItems="center"
                                    >

                                        <Avatar
                                            sx={{
                                                bgcolor: "#1976d2"
                                            }}
                                        >
                                            <LocalHospitalIcon />
                                        </Avatar>

                                        <Box>

                                            <Typography
                                                fontWeight="bold"
                                            >
                                                {d.doctorName}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Bác sĩ phòng khám
                                            </Typography>

                                        </Box>

                                    </Stack>

                                </TableCell>

                                {/* DEGREE */}
                                <TableCell>

                                    <Chip
                                        label={d.degree}
                                        color={getDegreeColor(d.degree)}
                                        variant="outlined"
                                    />

                                </TableCell>

                                {/* FEE */}
                                <TableCell>

                                    <Typography
                                        fontWeight="bold"
                                        color="success.main"
                                    >
                                        {Number(d.consultationFee)
                                            .toLocaleString()} VNĐ
                                    </Typography>

                                </TableCell>

                                {/* PHONE */}
                                <TableCell>
                                    {d.contactNumber}
                                </TableCell>

                                {/* CCCD */}
                                <TableCell>
                                    {d.cccd}
                                </TableCell>

                                {/* EMAIL */}
                                <TableCell>
                                    {d.email}
                                </TableCell>

                                {/* ACTION */}
                                <TableCell align="center">

                                    <Tooltip title="Chỉnh sửa">

                                        <IconButton
                                            color="warning"
                                            onClick={() =>
                                                setEditingDoctor(d)
                                            }
                                        >

                                            <EditIcon />

                                        </IconButton>

                                    </Tooltip>

                                </TableCell>

                            </TableRow>

                        ))}

                        {filteredDoctors.length === 0 && (

                            <TableRow>

                                <TableCell
                                    colSpan={7}
                                    align="center"
                                >

                                    <Typography
                                        py={3}
                                        color="text.secondary"
                                    >
                                        Không tìm thấy bác sĩ
                                    </Typography>

                                </TableCell>

                            </TableRow>
                        )}

                    </TableBody>

                </Table>

            </TableContainer>

            {/* MODAL CREATE */}
            {isModalOpen && (

                <ModalDoctor
                    onClose={() =>
                        setIsModalOpen(false)
                    }
                    onSuccess={fetchDoctors}
                />
            )}

            {/* MODAL EDIT */}
            {editingDoctor && (

                <ModalDoctorEdit
                    doctor={editingDoctor}
                    onClose={() =>
                        setEditingDoctor(null)
                    }
                    onSuccess={fetchDoctors}
                />
            )}

        </Box>
    );
};

export default BacSiList;

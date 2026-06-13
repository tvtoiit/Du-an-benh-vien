import React, { useEffect, useState } from "react";
import parentService from "../../../services/parentService";
import patientService from "../../../services/parentService";

import "../Patient/ModalPatient.css";

import EditPatientModal from "./EditPatientModal";
import RegisterModal from "./RegisterModal";
import DetailModal from "../../../components/DetailModal";

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
    Avatar,
    InputAdornment,
} from "@mui/material";

import { FaPlus } from "react-icons/fa";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";

const PatientList = () => {

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    const [users, setUsers] = useState([]);

    const [detailOpen, setDetailOpen] = useState(false);
    const [detailData, setDetailData] = useState({});

    const [searchCccd, setSearchCccd] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);

    // ==========================
    // LOAD DATA
    // ==========================
    const loadPatients = async () => {
        try {

            setLoading(true);

            const response =
                await parentService.getAll();

            setPatients(response || []);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        patientService
            .getWaitingPatients()
            .then((data) => {
                setUsers(data);
            })
            .catch((err) =>
                console.error(
                    "Lỗi load danh sách user:",
                    err
                )
            );

    }, []);

    useEffect(() => {
        loadPatients();
    }, []);

    // ==========================
    // FORMAT DATE
    // ==========================
    const formatDate = (isoString) => {
        return isoString
            ? isoString.substring(0, 10)
            : "";
    };

    // ==========================
    // SEARCH
    // ==========================
    const filteredPatients =
        patients.filter((p) =>
            p.cccd
                ?.toLowerCase()
                .includes(
                    searchCccd.toLowerCase()
                )
        );

    // ==========================
    // DETAIL
    // ==========================
    const handleView = (p) => {

        setDetailData({
            "Họ tên": p.fullName,
            "Email": p.email,
            "Địa chỉ": p.address,
            "Ngày sinh":
                formatDate(
                    p.dateOfBirth
                ),
            "CCCD": p.cccd,
            "Triệu chứng":
                p.otherInfo || "-"
        });

        setDetailOpen(true);
    };

    // ==========================
    // EDIT
    // ==========================
    const handleEdit = (p) => {
        setEditingPatient(p);
    };

    const handleOpenModal = () =>
        setIsModalOpen(true);

    const handleCloseModal = (
        reload = false
    ) => {

        setIsModalOpen(false);

        if (reload) {
            loadPatients();
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent:
                        "center",
                    mt: 5
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                p: 4,
                background: "#f5f7fb",
                minHeight: "100vh"
            }}
        >

            {/* HEADER */}

            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                    background:
                        "linear-gradient(135deg,#1976d2,#42a5f5)",
                    color: "#fff"
                }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >
                        Danh sách bệnh nhân
                    </Typography>

                    <Typography
                        variant="body2"
                    >
                        Quản lý hồ sơ bệnh nhân trong hệ thống
                    </Typography>

                </Box>

            </Paper>

            {/* TOOLBAR */}

            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 3,
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                    gap: 2
                }}
            >

                <TextField
                    fullWidth
                    size="small"
                    placeholder="Tìm theo CCCD..."
                    value={searchCccd}
                    onChange={(e) =>
                        setSearchCccd(
                            e.target.value
                        )
                    }
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }}
                />

                <Button
                    variant="contained"
                    startIcon={<FaPlus />}
                    onClick={
                        handleOpenModal
                    }
                    disabled={
                        !users ||
                        users.length === 0
                    }
                    sx={{
                        borderRadius: 2,
                        minWidth: 220
                    }}
                >
                    Thêm bệnh nhân
                </Button>

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
                                backgroundColor:
                                    "#f1f5f9"
                            }}
                        >

                            <TableCell>
                                <strong>
                                    Bệnh nhân
                                </strong>
                            </TableCell>

                            <TableCell>
                                <strong>
                                    Ngày sinh
                                </strong>
                            </TableCell>

                            <TableCell>
                                <strong>
                                    CCCD
                                </strong>
                            </TableCell>

                            <TableCell>
                                <strong>
                                    Địa chỉ
                                </strong>
                            </TableCell>

                            <TableCell>
                                <strong>
                                    Triệu chứng
                                </strong>
                            </TableCell>

                            <TableCell
                                align="center"
                            >
                                <strong>
                                    Thao tác
                                </strong>
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {filteredPatients.map(
                            (p) => (

                                <TableRow
                                    key={
                                        p.patientId
                                    }
                                    hover
                                >

                                    <TableCell>

                                        <Stack
                                            direction="row"
                                            spacing={2}
                                            alignItems="center"
                                        >

                                            <Avatar
                                                sx={{
                                                    bgcolor:
                                                        "#1976d2"
                                                }}
                                            >
                                                <PersonIcon />
                                            </Avatar>

                                            <Box>

                                                <Typography
                                                    fontWeight="bold"
                                                >
                                                    {
                                                        p.fullName
                                                    }
                                                </Typography>

                                            </Box>

                                        </Stack>

                                    </TableCell>

                                    <TableCell>
                                        {formatDate(
                                            p.dateOfBirth
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {p.cccd}
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            maxWidth: 250
                                        }}
                                    >
                                        {
                                            p.address
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {p.otherInfo ? (
                                            p.otherInfo
                                        ) : (
                                            <Typography
                                                color="text.secondary"
                                            >
                                                Chưa cập nhật
                                            </Typography>
                                        )}
                                    </TableCell>

                                    <TableCell align="center">

                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            justifyContent="center"
                                        >

                                            <Tooltip title="Xem chi tiết">

                                                <IconButton
                                                    color="primary"
                                                    onClick={() =>
                                                        handleView(
                                                            p
                                                        )
                                                    }
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>

                                            </Tooltip>

                                            <Tooltip title="Sửa thông tin">

                                                <IconButton
                                                    color="warning"
                                                    onClick={() =>
                                                        handleEdit(
                                                            p
                                                        )
                                                    }
                                                >
                                                    <EditIcon />
                                                </IconButton>

                                            </Tooltip>

                                        </Stack>

                                    </TableCell>

                                </TableRow>

                            )
                        )}

                        {filteredPatients.length === 0 && (

                            <TableRow>

                                <TableCell
                                    colSpan={6}
                                    align="center"
                                >

                                    <Typography
                                        py={4}
                                        color="text.secondary"
                                    >
                                        Không tìm thấy bệnh nhân
                                    </Typography>

                                </TableCell>

                            </TableRow>

                        )}

                    </TableBody>

                </Table>

            </TableContainer>

            {/* CREATE */}

            {isModalOpen && (
                <RegisterModal
                    onClose={
                        handleCloseModal
                    }
                />
            )}

            {/* EDIT */}

            {editingPatient && (
                <EditPatientModal
                    patient={
                        editingPatient
                    }
                    onClose={() => {

                        setEditingPatient(
                            null
                        );

                        loadPatients();

                    }}
                />
            )}

            {/* DETAIL */}

            <DetailModal
                open={detailOpen}
                onClose={() =>
                    setDetailOpen(
                        false
                    )
                }
                title="Thông tin bệnh nhân"
                data={detailData}
            />

        </Box>
    );

};

export default PatientList;

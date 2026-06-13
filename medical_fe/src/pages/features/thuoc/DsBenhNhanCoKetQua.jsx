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
    TextField,
    CircularProgress,
    InputAdornment,
    Avatar,
    Stack
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";

import PrescriptionForm from "./KeDonForm";
import serviceResultService from "../../../services/serviceResultService";

const DsBenhNhanCoKetQua = () => {

    const [selectedPatient, setSelectedPatient] =
        useState(null);

    const [patients, setPatients] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    // =====================================
    // LOAD DATA
    // =====================================

    const fetchPatients = async () => {

        try {

            setLoading(true);

            const res =
                await serviceResultService.getPatientsWithResultsKeDon();

            const list =
                Array.isArray(res)
                    ? res
                    : res?.data ?? [];

            setPatients(list);

        } catch (e) {

            console.error(
                "Lỗi tải danh sách bệnh nhân có kết quả CLS:",
                e
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        fetchPatients();

    }, [selectedPatient]);

    // =====================================
    // FILTER
    // =====================================

    const filteredPatients =
        patients.filter((p) =>
            p.cccd
                ?.toLowerCase()
                .includes(
                    search.toLowerCase()
                )
        );

    // =====================================
    // OPEN FORM KÊ ĐƠN
    // =====================================

    if (selectedPatient) {

        return (
            <PrescriptionForm
                patient={
                    selectedPatient.patient
                }
                appointmentId={
                    selectedPatient.appointmentId
                }
                onBack={() =>
                    setSelectedPatient(null)
                }
            />
        );
    }

    // =====================================
    // LOADING
    // =====================================

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

    // =====================================
    // UI
    // =====================================

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
                    alignItems:
                        "center",
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
                        Kê đơn thuốc
                    </Typography>

                    <Typography
                        variant="body2"
                    >
                        Danh sách bệnh nhân chờ kê đơn
                    </Typography>

                </Box>

                <Chip
                    label={`${filteredPatients.length} bệnh nhân`}
                    sx={{
                        bgcolor: "#fff",
                        color: "#1976d2",
                        fontWeight: "bold"
                    }}
                />

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
                    value={search}
                    onChange={(e) =>
                        setSearch(
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
                                    Giới tính
                                </strong>
                            </TableCell>

                            <TableCell>
                                <strong>
                                    Ngày sinh
                                </strong>
                            </TableCell>

                            <TableCell>
                                <strong>
                                    SĐT
                                </strong>
                            </TableCell>

                            <TableCell>
                                <strong>
                                    CCCD
                                </strong>
                            </TableCell>

                            <TableCell>
                                <strong>
                                    Trạng thái
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
                                        p.patientId ||
                                        p.id
                                    }
                                    hover
                                >

                                    {/* BỆNH NHÂN */}

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
                                                        p.fullName ||
                                                        p.name
                                                    }
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Bệnh nhân
                                                </Typography>

                                            </Box>

                                        </Stack>

                                    </TableCell>

                                    <TableCell>
                                        {p.gender || "--"}
                                    </TableCell>

                                    <TableCell>
                                        {(p.dateOfBirth ||
                                            p.birth ||
                                            "")
                                            .toString()
                                            .split("T")[0] || "--"}
                                    </TableCell>

                                    <TableCell>
                                        {p.contactNumber ||
                                            p.phone ||
                                            "--"}
                                    </TableCell>

                                    <TableCell>
                                        {p.cccd || "--"}
                                    </TableCell>

                                    <TableCell>

                                        <Chip
                                            label={
                                                p.status ||
                                                "Đã có kết quả CLS"
                                            }
                                            color={
                                                p.status ===
                                                    "Đã kê đơn"
                                                    ? "success"
                                                    : "warning"
                                            }
                                            variant="outlined"
                                        />

                                    </TableCell>

                                    <TableCell
                                        align="center"
                                    >

                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={
                                                p.status ===
                                                "Đã kê đơn"
                                            }
                                            sx={{
                                                borderRadius: 2,
                                                textTransform:
                                                    "none",
                                                fontWeight:
                                                    "bold"
                                            }}
                                            onClick={() =>
                                                setSelectedPatient({
                                                    patient: p,
                                                    appointmentId:
                                                        p.appointmentScheduleId
                                                })
                                            }
                                        >
                                            {p.status ===
                                                "Đã kê đơn"
                                                ? "Đã kê đơn"
                                                : "Kê đơn"}
                                        </Button>

                                    </TableCell>

                                </TableRow>
                            )
                        )}

                        {filteredPatients.length ===
                            0 && (

                                <TableRow>

                                    <TableCell
                                        colSpan={7}
                                        align="center"
                                    >

                                        <Typography
                                            py={4}
                                            color="text.secondary"
                                        >
                                            Không có bệnh nhân chờ kê đơn
                                        </Typography>

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
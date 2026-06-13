import React, { useState, useEffect } from "react";

import {
    Box,
    Typography,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    TableContainer,
    TextField,
    Chip,
    CircularProgress,
    InputAdornment,
    Avatar,
    Stack
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";

import PaymentForm from "./PaymentForm";
import paymentService from "../../../services/paymentService";

const DsBenhNhanThanhToan = () => {

    const [selectedPatient, setSelectedPatient] =
        useState(null);

    const [patients, setPatients] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    // ======================================
    // LOAD DATA
    // ======================================

    const fetchPatients = async () => {

        try {

            const res =
                await paymentService.getWaitingList();

            const list =
                Array.isArray(res)
                    ? res
                    : res.data ?? [];

            setPatients(list);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        fetchPatients();

    }, []);

    // ======================================
    // FILTER
    // ======================================

    const filteredPatients =
        patients.filter((p) =>
            p.cccd
                ?.toLowerCase()
                .includes(
                    search.toLowerCase()
                )
        );

    // ======================================
    // PAYMENT FORM
    // ======================================

    if (selectedPatient) {

        return (
            <PaymentForm
                patient={selectedPatient}
                onBack={() => {

                    setSelectedPatient(null);

                    fetchPatients();
                }}
            />
        );
    }

    // ======================================
    // LOADING
    // ======================================

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
                        Quầy Thanh Toán
                    </Typography>

                    <Typography variant="body2">
                        Danh sách bệnh nhân chờ thanh toán khám và cận lâm sàng
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
                                    CCCD
                                </strong>
                            </TableCell>

                            <TableCell>
                                <strong>
                                    Bác sĩ
                                </strong>
                            </TableCell>

                            <TableCell>
                                <strong>
                                    Phòng khám
                                </strong>
                            </TableCell>

                            <TableCell>
                                <strong>
                                    Tổng tiền
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
                                        p.appointmentId
                                    }
                                    hover
                                >

                                    {/* PATIENT */}

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
                                        {p.cccd}
                                    </TableCell>

                                    <TableCell>
                                        {p.doctorName || "--"}
                                    </TableCell>

                                    <TableCell>
                                        {p.roomGroupName || "--"}
                                        {p.roomName
                                            ? ` - ${p.roomName}`
                                            : ""}
                                    </TableCell>

                                    <TableCell>

                                        <Typography
                                            fontWeight="bold"
                                            color="success.main"
                                        >
                                            {Number(
                                                p.totalCost || 0
                                            ).toLocaleString()}
                                            {" VNĐ"}
                                        </Typography>

                                    </TableCell>

                                    <TableCell>

                                        <Chip
                                            label={p.status}
                                            color={
                                                p.status === "Chờ thanh toán CLS"
                                                    ? "warning"
                                                    : "info"
                                            }
                                            variant="outlined"
                                        />

                                    </TableCell>

                                    <TableCell
                                        align="center"
                                    >

                                        <Button
                                            variant="contained"
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: "none",
                                                fontWeight: "bold"
                                            }}
                                            onClick={() => setSelectedPatient(p)}
                                        >
                                            {p.status === "Chờ thanh toán CLS"
                                                ? "Thanh toán CLS"
                                                : "Thanh toán"}
                                        </Button>

                                    </TableCell>

                                </TableRow>
                            )
                        )}

                        {filteredPatients.length === 0 && (

                            <TableRow>

                                <TableCell
                                    colSpan={7}
                                    align="center"
                                >

                                    <Typography
                                        py={4}
                                        color="text.secondary"
                                    >
                                        Không có bệnh nhân chờ thanh toán
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

export default DsBenhNhanThanhToan;
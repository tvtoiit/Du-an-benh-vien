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

import CanLamSangForm from "../canlamsang/CanLamSangForm";
import parentService from "../../../services/parentService";

const DsCanLamSangList = () => {

    const [patients, setPatients] =
        useState([]);

    const [selectedPatient, setSelectedPatient] =
        useState(null);

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
                await parentService.getPatientsWithServices();

            setPatients(
                Array.isArray(res)
                    ? res
                    : []
            );

        } catch (error) {

            console.error(
                "Lỗi tải bệnh nhân cận lâm sàng:",
                error
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        fetchPatients();

    }, []);

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
    // FORM
    // =====================================

    if (selectedPatient) {

        return (
            <CanLamSangForm
                patient={selectedPatient}
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
                        Cận lâm sàng
                    </Typography>

                    <Typography
                        variant="body2"
                    >
                        Danh sách bệnh nhân cần thực hiện cận lâm sàng
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
                                    SĐT
                                </strong>
                            </TableCell>

                            <TableCell>
                                <strong>
                                    Ngày sinh
                                </strong>
                            </TableCell>

                            <TableCell>
                                <strong>
                                    Dịch vụ chỉ định
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
                                        {p.phoneNumber || "--"}
                                    </TableCell>

                                    <TableCell>
                                        {p.dateOfBirth
                                            ?.split("T")[0] ||
                                            "--"}
                                    </TableCell>

                                    <TableCell>

                                        <Box
                                            display="flex"
                                            flexWrap="wrap"
                                            gap={1}
                                        >

                                            {p.services?.map(
                                                (
                                                    s
                                                ) => (

                                                    <Chip
                                                        key={
                                                            s.serviceId
                                                        }
                                                        label={
                                                            s.serviceName
                                                        }
                                                        color="info"
                                                        size="small"
                                                        variant="outlined"
                                                    />

                                                )
                                            )}

                                        </Box>

                                    </TableCell>

                                    <TableCell
                                        align="center"
                                    >

                                        <Button
                                            variant="contained"
                                            sx={{
                                                borderRadius: 2,
                                                textTransform:
                                                    "none",
                                                fontWeight:
                                                    "bold"
                                            }}
                                            onClick={() =>
                                                setSelectedPatient(
                                                    p
                                                )
                                            }
                                        >
                                            Thực hiện
                                        </Button>

                                    </TableCell>

                                </TableRow>
                            )
                        )}

                        {filteredPatients.length ===
                            0 && (

                                <TableRow>

                                    <TableCell
                                        colSpan={6}
                                        align="center"
                                    >

                                        <Typography
                                            py={4}
                                            color="text.secondary"
                                        >
                                            Không có bệnh nhân cần thực hiện cận lâm sàng
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

export default DsCanLamSangList;
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

import ConclusionForm from "./ConclusionForm";
import MedicalExamForm from "./MedicalExamForm";

import serviceResultService from "../../../services/serviceResultService";

const DsBenhNhanCoKetQua = () => {

    const [patients, setPatients] =
        useState([]);

    const [selectedPatient, setSelectedPatient] =
        useState(null);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    // =====================================
    // BACK
    // =====================================

    const handleBack = (needRefresh) => {

        setSelectedPatient(null);

        if (needRefresh) {

            fetchData();
        }
    };

    // =====================================
    // LOAD DATA
    // =====================================

    const fetchData = async () => {

        try {

            setLoading(true);

            const doctorId =
                localStorage.getItem(
                    "doctorId"
                );

            const results =
                await serviceResultService
                    .getPatientsWithResults(
                        doctorId
                    );

            const listResults =
                Array.isArray(results)
                    ? results
                    : [];

            setPatients(listResults);

        } catch (error) {

            console.error(
                "Lỗi khi load danh sách",
                error
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        fetchData();

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
    // OPEN FORM
    // =====================================

    if (selectedPatient) {

        if (
            selectedPatient.status ===
            "Chờ khám"
        ) {

            return (
                <MedicalExamForm
                    appointment={{
                        patient:
                            selectedPatient
                    }}
                    onBack={handleBack}
                />
            );
        }

        if (
            selectedPatient.status === "Kết quả CLS" ||
            selectedPatient.status === "Chờ kết luận"
        ) {
            return (
                <ConclusionForm
                    patient={selectedPatient}
                    onBack={handleBack}
                />
            );
        }

        return null;
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
                background:
                    "#f5f7fb",
                minHeight:
                    "100vh"
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
                        Khám bệnh
                    </Typography>

                    <Typography
                        variant="body2"
                    >
                        Danh sách bệnh nhân
                        tiếp nhận và có
                        kết quả cận lâm
                        sàng
                    </Typography>

                </Box>

                <Chip
                    label={`${filteredPatients.length} bệnh nhân`}
                    sx={{
                        bgcolor:
                            "#fff",
                        color:
                            "#1976d2",
                        fontWeight:
                            "bold"
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
                        startAdornment:
                            (
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
                                        p.patientId
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
                                        {
                                            p.cccd
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {
                                            p.contactNumber
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {p.dateOfBirth
                                            ?.split(
                                                "T"
                                            )[0] ??
                                            "--"}
                                    </TableCell>

                                    <TableCell>

                                        {p.status === "Chờ khám" && (
                                            <Chip
                                                label="Chờ khám"
                                                color="primary"
                                                variant="outlined"
                                            />
                                        )}

                                        {p.status === "Kết quả CLS" && (
                                            <Chip
                                                label="Kết quả CLS"
                                                color="warning"
                                                variant="outlined"
                                            />
                                        )}
                                        {p.status === "Chờ kết luận" && (
                                            <Chip
                                                label="Chờ kết luận"
                                                color="success"
                                                variant="outlined"
                                            />
                                        )}

                                    </TableCell>

                                    <TableCell align="center">

                                        {p.status === "Chờ khám" && (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                sx={{
                                                    borderRadius: 2,
                                                    textTransform: "none",
                                                    fontWeight: "bold"
                                                }}
                                                onClick={() =>
                                                    setSelectedPatient(p)
                                                }
                                            >
                                                Khám bệnh
                                            </Button>
                                        )}

                                        {(p.status === "Kết quả CLS" ||
                                            p.status === "Chờ kết luận") && (
                                                <Button
                                                    variant="contained"
                                                    color="warning"
                                                    sx={{
                                                        borderRadius: 2,
                                                        textTransform: "none",
                                                        fontWeight: "bold"
                                                    }}
                                                    onClick={() =>
                                                        setSelectedPatient(p)
                                                    }
                                                >
                                                    Kết luận
                                                </Button>
                                            )}

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
                                            Không tìm thấy
                                            bệnh nhân
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
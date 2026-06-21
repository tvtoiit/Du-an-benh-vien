import React, { useEffect, useState } from "react";

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
    TextField,
    CircularProgress,
    Avatar,
    Stack,
    Chip,
    InputAdornment
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

import patientService from "../../../services/parentService";

const DanhSachTiepNhan = ({
    onSelectPatient
}) => {

    const [patients, setPatients] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [search, setSearch] =
        useState("");

    // ==========================================
    // FILTER
    // ==========================================
    const keyword = search.trim();

    const filteredPatients =
        patients.filter((p) =>
            p.cccd?.includes(keyword)
        );

    // ==========================================
    // LOAD DATA
    // ==========================================
    useEffect(() => {

        const loadWaitingPatients =
            async () => {

                try {

                    setLoading(true);

                    const res =
                        await patientService
                            .getWaitingPatients1();

                    const list =
                        res.data ?? res;

                    setPatients(
                        Array.isArray(list)
                            ? list
                            : []
                    );

                } catch (error) {

                    console.error(
                        "Lỗi load danh sách bệnh nhân:",
                        error
                    );

                } finally {

                    setLoading(false);
                }
            };

        loadWaitingPatients();

    }, []);

    // ==========================================
    // UI
    // ==========================================
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
                    borderRadius: 4,
                    background:
                        "linear-gradient(135deg, #1976d2, #42a5f5)",
                    color: "#fff"
                }}
            >

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >

                    <Box>

                        <Typography
                            variant="h5"
                            fontWeight="bold"
                        >
                            Danh sách tiếp nhận
                        </Typography>

                        <Typography
                            variant="body2"
                        >

                            Quản lý bệnh nhân
                            chờ khám

                        </Typography>

                    </Box>

                    <Avatar
                        sx={{
                            bgcolor: "#fff",
                            color: "#1976d2",
                            width: 56,
                            height: 56
                        }}
                    >

                        <MedicalServicesIcon />

                    </Avatar>

                </Stack>

            </Paper>

            {/* SEARCH */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 4
                }}
            >

                <TextField
                    fullWidth
                    size="small"
                    placeholder="Tìm kiếm theo CCCD..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
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
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 4,
                    overflow: "hidden"
                }}
            >

                <Table>

                    <TableHead>

                        <TableRow
                            sx={{
                                background:
                                    "#f1f5f9"
                            }}
                        >

                            <TableCell>
                                <strong>#</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Bệnh nhân</strong>
                            </TableCell>

                            <TableCell>
                                <strong>SĐT</strong>
                            </TableCell>

                            <TableCell>
                                <strong>CCCD</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Ghi chú</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Lần khám gần nhất</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Trạng thái</strong>
                            </TableCell>
                            <TableCell align="center">
                                <strong>Thao tác</strong>
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {/* LOADING */}
                        {loading ? (

                            <TableRow>

                                <TableCell
                                    colSpan={7}
                                    align="center"
                                >

                                    <Box py={4}>

                                        <CircularProgress />

                                    </Box>

                                </TableCell>

                            </TableRow>

                        ) : filteredPatients.length === 0 ? (

                            // EMPTY
                            <TableRow>

                                <TableCell
                                    colSpan={7}
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

                        ) : (

                            // DATA
                            filteredPatients.map(
                                (p, index) => (

                                    <TableRow
                                        key={p.patientId}
                                        hover
                                    >

                                        {/* STT */}
                                        <TableCell>
                                            {index + 1}
                                        </TableCell>

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
                                                        {p.fullName}
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >

                                                        ID:
                                                        {" "}
                                                        {p.patientId}

                                                    </Typography>

                                                </Box>

                                            </Stack>

                                        </TableCell>

                                        {/* PHONE */}
                                        <TableCell>
                                            {p.phone}
                                        </TableCell>

                                        {/* CCCD */}
                                        <TableCell>
                                            {p.cccd}
                                        </TableCell>

                                        {/* NOTE */}
                                        <TableCell>
                                            {p.note || "-"}
                                        </TableCell>

                                        {/* STATUS */}
                                        <TableCell>
                                            {p.lastVisitDate
                                                ? new Date(
                                                    p.lastVisitDate
                                                ).toLocaleDateString("vi-VN")
                                                : "Chưa khám"}

                                        </TableCell>

                                        <TableCell>

                                            <Chip
                                                label={p.status}
                                                color={
                                                    p.status === "Khám lại"
                                                        ? "primary"
                                                        : p.status === "Đang xử lý"
                                                            ? "warning"
                                                            : "success"
                                                }
                                                size="small"
                                            />

                                        </TableCell>

                                        {/* ACTION */}
                                        <TableCell
                                            align="center"
                                        >

                                            <Button
                                                variant="contained"
                                                size="small"
                                                disabled={
                                                    p.status === "Đang xử lý"
                                                }
                                                onClick={() =>
                                                    onSelectPatient(p)
                                                }
                                            >
                                                {p.status === "Khám lại"
                                                    ? "Khám lại"
                                                    : "Tiếp nhận"}
                                            </Button>

                                        </TableCell>

                                    </TableRow>
                                )
                            )
                        )}

                    </TableBody>

                </Table>

            </Paper>

        </Box>
    );
};

export default DanhSachTiepNhan;
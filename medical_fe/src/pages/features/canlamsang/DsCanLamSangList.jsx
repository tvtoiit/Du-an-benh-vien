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
    TextField
} from "@mui/material";
import CanLamSangForm from "../canlamsang/CanLamSangForm";
import parentService from "../../../services/parentService";

const DsCanLamSangList = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await parentService.getPatientsWithServices();
                setPatients(res);
            } catch (error) {
                console.error("Lỗi tải bệnh nhân cận lâm sàng:", error);
            }
        };

        fetchPatients();
    }, []);

    const keyword = search.trim();

    const filteredPatients = keyword
        ? patients.filter((p) => p.cccd?.includes(keyword))
        : patients;

    return (
        <Box sx={{ p: 4 }}>
            {!selectedPatient ? (
                <>
                    <Box sx={{ mb: 2 }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 2
                            }}
                        >
                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                color="primary"
                            >
                                Danh sách bệnh nhân cần thực hiện cận lâm sàng
                            </Typography>

                            <TextField
                                size="small"
                                label="Tìm theo CCCD"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                sx={{ width: "300px" }}
                            />
                        </Box>
                    </Box>

                    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><b>Họ và tên</b></TableCell>
                                        <TableCell><b>Ngày sinh</b></TableCell>
                                        <TableCell><b>SĐT</b></TableCell>
                                        <TableCell><b>CCCD</b></TableCell>
                                        <TableCell><b>Dịch vụ chỉ định</b></TableCell>
                                        <TableCell align="center"><b>Thao tác</b></TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {filteredPatients.map((p) => (
                                        <TableRow key={p.patientId}>
                                            <TableCell>{p.fullName}</TableCell>

                                            <TableCell>
                                                {p.dateOfBirth?.split("T")[0]}
                                            </TableCell>

                                            <TableCell>{p.phoneNumber}</TableCell>
                                            <TableCell>{p.cccd}</TableCell>
                                            <TableCell>
                                                {p.services.map((s) => (
                                                    <Chip
                                                        key={s.serviceId}
                                                        label={s.serviceName}
                                                        color="info"
                                                        size="small"
                                                        sx={{ mr: 1, mb: 1 }}
                                                    />
                                                ))}
                                            </TableCell>

                                            <TableCell align="center">
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => setSelectedPatient(p)}
                                                >
                                                    Thực hiện
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredPatients.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">
                                                Không tìm thấy bệnh nhân
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </>
            ) : (
                <CanLamSangForm
                    patient={selectedPatient}
                    onBack={() => setSelectedPatient(null)}
                />
            )}
        </Box>
    );
};

export default DsCanLamSangList;

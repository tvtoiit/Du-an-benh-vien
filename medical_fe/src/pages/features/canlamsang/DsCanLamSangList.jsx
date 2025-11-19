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
} from "@mui/material";
import CanLamSangForm from "../canlamsang/CanLamSangForm";
import parentService from "../../../services/parentService";

const DsCanLamSangList = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);

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

    return (
        <Box sx={{ p: 4 }}>
            {!selectedPatient ? (
                <>
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        textAlign="center"
                        mb={3}
                        color="primary"
                    >
                        Danh sách bệnh nhân cần thực hiện cận lâm sàng
                    </Typography>

                    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><b>Họ và tên</b></TableCell>
                                        <TableCell><b>Ngày sinh</b></TableCell>
                                        <TableCell><b>SĐT</b></TableCell>
                                        <TableCell><b>Dịch vụ chỉ định</b></TableCell>
                                        <TableCell align="center"><b>Thao tác</b></TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {patients.map((p) => (
                                        <TableRow key={p.patientId}>
                                            <TableCell>{p.fullName}</TableCell>

                                            <TableCell>
                                                {p.services[0]?.dateOfBirth?.split("T")[0]}
                                            </TableCell>

                                            <TableCell>{p.services[0]?.contactNumber}</TableCell>

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

// src/pages/features/Appointments/DanhSachTiepNhan.jsx
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
} from "@mui/material";
import patientService from "../../../services/parentService";

const DanhSachTiepNhan = ({ onSelectPatient }) => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                setLoading(true);

                let res;
                // Nếu bạn có API riêng cho danh sách chờ tiếp nhận thì dùng:
                if (patientService.getWaitingPatients1) {
                    res = await patientService.getWaitingPatients1();
                } else {
                    // fallback: lấy toàn bộ bệnh nhân
                    res = await patientService.getAll();
                }

                // tuỳ patientService viết thế nào:
                // nếu dùng axios mà bạn đã return response.data thì list = res
                // nếu return nguyên response thì list = res.data
                const list = res.data ?? res;

                setPatients(Array.isArray(list) ? list : []);
            } catch (error) {
                console.error("Lỗi load danh sách bệnh nhân:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    return (
        <Box>
            <Typography variant="h6" mb={2}>
                Danh sách bệnh nhân chờ tiếp nhận
            </Typography>

            <Paper sx={{ p: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell>Họ tên</TableCell>
                            <TableCell>CCCD</TableCell>
                            <TableCell>SĐT</TableCell>
                            <TableCell align="right">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    Đang tải dữ liệu...
                                </TableCell>
                            </TableRow>
                        ) : patients.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    Không có bệnh nhân nào đang chờ tiếp nhận.
                                </TableCell>
                            </TableRow>
                        ) : (
                            patients.map((p, index) => (
                                <TableRow key={p.patientId}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{p.fullName}</TableCell>
                                    <TableCell>{p.address}</TableCell>
                                    <TableCell>{p.contactNumber}</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => onSelectPatient(p)}
                                        >
                                            Tiếp nhận
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
};

export default DanhSachTiepNhan;

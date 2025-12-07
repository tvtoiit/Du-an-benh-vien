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

// Component Badge hiển thị trạng thái
const StatusBadge = ({ status }) => {
    const colors = {
        "Khám lại": "#0d6efd",
        "Chờ khám": "#ffc107"
    };

    return (
        <span
            style={{
                padding: "4px 8px",
                borderRadius: "6px",
                color: "white",
                backgroundColor: colors[status] || "#6c757d",
                fontSize: "0.85rem",
                fontWeight: 500,
            }}
        >
            {status}
        </span>
    );
};

const DanhSachTiepNhan = ({ onSelectPatient }) => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadWaitingPatients = async () => {
            try {
                setLoading(true);
                const res = await patientService.getWaitingPatients1();
                const list = res.data ?? res;
                setPatients(Array.isArray(list) ? list : []);
            } catch (error) {
                console.error("Lỗi load danh sách bệnh nhân chờ tiếp nhận:", error);
            } finally {
                setLoading(false);
            }
        };

        loadWaitingPatients();
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
                            <TableCell>SĐT</TableCell>
                            <TableCell>ghi chu</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell align="right">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    Đang tải dữ liệu...
                                </TableCell>
                            </TableRow>
                        ) : patients.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    Không có bệnh nhân nào đang chờ tiếp nhận.
                                </TableCell>
                            </TableRow>
                        ) : (
                            patients.map((p, index) => (
                                <TableRow key={p.patientId}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{p.fullName}</TableCell>
                                    <TableCell>{p.phone}</TableCell>
                                    <TableCell>{p.cccd}</TableCell>

                                    {/* HIỂN THỊ TRẠNG THÁI */}
                                    <TableCell>
                                        <StatusBadge status={p.status} />
                                    </TableCell>

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

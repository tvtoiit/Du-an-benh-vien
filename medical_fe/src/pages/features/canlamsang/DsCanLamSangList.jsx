import React, { useState } from "react";
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
} from "@mui/material";
import CanLamSangForm from "../canlamsang/CanLamSangForm";

const LabList = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);

    // Danh sách bệnh nhân giả lập
    const patients = [
        {
            id: 1,
            name: "Nguyễn Văn A",
            gender: "Nam",
            birth: "1988-03-12",
            department: "Nội tổng hợp",
            test: "Xét nghiệm máu",
            status: "Chưa làm",
        },
        {
            id: 2,
            name: "Trần Thị B",
            gender: "Nữ",
            birth: "1992-07-22",
            department: "Da liễu",
            test: "Xét nghiệm nước tiểu",
            status: "Đang làm",
        },
        {
            id: 3,
            name: "Lê Văn C",
            gender: "Nam",
            birth: "1979-10-05",
            department: "Ngoại tổng quát",
            test: "X-quang phổi",
            status: "Hoàn thành",
        },
    ];

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
                                        <TableCell><b>Giới tính</b></TableCell>
                                        <TableCell><b>Ngày sinh</b></TableCell>
                                        <TableCell><b>Khoa chỉ định</b></TableCell>
                                        <TableCell><b>Chỉ định</b></TableCell>
                                        <TableCell><b>Trạng thái</b></TableCell>
                                        <TableCell align="center"><b>Thao tác</b></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {patients.map((p) => (
                                        <TableRow key={p.id}>
                                            <TableCell>{p.name}</TableCell>
                                            <TableCell>{p.gender}</TableCell>
                                            <TableCell>{p.birth}</TableCell>
                                            <TableCell>{p.department}</TableCell>
                                            <TableCell>{p.test}</TableCell>
                                            <TableCell>{p.status}</TableCell>
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

export default LabList;

import React, { useEffect, useState } from "react";
import medicineService from "../../../services/medicinesService";
import RegisterMedicineModal from "./RegisterMedicineModal";
import EditMedicineModal from "./EditMedicineModal";
import DetailModal from "../../../components/DetailModal";


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
    Stack,
    IconButton,
    Tooltip,
    CircularProgress,
} from "@mui/material";

import { FaPlus } from "react-icons/fa";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";

const MedicineList = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);

    // model detail
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailData, setDetailData] = useState({});


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMedicine, setEditingMedicine] = useState(null);

    const loadMedicines = async () => {
        try {
            const response = await medicineService.getAll();
            setMedicines(Array.isArray(response) ? response : []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMedicines();
    }, []);

    const handleOpenModal = () => setIsModalOpen(true);

    const handleCloseModal = (reload = false) => {
        setIsModalOpen(false);
        if (reload) loadMedicines();
    };

    const handleView = (s) => {
        setDetailData({
            "Tên thuốc": s.name,
            "Số lượng": s.quantity,
            "Đơn vị": s.unit,
            "Giá": s.price
        });
        setDetailOpen(true);
    };


    const handleEdit = (m) => {
        setEditingMedicine(m);
    };

    if (loading) return <CircularProgress sx={{ m: 4 }} />;

    return (
        <Box sx={{ p: 4 }}>
            <Paper sx={{ p: 2, mb: 3, display: "flex", justifyContent: "space-between" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Quản lý danh sách thuốc
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenModal}
                    startIcon={<FaPlus />}
                >
                    Thêm Thuốc Mới
                </Button>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                            {/* <TableCell>Mã thuốc</TableCell> */}
                            <TableCell>Tên thuốc</TableCell>
                            <TableCell>Số lượng</TableCell>
                            <TableCell>Đơn vị</TableCell>
                            <TableCell>Giá</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {medicines.map((m) => (
                            <TableRow key={m.medicineId} hover>
                                {/* <TableCell>{m.medicineId}</TableCell> */}
                                <TableCell>{m.name}</TableCell>
                                <TableCell>{m.quantity}</TableCell>
                                <TableCell>{m.unit}</TableCell>
                                <TableCell>{m.price}</TableCell>

                                <TableCell align="center">
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                        <Tooltip title="Xem chi tiết">
                                            <IconButton color="primary" onClick={() => handleView(m)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Sửa thông tin">
                                            <IconButton color="warning" onClick={() => handleEdit(m)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {isModalOpen && <RegisterMedicineModal onClose={handleCloseModal} />}

            {editingMedicine && (
                <EditMedicineModal
                    medicine={editingMedicine}
                    onClose={() => {
                        setEditingMedicine(null);
                        loadMedicines();
                    }}
                />
            )}

            <DetailModal
                open={detailOpen}
                onClose={() => setDetailOpen(false)}
                title="Thông tin thuốc"
                data={detailData}
            />
        </Box>
    );
};


export default MedicineList;

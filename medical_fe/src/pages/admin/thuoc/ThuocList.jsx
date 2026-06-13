import React, { useEffect, useState } from "react";
import medicineService from "../../../services/medicinesService";
import RegisterMedicineModal from "./RegisterMedicineModal";
import EditMedicineModal from "./EditMedicineModal";
import DetailModal from "../../../components/DetailModal";
import DeleteIcon from "@mui/icons-material/Delete";

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
    TextField
} from "@mui/material";

import { FaPlus } from "react-icons/fa";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import InputAdornment from "@mui/material/InputAdornment";
import Avatar from "@mui/material/Avatar";
import SearchIcon from "@mui/icons-material/Search";
import MedicationIcon from "@mui/icons-material/Medication";

const MedicineList = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

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

    const keyword = search.trim().toLowerCase();

    const filteredMedicines = keyword
        ? medicines.filter((m) =>
            m.name?.toLowerCase().includes(keyword)
        )
        : medicines;

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

    const handleDelete = async (medicine) => {
        if (!window.confirm(`Bạn có chắc muốn xóa thuốc "${medicine.name}"?`)) return;

        try {
            await medicineService.delete(medicine.medicineId);
            toast.success("Xóa thuốc thành công!");
            loadMedicines();
        } catch (err) {
            console.error("Lỗi xóa thuốc:", err);
            toast.error("Không thể xóa thuốc. Thuốc có thể đang được sử dụng!");
        }
    };



    const handleEdit = (m) => {
        setEditingMedicine(m);
    };

    if (loading) return <CircularProgress sx={{ m: 4 }} />;
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
                        Quản lý thuốc
                    </Typography>

                    <Typography
                        variant="body2"
                    >
                        Danh sách thuốc trong kho
                    </Typography>
                </Box>

                <Chip
                    label={`${filteredMedicines.length} loại thuốc`}
                    sx={{
                        bgcolor: "#fff",
                        color: "#1976d2",
                        fontWeight: "bold"
                    }}
                />
            </Paper>

            {/* TOOLBAR */}

            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2
                }}
            >
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Tìm kiếm theo tên thuốc..."
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

                <Button
                    variant="contained"
                    startIcon={<FaPlus />}
                    onClick={handleOpenModal}
                    sx={{
                        borderRadius: 2,
                        minWidth: 180
                    }}
                >
                    Thêm thuốc
                </Button>
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
                                    Thuốc
                                </strong>
                            </TableCell>

                            <TableCell>
                                <strong>
                                    Số lượng
                                </strong>
                            </TableCell>

                            <TableCell>
                                <strong>
                                    Đơn vị
                                </strong>
                            </TableCell>

                            <TableCell>
                                <strong>
                                    Giá
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

                        {filteredMedicines.map(
                            (m) => (

                                <TableRow
                                    key={
                                        m.medicineId
                                    }
                                    hover
                                >

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
                                                <MedicationIcon />
                                            </Avatar>

                                            <Typography
                                                fontWeight="bold"
                                            >
                                                {m.name}
                                            </Typography>

                                        </Stack>

                                    </TableCell>

                                    <TableCell>
                                        {m.quantity}
                                    </TableCell>

                                    <TableCell>
                                        {m.unit}
                                    </TableCell>

                                    <TableCell>
                                        {Number(
                                            m.price || 0
                                        ).toLocaleString()}
                                        {" "}VNĐ
                                    </TableCell>

                                    <TableCell
                                        align="center"
                                    >
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            justifyContent="center"
                                        >

                                            <Tooltip title="Xem chi tiết">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() =>
                                                        handleView(
                                                            m
                                                        )
                                                    }
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Sửa">
                                                <IconButton
                                                    color="warning"
                                                    onClick={() =>
                                                        handleEdit(
                                                            m
                                                        )
                                                    }
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Xóa">
                                                <IconButton
                                                    color="error"
                                                    onClick={() =>
                                                        handleDelete(
                                                            m
                                                        )
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>

                                        </Stack>
                                    </TableCell>

                                </TableRow>
                            )
                        )}

                        {filteredMedicines.length ===
                            0 && (

                                <TableRow>

                                    <TableCell
                                        colSpan={5}
                                        align="center"
                                    >

                                        <Typography
                                            py={4}
                                            color="text.secondary"
                                        >
                                            Không tìm thấy thuốc
                                        </Typography>

                                    </TableCell>

                                </TableRow>

                            )}

                    </TableBody>

                </Table>
            </TableContainer>

            {isModalOpen && (
                <RegisterMedicineModal
                    onClose={
                        handleCloseModal
                    }
                />
            )}

            {editingMedicine && (
                <EditMedicineModal
                    medicine={
                        editingMedicine
                    }
                    onClose={() => {
                        setEditingMedicine(
                            null
                        );
                        loadMedicines();
                    }}
                />
            )}

            <DetailModal
                open={detailOpen}
                onClose={() =>
                    setDetailOpen(false)
                }
                title="Thông tin thuốc"
                data={detailData}
            />
        </Box>
    );
}

export default MedicineList;

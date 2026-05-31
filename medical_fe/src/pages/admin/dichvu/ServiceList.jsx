import { useEffect, useState } from "react";
import serviceService from "../../../services/servicesServices";
import RegisterServiceModal from "./RegisterServiceModal";
import EditServiceModal from "./EditServiceModal";
import { toast } from "react-toastify";
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
    Chip,
    TextField,
} from "@mui/material";

import { FaPlus } from "react-icons/fa";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [detailOpen, setDetailOpen] = useState(false);
    const [detailData, setDetailData] = useState({});

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);

    // =========================
    // LOAD DATA
    // =========================
    const loadServices = async () => {
        try {
            setLoading(true);

            const res = await serviceService.getAll();

            const list =
                res?.data?.data ??
                res?.data ??
                [];

            setServices(
                Array.isArray(list)
                    ? list
                    : []
            );
        } catch (err) {
            console.error(err);

            toast.error(
                "Không thể tải danh sách dịch vụ"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadServices();
    }, []);

    // =========================
    // XEM CHI TIẾT
    // =========================
    const handleView = (s) => {
        setDetailData({
            "Tên dịch vụ": s.serviceName,

            "Loại dịch vụ":
                s.serviceType === "CLINICAL"
                    ? "Cận lâm sàng"
                    : "Dịch vụ bác sĩ",

            "Chuyên khoa":
                s.roomGroupName || "-",

            "Giá":
                Number(
                    s.price || 0
                ).toLocaleString() + " VNĐ",

            "Mô tả":
                s.description || "-",
        });

        setDetailOpen(true);
    };

    // =========================
    // XÓA
    // =========================
    const handleDelete = async (s) => {
        if (
            !window.confirm(
                `Bạn có chắc muốn xóa dịch vụ "${s.serviceName}"?`
            )
        ) {
            return;
        }

        try {
            await serviceService.delete(
                s.serviceId
            );

            toast.success(
                "Xóa dịch vụ thành công!"
            );

            loadServices();
        } catch (err) {
            toast.error(
                err?.response?.data?.message ||
                "Không thể xóa dịch vụ!"
            );
        }
    };

    // =========================
    // SEARCH
    // =========================
    const filteredServices =
        services.filter((s) =>
            s.serviceName
                ?.toLowerCase()
                .includes(
                    search.toLowerCase()
                )
        );

    // =========================
    // LOADING
    // =========================
    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 5,
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* HEADER */}
            <Paper
                sx={{
                    p: 2,
                    mb: 3,
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <Box>
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        Quản lý dịch vụ
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Danh sách dịch vụ khám
                        và cận lâm sàng
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                    }}
                >
                    <TextField
                        size="small"
                        label="Tìm theo tên dịch vụ"
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                    <Button
                        variant="contained"
                        startIcon={<FaPlus />}
                        onClick={() =>
                            setIsModalOpen(true)
                        }
                    >
                        Thêm dịch vụ
                    </Button>
                </Box>
            </Paper>

            {/* TABLE */}
            <TableContainer
                component={Paper}
            >
                <Table>
                    <TableHead>
                        <TableRow
                            sx={{
                                backgroundColor:
                                    "#e3f2fd",
                            }}
                        >
                            <TableCell>
                                Tên dịch vụ
                            </TableCell>

                            <TableCell>
                                Loại dịch vụ
                            </TableCell>

                            <TableCell>
                                Chuyên khoa
                            </TableCell>

                            <TableCell>
                                Giá
                            </TableCell>

                            <TableCell>
                                Mô tả
                            </TableCell>

                            <TableCell align="center">
                                Thao tác
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filteredServices.map(
                            (s) => (
                                <TableRow
                                    key={
                                        s.serviceId
                                    }
                                    hover
                                >
                                    <TableCell
                                        sx={{
                                            fontWeight:
                                                600,
                                        }}
                                    >
                                        {
                                            s.serviceName
                                        }
                                    </TableCell>

                                    <TableCell>
                                        <Chip
                                            size="small"
                                            label={
                                                s.serviceType ===
                                                    "CLINICAL"
                                                    ? "CLS"
                                                    : "Khám"
                                            }
                                            color={
                                                s.serviceType ===
                                                    "CLINICAL"
                                                    ? "secondary"
                                                    : "primary"
                                            }
                                        />
                                    </TableCell>

                                    <TableCell>
                                        {s.roomGroupName ||
                                            "-"}
                                    </TableCell>

                                    <TableCell>
                                        {Number(
                                            s.price ||
                                            0
                                        ).toLocaleString()}
                                        {" VNĐ"}
                                    </TableCell>

                                    <TableCell>
                                        {s.description}
                                    </TableCell>

                                    <TableCell align="center">
                                        <Stack
                                            direction="row"
                                            spacing={
                                                1
                                            }
                                            justifyContent="center"
                                        >
                                            <Tooltip title="Xem chi tiết">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() =>
                                                        handleView(
                                                            s
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
                                                        setEditingService(
                                                            s
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
                                                            s
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

                        {filteredServices.length ===
                            0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        align="center"
                                    >
                                        Không tìm thấy
                                        dịch vụ nào
                                    </TableCell>
                                </TableRow>
                            )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* CREATE */}
            {isModalOpen && (
                <RegisterServiceModal
                    onClose={(
                        reload
                    ) => {
                        setIsModalOpen(
                            false
                        );

                        if (reload) {
                            loadServices();
                        }
                    }}
                />
            )}

            {/* EDIT */}
            {editingService && (
                <EditServiceModal
                    service={
                        editingService
                    }
                    onClose={(
                        reload
                    ) => {
                        setEditingService(
                            null
                        );

                        if (reload) {
                            loadServices();
                        }
                    }}
                />
            )}

            {/* DETAIL */}
            <DetailModal
                open={detailOpen}
                onClose={() =>
                    setDetailOpen(false)
                }
                title="Thông tin dịch vụ"
                data={detailData}
            />
        </Box>
    );
};

export default ServiceList;
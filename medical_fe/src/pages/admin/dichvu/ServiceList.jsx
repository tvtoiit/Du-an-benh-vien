import { useEffect, useState } from "react";
import serviceService from "../../../services/servicesServices";
import RegisterServiceModal from "./RegisterServiceModal";
import EditServiceModal from "./EditServiceModal";
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
    Avatar,
    InputAdornment
} from "@mui/material";

import { FaPlus } from "react-icons/fa";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

import { toast } from "react-toastify";

const ServiceList = () => {

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [detailOpen, setDetailOpen] = useState(false);
    const [detailData, setDetailData] = useState({});

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);

    // =============================
    // LOAD DATA
    // =============================
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

    // =============================
    // XEM CHI TIẾT
    // =============================
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
                ).toLocaleString()
                + " VNĐ",

            "Mô tả":
                s.description || "-"
        });

        setDetailOpen(true);
    };

    // =============================
    // XÓA
    // =============================
    const handleDelete = async (service) => {

        if (
            !window.confirm(
                `Bạn có chắc muốn xóa dịch vụ "${service.serviceName}" ? `
            )
        ) {
            return;
        }

        try {

            await serviceService.delete(
                service.serviceId
            );

            toast.success(
                "Xóa dịch vụ thành công!"
            );

            loadServices();

        } catch (err) {

            console.error(err);

            toast.error(
                err?.response?.data?.message ||
                "Không thể xóa dịch vụ!"
            );

        }
    };

    // =============================
    // SEARCH
    // =============================
    const keyword =
        search.trim().toLowerCase();

    const filteredServices =
        keyword
            ? services.filter((s) =>
                s.serviceName
                    ?.toLowerCase()
                    .includes(keyword)
            )
            : services;

    // =============================
    // LOADING
    // =============================
    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 5
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

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
                        Danh mục dịch vụ
                    </Typography>

                    <Typography variant="body2">
                        Danh sách dịch vụ khám và cận lâm sàng
                    </Typography>

                </Box>
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
                    placeholder="Tìm kiếm theo tên dịch vụ..."
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
                    onClick={() =>
                        setIsModalOpen(true)
                    }
                    sx={{
                        borderRadius: 2,
                        minWidth: 180
                    }}
                >
                    Thêm dịch vụ
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
                                <strong>Dịch vụ</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Loại</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Chuyên khoa</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Giá</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Mô tả</strong>
                            </TableCell>

                            <TableCell align="center">
                                <strong>Thao tác</strong>
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {filteredServices.map((s) => (

                            <TableRow
                                key={s.serviceId}
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
                                            <MedicalServicesIcon />
                                        </Avatar>

                                        <Typography
                                            fontWeight="bold"
                                        >
                                            {s.serviceName}
                                        </Typography>

                                    </Stack>

                                </TableCell>

                                <TableCell>

                                    <Chip
                                        size="small"
                                        label={
                                            s.serviceType ===
                                                "CLINICAL"
                                                ? "Cận lâm sàng"
                                                : "Khám bệnh"
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
                                    {s.roomGroupName || "-"}
                                </TableCell>

                                <TableCell>
                                    {Number(
                                        s.price || 0
                                    ).toLocaleString()}
                                    {" VNĐ"}
                                </TableCell>

                                <TableCell>
                                    {s.description}
                                </TableCell>

                                <TableCell align="center">

                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        justifyContent="center"
                                    >

                                        <Tooltip title="Xem chi tiết">
                                            <IconButton
                                                color="primary"
                                                onClick={() =>
                                                    handleView(s)
                                                }
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Sửa">
                                            <IconButton
                                                color="warning"
                                                onClick={() =>
                                                    setEditingService(s)
                                                }
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Xóa">
                                            <IconButton
                                                color="error"
                                                onClick={() =>
                                                    handleDelete(s)
                                                }
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>

                                    </Stack>

                                </TableCell>

                            </TableRow>

                        ))}

                        {filteredServices.length === 0 && (

                            <TableRow>

                                <TableCell
                                    colSpan={6}
                                    align="center"
                                >

                                    <Typography
                                        py={4}
                                        color="text.secondary"
                                    >
                                        Không tìm thấy dịch vụ
                                    </Typography>

                                </TableCell>

                            </TableRow>

                        )}

                    </TableBody>

                </Table>

            </TableContainer>

            {/* CREATE */}

            {isModalOpen && (
                <RegisterServiceModal
                    onClose={(reload) => {

                        setIsModalOpen(false);

                        if (reload) {
                            loadServices();
                        }

                    }}
                />
            )}

            {/* EDIT */}

            {editingService && (
                <EditServiceModal
                    service={editingService}
                    onClose={(reload) => {

                        setEditingService(null);

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

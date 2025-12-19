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
} from "@mui/material";

import { FaPlus } from "react-icons/fa";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const [detailOpen, setDetailOpen] = useState(false);
    const [detailData, setDetailData] = useState({});

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);

    const loadServices = async () => {
        try {
            const res = await serviceService.getAll();
            setServices(Array.isArray(res?.data) ? res.data : []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadServices();
    }, []);

    const handleView = (s) => {
        setDetailData({
            "Tên dịch vụ": s.serviceName,
            "Giá": s.price,
            "Loại dịch vụ":
                s.serviceType === "CLINICAL"
                    ? "Cận lâm sàng"
                    : "Dịch vụ bác sĩ",
            "Mô tả": s.description,
        });
        setDetailOpen(true);
    };

    const handleDelete = async (s) => {
        if (!window.confirm(`Bạn có chắc muốn xóa dịch vụ "${s.serviceName}"?`)) return;

        try {
            await serviceService.delete(s.serviceId);
            toast.success("Xóa dịch vụ thành công!");
            loadServices();
        } catch (err) {
            toast.error(
                err?.response?.data?.message || "Không thể xóa dịch vụ!"
            );
        }
    };

    if (loading) return <CircularProgress sx={{ m: 4 }} />;

    return (
        <Box sx={{ p: 4 }}>
            <Paper
                sx={{
                    p: 2,
                    mb: 3,
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <Typography variant="subtitle1" fontWeight="bold">
                    Quản lý dịch vụ
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<FaPlus />}
                    onClick={() => setIsModalOpen(true)}
                >
                    Thêm dịch vụ
                </Button>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                            <TableCell>Tên dịch vụ</TableCell>
                            <TableCell>Loại dịch vụ</TableCell>
                            <TableCell>Giá</TableCell>
                            <TableCell>Mô tả</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {services.map((s) => (
                            <TableRow key={s.serviceId} hover>
                                <TableCell>{s.serviceName}</TableCell>

                                <TableCell>
                                    <Chip
                                        label={
                                            s.serviceType === "CLINICAL"
                                                ? "Cận lâm sàng"
                                                : "Bác sĩ"
                                        }
                                        color={
                                            s.serviceType === "CLINICAL"
                                                ? "secondary"
                                                : "primary"
                                        }
                                        size="small"
                                    />
                                </TableCell>

                                <TableCell>{s.price}</TableCell>
                                <TableCell>{s.description}</TableCell>

                                <TableCell align="center">
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        justifyContent="center"
                                    >
                                        <Tooltip title="Xem chi tiết">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleView(s)}
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Sửa">
                                            <IconButton
                                                color="warning"
                                                onClick={() => setEditingService(s)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Xóa">
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(s)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {isModalOpen && (
                <RegisterServiceModal
                    onClose={(reload) => {
                        setIsModalOpen(false);
                        if (reload) loadServices();
                    }}
                />
            )}

            {editingService && (
                <EditServiceModal
                    service={editingService}
                    onClose={(reload) => {
                        setEditingService(null);
                        if (reload) loadServices();
                    }}
                />
            )}

            <DetailModal
                open={detailOpen}
                onClose={() => setDetailOpen(false)}
                title="Thông tin dịch vụ"
                data={detailData}
            />
        </Box>
    );
};

export default ServiceList;

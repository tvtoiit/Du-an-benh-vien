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
} from "@mui/material";

import { FaPlus } from "react-icons/fa";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    // model detail
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

    const handleOpenModal = () => setIsModalOpen(true);

    const handleCloseModal = (reload = false) => {
        setIsModalOpen(false);
        if (reload) loadServices();
    };

    const handleView = (s) => {
        setDetailData({
            "Tên dịch vụ": s.serviceName,
            "Giá": s.price,
            "Mô tả:": s.description,
        });
        setDetailOpen(true);
    };

    const handleEdit = (s) => {
        setEditingService(s);
    };

    if (loading) return <CircularProgress sx={{ m: 4 }} />;

    return (
        <Box sx={{ p: 4 }}>
            <Paper sx={{ p: 2, mb: 3, display: "flex", justifyContent: "space-between" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Quản lý dịch vụ
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenModal}
                    startIcon={<FaPlus />}
                >
                    Thêm Dịch Vụ
                </Button>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                            <TableCell>Mã DV</TableCell>
                            <TableCell>Tên dịch vụ</TableCell>
                            <TableCell>Giá</TableCell>
                            <TableCell>Mô tả</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {services.map((s) => (
                            <TableRow key={s.serviceId} hover>
                                <TableCell>{s.serviceId}</TableCell>
                                <TableCell>{s.serviceName}</TableCell>
                                <TableCell>{s.price}</TableCell>
                                <TableCell>{s.description}</TableCell>

                                <TableCell align="center">
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                        <Tooltip title="Xem chi tiết">
                                            <IconButton color="primary" onClick={() => handleView(s)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Sửa thông tin">
                                            <IconButton color="warning" onClick={() => handleEdit(s)}>
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

            {isModalOpen && <RegisterServiceModal onClose={handleCloseModal} />}

            {editingService && (
                <EditServiceModal
                    service={editingService}
                    onClose={() => {
                        setEditingService(null);
                        loadServices();
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

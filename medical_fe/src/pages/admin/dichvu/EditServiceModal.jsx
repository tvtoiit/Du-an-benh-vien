import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Stack,
    Typography,
    Alert,
} from "@mui/material";
import serviceService from "../../../services/servicesServices";

const EditServiceModal = ({ service, onClose }) => {
    const [form, setForm] = useState({
        serviceName: service.serviceName || "",
        price: service.price || 0,
        description: service.description || "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // =========================
    // HANDLE CHANGE
    // =========================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: name === "price" ? Number(value) : value,
        });
    };

    // =========================
    // SUBMIT
    // =========================
    const handleSubmit = async () => {
        setError("");

        // FE validate
        if (!form.serviceName.trim()) {
            setError("Tên dịch vụ không được để trống");
            return;
        }

        if (!form.price || form.price <= 0) {
            setError("Giá dịch vụ phải lớn hơn 0");
            return;
        }

        try {
            setLoading(true);

            await serviceService.updateDichVu(service.serviceId, form);
            onClose(true);
        } catch (err) {
            // ⭐ BẮT LỖI BE GIỐNG REGISTER
            const msg =
                err?.response?.data?.message ||
                err?.response?.data ||
                "Cập nhật dịch vụ thất bại. Vui lòng thử lại.";

            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open onClose={() => onClose(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Cập nhật dịch vụ</DialogTitle>

            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    {/* MESSAGE LỖI GIỐNG TRANG ĐĂNG KÍ */}
                    {error && <Alert severity="error">{error}</Alert>}

                    {/* Loại dịch vụ (readonly) */}
                    <Typography variant="body2" color="text.secondary">
                        Loại dịch vụ:{" "}
                        <strong>
                            {service.serviceType === "CLINICAL"
                                ? "Cận lâm sàng"
                                : "Dịch vụ bác sĩ"}
                        </strong>
                    </Typography>

                    <TextField
                        label="Tên dịch vụ"
                        name="serviceName"
                        fullWidth
                        required
                        value={form.serviceName}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Giá (VNĐ)"
                        name="price"
                        type="number"
                        fullWidth
                        required
                        value={form.price}
                        onChange={handleChange}
                        inputProps={{ min: 0 }}
                    />

                    <TextField
                        label="Mô tả"
                        name="description"
                        fullWidth
                        multiline
                        rows={3}
                        value={form.description}
                        onChange={handleChange}
                    />
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={() => onClose(false)}
                    disabled={loading}
                >
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Đang cập nhật..." : "Cập nhật"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditServiceModal;

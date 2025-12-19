import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
} from "@mui/material";
import serviceService from "../../../services/servicesServices";

const RegisterServiceModal = ({ onClose }) => {
    const [form, setForm] = useState({
        serviceName: "",
        price: 0,
        description: "",
        serviceType: "DOCTOR",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // =========================
    // HANDLE CHANGE
    // =========================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: name === "price" ? Number(value) : value,
        }));
    };

    // =========================
    // VALIDATE FORM (FE)
    // =========================
    const validateForm = () => {
        if (!form.serviceName.trim()) {
            return "Tên dịch vụ không được để trống";
        }
        if (!form.price || form.price <= 0) {
            return "Giá dịch vụ phải lớn hơn 0";
        }
        if (!form.serviceType) {
            return "Vui lòng chọn loại dịch vụ";
        }
        return "";
    };

    // =========================
    // SUBMIT
    // =========================
    const handleSubmit = async () => {
        setError("");

        const validateMsg = validateForm();
        if (validateMsg) {
            setError(validateMsg);
            return;
        }

        try {
            setLoading(true);

            await serviceService.createDichVu(form);

            // Reset form
            setForm({
                serviceName: "",
                price: 0,
                description: "",
                serviceType: "DOCTOR",
            });

            onClose(true);
        } catch (err) {
            // ⭐ BẮT ĐÚNG LỖI TỪ BE
            const msg =
                err?.response?.data?.message ||
                err?.response?.data ||
                "Không thể thêm dịch vụ. Vui lòng thử lại.";

            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open onClose={() => onClose(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Thêm dịch vụ mới</DialogTitle>

            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    {error && <Alert severity="error">{error}</Alert>}

                    <TextField
                        label="Tên dịch vụ"
                        name="serviceName"
                        fullWidth
                        required
                        value={form.serviceName}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Giá dịch vụ (VNĐ)"
                        name="price"
                        type="number"
                        fullWidth
                        required
                        value={form.price}
                        onChange={handleChange}
                        inputProps={{ min: 0 }}
                    />

                    <FormControl fullWidth required>
                        <InputLabel id="service-type-label">
                            Loại dịch vụ
                        </InputLabel>
                        <Select
                            labelId="service-type-label"
                            name="serviceType"
                            value={form.serviceType}
                            label="Loại dịch vụ"
                            onChange={handleChange}
                        >
                            <MenuItem value="DOCTOR">
                                Dịch vụ bác sĩ
                            </MenuItem>
                            <MenuItem value="CLINICAL">
                                Cận lâm sàng
                            </MenuItem>
                        </Select>
                    </FormControl>

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
                    color="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Đang lưu..." : "Lưu"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RegisterServiceModal;

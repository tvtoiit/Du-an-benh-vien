import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Stack,
} from "@mui/material";
import serviceService from "../../../services/servicesServices";

const EditServiceModal = ({ service, onClose }) => {
    const [form, setForm] = useState({ ...service });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await serviceService.updateDichVu(form.serviceId, form);
            onClose(true);
        } catch (err) {
            console.error("Lỗi cập nhật dịch vụ:", err);
        }
    };

    return (
        <Dialog open onClose={() => onClose(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Cập nhật dịch vụ</DialogTitle>

            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Tên dịch vụ"
                        name="serviceName"
                        fullWidth
                        value={form.serviceName}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Giá"
                        name="price"
                        type="number"
                        fullWidth
                        value={form.price}
                        onChange={handleChange}
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
                <Button onClick={() => onClose(false)}>Hủy</Button>
                <Button variant="contained" onClick={handleSubmit} color="primary">
                    Cập nhật
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditServiceModal;

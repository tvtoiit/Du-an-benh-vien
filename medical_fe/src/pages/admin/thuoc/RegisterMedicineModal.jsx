import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Stack,
} from "@mui/material";
import medicineService from "../../../services/medicinesService";

const RegisterMedicineModal = ({ onClose }) => {
    const [form, setForm] = useState({
        name: "",
        quantity: "",
        unit: "",
        price: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await medicineService.create(form);
            onClose(true);
        } catch (err) {
            console.error("Lỗi thêm thuốc:", err);
        }
    };

    return (
        <Dialog open onClose={() => onClose(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Thêm thuốc mới</DialogTitle>

            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Tên thuốc"
                        name="name"
                        fullWidth
                        value={form.name}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Số lượng"
                        name="quantity"
                        fullWidth
                        value={form.quantity}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Đơn vị"
                        name="unit"
                        fullWidth
                        value={form.unit}
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
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={() => onClose(false)}>Hủy</Button>
                <Button variant="contained" onClick={handleSubmit} color="primary">
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RegisterMedicineModal;

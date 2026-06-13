import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Stack,
    MenuItem,
} from "@mui/material";
import medicineService from "../../../services/medicinesService";
import { toast } from "react-toastify";

const units = ["viên", "hộp", "chai", "gói", "ống"];

const RegisterMedicineModal = ({ onClose }) => {
    const [form, setForm] = useState({
        name: "",
        unit: "",
        description: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.name.trim()) return toast.error("Tên thuốc không được để trống");
        if (!form.unit.trim()) return toast.error("Vui lòng chọn đơn vị");

        try {
            await medicineService.create(form);
            toast.success("Thêm thuốc thành công!");
            onClose(true);
        } catch (err) {
            console.error("Lỗi thêm thuốc:", err);
            toast.error(err?.response?.data?.message || "Không thể thêm thuốc");
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
                        select
                        label="Đơn vị"
                        name="unit"
                        fullWidth
                        value={form.unit}
                        onChange={handleChange}
                    >
                        {units.map((u) => (
                            <MenuItem key={u} value={u}>
                                {u}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Mô tả thuốc"
                        name="description"
                        multiline
                        rows={3}
                        fullWidth
                        value={form.description}
                        onChange={handleChange}
                    />
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={() => onClose(false)}>Hủy</Button>
                <Button variant="contained" onClick={handleSubmit}>
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RegisterMedicineModal;

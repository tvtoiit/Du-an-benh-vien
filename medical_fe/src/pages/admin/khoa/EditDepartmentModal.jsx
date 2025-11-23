// src/pages/features/Department/EditDepartmentModal.jsx
import React, { useState } from "react";
import {
    Box,
    Modal,
    Typography,
    TextField,
    Button,
    Stack,
} from "@mui/material";
import departmentService from "../../../services/departmentService";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 450,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

const EditDepartmentModal = ({ department, onClose }) => {
    const [form, setForm] = useState({
        name: department?.name || "",
        description: department?.description || "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.name.trim()) {
            alert("Vui lòng nhập tên khoa");
            return;
        }

        try {
            await departmentService.update(department.departmentId, form);
            onClose(true);
        } catch (err) {
            console.error(err);
            alert("Không thể cập nhật khoa.");
        }
    };

    return (
        <Modal open onClose={() => onClose(false)}>
            <Box sx={style}>
                <Typography variant="h6" mb={2}>
                    Sửa thông tin Khoa
                </Typography>

                <Stack spacing={2}>
                    <TextField
                        label="Tên khoa"
                        name="name"
                        fullWidth
                        value={form.name}
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

                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => onClose(false)}
                        >
                            Đóng
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Lưu
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Modal>
    );
};

export default EditDepartmentModal;

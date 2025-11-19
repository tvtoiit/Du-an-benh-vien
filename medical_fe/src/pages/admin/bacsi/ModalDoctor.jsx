import React, { useState } from "react";
import {
    Box,
    Modal,
    Typography,
    TextField,
    Button,
    Stack
} from "@mui/material";
import doctorService from "../../../services/doctorService";

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

const ModalDoctor = ({ onClose, onSuccess }) => {
    const [form, setForm] = useState({
        fullName: "",
        specialty: "",
        phoneNumber: "",
        email: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.fullName || !form.specialty) {
            alert("Vui lòng nhập đầy đủ họ tên và chuyên khoa");
            return;
        }

        try {
            await doctorService.create(form);
            alert("Thêm bác sĩ thành công!");
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            alert("Không thể thêm bác sĩ.");
        }
    };

    return (
        <Modal open onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" mb={2}>
                    Thêm Bác Sĩ Mới
                </Typography>

                <Stack spacing={2}>
                    <TextField
                        label="Họ và tên"
                        name="fullName"
                        fullWidth
                        value={form.fullName}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Chuyên khoa"
                        name="specialty"
                        fullWidth
                        value={form.specialty}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Số điện thoại"
                        name="phoneNumber"
                        fullWidth
                        value={form.phoneNumber}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Email"
                        name="email"
                        fullWidth
                        value={form.email}
                        onChange={handleChange}
                    />

                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button variant="contained" color="error" onClick={onClose}>
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

export default ModalDoctor;

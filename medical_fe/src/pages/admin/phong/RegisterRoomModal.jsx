import React, { useState, useEffect } from "react";
import { Box, Modal, Typography, TextField, Button, Stack, MenuItem } from "@mui/material";
import roomService from "../../../services/roomService";
import departmentService from "../../../services/departmentService";
import { toast } from "react-toastify";

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

const RegisterRoomModal = ({ onClose }) => {
    const [form, setForm] = useState({
        roomName: "",
        departmentId: ""
    });

    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        departmentService.getAll().then((res) => {
            setDepartments(Array.isArray(res) ? res : []);
        });
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.roomName || !form.departmentId) {
            toast.error("Vui lòng nhập đủ thông tin");
            return;
        }

        try {
            await roomService.create({
                roomName: form.roomName,
                department: {
                    departmentId: form.departmentId
                }
            });
            toast.success('Thêm thành công!');
            onClose(true);
        } catch (err) {
            toast.error(err.response?.data?.message || "Có lỗi xảy ra!");
        }
    };

    return (
        <Modal open onClose={() => onClose(false)}>
            <Box sx={style}>
                <Typography variant="h6" mb={2}>
                    Thêm Phòng Mới
                </Typography>

                <Stack spacing={2}>
                    <TextField
                        label="Tên phòng"
                        name="roomName"
                        fullWidth
                        value={form.roomName}
                        onChange={handleChange}
                    />

                    <TextField
                        select
                        label="Chọn khoa"
                        fullWidth
                        name="departmentId"
                        value={form.departmentId}
                        onChange={handleChange}
                    >
                        {departments.map((dep) => (
                            <MenuItem key={dep.departmentId} value={dep.departmentId}>
                                {dep.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button variant="contained" color="error" onClick={() => onClose(false)}>
                            Đóng
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Lưu
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Modal >
    );
};

export default RegisterRoomModal;

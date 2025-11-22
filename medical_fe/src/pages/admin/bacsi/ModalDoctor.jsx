import { useState, useEffect } from "react";
import {
    Box,
    Modal,
    Typography,
    TextField,
    Button,
    Stack
} from "@mui/material";
import doctorService from "../../../services/doctorService";

import userService from "../../../services/userService";
import { MenuItem } from "@mui/material";

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
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await userService.getByRole();
                const list = res.data ?? res;
                setUsers(list);
            } catch (err) {
                console.error("Lỗi load users:", err);
            }
        };

        fetchUsers();
    }, []);

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
                        select
                        label="Chọn tài khoản người dùng"
                        name="userId"
                        fullWidth
                        value={form.userId || ""}
                        onChange={handleChange}
                    >
                        {users.map((u) => (
                            <MenuItem key={u.userId} value={u.userId}>
                                {u.fullName} — {u.email}
                            </MenuItem>
                        ))}
                    </TextField>


                    <TextField
                        label="Chuyên khoa"
                        name="specialty"
                        fullWidth
                        value={form.specialty}
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

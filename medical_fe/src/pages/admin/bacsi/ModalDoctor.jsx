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
import departmentService from "../../../services/departmentService";


import userService from "../../../services/userService";
import { MenuItem } from "@mui/material";
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

const ModalDoctor = ({ onClose, onSuccess }) => {
    const [form, setForm] = useState({
        userId: "",
        departmentId: "",
        experience: ""
    });

    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resUsers = await userService.getByRole();
                setUsers(resUsers.data ?? resUsers);

                const resDept = await departmentService.getAll();
                setDepartments(resDept.data ?? resDept);
            } catch (err) {
                console.error("Lỗi load dữ liệu:", err);
            }
        };

        fetchData();
    }, []);


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
        if (!form.userId || !form.departmentId || !form.experience) {
            toast.success("Vui lòng chọn đầy đủ thông tin!");
            return;
        }

        try {
            await doctorService.create(form);
            toast.success("✅ Thêm bác sĩ thành công!");
            onSuccess?.();
            onClose();
        } catch (err) {
            toast.error("❌ Không thể thêm bác sĩ");
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
                        value={form.userId}
                        onChange={handleChange}
                    >
                        {users.map(u => (
                            <MenuItem key={u.userId} value={u.userId}>
                                {u.fullName} — {u.email}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Chọn khoa"
                        name="departmentId"
                        fullWidth
                        value={form.departmentId}
                        onChange={handleChange}
                    >
                        {departments.map(d => (
                            <MenuItem key={d.departmentId} value={d.departmentId}>
                                {d.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Kinh nghiệm (năm)"
                        name="experience"
                        type="number"
                        fullWidth
                        value={form.experience}
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

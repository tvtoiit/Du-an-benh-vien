import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";

const UserManagement = () => {
    // Fake data ban đầu
    const [users, setUsers] = useState([
        {
            user_id: "1",
            full_name: "Nguyễn Văn A",
            email: "vana@example.com",
            phone_number: "0901234567",
            address: "Hà Nội",
            status: "active",
        },
        {
            user_id: "2",
            full_name: "Trần Thị B",
            email: "thib@example.com",
            phone_number: "0987654321",
            address: "TP.HCM",
            status: "inactive",
        },
    ]);

    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone_number: "",
        address: "",
        status: "active",
    });

    const handleOpen = (user = null) => {
        setEditingUser(user);
        setFormData(
            user || {
                full_name: "",
                email: "",
                phone_number: "",
                address: "",
                status: "active",
            }
        );
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingUser(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Thêm hoặc sửa user trong danh sách
    const handleSave = () => {
        if (editingUser) {
            // cập nhật user
            setUsers((prev) =>
                prev.map((u) =>
                    u.user_id === editingUser.user_id ? { ...u, ...formData } : u
                )
            );
        }
        // } else {
        //     // thêm mới
        //     const newUser = { user_id: uuidv4(), ...formData };
        //     setUsers((prev) => [...prev, newUser]);
        // }
        handleClose();
    };
    /////////////////////CALL API SERVICE HERE /////////////////////
    // import userService from "../services/userService";

    // useEffect(() => {
    //   userService.getAll().then(setUsers);
    // }, []);

    const handleDelete = (user_id) => {

    };

    return (
        <Box>
            <Typography variant="h6" mb={2}>
                Danh sách người dùng
            </Typography>

            <Button
                variant="contained"
                startIcon={<Add />}
                sx={{ mb: 2 }}
                onClick={() => handleOpen()}
            >
                Thêm người dùng
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
                        <TableRow>
                            <TableCell>Họ tên</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Số điện thoại</TableCell>
                            <TableCell>Địa chỉ</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((u) => (
                            <TableRow key={u.user_id}>
                                <TableCell>{u.full_name}</TableCell>
                                <TableCell>{u.email}</TableCell>
                                <TableCell>{u.phone_number}</TableCell>
                                <TableCell>{u.address}</TableCell>
                                <TableCell>{u.status}</TableCell>
                                <TableCell>
                                    <Button
                                        color="primary"
                                        onClick={() => handleOpen(u)}
                                        startIcon={<Edit />}
                                    >
                                        Sửa
                                    </Button>
                                    <Button
                                        color="error"
                                        onClick={() => handleDelete(u.user_id)}
                                        startIcon={<Delete />}
                                    >
                                        Xóa
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {users.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    Không có người dùng nào
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Form thêm/sửa */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    {editingUser ? "Sửa người dùng" : "Thêm người dùng"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Họ tên"
                        name="full_name"
                        fullWidth
                        value={formData.full_name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        name="email"
                        fullWidth
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Số điện thoại"
                        name="phone_number"
                        fullWidth
                        value={formData.phone_number}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Địa chỉ"
                        name="address"
                        fullWidth
                        value={formData.address}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={handleSave} variant="contained">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserManagement;

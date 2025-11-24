import { useState, useEffect } from "react";
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
    MenuItem
} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";
import userService from "../../../services/userService";
import roleService from "../../../services/roleService";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [roles, setRoles] = useState([]);

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone_number: "",
        address: "",
        status: true,
        roleName: ""
    });

    useEffect(() => {
        userService
            .getAll()
            .then((data) => setUsers(data))
            .catch((err) => console.error(err));
    }, []);

    /// lấy all role 
    useEffect(() => {
        roleService.getAllRole()
            .then(data => setRoles(data))
            .catch(err => console.error(err));
    }, []);


    const handleOpen = (user = null) => {
        setEditingUser(user);

        setFormData(
            user
                ? {
                    full_name: user.fullName,
                    email: user.email,
                    phone_number: user.phoneNumber,
                    address: user.address,
                    status: user.status,
                    roleName: user.roleName
                }
                : {
                    full_name: "",
                    email: "",
                    phone_number: "",
                    address: "",
                    status: true,
                    roleName: roles[0]?.name ?? ""
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

    const handleSave = async () => {
        try {
            if (editingUser) {
                // UPDATE USER
                await userService.update(editingUser.userId, {
                    fullName: formData.full_name,
                    phoneNumber: formData.phone_number,
                    address: formData.address,
                    status: formData.status,
                    roleName: formData.roleName
                });

                setUsers((prev) =>
                    prev.map((u) =>
                        u.userId === editingUser.userId
                            ? {
                                ...u,
                                fullName: formData.full_name,
                                email: formData.email,
                                phoneNumber: formData.phone_number,
                                address: formData.address,
                                status: formData.status === "active",
                                roleName: formData.roleName
                            }
                            : u
                    )
                );

            } else {
                // CREATE USER - FE only sends basic info
                const createdUser = await userService.create({
                    fullName: formData.full_name,
                    email: formData.email,
                    phoneNumber: formData.phone_number,
                    address: formData.address,
                    roleName: formData.roleName
                });

                setUsers((prev) => [...prev, createdUser]);
            }

            handleClose();
        } catch (error) {
            console.error(error);

            if (error.response) {
                const err = error.response.data;

                // Nếu BE trả về dạng { error: "..."}
                if (err.error) {
                    alert(err.error);
                    return;
                }

                // Nếu BE trả về string (Tài khoản đã tồn tại!)
                if (typeof err === "string") {
                    alert(err);
                    return;
                }
            }

            alert("Có lỗi xảy ra khi lưu người dùng!");
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Bạn có chắc muốn xoá người dùng này?")) return;

        try {
            await userService.delete(userId);
            setUsers((prev) => prev.filter((u) => u.userId !== userId));
        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra khi xoá người dùng!");
        }
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
                            <TableRow key={u.userId}>
                                <TableCell>{u.fullName}</TableCell>
                                <TableCell>{u.email}</TableCell>
                                <TableCell>{u.phoneNumber}</TableCell>
                                <TableCell>{u.address}</TableCell>
                                <TableCell>
                                    {u.status ? "Hoạt động" : "Không hoạt động"}
                                </TableCell>
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
                                        onClick={() => handleDelete(u.userId)}
                                        startIcon={<Delete />}
                                    >
                                        Xoá
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}

                        {users.length === 0 && (
                            <TableRow key="empty">
                                <TableCell colSpan={6} align="center">
                                    Không có người dùng nào
                                </TableCell>
                            </TableRow>
                        )}

                    </TableBody>
                </Table>
            </TableContainer>

            {/* Form thêm / sửa */}
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
                        disabled={!!editingUser}
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
                    <TextField
                        select
                        margin="dense"
                        label="Quyền"
                        name="roleName"
                        fullWidth
                        value={formData.roleName ?? ""}
                        onChange={handleChange}
                    >
                        {roles.map(r => (
                            <MenuItem key={r.roleId} value={r.roleName}>
                                {r.roleName}
                            </MenuItem>
                        ))}
                    </TextField>
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

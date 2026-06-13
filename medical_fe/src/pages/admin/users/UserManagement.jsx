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
import { toast } from "react-toastify";
import Avatar from "@mui/material/Avatar";
import InputAdornment from "@mui/material/InputAdornment";
import Chip from "@mui/material/Chip";

import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";

const UserManagement = ({ currentRole }) => {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [searchCccd, setSearchCccd] = useState("");
    const [searchRole, setSearchRole] = useState("");

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone_number: "",
        address: "",
        status: true,
        roleName: "",
        dateOfBirth: "",
        gender: "",   // MALE | FEMALE
        cccd: ""
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

        const defaultRole = currentRole === "ROLE_LETAN"
            ? "ROLE_USER"
            : roles[0]?.roleName;

        setFormData(
            user
                ? {
                    full_name: user.fullName,
                    email: user.email,
                    phone_number: user.phoneNumber,
                    address: user.address,
                    status: user.status,
                    roleName: user.role,
                    dateOfBirth: user.dateOfBirth
                        ? user.dateOfBirth.split("T")[0]
                        : "",
                    gender: user.gender?.toUpperCase() ?? "",
                    cccd: user.cccd || ""
                }
                : {
                    full_name: "",
                    email: "",
                    phone_number: "",
                    address: "",
                    status: true,
                    roleName: defaultRole,
                    dateOfBirth: "",
                    gender: "",
                    cccd: ""
                }
        );

        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingUser(null);
    };

    const roleText = {
        "ROLE_USER": "Người dùng",
        "ROLE_ADMIN": "Quản trị viên",
        "ROLE_LETAN": "Lễ tân",
        "ROLE_BACSI": "Bác sĩ",
        "ROLE_THUNGAN": "Thu ngân",
        "ROLE_CANLAMSANG": "Cận lâm sàng",
        "ROLE_BENHNHAN": "Bệnh nhân"
    };

    const filteredUsers = users.filter((u) => {
        const matchCccd =
            !searchCccd ||
            u.cccd?.includes(searchCccd);

        const matchRole =
            searchRole === "" || u.role === searchRole;

        return matchCccd && matchRole;
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            if (!formData.cccd) {
                toast.error("CCCD không được bỏ trống");
                return;
            }

            if (!/^\d{12}$/.test(formData.cccd)) {
                toast.error("CCCD phải đủ 12 số");
                return;
            }
            if (editingUser && currentRole === "ROLE_LETAN") {
                formData.roleName = editingUser.role;
            }
            if (editingUser) {
                // UPDATE USER
                await userService.update(editingUser.userId, {
                    fullName: formData.full_name,
                    phoneNumber: formData.phone_number,
                    address: formData.address,
                    status: formData.status,
                    roleName: formData.roleName,
                    dateOfBirth: formData.dateOfBirth,
                    gender: formData.gender,
                    cccd: formData.cccd
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
                                status: formData.status,
                                role: formData.roleName,
                                dateOfBirth: formData.dateOfBirth,
                                gender: formData.gender,
                                cccd: formData.cccd
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
                    roleName: formData.roleName,
                    dateOfBirth: formData.dateOfBirth,
                    gender: formData.gender,
                    cccd: formData.cccd
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
                    toast.error(err.error);
                    return;
                }

                // Nếu BE trả về string (Tài khoản đã tồn tại!)
                if (typeof err === "string") {
                    toast.error(err);
                    return;
                }
            }

            toast.error("Có lỗi xảy ra khi lưu người dùng!");
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Bạn có chắc muốn xoá người dùng này?")) return;

        try {
            await userService.delete(userId);
            setUsers((prev) => prev.filter((u) => u.userId !== userId));
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra khi xoá người dùng!");
        }
    };

    return (
        <Box
            sx={{
                p: 4,
                background: "#f5f7fb",
                minHeight: "100vh"
            }}
        >

            {/* HEADER */}

            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background:
                        "linear-gradient(135deg,#1976d2,#42a5f5)",
                    color: "#fff"
                }}
            >
                <Box>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >
                        Quản lý người dùng
                    </Typography>

                    <Typography variant="body2">
                        Danh sách tài khoản trong hệ thống
                    </Typography>

                </Box>
            </Paper>

            {/* TOOLBAR */}

            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 3,
                    display: "flex",
                    gap: 2,
                    alignItems: "center"
                }}
            >

                <TextField
                    fullWidth
                    size="small"
                    placeholder="Tìm theo CCCD..."
                    value={searchCccd}
                    onChange={(e) =>
                        setSearchCccd(
                            e.target.value
                        )
                    }
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }}
                />

                <TextField
                    select
                    size="small"
                    label="Vai trò"
                    value={searchRole}
                    onChange={(e) =>
                        setSearchRole(
                            e.target.value
                        )
                    }
                    sx={{
                        minWidth: 220
                    }}
                >

                    <MenuItem value="">
                        Tất cả
                    </MenuItem>

                    {roles.map((r) => (

                        <MenuItem
                            key={r.roleId}
                            value={r.roleName}
                        >
                            {roleText[r.roleName] ||
                                r.roleName}
                        </MenuItem>

                    ))}

                </TextField>

                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() =>
                        handleOpen()
                    }
                    sx={{
                        minWidth: 220,
                        borderRadius: 2
                    }}
                >
                    Thêm người dùng
                </Button>

            </Paper>

            {/* TABLE */}

            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    borderRadius: 3
                }}
            >

                <Table>

                    <TableHead
                        sx={{
                            backgroundColor:
                                "#f1f5f9"
                        }}
                    >

                        <TableRow>

                            <TableCell>
                                <strong>Người dùng</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Email</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Điện thoại</strong>
                            </TableCell>

                            <TableCell>
                                <strong>CCCD</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Địa chỉ</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Giới tính</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Ngày sinh</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Vai trò</strong>
                            </TableCell>

                            <TableCell align="center">
                                <strong>Thao tác</strong>
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {filteredUsers.map((u) => (

                            <TableRow
                                key={u.userId}
                                hover
                            >

                                <TableCell>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2
                                        }}
                                    >

                                        <Avatar
                                            sx={{
                                                bgcolor:
                                                    "#1976d2"
                                            }}
                                        >
                                            <PersonIcon />
                                        </Avatar>

                                        <Box>

                                            <Typography
                                                fontWeight="bold"
                                            >
                                                {u.fullName}
                                            </Typography>

                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {u.email}
                                            </Typography>

                                        </Box>

                                    </Box>

                                </TableCell>

                                <TableCell>
                                    {u.email}
                                </TableCell>

                                <TableCell>
                                    {u.phoneNumber}
                                </TableCell>

                                <TableCell>
                                    {u.cccd}
                                </TableCell>

                                <TableCell
                                    sx={{
                                        maxWidth: 250
                                    }}
                                >
                                    {u.address || "-"}
                                </TableCell>

                                <TableCell>

                                    {u.gender === "MALE"
                                        ? "Nam"
                                        : u.gender ===
                                            "FEMALE"
                                            ? "Nữ"
                                            : ""}

                                </TableCell>

                                <TableCell>

                                    {u.dateOfBirth
                                        ? new Date(
                                            u.dateOfBirth
                                        ).toLocaleDateString(
                                            "vi-VN"
                                        )
                                        : ""}

                                </TableCell>

                                <TableCell>

                                    <Chip
                                        label={
                                            roleText[
                                            u.role
                                            ] ||
                                            u.role
                                        }
                                        color="primary"
                                        size="small"
                                    />

                                </TableCell>

                                <TableCell align="center">

                                    <Box
                                        sx={{
                                            display:
                                                "flex",
                                            justifyContent:
                                                "center",
                                            gap: 1
                                        }}
                                    >

                                        {(currentRole !==
                                            "ROLE_LETAN" ||
                                            u.role ===
                                            "ROLE_USER") && (

                                                <Button
                                                    size="small"
                                                    color="warning"
                                                    startIcon={
                                                        <Edit />
                                                    }
                                                    onClick={() =>
                                                        handleOpen(
                                                            u
                                                        )
                                                    }
                                                >
                                                    Sửa
                                                </Button>

                                            )}

                                        {currentRole !==
                                            "ROLE_LETAN" && (

                                                <Button
                                                    size="small"
                                                    color="error"
                                                    startIcon={
                                                        <Delete />
                                                    }
                                                    onClick={() =>
                                                        handleDelete(
                                                            u.userId
                                                        )
                                                    }
                                                >
                                                    Xóa
                                                </Button>

                                            )}

                                    </Box>

                                </TableCell>

                            </TableRow>

                        ))}

                        {filteredUsers.length ===
                            0 && (

                                <TableRow>

                                    <TableCell
                                        colSpan={7}
                                        align="center"
                                    >

                                        <Typography
                                            py={4}
                                            color="text.secondary"
                                        >
                                            Không có người dùng nào
                                        </Typography>

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
                        label="CCCD"
                        name="cccd"
                        fullWidth
                        value={formData.cccd}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Ngày sinh"
                        name="dateOfBirth"
                        type="date"
                        fullWidth
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        helperText="Chọn ngày sinh theo định dạng DD/MM/YYYY"
                        sx={{ mt: 2 }}
                    />

                    <TextField
                        select
                        margin="dense"
                        label="Giới tính"
                        name="gender"
                        fullWidth
                        value={formData.gender}
                        onChange={handleChange}
                        helperText="Vui lòng chọn giới tính"
                        sx={{ mt: 2 }}
                    >
                        <MenuItem value="MALE">👨 Nam</MenuItem>
                        <MenuItem value="FEMALE">👩 Nữ</MenuItem>
                    </TextField>

                    <TextField
                        margin="dense"
                        label="Địa chỉ"
                        name="address"
                        fullWidth
                        value={formData.address}
                        onChange={handleChange}
                    />
                    {/* Quyền */}
                    <TextField
                        select
                        margin="dense"
                        label="Quyền"
                        name="roleName"
                        fullWidth
                        value={formData.roleName ?? ""}
                        onChange={handleChange}
                        disabled={currentRole === "ROLE_LETAN"}
                    >
                        {roles.map(r => (
                            <MenuItem
                                key={r.roleId}
                                value={r.roleName}
                            >
                                {roleText[r.roleName] ||
                                    r.roleName}
                            </MenuItem>
                        ))}
                    </TextField>
                    {/* Quyền */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={handleSave} variant="contained">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
};

export default UserManagement;

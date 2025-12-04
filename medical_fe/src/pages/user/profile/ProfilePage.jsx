import React, { useEffect, useState } from "react";
import loginService from "../../../services/loginService";
import userService from "../../../services/userService";
import { toast } from "react-toastify";

import {
    Box,
    Card,
    CardContent,
    Avatar,
    Typography,
    TextField,
    Button,
    Divider
} from "@mui/material";

export default function ProfilePage() {
    const [info, setInfo] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        loginService.loginCheckUser(token)
            .then(res => setInfo(res))
            .catch(() => toast.error("Không thể tải thông tin người dùng"));
    }, []);

    const handleChange = (e) => {
        setInfo({ ...info, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            await userService.updateMyProfile({
                userId: info.userId,
                fullName: info.fullName,
                phoneNumber: info.phoneNumber,
                address: info.address
            });

            toast.success("Cập nhật thông tin thành công!");
        } catch (err) {
            toast.error("Cập nhật thất bại!");
        }
    };

    if (!info) return <p>Đang tải...</p>;

    return (
        <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
            <Card sx={{ width: 450, p: 3, boxShadow: 5, borderRadius: 3 }}>
                <CardContent sx={{ textAlign: "center" }}>

                    {/* Avatar */}
                    <Avatar
                        sx={{
                            width: 90,
                            height: 90,
                            margin: "0 auto",
                            fontSize: 36,
                            bgcolor: "#1976d2",
                        }}
                    >
                        {info.fullName.charAt(0).toUpperCase()}
                    </Avatar>

                    <Typography variant="h5" sx={{ mt: 2, fontWeight: "bold" }}>
                        {info.fullName}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        {info.role === "ROLE_USER" ? "Người dùng" : info.role}
                    </Typography>

                    <Divider sx={{ my: 3 }} />

                    {/* FORM INPUTS */}
                    <TextField
                        fullWidth
                        label="Email"
                        value={info.email}
                        InputProps={{ readOnly: true }}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        label="Họ tên"
                        name="fullName"
                        value={info.fullName}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        label="Số điện thoại"
                        name="phoneNumber"
                        value={info.phoneNumber}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        label="Địa chỉ"
                        name="address"
                        value={info.address}
                        onChange={handleChange}
                        sx={{ mb: 3 }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{
                            py: 1.2,
                            fontSize: "16px",
                            textTransform: "none",
                            borderRadius: "8px"
                        }}
                        onClick={handleSave}
                    >
                        Lưu thay đổi
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
}

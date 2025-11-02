import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
    Paper,
    Stack,
} from "@mui/material";

const TiepNhan = () => {
    const [formData, setFormData] = useState({
        name: "",
        gender: "",
        birthDate: "",
        phone: "",
        department: "",
        doctor: "",
        note: "",
    });

    const departments = [
        "Nội tổng hợp",
        "Ngoại tổng quát",
        "Tai Mũi Họng",
        "Da liễu",
    ];
    const doctors = ["BS. Nguyễn Văn A", "BS. Trần Thị B", "BS. Lê Văn C"];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Đã tạo chỉ định khám cho: " + formData.name);
        console.log(formData);
    };

    const handleReset = () => {
        setFormData({
            name: "",
            gender: "",
            birthDate: "",
            phone: "",
            department: "",
            doctor: "",
            note: "",
        });
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography
                variant="h5"
                fontWeight="bold"
                mb={3}
                color="primary"
                sx={{ textAlign: "center" }}
            >
                Tiếp nhận & chỉ định khám
            </Typography>

            <Paper
                sx={{
                    p: 4,
                    borderRadius: 3,
                    boxShadow: 3,
                    maxWidth: 600,
                    mx: "auto",
                }}
            >
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            label="Họ và tên"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            required
                        />

                        <TextField
                            select
                            label="Giới tính"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            fullWidth
                            required
                        >
                            <MenuItem value="Nam">Nam</MenuItem>
                            <MenuItem value="Nữ">Nữ</MenuItem>
                        </TextField>

                        <TextField
                            label="Ngày sinh"
                            type="date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />

                        <TextField
                            label="Số điện thoại"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            fullWidth
                        />

                        <TextField
                            select
                            label="Khoa khám"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            fullWidth
                            required
                        >
                            {departments.map((dep) => (
                                <MenuItem key={dep} value={dep}>
                                    {dep}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Bác sĩ chỉ định"
                            name="doctor"
                            value={formData.doctor}
                            onChange={handleChange}
                            fullWidth
                            required
                        >
                            {doctors.map((doc) => (
                                <MenuItem key={doc} value={doc}>
                                    {doc}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Ghi chú / Triệu chứng ban đầu"
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={3}
                        />

                        <Box display="flex" justifyContent="flex-end" gap={2}>
                            <Button variant="outlined" color="secondary" onClick={handleReset}>
                                Làm mới
                            </Button>
                            <Button type="submit" variant="contained" color="primary">
                                Tạo chỉ định khám
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
};

export default TiepNhan;

import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Paper,
    Grid,
    Button,
    MenuItem,
    Divider,
} from "@mui/material";

const CanLamSangForm = () => {
    const [selectedTest, setSelectedTest] = useState("");
    const [formData, setFormData] = useState({
        result: "",
        note: "",
        status: "Chưa làm",
        file: null,
    });

    const labTests = [
        "Xét nghiệm máu",
        "Xét nghiệm nước tiểu",
        "Siêu âm ổ bụng",
        "X-quang phổi",
        "Điện tâm đồ",
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Đã lưu kết quả cho: " + selectedTest);
        console.log(formData);
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography
                variant="h5"
                fontWeight="bold"
                textAlign="center"
                mb={3}
                color="primary"
            >
                Cận lâm sàng
            </Typography>

            <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3, maxWidth: 900, mx: "auto" }}>
                {/* Thông tin bệnh nhân */}
                <Typography variant="h6" color="secondary" gutterBottom>
                    Thông tin bệnh nhân
                </Typography>
                <Grid container spacing={2} mb={2}>
                    <Grid item xs={6}>
                        <TextField label="Họ và tên" value="Nguyễn Văn A" fullWidth disabled />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField label="Giới tính" value="Nam" fullWidth disabled />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField label="Ngày sinh" value="12/03/1988" fullWidth disabled />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Chỉ định */}
                <Typography variant="h6" color="secondary" gutterBottom>
                    Chỉ định cần thực hiện
                </Typography>
                <TextField
                    select
                    label="Chọn loại chỉ định"
                    fullWidth
                    value={selectedTest}
                    onChange={(e) => setSelectedTest(e.target.value)}
                    sx={{ mb: 3 }}
                >
                    {labTests.map((test) => (
                        <MenuItem key={test} value={test}>
                            {test}
                        </MenuItem>
                    ))}
                </TextField>

                {selectedTest && (
                    <>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Kết quả cho: {selectedTest}
                        </Typography>

                        {/* Form nhập kết quả */}
                        <TextField
                            label="Kết quả chi tiết"
                            name="result"
                            value={formData.result}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={3}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Ghi chú"
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={2}
                            sx={{ mb: 2 }}
                        />

                        {/* Upload file */}
                        <Button variant="outlined" component="label" sx={{ mb: 2 }}>
                            Tải lên kết quả hình ảnh
                            <input type="file" hidden onChange={handleFileChange} />
                        </Button>
                        {formData.file && (
                            <Typography variant="body2" color="text.secondary">
                                📄 {formData.file.name}
                            </Typography>
                        )}

                        {/* Trạng thái */}
                        <TextField
                            select
                            label="Trạng thái"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            fullWidth
                            sx={{ mb: 3 }}
                        >
                            <MenuItem value="Chưa làm">Chưa làm</MenuItem>
                            <MenuItem value="Đang thực hiện">Đang thực hiện</MenuItem>
                            <MenuItem value="Hoàn thành">Hoàn thành</MenuItem>
                        </TextField>

                        {/* Nút thao tác */}
                        <Box display="flex" justifyContent="flex-end" gap={2}>
                            <Button variant="outlined" color="secondary">
                                Quay lại
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleSubmit}>
                                Lưu kết quả
                            </Button>
                        </Box>
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default CanLamSangForm;

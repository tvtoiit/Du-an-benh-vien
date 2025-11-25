import React, { useState, useEffect } from "react";
import {
    Box, Typography, TextField, Paper, Grid, Button,
    MenuItem, Divider
} from "@mui/material";

import serviceResult from "../../../services/serviceResult";
import { toast } from "react-toastify";

const CanLamSangForm = ({ patient, onBack }) => {
    const [selectedTest, setSelectedTest] = useState("");
    const [formData, setFormData] = useState({
        result: "",
        note: "",
        status: "Chưa làm",
        file: null,
    });

    // Chọn dịch vụ mặc định khi load form
    // useEffect(() => {
    //     if (patient?.services?.length > 0) {
    //         setSelectedTest(patient.services[0].serviceId);
    //     }
    // }, [patient]);


    // Lấy danh sách dịch vụ bác sĩ chỉ định
    const labTests = patient.services;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const selectedService = labTests.find(s => s.serviceId === selectedTest);
        if (!selectedService) return toast.warning("Chọn dịch vụ");

        const data = new FormData();
        data.append("patientId", patient.patientId);
        data.append("serviceId", selectedService.serviceId);
        data.append("appointmentScheduleId", patient.appointmentScheduleId || "");
        data.append("medicalHistoryId", patient.medicalHistoryId || "");
        data.append("resultData", formData.result);
        data.append("note", formData.note);
        data.append("status", formData.status);

        if (formData.file) data.append("imageFile", formData.file);

        try {
            const response = await serviceResult.create(data);
            toast.success("Lưu thành công: " + selectedService.serviceName);
            console.log("Kết quả lưu:", response.data);
            setFormData({ result: "", note: "", status: "Chưa làm", file: null });
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi lưu kết quả");
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" textAlign="center" mb={3} fontWeight="bold">
                Cận lâm sàng
            </Typography>

            <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3, maxWidth: 900, mx: "auto" }}>

                {/* Thông tin bệnh nhân */}
                <Typography variant="h6" gutterBottom>
                    Thông tin bệnh nhân
                </Typography>

                <Grid container spacing={2} mb={2}>
                    <Grid item xs={6}>
                        <TextField label="Họ và tên" value={patient.fullName} fullWidth disabled />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField label="Giới tính" value={patient.gender || ''} fullWidth disabled />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Ngày sinh"
                            value={patient.services[0].dateOfBirth?.split("T")[0] || ""}
                            fullWidth
                            disabled
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                    Chỉ định cần thực hiện
                </Typography>

                <TextField
                    select
                    label="Chọn dịch vụ"
                    value={selectedTest}
                    onChange={(e) => setSelectedTest(e.target.value)}
                    fullWidth
                    sx={{ mb: 3 }}
                >
                    {labTests.map((s) => (
                        <MenuItem key={s.serviceId} value={s.serviceId}>
                            {s.serviceName}
                        </MenuItem>
                    ))}
                </TextField>

                {selectedTest && (
                    <>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Kết quả cho: {labTests.find(s => s.serviceId === selectedTest).serviceName}
                        </Typography>

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

                        <Button variant="outlined" component="label" sx={{ mb: 2 }}>
                            Tải lên kết quả hình ảnh
                            <input type="file" hidden onChange={handleFileChange} />
                        </Button>

                        {formData.file && <Typography>{formData.file.name}</Typography>}

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

                        <Box display="flex" justifyContent="flex-end" gap={2}>
                            <Button variant="outlined" onClick={onBack}>Quay lại</Button>
                            <Button variant="contained" onClick={handleSubmit}>Lưu kết quả</Button>
                        </Box>
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default CanLamSangForm;

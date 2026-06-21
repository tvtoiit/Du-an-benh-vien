import React, { useState, useEffect } from "react";
import {
    Box, Typography, TextField, Paper, Grid, Button,
    MenuItem, Divider
} from "@mui/material";

import serviceResult from "../../../services/serviceResult";
import { toast } from "react-toastify";

const CanLamSangForm = ({ patient, onBack }) => {
    const [formData, setFormData] = useState({
        result: "",
        note: "",
        file: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const selectedService = {
            serviceId: patient.serviceId,
            serviceName: patient.serviceName
        };
        if (!selectedService) return toast.warning("Chọn dịch vụ");

        const data = new FormData();
        data.append("patientId", patient.patientId);
        data.append("serviceId", selectedService.serviceId);
        data.append("appointmentId", patient.appointmentId || "");
        data.append("medicalHistoryId", patient.medicalHistoryId || "");
        data.append("resultData", formData.result);
        data.append("note", formData.note);

        if (formData.file) data.append("imageFile", formData.file);

        try {
            const response = await serviceResult.create(data);
            toast.success("Lưu thành công: " + selectedService.serviceName);
            console.log("Kết quả lưu:", response.data);
            setFormData({ result: "", note: "", file: null });
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
                            value={patient.dateOfBirth?.split("T")[0] || ""}
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
                    label="Dịch vụ thực hiện"
                    value={patient.serviceName}
                    fullWidth
                    disabled
                    sx={{ mb: 3 }}
                />

                {patient.serviceId && (
                    <>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Kết quả cho: {patient.serviceName}
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

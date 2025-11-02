import React, { useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Button,
    Grid,
    TextField,
    Divider,
    Checkbox,
    FormControlLabel,
} from "@mui/material";

const MedicalExamForm = ({ patient, onBack }) => {
    const [formData, setFormData] = useState({
        symptom: "",
        result: "",
        diagnosis: "",
        secondaryDiagnosis: "",
        services: {
            xetNghiem: false,
            sieuAm: false,
            xquang: false,
            dienTamDo: false,
        },
        note: "",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setFormData({
                ...formData,
                services: {
                    ...formData.services,
                    [name]: checked,
                },
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Đã lưu phiếu khám cho bệnh nhân: ${patient.name}`);
        console.log({ ...formData, patient });
    };

    return (
        <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>

            <Typography
                variant="h5"
                fontWeight="bold"
                mb={3}
                color="primary"
                textAlign="center"
            >
                Phiếu khám bệnh
            </Typography>

            {/* Thông tin bệnh nhân */}
            <Typography variant="h6" gutterBottom color="secondary">
                Thông tin bệnh nhân
            </Typography>
            <Grid container spacing={2} mb={2}>
                <Grid item xs={6}>
                    <TextField label="Họ và tên" value={patient.name} fullWidth disabled />
                </Grid>
                <Grid item xs={3}>
                    <TextField label="Giới tính" value={patient.gender} fullWidth disabled />
                </Grid>
                <Grid item xs={3}>
                    <TextField label="Ngày sinh" value={patient.birth} fullWidth disabled />
                </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Khám lâm sàng */}
            <Typography variant="h6" gutterBottom color="secondary">
                Khám lâm sàng
            </Typography>
            <TextField
                label="Triệu chứng lâm sàng"
                name="symptom"
                value={formData.symptom}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                sx={{ mb: 2 }}
            />
            <TextField
                label="Kết quả khám ban đầu"
                name="result"
                value={formData.result}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                sx={{ mb: 3 }}
            />

            {/* Chẩn đoán */}
            <Typography variant="h6" gutterBottom color="secondary">
                Chẩn đoán
            </Typography>
            <TextField
                label="Chẩn đoán chính"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
            />
            <TextField
                label="Chẩn đoán phụ (nếu có)"
                name="secondaryDiagnosis"
                value={formData.secondaryDiagnosis}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 3 }}
            />

            {/* Chỉ định */}
            <Typography variant="h6" gutterBottom color="secondary">
                Chỉ định cận lâm sàng
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
                {[
                    ["xetNghiem", "Xét nghiệm"],
                    ["sieuAm", "Siêu âm"],
                    ["xquang", "X-quang"],
                    ["dienTamDo", "Điện tâm đồ"],
                ].map(([key, label]) => (
                    <FormControlLabel
                        key={key}
                        control={
                            <Checkbox
                                checked={formData.services[key]}
                                onChange={handleChange}
                                name={key}
                            />
                        }
                        label={label}
                    />
                ))}
            </Box>

            {/* Ghi chú */}
            <TextField
                label="Ghi chú thêm"
                name="note"
                value={formData.note}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                sx={{ mb: 3 }}
            />

            {/* Nút thao tác */}
            <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="outlined" color="secondary">
                    In phiếu
                </Button>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Lưu phiếu khám
                </Button>
            </Box>
        </Paper>
    );
};

export default MedicalExamForm;

import React, { useState, useEffect } from "react";
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
import serviceService from "../../../services/servicesServices";
import parentService from "../../../services/parentService";
import medicalHistoryService from "../../../services/medicalHistoryService";

const MedicalExamForm = ({ appointment, onBack }) => {
    const patient = appointment.patient;
    const [formData, setFormData] = useState({
        symptom: "",
        result: "",
        diagnosis: "",
        secondaryDiagnosis: "",
        servicesSelected: {},
        note: "",
    });

    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await serviceService.getAll();
                const list = Array.isArray(res) ? res : res.data ?? [];
                setServices(list);
            } catch (error) {
                console.error("Lỗi tải danh sách dịch vụ:", error);
                setServices([]);
            }
        };
        fetchServices();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setFormData({
                ...formData,
                servicesSelected: {
                    ...formData.servicesSelected,
                    [name]: checked,
                },
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const selectedServices = Object.keys(formData.servicesSelected).filter(
            (id) => formData.servicesSelected[id]
        );

        if (selectedServices.length === 0) {
            const confirmNoServices = window.confirm(
                "Chưa chọn dịch vụ cận lâm sàng nào. Bạn vẫn muốn lưu phiếu khám?"
            );
            if (!confirmNoServices) return;
        }

        try {
            const doctorId = localStorage.getItem("doctorId");

            if (!doctorId) {
                alert("Không tìm thấy doctorId, vui lòng đăng nhập lại.");
                return;
            }

            // 1. Gửi thông tin khám lâm sàng -> tạo MedicalHistory
            const historyPayload = {
                symptom: formData.symptom,
                result: formData.result,
                diagnosis: formData.diagnosis,
                secondaryDiagnosis: formData.secondaryDiagnosis,
                note: formData.note,
                // có thể để backend tự set testResults, nên không cần truyền
                // testResults: "",

                patientId: patient.patientId,
                doctorId: doctorId,
            };

            await medicalHistoryService.create(historyPayload);

            // 2. Gán các dịch vụ cận lâm sàng cho bệnh nhân (API của bạn)
            await parentService.addServicesForPatient(patient.patientId, selectedServices);

            alert(`Đã lưu phiếu khám cho bệnh nhân: ${patient.fullName}`);
        } catch (error) {
            console.error("Lỗi lưu phiếu khám:", error);
            alert("Lưu phiếu khám thất bại, vui lòng thử lại!");
        }
    };

    return (
        <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h5" fontWeight="bold" mb={3} color="primary" textAlign="center">
                Phiếu khám bệnh
            </Typography>

            {/* Thông tin bệnh nhân */}
            <Typography variant="h6" gutterBottom color="secondary">
                Thông tin bệnh nhân
            </Typography>
            <Grid container spacing={2} mb={2}>
                <Grid item xs={6}>
                    <TextField label="Họ và tên" value={patient.fullName} fullWidth disabled />
                </Grid>
                <Grid item xs={3}>
                    <TextField label="Giới tính" value={patient.gender} fullWidth disabled />
                </Grid>
                <Grid item xs={3}>
                    <TextField label="Ngày sinh" value={patient.dateOfBirth} fullWidth disabled />
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
                {services.map((s) => (
                    <FormControlLabel
                        key={s.serviceId}
                        control={
                            <Checkbox
                                checked={!!formData.servicesSelected[s.serviceId]}
                                onChange={handleChange}
                                name={s.serviceId}
                            />
                        }
                        label={s.serviceName}
                    />
                ))}
            </Box>

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

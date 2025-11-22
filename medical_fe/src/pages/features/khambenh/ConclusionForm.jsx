import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Button,
    Grid,
    TextField,
    Divider,
} from "@mui/material";
import serviceResultService from "../../../services/serviceResultService";
import medicalHistoryService from "../../../services/medicalHistoryService";

const ConclusionForm = ({ patient, onBack }) => {
    const [results, setResults] = useState([]);
    const [formData, setFormData] = useState({
        diagnosis: "",
        secondaryDiagnosis: "",
        note: "",
    });

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await serviceResultService.getByPatient(patient.patientId);
                const list = Array.isArray(res) ? res : res.data ?? [];
                setResults(list);
            } catch (error) {
                console.error("Lỗi tải kết quả CLS:", error);
                setResults([]);
            }
        };
        fetchResults();
    }, [patient.patientId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            const doctorId = localStorage.getItem("doctorId");
            if (!doctorId) {
                alert("Không tìm thấy doctorId, vui lòng đăng nhập lại.");
                return;
            }

            const payload = {
                patientId: patient.patientId,
                doctorId: doctorId,
                diagnosis: formData.diagnosis,
                secondaryDiagnosis: formData.secondaryDiagnosis,
                note: formData.note,
                testResults: formData.diagnosis,
                admissionDate: new Date(),
                dischargeDate: new Date(),
            };

            await medicalHistoryService.createResult(payload);

            alert("Đã lưu kết luận của bác sĩ");
            onBack(true);
        } catch (error) {
            console.error("Lỗi lưu kết luận:", error);
            alert("Lưu kết luận thất bại, vui lòng thử lại!");
        }
    };

    return (
        <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h5" fontWeight="bold" mb={3} color="primary" textAlign="center">
                Kết luận sau cận lâm sàng
            </Typography>

            <Typography variant="h6" gutterBottom color="secondary">
                Thông tin bệnh nhân
            </Typography>
            <Grid container spacing={2} mb={2}>
                <Grid item xs={6}>
                    <TextField label="Họ và tên" value={patient.fullName} fullWidth disabled />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Ngày sinh"
                        value={patient.dateOfBirth?.split("T")[0] ?? ""}
                        fullWidth
                        disabled
                    />
                </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom color="secondary">
                Kết quả cận lâm sàng
            </Typography>
            <Box sx={{ mb: 3, maxHeight: 200, overflowY: "auto" }}>
                {results.map((r) => (
                    <Box
                        key={r.resultId}
                        sx={{ mb: 2, p: 2, borderRadius: 2, border: "1px solid #eee" }}
                    >
                        <Typography variant="subtitle1" fontWeight="bold">
                            {r.serviceName}
                        </Typography>
                        <Typography variant="body2">{r.resultData}</Typography>
                        {r.note && (
                            <Typography variant="body2" color="text.secondary">
                                Ghi chú: {r.note}
                            </Typography>
                        )}
                    </Box>
                ))}
            </Box>

            <Typography variant="h6" gutterBottom color="secondary">
                Kết luận của bác sĩ
            </Typography>
            <TextField
                label="Chẩn đoán cuối cùng"
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
                sx={{ mb: 2 }}
            />
            <TextField
                label="Ghi chú điều trị / theo dõi"
                name="note"
                value={formData.note}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                sx={{ mb: 3 }}
            />

            <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="outlined" color="secondary" onClick={onBack}>
                    Quay lại
                </Button>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Lưu kết luận
                </Button>
            </Box>
        </Paper>
    );
};

export default ConclusionForm;

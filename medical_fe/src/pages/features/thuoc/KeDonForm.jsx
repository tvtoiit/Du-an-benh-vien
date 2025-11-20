import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Paper,
    Grid,
    MenuItem,
} from "@mui/material";
import { AddCircle, Delete } from "@mui/icons-material";
import prescriptionHistoryService from "../../../services/prescriptionHistoryService";
import medicinesService from "../../../services/medicinesService";

const KeDonForm = ({ patient, onBack }) => {
    const [prescriptions, setPrescriptions] = useState([
        { medicineId: "", dosage: "", quantity: "" },
    ]);
    const [medicines, setMedicines] = useState([]);

    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                const res = await medicinesService.getAll();
                const list = Array.isArray(res) ? res : res.data ?? [];
                setMedicines(list);
            } catch (error) {
                console.error("Lỗi tải danh sách thuốc:", error);
            }
        };
        fetchMedicines();
    }, []);

    const handleAddRow = () => {
        setPrescriptions([
            ...prescriptions,
            { medicineId: "", dosage: "", quantity: "" },
        ]);
    };

    const handleChange = (index, field, value) => {
        const newPrescriptions = [...prescriptions];
        newPrescriptions[index][field] = value;
        setPrescriptions(newPrescriptions);
    };

    const handleRemoveRow = (index) => {
        setPrescriptions(prescriptions.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        try {
            const patientId = patient.patientId || patient.id;
            if (!patientId) {
                alert("Không tìm thấy patientId");
                return;
            }

            const promises = prescriptions.map((item) =>
                prescriptionHistoryService.create({
                    patientId,
                    medicineId: item.medicineId,
                    dosage: item.dosage,
                    duration: (item.quantity ?? "").toString(),
                })
            );

            await Promise.all(promises);

            alert(`Đã lưu đơn thuốc cho ${patient.name || patient.fullName}`);
            onBack();
        } catch (error) {
            console.error("Lỗi lưu đơn thuốc:", error);
            alert("Lưu đơn thuốc thất bại, vui lòng thử lại!");
        }
    };

    return (
        <Box p={3}>
            <Typography variant="h5" fontWeight="bold" mb={3} color="primary">
                Kê đơn thuốc cho bệnh nhân: {patient.name || patient.fullName}
            </Typography>

            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
                {prescriptions.map((item, index) => (
                    <Grid container spacing={2} alignItems="center" key={index} mb={2}>
                        <Grid item xs={4}>
                            <TextField
                                select
                                label="Thuốc"
                                value={item.medicineId}
                                onChange={(e) =>
                                    handleChange(index, "medicineId", e.target.value)
                                }
                                fullWidth
                            >
                                {medicines.map((m) => (
                                    <MenuItem key={m.medicineId} value={m.medicineId}>
                                        {m.name /* đổi nếu BE dùng field khác */}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Liều dùng (vd: 2 viên/ngày)"
                                value={item.dosage}
                                onChange={(e) =>
                                    handleChange(index, "dosage", e.target.value)
                                }
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Số ngày"
                                type="number"
                                value={item.quantity}
                                onChange={(e) =>
                                    handleChange(index, "quantity", e.target.value)
                                }
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton color="error" onClick={() => handleRemoveRow(index)}>
                                <Delete />
                            </IconButton>
                        </Grid>
                    </Grid>
                ))}

                <Button
                    startIcon={<AddCircle />}
                    onClick={handleAddRow}
                    variant="outlined"
                    sx={{ mb: 2 }}
                >
                    Thêm thuốc
                </Button>

                <Box mt={3}>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Lưu đơn thuốc
                    </Button>
                    <Button variant="outlined" sx={{ ml: 2 }} onClick={onBack}>
                        Quay lại
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default KeDonForm;

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
import { toast } from "react-toastify";

const KeDonForm = ({ patient, appointmentId, onBack }) => {
    const [note, setNote] = useState("");
    const [prescriptions, setPrescriptions] = useState([
        { medicineId: "", dosage: "", quantity: "", duration: "" },
    ]);
    const [medicines, setMedicines] = useState([]);

    // Load danh sách thuốc
    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                const res = await medicinesService.getAll();
                const list = Array.isArray(res) ? res : res.data ?? [];
                setMedicines(list);
            } catch (error) {
                console.error("Lỗi tải danh sách thuốc:", error);
                setMedicines([]);
            }
        };
        fetchMedicines();
    }, []);

    // Thêm dòng thuốc
    const handleAddRow = () => {
        setPrescriptions([
            ...prescriptions,
            { medicineId: "", dosage: "", quantity: "", duration: "" },
        ]);
    };

    // Cập nhật giá trị từng ô
    const handleChange = (index, field, value) => {
        const newData = [...prescriptions];
        newData[index][field] = value;
        setPrescriptions(newData);
    };

    // Xóa dòng thuốc
    const handleRemoveRow = (index) => {
        setPrescriptions(prescriptions.filter((_, i) => i !== index));
    };

    // Gửi đơn thuốc
    const handleSubmit = async () => {
        try {
            const patientId = patient?.patientId;
            const apptId = appointmentId;

            if (!patientId || !apptId) {
                toast.error("Thiếu dữ liệu bệnh nhân hoặc lịch khám!");
                return;
            }

            // Validate thuốc
            if (prescriptions.some((p) => !p.medicineId)) {
                toast.error("Vui lòng chọn thuốc cho từng dòng!");
                return;
            }

            const payload = {
                patientId,
                appointmentId: apptId,
                note,
                details: prescriptions.map((p) => ({
                    medicineId: p.medicineId,
                    dosage: p.dosage,
                    duration: p.duration,
                    quantity: Number(p.quantity),
                })),
            };

            await prescriptionHistoryService.create(payload);

            toast.success("Đã lưu đơn thuốc thành công!");
            onBack();
        } catch (error) {
            toast.error("Lưu đơn thuốc thất bại!");
            console.error(error);
        }
    };

    return (
        <Box p={3}>
            <Typography variant="h5" fontWeight="bold" mb={3} color="primary">
                Kê đơn thuốc cho bệnh nhân: {patient?.fullName}
            </Typography>

            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
                {/* Ghi chú đơn thuốc */}
                <TextField
                    label="Ghi chú chung"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    fullWidth
                    multiline
                    sx={{ mb: 3 }}
                />

                {prescriptions.map((item, index) => (
                    <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        key={index}
                        mb={2}
                        sx={{ flexWrap: "nowrap" }}   // ⭐ BẮT BUỘC: KHÔNG CHO WRAP
                    >
                        {/* Thuốc */}
                        <Grid item sx={{ flex: "0 0 35%" }}>
                            <TextField
                                select
                                label="Thuốc"
                                value={item.medicineId}
                                onChange={(e) => handleChange(index, "medicineId", e.target.value)}
                                fullWidth
                            >
                                {medicines.map((m) => (
                                    <MenuItem key={m.medicineId} value={m.medicineId}>
                                        {m.name} — tồn: {m.quantity}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Liều dùng */}
                        <Grid item sx={{ flex: "0 0 25%" }}>
                            <TextField
                                label="Liều dùng (vd: 2 viên/ngày)"
                                value={item.dosage}
                                onChange={(e) => handleChange(index, "dosage", e.target.value)}
                                fullWidth
                            />
                        </Grid>

                        {/* Số lượng */}
                        <Grid item sx={{ flex: "0 0 15%" }}>
                            <TextField
                                label="Số lượng"
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleChange(index, "quantity", e.target.value)}
                                fullWidth
                            />
                        </Grid>

                        {/* Số ngày */}
                        <Grid item sx={{ flex: "0 0 15%" }}>
                            <TextField
                                label="Số ngày"
                                value={item.duration}
                                onChange={(e) => handleChange(index, "duration", e.target.value)}
                                fullWidth
                            />
                        </Grid>

                        {/* Xóa */}
                        <Grid item sx={{ flex: "0 0 5%", display: "flex", alignItems: "center" }}>
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

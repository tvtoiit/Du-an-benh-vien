import React, { useState } from "react";
import {
    Box, Typography, TextField, Button, IconButton, Paper, Grid
} from "@mui/material";
import { AddCircle, Delete } from "@mui/icons-material";

const PrescriptionForm = ({ patient, onBack }) => {
    const [prescriptions, setPrescriptions] = useState([
        { medicine: "", dosage: "", quantity: "" },
    ]);

    const handleAddRow = () => {
        setPrescriptions([...prescriptions, { medicine: "", dosage: "", quantity: "" }]);
    };

    const handleChange = (index, field, value) => {
        const updated = prescriptions.map((p, i) =>
            i === index ? { ...p, [field]: value } : p
        );
        setPrescriptions(updated);
    };

    const handleRemove = (index) => {
        setPrescriptions(prescriptions.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        console.log("Lưu đơn thuốc cho:", patient.name, prescriptions);
        alert(`Đã lưu đơn thuốc cho ${patient.name}`);
        onBack();
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" color="primary" fontWeight="bold" mb={3}>
                Kê đơn thuốc cho {patient.name}
            </Typography>

            <Paper sx={{ p: 2, borderRadius: 3 }}>
                {prescriptions.map((item, index) => (
                    <Grid container spacing={2} key={index} alignItems="center" mb={1}>
                        <Grid item xs={4}>
                            <TextField
                                label="Tên thuốc"
                                fullWidth
                                value={item.medicine}
                                onChange={(e) => handleChange(index, "medicine", e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Liều dùng"
                                fullWidth
                                value={item.dosage}
                                onChange={(e) => handleChange(index, "dosage", e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Số lượng"
                                type="number"
                                fullWidth
                                value={item.quantity}
                                onChange={(e) => handleChange(index, "quantity", e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton color="error" onClick={() => handleRemove(index)}>
                                <Delete />
                            </IconButton>
                        </Grid>
                    </Grid>
                ))}

                <Button startIcon={<AddCircle />} onClick={handleAddRow}>
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

export default PrescriptionForm;

import { Box, Button, TextField, Typography, Stack } from "@mui/material";
import advancePaymentService from "../../../services/advancePaymentService";
import { useState } from "react";
import { toast } from "react-toastify";

const AdvanceForm = ({ patient, onBack }) => {
    const [amount, setAmount] = useState("");

    const handleSubmit = async () => {
        await advancePaymentService.create({
            patientId: patient.patientId,
            amount
        });

        toast.success("Ứng tiền thành công!");
        onBack(true);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
                Ứng tiền cho {patient.fullName}
            </Typography>

            <Stack spacing={2} maxWidth={300}>
                <TextField
                    label="Số tiền ứng"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />

                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" onClick={onBack}>Quay lại</Button>
                    <Button variant="contained" onClick={handleSubmit}>Xác nhận</Button>
                </Stack>
            </Stack>
        </Box>
    );
};

export default AdvanceForm;

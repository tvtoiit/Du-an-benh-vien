import React, { useState } from "react";
import {
    Box, Typography, Paper, Button, Divider, Grid
} from "@mui/material";

const PaymentForm = ({ patient, onBack }) => {
    const [paymentInfo, setPaymentInfo] = useState({
        examFee: 100000,
        serviceFee: 150000,
        medicineFee: 100000,
        paid: false,
    });

    const total = paymentInfo.examFee + paymentInfo.serviceFee + paymentInfo.medicineFee;

    const handlePayment = () => {
        setPaymentInfo({ ...paymentInfo, paid: true });
        alert(`Đã thanh toán cho bệnh nhân ${patient.name}, tổng cộng: ${total.toLocaleString()} VNĐ`);
        onBack();
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" color="primary" fontWeight="bold" mb={2}>
                Thanh toán cho {patient.name}
            </Typography>

            <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography>Phí khám bệnh:</Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                        <Typography>{paymentInfo.examFee.toLocaleString()} đ</Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography>Phí dịch vụ:</Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                        <Typography>{paymentInfo.serviceFee.toLocaleString()} đ</Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography>Tiền thuốc:</Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                        <Typography>{paymentInfo.medicineFee.toLocaleString()} đ</Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" color="primary">
                        Tổng cộng: {total.toLocaleString()} đ
                    </Typography>

                    <Box>
                        <Button variant="outlined" onClick={onBack} sx={{ mr: 2 }}>
                            Quay lại
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handlePayment}
                            disabled={paymentInfo.paid}
                        >
                            {paymentInfo.paid ? "Đã thanh toán" : "Xác nhận thanh toán"}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default PaymentForm;

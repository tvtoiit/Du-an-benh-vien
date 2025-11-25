import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Paper,
    Button,
    Divider,
    Grid,
    TextField,
    Chip,
} from "@mui/material";
import { toast } from "react-toastify";

import paymentService from "../../../services/paymentService";
import advancePaymentService from "../../../services/advancePaymentService";

const PaymentForm = ({ patient, onBack }) => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);

    const [advanceAmount, setAdvanceAmount] = useState("");
    const [advanceNote, setAdvanceNote] = useState("");
    const [submittingAdvance, setSubmittingAdvance] = useState(false);
    const [confirming, setConfirming] = useState(false);

    const patientId = patient.patientId;
    const prescriptionId = patient.prescriptionId || null;

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setLoading(true);
                const res = await paymentService.getSummary(patientId, prescriptionId);
                setSummary(res);
            } catch (error) {
                console.error("Error fetching payment summary: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, [patientId, prescriptionId]);

    const handleConfirmPayment = async () => {
        try {
            setConfirming(true);
            await paymentService.createPaymentDetails({ patientId, prescriptionId });

            toast.success(`Thanh toán thành công!`);
            onBack();
        } catch (error) {
            toast.error("Thanh toán thất bại!");
        } finally {
            setConfirming(false);
        }
    };

    if (loading || !summary) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>Đang tải thông tin thanh toán...</Typography>
            </Box>
        );
    }

    const { examFee, serviceFee, medicineFee, totalCost, advanceTotal, amountToPay } =
        summary;

    return (
        <Box sx={{ p: 3, maxWidth: 700, mx: "auto" }}>
            <Typography variant="h5" fontWeight="bold" color="primary" mb={3}>
                Thanh toán cho bệnh nhân: <b>{summary.fullName}</b>
            </Typography>

            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 4 }}>
                {/* THÔNG TIN CHI PHÍ */}
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    Chi tiết chi phí
                </Typography>

                <Grid container spacing={1}>
                    <Grid item xs={7}>Phí khám bệnh</Grid>
                    <Grid item xs={5} textAlign="right">
                        {examFee.toLocaleString()} đ
                    </Grid>

                    <Grid item xs={7}>Phí dịch vụ</Grid>
                    <Grid item xs={5} textAlign="right">
                        {serviceFee.toLocaleString()} đ
                    </Grid>

                    <Grid item xs={7}>Tiền thuốc</Grid>
                    <Grid item xs={5} textAlign="right">
                        {medicineFee.toLocaleString()} đ
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* TỔNG KẾT */}
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    Tổng kết
                </Typography>

                <Grid container spacing={1}>
                    <Grid item xs={7}>Tổng chi phí: </Grid>
                    <Grid item xs={5} textAlign="right">
                        <b>{totalCost.toLocaleString()} đ</b>
                    </Grid>

                    <Grid item xs={7}>Đã tạm ứng: </Grid>
                    <Grid item xs={5} textAlign="right">
                        {advanceTotal.toLocaleString()} đ
                    </Grid>

                    <Grid item xs={7}>
                        <Typography fontWeight="bold">Cần thu thêm: </Typography>
                    </Grid>
                    <Grid item xs={5} textAlign="right">
                        <Typography fontWeight="bold" color="error" fontSize="1.3rem">
                            {amountToPay.toLocaleString()} đ
                        </Typography>
                    </Grid>
                </Grid>

                {/* BUTTONS */}
                <Box display="flex" justifyContent="space-between" mt={4}>
                    <Button variant="outlined" onClick={onBack}>
                        Quay lại
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleConfirmPayment}
                        disabled={confirming}
                        sx={{
                            px: 4,
                            backgroundColor: "#2F3E4F",
                            color: "#fff",
                            "&:hover": {
                                backgroundColor: "#243543",
                            },
                            "&.Mui-disabled": {
                                backgroundColor: "#7a8791",
                                color: "#e0e0e0",
                            }
                        }}
                    >
                        {confirming ? "Đang xử lý..." : "Xác nhận thanh toán"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default PaymentForm;

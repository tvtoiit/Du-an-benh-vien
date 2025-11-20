// PaymentForm.jsx
import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Paper,
    Button,
    Divider,
    Grid,
    TextField,
} from "@mui/material";
import paymentService from "../../../services/paymentService";
import advancePaymentService from "../../../services/advancePaymentService";

const PaymentForm = ({ patient, onBack }) => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);

    const [advanceAmount, setAdvanceAmount] = useState("");
    const [advanceNote, setAdvanceNote] = useState("");
    const [submittingAdvance, setSubmittingAdvance] = useState(false);
    const [confirming, setConfirming] = useState(false);

    // Dựa vào dữ liệu từ DsBenhNhanThanhToan
    const patientId = patient.patientId || patient.id;
    const prescriptionId = patient.prescriptionId || null;

    // Load summary khi vào form
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

        if (patientId) {
            fetchSummary();
        }
    }, [patientId, prescriptionId]);

    const handleCreateAdvance = async () => {
        const amountNumber = Number(advanceAmount);

        if (!amountNumber || amountNumber <= 0) {
            alert("Vui lòng nhập số tiền tạm ứng hợp lệ");
            return;
        }

        try {
            setSubmittingAdvance(true);
            await advancePaymentService.create({
                patientId: patientId,
                amount: amountNumber,
                note: advanceNote,
                createdBy: localStorage.getItem("username") || "THUNGAN",
            });

            alert("Thu tạm ứng thành công");

            setAdvanceAmount("");
            setAdvanceNote("");

            // Reload summary để update advanceTotal + amountToPay
            const res = await paymentService.getSummary(patientId, prescriptionId);
            setSummary(res);
        } catch (error) {
            console.error("Error creating advance payment: ", error);
            alert("Thu tạm ứng thất bại");
        } finally {
            setSubmittingAdvance(false);
        }
    };

    const handleConfirmPayment = async () => {
        if (!summary) return;

        try {
            setConfirming(true);
            await paymentService.createPaymentDetails({
                patientId,
                prescriptionId,
            });

            alert(
                `Đã thanh toán cho bệnh nhân ${summary.fullName || patient.name
                }, số tiền cần thu: ${summary.amountToPay.toLocaleString()} VNĐ`
            );
            onBack();
        } catch (error) {
            console.error("Error confirming payment: ", error);
            alert("Thanh toán thất bại");
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
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" color="primary" fontWeight="bold" mb={2}>
                Thanh toán cho {summary.fullName || patient.name}
            </Typography>

            <Paper sx={{ p: 3, borderRadius: 3 }}>
                {/* Chi tiết phí */}
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography>Phí khám bệnh:</Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                        <Typography>{examFee.toLocaleString()} đ</Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography>Phí dịch vụ:</Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                        <Typography>{serviceFee.toLocaleString()} đ</Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <Typography>Tiền thuốc:</Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                        <Typography>{medicineFee.toLocaleString()} đ</Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Khu vực tạm ứng */}
                <Box mb={2}>
                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                        Tạm ứng
                    </Typography>

                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={6}>
                            <Typography>Đã tạm ứng:</Typography>
                        </Grid>
                        <Grid item xs={6} textAlign="right">
                            <Typography>{advanceTotal.toLocaleString()} đ</Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Nhập số tiền tạm ứng thêm"
                                type="number"
                                fullWidth
                                size="small"
                                value={advanceAmount}
                                onChange={(e) => setAdvanceAmount(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Ghi chú (tuỳ chọn)"
                                fullWidth
                                size="small"
                                value={advanceNote}
                                onChange={(e) => setAdvanceNote(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} textAlign="right">
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleCreateAdvance}
                                disabled={submittingAdvance}
                            >
                                {submittingAdvance ? "Đang thu tạm ứng..." : "Thu tạm ứng"}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Tổng kết */}
                <Box mb={2}>
                    <Grid container>
                        <Grid item xs={6}>
                            <Typography>Tổng chi phí:</Typography>
                        </Grid>
                        <Grid item xs={6} textAlign="right">
                            <Typography>{totalCost.toLocaleString()} đ</Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography>Đã tạm ứng:</Typography>
                        </Grid>
                        <Grid item xs={6} textAlign="right">
                            <Typography>{advanceTotal.toLocaleString()} đ</Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography fontWeight="bold">Cần thu thêm:</Typography>
                        </Grid>
                        <Grid item xs={6} textAlign="right">
                            <Typography fontWeight="bold" color="primary">
                                {amountToPay.toLocaleString()} đ
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Button variant="outlined" onClick={onBack}>
                        Quay lại
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleConfirmPayment}
                        disabled={confirming}
                    >
                        {confirming ? "Đang thanh toán..." : "Xác nhận thanh toán"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default PaymentForm;

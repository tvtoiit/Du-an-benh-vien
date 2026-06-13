import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Paper,
    Button,
    Divider,
    Grid
} from "@mui/material";
import { toast } from "react-toastify";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

import paymentService from "../../../services/paymentService";

const PaymentForm = ({ patient, onBack }) => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [confirming, setConfirming] = useState(false);

    const patientId = patient.patientId;
    const prescriptionId = patient.prescriptionId || null;
    const appointmentId = patient.appointmentId;

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setLoading(true);

                const res = await paymentService.getSummary(
                    appointmentId
                );

                setSummary(res);

                console.log("PAYMENT SUMMARY:", res);
            } catch (error) {
                console.error(
                    "Error fetching payment summary:",
                    error
                );

                toast.error(
                    "Không lấy được thông tin thanh toán"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, [patientId, prescriptionId]);

    const handleConfirmPayment = async () => {
        try {
            setConfirming(true);

            const res =
                await paymentService.createPaymentDetails({
                    patientId,
                    appointmentId:
                        summary.appointmentId,
                    prescriptionId
                });

            if (!res) {
                toast.error("Không nhận được dữ liệu hóa đơn");
                return;
            }

            console.log(
                "PAYMENT SUCCESS:",
                res
            );

            downloadInvoice(res);

            toast.success(
                "Thanh toán thành công! Hóa đơn đã được tải xuống."
            );

            setTimeout(() => {
                onBack();
            }, 1000);

        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.response?.data ||
                "Thanh toán thất bại!";

            toast.error(message);
        } finally {
            setConfirming(false);
        }
    };



    if (loading || !summary) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>
                    Đang tải thông tin thanh toán...
                </Typography>
            </Box>
        );
    }

    const {
        fullName,
        cccd,
        doctorName,
        roomName,
        roomGroupName,
        status,
        consultationFee,
        serviceFee,
        totalCost
    } = summary;

    const downloadInvoice = (paymentInfo) => {
        const amount =
            paymentInfo?.totalAmount || totalCost || 0;

        const documentDefinition = {
            content: [
                {
                    text: "BỆNH VIỆN HÀ NỘI",
                    style: "header",
                    alignment: "center"
                },

                {
                    text: "PHIẾU THANH TOÁN",
                    style: "title",
                    alignment: "center",
                    margin: [0, 0, 0, 20]
                },

                {
                    text: `Mã thanh toán: ${paymentInfo?.paymentDetailId || ""
                        }`
                },

                {
                    text: `Họ tên: ${fullName}`
                },

                {
                    text: `CCCD: ${cccd}`
                },

                {
                    text: `Bác sĩ: ${doctorName}`
                },

                {
                    text: `Phòng khám: ${roomName}`
                },

                {
                    text: `Khu phòng: ${roomGroupName}`
                },

                {
                    text: " "
                },

                {
                    canvas: [
                        {
                            type: "line",
                            x1: 0,
                            y1: 0,
                            x2: 500,
                            y2: 0,
                            lineWidth: 1
                        }
                    ]
                },

                {
                    text: " "
                },

                {
                    text:
                        `Phí khám bác sĩ: ${Number(
                            consultationFee || 0
                        ).toLocaleString()} VNĐ`
                },

                {
                    text:
                        `Phí dịch vụ: ${Number(
                            serviceFee || 0
                        ).toLocaleString()} VNĐ`
                },

                {
                    text: " "
                },

                {
                    canvas: [
                        {
                            type: "line",
                            x1: 0,
                            y1: 0,
                            x2: 500,
                            y2: 0,
                            lineWidth: 1
                        }
                    ]
                },

                {
                    text: " "
                },

                {
                    text:
                        `TỔNG TIỀN: ${Number(
                            amount
                        ).toLocaleString()} VNĐ`,
                    style: "total"
                },

                {
                    text: " "
                },

                {
                    text:
                        `Ngày thanh toán: ${new Date().toLocaleString(
                            "vi-VN"
                        )}`
                }
            ],

            styles: {
                header: {
                    fontSize: 18,
                    bold: true
                },

                title: {
                    fontSize: 16,
                    bold: true
                },

                total: {
                    fontSize: 14,
                    bold: true,
                    color: "red"
                }
            }
        };

        const fileName = fullName
            .replace(/\s+/g, "_")
            .replace(/[^\w]/g, "");

        pdfMake
            .createPdf(documentDefinition)
            .download(
                `HoaDon_${fileName}_${new Date()
                    .toISOString()
                    .slice(0, 10)}.pdf`
            );
    };

    // =========================
    // MÀN HÌNH THANH TOÁN
    // =========================
    return (
        <Box
            sx={{
                p: 3,
                maxWidth: 700,
                mx: "auto"
            }}
        >
            <Typography
                variant="h5"
                fontWeight="bold"
                color="primary"
                mb={3}
            >
                Thanh toán cho bệnh nhân:
                {" "}
                <b>{fullName}</b>
            </Typography>

            <Paper
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    boxShadow: 2
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    mb={2}
                >
                    Thông tin khám bệnh
                </Typography>

                <Grid container spacing={1}>
                    <Grid item xs={4}>
                        <b>CCCD:</b>
                    </Grid>

                    <Grid item xs={8}>
                        {cccd}
                    </Grid>

                    <Grid item xs={4}>
                        <b>Bác sĩ:</b>
                    </Grid>

                    <Grid item xs={8}>
                        {doctorName}
                    </Grid>

                    <Grid item xs={4}>
                        <b>Phòng khám:</b>
                    </Grid>

                    <Grid item xs={8}>
                        {roomName}
                    </Grid>

                    <Grid item xs={4}>
                        <b>Khu phòng:</b>
                    </Grid>

                    <Grid item xs={8}>
                        {roomGroupName}
                    </Grid>

                    <Grid item xs={4}>
                        <b>Trạng thái:</b>
                    </Grid>

                    <Grid item xs={8}>
                        {status}
                    </Grid>
                </Grid>
            </Paper>

            <Paper
                sx={{
                    p: 3,
                    borderRadius: 3,
                    boxShadow: 4
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    mb={2}
                >
                    Chi tiết thanh toán
                </Typography>

                <Grid container spacing={1}>
                    <Grid item xs={7}>
                        Phí khám bác sĩ
                    </Grid>

                    <Grid
                        item
                        xs={5}
                        textAlign="right"
                    >
                        {Number(
                            consultationFee || 0
                        ).toLocaleString()}
                        {" "}đ
                    </Grid>

                    <Grid item xs={7}>
                        Phí dịch vụ
                    </Grid>

                    <Grid
                        item
                        xs={5}
                        textAlign="right"
                    >
                        {Number(
                            serviceFee || 0
                        ).toLocaleString()}
                        {" "}đ
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={1}>
                    <Grid item xs={7}>
                        <Typography
                            fontWeight="bold"
                            fontSize="1.1rem"
                        >
                            Tổng tiền thanh toán
                        </Typography>
                    </Grid>

                    <Grid
                        item
                        xs={5}
                        textAlign="right"
                    >
                        <Typography
                            fontWeight="bold"
                            color="error"
                            fontSize="1.4rem"
                        >
                            {Number(
                                totalCost || 0
                            ).toLocaleString()}
                            {" "}đ
                        </Typography>
                    </Grid>
                </Grid>

                <Box
                    display="flex"
                    justifyContent="space-between"
                    mt={4}
                >
                    <Button
                        variant="outlined"
                        onClick={onBack}
                    >
                        Quay lại
                    </Button>

                    <Button
                        variant="contained"
                        onClick={
                            handleConfirmPayment
                        }
                        disabled={confirming}
                        sx={{
                            px: 4,
                            backgroundColor:
                                "#2F3E4F",
                            color: "#fff",
                            "&:hover": {
                                backgroundColor:
                                    "#243543"
                            },
                            "&.Mui-disabled": {
                                backgroundColor:
                                    "#7a8791",
                                color:
                                    "#e0e0e0"
                            }
                        }}
                    >
                        {confirming
                            ? "Đang xử lý..."
                            : "Xác nhận thanh toán"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default PaymentForm;
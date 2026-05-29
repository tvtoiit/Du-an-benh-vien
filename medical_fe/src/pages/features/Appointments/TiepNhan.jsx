import React, { useEffect, useState, useCallback } from "react";

import {
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
    Paper,
    Stack,
    Alert,
    Avatar,
    Chip,
    Divider,
    Card,
    CardContent,
    InputAdornment
} from "@mui/material";

import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import NotesIcon from "@mui/icons-material/Notes";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

import doctorService from "../../../services/doctorService";
import appointmentService from "../../../services/appointmentService";

import { toast } from "react-toastify";

const TiepNhan = ({
    selectedPatient,
    onBack = () => { }
}) => {

    const [formData, setFormData] = useState({
        doctor: "",
        room: "",
        note: "",
    });

    const [doctors, setDoctors] = useState([]);

    const [currentAppointment, setCurrentAppointment] =
        useState(null);

    const [loadingAppointment, setLoadingAppointment] =
        useState(true);

    // ==========================================
    // VALIDATE PATIENT
    // ==========================================
    if (!selectedPatient) {

        return (
            <Box sx={{ p: 4 }}>

                <Typography color="error">

                    Vui lòng chọn bệnh nhân trước.

                </Typography>

            </Box>
        );
    }

    // ==========================================
    // LOAD DOCTORS
    // ==========================================
    const loadDoctors = useCallback(async () => {

        try {

            const res =
                await doctorService.getAll();

            const list = res.data ?? res;

            setDoctors(list || []);

        } catch (err) {

            console.error(
                "Lỗi load bác sĩ:",
                err
            );
        }

    }, []);

    useEffect(() => {

        loadDoctors();

    }, [loadDoctors]);

    // ==========================================
    // LOAD APPOINTMENT
    // ==========================================
    const loadCurrentAppointment =
        useCallback(async () => {

            try {

                setLoadingAppointment(true);

                const res =
                    await appointmentService
                        .getByPatient(
                            selectedPatient.patientId
                        );

                const list =
                    res.data ?? res ?? [];

                const active = list
                    .filter(
                        (a) =>
                            a.status !==
                            "Đã thanh toán"
                    )
                    .sort(
                        (a, b) =>
                            new Date(
                                b.appointmentDatetime
                            ) -
                            new Date(
                                a.appointmentDatetime
                            )
                    )[0];

                setCurrentAppointment(
                    active || null
                );

            } catch (err) {

                console.error(
                    "Lỗi load lịch khám:",
                    err
                );

            } finally {

                setLoadingAppointment(false);
            }

        }, [selectedPatient.patientId]);

    useEffect(() => {

        loadCurrentAppointment();

    }, [loadCurrentAppointment]);

    // ==========================================
    // HANDLE CHANGE
    // ==========================================
    const handleChange = (e) => {

        const { name, value } = e.target;

        // auto fill room
        if (name === "doctor") {

            const selectedDoctor =
                doctors.find(
                    (d) =>
                        d.doctorId === value
                );

            setFormData({
                ...formData,
                doctor: value,
                room:
                    selectedDoctor?.roomName ?? ""
            });

            return;
        }

        setFormData({
            ...formData,
            [name]: value
        });
    };

    // ==========================================
    // SUBMIT
    // ==========================================
    const handleSubmit = async (e) => {

        e.preventDefault();

        if (currentAppointment) {

            toast.warning(
                "Bệnh nhân đang có lịch khám chưa hoàn tất!"
            );

            return;
        }

        try {

            const payload = {
                patientId:
                    selectedPatient.patientId,

                doctorId:
                    formData.doctor,

                appointmentDatetime:
                    new Date()
                        .toISOString()
                        .slice(0, 19)
                        .replace("T", " "),

                room:
                    formData.room,

                note:
                    formData.note,
            };

            await appointmentService
                .create(payload);

            toast.success(
                "Tiếp nhận thành công!"
            );

            onBack(true);

        } catch (err) {

            console.error(err);

            toast.error(
                "Không thể tiếp nhận!"
            );
        }
    };

    // ==========================================
    // RESET
    // ==========================================
    const handleReset = () => {

        setFormData({
            doctor: "",
            room: "",
            note: "",
        });
    };

    const disableCreate =
        !!currentAppointment;

    // doctor selected
    const selectedDoctor =
        doctors.find(
            (d) =>
                d.doctorId === formData.doctor
        );

    // ==========================================
    // UI
    // ==========================================
    return (
        <Box
            sx={{
                p: 4,
                background: "#f5f7fb",
                minHeight: "100vh"
            }}
        >

            {/* HEADER */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 4,
                    background:
                        "linear-gradient(135deg, #1976d2, #42a5f5)",
                    color: "#fff"
                }}
            >

                <Typography
                    variant="h5"
                    fontWeight="bold"
                >
                    Tiếp nhận khám bệnh
                </Typography>

                <Typography variant="body2">

                    Hệ thống tiếp nhận và
                    chỉ định khám

                </Typography>

            </Paper>

            {/* PATIENT INFO */}
            <Card
                sx={{
                    mb: 3,
                    borderRadius: 4
                }}
            >

                <CardContent>

                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                    >

                        <Avatar
                            sx={{
                                bgcolor: "#1976d2",
                                width: 56,
                                height: 56
                            }}
                        >
                            {selectedPatient.fullName?.[0]}
                        </Avatar>

                        <Box>

                            <Typography
                                variant="h6"
                                fontWeight="bold"
                            >
                                {selectedPatient.fullName}
                            </Typography>

                            <Typography
                                color="text.secondary"
                            >
                                CCCD:
                                {" "}
                                {selectedPatient.cccd}
                            </Typography>

                        </Box>

                    </Stack>

                </CardContent>

            </Card>

            {/* WARNING */}
            {!loadingAppointment &&
                currentAppointment && (

                    <Alert
                        severity="warning"
                        sx={{
                            mb: 3,
                            borderRadius: 3
                        }}
                    >

                        Bệnh nhân đang có lịch khám
                        chưa hoàn tất với bác sĩ
                        {" "}
                        <b>
                            {
                                currentAppointment
                                    .doctor?.doctorName
                            }
                        </b>

                    </Alert>
                )}

            {/* FORM */}
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    borderRadius: 4,
                    maxWidth: 700,
                    mx: "auto"
                }}
            >

                <form onSubmit={handleSubmit}>

                    <Stack spacing={3}>

                        {/* SELECT DOCTOR */}
                        <TextField
                            select
                            label="Chọn bác sĩ"
                            name="doctor"
                            value={formData.doctor}
                            onChange={handleChange}
                            fullWidth
                            required
                            disabled={disableCreate}
                        >

                            {doctors.map((doc) => (

                                <MenuItem
                                    key={doc.doctorId}
                                    value={doc.doctorId}
                                >

                                    {doc.doctorName}
                                    {" - "}
                                    {doc.degree}

                                </MenuItem>

                            ))}

                        </TextField>

                        {/* DOCTOR INFO */}
                        {selectedDoctor && (

                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    background:
                                        "#f8fafc"
                                }}
                            >

                                <Stack spacing={2}>

                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        alignItems="center"
                                    >

                                        <Avatar
                                            sx={{
                                                bgcolor:
                                                    "#1976d2"
                                            }}
                                        >
                                            <LocalHospitalIcon />
                                        </Avatar>

                                        <Box>

                                            <Typography
                                                fontWeight="bold"
                                            >
                                                {
                                                    selectedDoctor
                                                        .doctorName
                                                }
                                            </Typography>

                                            <Chip
                                                label={
                                                    selectedDoctor
                                                        .degree
                                                }
                                                color="primary"
                                                size="small"
                                            />

                                        </Box>

                                    </Stack>

                                    <Divider />

                                    <Typography>

                                        Phòng khám:
                                        {" "}
                                        <b>
                                            {
                                                selectedDoctor
                                                    .roomName
                                            }
                                        </b>

                                    </Typography>

                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                    >

                                        <MonetizationOnIcon
                                            color="success"
                                        />

                                        <Typography
                                            color="success.main"
                                            fontWeight="bold"
                                        >

                                            {Number(
                                                selectedDoctor
                                                    .consultationFee
                                            ).toLocaleString()}
                                            {" "}
                                            VNĐ

                                        </Typography>

                                    </Stack>

                                </Stack>

                            </Paper>
                        )}

                        {/* NOTE */}
                        <TextField
                            label="Ghi chú"
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={4}
                            disabled={disableCreate}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <NotesIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* BUTTON */}
                        <Box
                            display="flex"
                            justifyContent="flex-end"
                            gap={2}
                        >

                            <Button
                                variant="outlined"
                                onClick={handleReset}
                                disabled={disableCreate}
                                sx={{
                                    borderRadius: 2,
                                    px: 3
                                }}
                            >
                                Làm mới
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={disableCreate}
                                sx={{
                                    borderRadius: 2,
                                    px: 3
                                }}
                            >
                                Tiếp nhận khám
                            </Button>

                        </Box>

                    </Stack>

                </form>

            </Paper>

        </Box>
    );
};

export default TiepNhan;
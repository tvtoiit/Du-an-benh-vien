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
} from "@mui/material";

import departmentService from "../../../services/departmentService";
import doctorService from "../../../services/doctorService";
import appointmentService from "../../../services/appointmentService";
import { toast } from "react-toastify";

const TiepNhan = ({ selectedPatient, onBack = () => { } }) => {
    const [formData, setFormData] = useState({
        department: "",
        doctor: "",
        room: "",
        note: "",
    });

    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);

    // Lịch khám gần nhất chưa hoàn tất
    const [currentAppointment, setCurrentAppointment] = useState(null);
    const [loadingAppointment, setLoadingAppointment] = useState(true);

    // ============================
    //  VALIDATION INPUT PATIENT
    // ============================
    if (!selectedPatient) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography color="error">
                    Vui lòng chọn bệnh nhân từ danh sách trước khi tiếp nhận.
                </Typography>
            </Box>
        );
    }

    // ============================
    // LOAD KHOA
    // ============================
    const loadDepartments = useCallback(async () => {
        try {
            const res = await departmentService.getAll();
            const list = res.data ?? res;
            setDepartments(list || []);
        } catch (err) {
            console.error("Lỗi load khoa:", err);
        }
    }, []);

    useEffect(() => {
        loadDepartments();
    }, [loadDepartments]);

    // ============================
    // LOAD BÁC SĨ THEO KHOA
    // ============================
    const loadDoctors = useCallback(async () => {
        if (!formData.department) return;
        try {
            const res = await doctorService.getByIdDepartment(formData.department);
            const list = res.data ?? res;
            setDoctors(list || []);
        } catch (err) {
            console.error("Lỗi load bác sĩ:", err);
        }
    }, [formData.department]);

    useEffect(() => {
        loadDoctors();
    }, [loadDoctors]);

    // Reset room khi đổi doctor
    useEffect(() => {
        setFormData((prev) => ({ ...prev, room: "" }));
    }, [formData.doctor]);

    // ============================
    // LOAD LỊCH KHÁM GẦN NHẤT
    // ============================
    const loadCurrentAppointment = useCallback(async () => {
        try {
            setLoadingAppointment(true);

            const res = await appointmentService.getByPatient(
                selectedPatient.patientId
            );

            const list = res.data ?? res ?? [];

            // Lọc history → bỏ qua "Đã thanh toán" (vì đó là khám lại)
            const active = list
                .filter((a) => a.status !== "Đã thanh toán")
                .sort(
                    (a, b) =>
                        new Date(b.appointmentDatetime) -
                        new Date(a.appointmentDatetime)
                )[0];

            setCurrentAppointment(active || null);
        } catch (err) {
            console.error("Lỗi lấy lịch khám:", err);
        } finally {
            setLoadingAppointment(false);
        }
    }, [selectedPatient.patientId]);

    useEffect(() => {
        loadCurrentAppointment();
    }, [loadCurrentAppointment]);

    // ============================
    // FORM CHANGE
    // ============================
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ============================
    // SUBMIT TẠO LỊCH KHÁM
    // ============================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (currentAppointment) {
            toast.warning(
                "Bệnh nhân đang có lịch khám chưa hoàn tất, không thể tạo thêm lịch mới."
            );
            return;
        }

        try {
            const payload = {
                patientId: selectedPatient.patientId,
                doctorId: formData.doctor,
                appointmentDatetime: new Date()
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " "),
                room: formData.room,
                note: formData.note,
            };

            await appointmentService.create(payload);

            toast.success("Tạo lịch khám thành công!");
            onBack(true);
        } catch (err) {
            console.error("Lỗi tạo lịch khám:", err);
            toast.error("Không thể tạo lịch khám!");
        }
    };

    const handleReset = () => {
        setFormData({
            department: "",
            doctor: "",
            room: "",
            note: "",
        });
    };

    const disableCreate = !!currentAppointment;

    // ============================
    // UI
    // ============================
    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" mb={3} color="primary" align="center">
                Tiếp nhận & Chỉ định khám
            </Typography>

            <Typography mb={2}>
                Bệnh nhân: <b>{selectedPatient.fullName}</b> (ID:{" "}
                <b>{selectedPatient.patientId}</b>)
            </Typography>

            {/* cảnh báo nếu có lịch đang active */}
            {!loadingAppointment && currentAppointment && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Bệnh nhân đang có lịch khám trạng thái{" "}
                    <b>{currentAppointment.status}</b> với bác sĩ{" "}
                    <b>{currentAppointment.doctor?.doctorName}</b> tại phòng{" "}
                    <b>{currentAppointment.room}</b> lúc{" "}
                    <b>{currentAppointment.appointmentDatetime}</b>.
                    Vui lòng xử lý lịch này trước khi tạo lịch mới.
                </Alert>
            )}

            <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3, maxWidth: 600, mx: "auto" }}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        {/* Chọn khoa */}
                        <TextField
                            select
                            label="Khoa khám"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            fullWidth
                            required
                            disabled={disableCreate}
                        >
                            {departments.map((dep) => (
                                <MenuItem key={dep.departmentId} value={dep.departmentId}>
                                    {dep.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* Chọn bác sĩ */}
                        <TextField
                            select
                            label="Bác sĩ"
                            name="doctor"
                            value={formData.doctor}
                            onChange={handleChange}
                            fullWidth
                            required
                            disabled={disableCreate}
                        >
                            {doctors.map((doc) => (
                                <MenuItem key={doc.doctorId} value={doc.doctorId}>
                                    {doc.doctorName}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* Chọn phòng */}
                        {formData.doctor && (
                            <TextField
                                select
                                label="Phòng khám"
                                name="room"
                                value={formData.room}
                                onChange={handleChange}
                                fullWidth
                                required
                                disabled={disableCreate}
                            >
                                {doctors
                                    .find((doc) => doc.doctorId === formData.doctor)
                                    ?.roomNames.map((room) => (
                                        <MenuItem key={room} value={room}>
                                            {room}
                                        </MenuItem>
                                    ))}
                            </TextField>
                        )}

                        {/* Ghi chú */}
                        <TextField
                            label="Ghi chú"
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={3}
                            disabled={disableCreate}
                        />

                        {/* Nút */}
                        <Box display="flex" justifyContent="flex-end" gap={2}>
                            <Button
                                variant="outlined"
                                onClick={handleReset}
                                disabled={disableCreate}
                            >
                                Làm mới
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={disableCreate}
                            >
                                Tạo chỉ định khám
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
};

export default TiepNhan;

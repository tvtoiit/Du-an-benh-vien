import React, { useEffect, useState } from "react";
import departmentService from "../../../services/departmentService";
import appointmentService from "../../../services/appointmentService";
import doctorService from "../../../services/doctorService";
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

const TiepNhan = ({ selectedPatient }) => {
    const [formData, setFormData] = useState({
        department: "",
        doctor: "",
        room: "",
        note: "",
    });

    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);

    // trạng thái lịch hiện tại của bệnh nhân
    const [currentAppointment, setCurrentAppointment] = useState(null);
    const [loadingAppointment, setLoadingAppointment] = useState(true);

    if (!selectedPatient) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography color="error">
                    Vui lòng chọn bệnh nhân từ danh sách trước khi tiếp nhận.
                </Typography>
            </Box>
        );
    }

    // 1. load khoa
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await departmentService.getAll();
                const list = res.data ?? res;
                setDepartments(list || []);
            } catch (error) {
                console.error("Lỗi gọi API khoa phòng:", error);
            }
        };
        fetchDepartments();
    }, []);

    // 2. load bác sĩ theo khoa
    useEffect(() => {
        const fetchDoctors = async () => {
            if (!formData.department) return;
            try {
                const res = await doctorService.getByIdDepartment(formData.department);
                const list = res.data ?? res;
                setDoctors(list || []);
            } catch (error) {
                console.error("Lỗi load bác sĩ:", error);
            }
        };
        fetchDoctors();
    }, [formData.department]);

    // reset room khi đổi doctor
    useEffect(() => {
        setFormData((prev) => ({ ...prev, room: "" }));
    }, [formData.doctor]);

    // 3. load lịch khám hiện tại của bệnh nhân
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setLoadingAppointment(true);
                // giả sử service này map tới GET /appointments/patient/{id}
                const res = await appointmentService.getByPatient(
                    selectedPatient.patientId
                );
                const list = res.data ?? res ?? [];

                // chọn lịch gần nhất chưa "kết thúc"
                const active = list
                    .filter(
                        (a) =>
                            a.status !== "Successful" &&
                            a.status !== "Failed" &&
                            a.status !== "done"
                    )
                    .sort(
                        (a, b) =>
                            new Date(b.appointmentDatetime) -
                            new Date(a.appointmentDatetime)
                    )[0];

                setCurrentAppointment(active || null);
            } catch (error) {
                console.error("Lỗi lấy lịch khám hiện tại:", error);
            } finally {
                setLoadingAppointment(false);
            }
        };

        fetchAppointments();
    }, [selectedPatient.patientId]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // nếu đã có lịch đang chờ thì không cho tạo mới
        if (currentAppointment) {
            alert("Bệnh nhân đang có lịch khám chưa hoàn tất, không thể tạo thêm.");
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
                // status không cần gửi, BE sẽ tự set "waiting for censorship"
            };

            const response = await appointmentService.create(payload);

            alert("Tạo chỉ định khám thành công!");
            console.log(response.data ?? response);

            handleReset();
        } catch (error) {
            console.error("Lỗi khi tạo chỉ định:", error);
            alert("Lỗi khi tạo chỉ định khám!");
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

    const isCreateDisabled = !!currentAppointment; // đã có lịch active thì disable

    return (
        <Box sx={{ p: 4 }}>
            <Typography
                variant="h5"
                fontWeight="bold"
                mb={3}
                color="primary"
                sx={{ textAlign: "center" }}
            >
                Tiếp nhận & chỉ định khám
            </Typography>

            <Typography mb={2}>
                Bệnh nhân: <b>{selectedPatient.fullName}</b> (ID:{" "}
                <b>{selectedPatient.patientId}</b>)
            </Typography>

            {/* Thông báo trạng thái lịch hiện tại */}
            {!loadingAppointment && currentAppointment && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Bệnh nhân đang có lịch khám trạng thái{" "}
                    <b>{currentAppointment.status}</b> với bác sĩ{" "}
                    <b>{currentAppointment.doctor?.doctorName}</b> ở phòng{" "}
                    <b>{currentAppointment.room}</b> lúc{" "}
                    <b>{currentAppointment.appointmentDatetime}</b>.
                    Vui lòng xử lý lịch này (khám / huỷ) trước khi tạo lịch mới.
                </Alert>
            )}

            <Paper
                sx={{
                    p: 4,
                    borderRadius: 3,
                    boxShadow: 3,
                    maxWidth: 600,
                    mx: "auto",
                }}
            >
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            select
                            label="Khoa khám"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            fullWidth
                            required
                            disabled={isCreateDisabled}
                        >
                            {departments.map((dep) => (
                                <MenuItem key={dep.departmentId} value={dep.departmentId}>
                                    {dep.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Bác sĩ chỉ định"
                            name="doctor"
                            value={formData.doctor}
                            onChange={handleChange}
                            fullWidth
                            required
                            disabled={isCreateDisabled}
                        >
                            {doctors.map((doc) => (
                                <MenuItem key={doc.doctorId} value={doc.doctorId}>
                                    {doc.doctorName}
                                </MenuItem>
                            ))}
                        </TextField>

                        {formData.doctor &&
                            doctors.find((doc) => doc.doctorId === formData.doctor) && (
                                <TextField
                                    select
                                    label="Phòng"
                                    name="room"
                                    value={formData.room}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    disabled={isCreateDisabled}
                                >
                                    {doctors
                                        .find((doc) => doc.doctorId === formData.doctor)
                                        .roomNames.map((room) => (
                                            <MenuItem key={room} value={room}>
                                                {room}
                                            </MenuItem>
                                        ))}
                                </TextField>
                            )}

                        <TextField
                            label="Ghi chú / Triệu chứng ban đầu"
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={3}
                            disabled={isCreateDisabled}
                        />

                        <Box display="flex" justifyContent="flex-end" gap={2}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleReset}
                                disabled={isCreateDisabled}
                            >
                                Làm mới
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isCreateDisabled}
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

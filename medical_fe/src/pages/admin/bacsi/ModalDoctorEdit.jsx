import React, { useState } from "react";
import {
    Box, Modal, Typography, TextField, Button, Stack, MenuItem
} from "@mui/material";
import doctorService from "../../../services/doctorService";
import departmentService from "../../../services/departmentService";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 450,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

const ModalDoctorEdit = ({ doctor, onClose, onSuccess }) => {
    const [form, setForm] = useState({
        experience: doctor.experience,
        departmentId: doctor.departmentId
    });

    const [departments, setDepartments] = useState([]);

    React.useEffect(() => {
        if (doctor) {
            setForm({
                experience: doctor.experience ?? "",
                departmentId: String(doctor.departmentId ?? "")
            });
        }
    }, [doctor]);

    React.useEffect(() => {
        departmentService.getAll().then(res =>
            setDepartments(res.data ?? res)
        );
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            await doctorService.update(doctor.doctorId, form);
            toast.success("Cập nhật thành công!");
            onSuccess?.();
            onClose();
        } catch (err) {
            toast.error("Lỗi cập nhật bác sĩ!");
            console.error(err);
        }
    };

    return (
        <Modal open onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" mb={2}>Sửa thông tin bác sĩ</Typography>

                <Stack spacing={2}>
                    <TextField
                        label="Kinh nghiệm"
                        name="experience"
                        value={form.experience}
                        onChange={handleChange}
                        fullWidth
                    />

                    <TextField
                        select
                        label="Khoa"
                        name="departmentId"
                        value={String(form.departmentId)}
                        onChange={handleChange}
                        fullWidth
                    >
                        {departments.map(d => (
                            <MenuItem key={d.departmentId} value={d.departmentId}>
                                {d.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button onClick={onClose} color="error" variant="contained">Hủy</Button>
                        <Button onClick={handleSave} variant="contained" color="primary">
                            Lưu
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Modal>
    );
};

export default ModalDoctorEdit;

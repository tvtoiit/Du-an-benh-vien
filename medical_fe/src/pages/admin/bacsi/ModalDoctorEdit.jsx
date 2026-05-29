import React, { useState, useEffect } from "react";

import {
    Box,
    Modal,
    Typography,
    TextField,
    Button,
    Stack,
    MenuItem,
    Avatar,
    Chip,
    Divider
} from "@mui/material";

import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

import doctorService from "../../../services/doctorService";

import { toast } from "react-toastify";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    borderRadius: 4,
    boxShadow: 24,
    p: 4,
};

const degreeFees = {
    "Bác sĩ": 100000,
    "Thạc sĩ": 200000,
    "Tiến sĩ": 300000,
};

const ModalDoctorEdit = ({
    doctor,
    onClose,
    onSuccess
}) => {

    const [form, setForm] = useState({
        degree: "",
        consultationFee: ""
    });

    // ==========================================
    // LOAD DATA
    // ==========================================
    useEffect(() => {

        if (doctor) {

            setForm({
                degree: doctor.degree ?? "",
                consultationFee:
                    doctor.consultationFee ?? ""
            });
        }

    }, [doctor]);

    // ==========================================
    // HANDLE CHANGE
    // ==========================================
    const handleChange = (e) => {

        const { name, value } = e.target;

        // tự động đổi phí khám
        if (name === "degree") {

            setForm({
                ...form,
                degree: value,
                consultationFee:
                    degreeFees[value]
            });

            return;
        }

        setForm({
            ...form,
            [name]: value
        });
    };

    // ==========================================
    // SAVE
    // ==========================================
    const handleSave = async () => {

        try {

            await doctorService.update(
                doctor.doctorId,
                form
            );

            toast.success(
                "Cập nhật bác sĩ thành công!"
            );

            onSuccess?.();

            onClose();

        } catch (err) {

            console.error(err);

            toast.error(
                "Lỗi cập nhật bác sĩ!"
            );
        }
    };

    return (
        <Modal open onClose={onClose}>

            <Box sx={style}>

                {/* HEADER */}
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    mb={2}
                >

                    <Avatar
                        sx={{
                            bgcolor: "#1976d2",
                            width: 56,
                            height: 56
                        }}
                    >
                        <LocalHospitalIcon />
                    </Avatar>

                    <Box>

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            Chỉnh sửa bác sĩ
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {doctor.doctorName}
                        </Typography>

                    </Box>

                </Stack>

                <Divider sx={{ mb: 3 }} />

                <Stack spacing={3}>

                    {/* DEGREE */}
                    <TextField
                        select
                        label="Trình độ"
                        name="degree"
                        value={form.degree}
                        onChange={handleChange}
                        fullWidth
                    >

                        <MenuItem value="Bác sĩ">
                            <Chip
                                label="Bác sĩ"
                                color="primary"
                                size="small"
                            />
                        </MenuItem>

                        <MenuItem value="Thạc sĩ">
                            <Chip
                                label="Thạc sĩ"
                                color="warning"
                                size="small"
                            />
                        </MenuItem>

                        <MenuItem value="Tiến sĩ">
                            <Chip
                                label="Tiến sĩ"
                                color="error"
                                size="small"
                            />
                        </MenuItem>

                    </TextField>

                    {/* CONSULTATION FEE */}
                    <TextField
                        label="Phí khám"
                        name="consultationFee"
                        type="number"
                        value={form.consultationFee}
                        onChange={handleChange}
                        fullWidth
                    />

                    {/* BUTTON */}
                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="flex-end"
                    >

                        <Button
                            onClick={onClose}
                            color="error"
                            variant="contained"
                            sx={{
                                borderRadius: 2,
                                px: 3
                            }}
                        >
                            Hủy
                        </Button>

                        <Button
                            onClick={handleSave}
                            variant="contained"
                            color="primary"
                            sx={{
                                borderRadius: 2,
                                px: 3
                            }}
                        >
                            Lưu thay đổi
                        </Button>

                    </Stack>

                </Stack>

            </Box>

        </Modal>
    );
};

export default ModalDoctorEdit;
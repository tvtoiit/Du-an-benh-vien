import React from "react";
import {
    Box,
    Modal,
    Typography,
    Button,
    Stack
} from "@mui/material";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 420,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

const ModalDoctorView = ({ doctor, onClose }) => {
    if (!doctor) return null;

    return (
        <Modal open onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" mb={2}>
                    Thông Tin Bác Sĩ
                </Typography>

                <Stack spacing={1.5}>
                    <Typography><b>Mã bác sĩ:</b> {doctor.doctorId}</Typography>
                    <Typography><b>Họ tên:</b> {doctor.fullName}</Typography>
                    <Typography><b>Chuyên khoa:</b> {doctor.specialty}</Typography>
                    <Typography><b>SĐT:</b> {doctor.phoneNumber}</Typography>
                    <Typography><b>Email:</b> {doctor.email}</Typography>
                </Stack>

                <Stack mt={3} justifyContent="flex-end">
                    <Button variant="contained" color="primary" onClick={onClose}>
                        Đóng
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
};

export default ModalDoctorView;

import React, { useState } from "react";
import { Box, Modal, Typography, TextField, Button, Stack } from "@mui/material";
import roomService from "../../../services/roomService";
import { toast } from "react-toastify";

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

const EditRoomModal = ({ room, onClose }) => {
    const [roomName, setRoomName] = useState(room.roomName);

    const handleSubmit = async () => {
        try {
            await roomService.update(room.roomId, { roomName });
            onClose(true);
        } catch (err) {
            toast.error(err.response?.data?.message || "Có lỗi xảy ra!");
        }

    };

    return (
        <Modal open onClose={() => onClose(false)}>
            <Box sx={style}>
                <Typography variant="h6" mb={2}>
                    Sửa thông tin phòng
                </Typography>

                <Stack spacing={2}>
                    <TextField
                        label="Tên phòng"
                        fullWidth
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                    />

                    <Stack direction="row" justifyContent="flex-end" spacing={2}>
                        <Button variant="contained" color="error" onClick={() => onClose(false)}>
                            Đóng
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Lưu
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Modal>
    );
};

export default EditRoomModal;

import React, { useState } from "react";

import {
    Box,
    Modal,
    Typography,
    TextField,
    Button,
    Stack,
    CircularProgress
} from "@mui/material";

import roomGroupService
    from "../../../services/roomGroupService";

import { toast }
    from "react-toastify";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform:
        "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
};

const RegisterRoomGroupModal = ({
    onClose,
    onSuccess
}) => {

    const [groupName,
        setGroupName]
        = useState("");

    const [loading,
        setLoading]
        = useState(false);

    // ==========================================
    // SUBMIT
    // ==========================================
    const handleSubmit =
        async () => {

            if (!groupName.trim()) {

                toast.error(
                    "Vui lòng nhập tên khu phòng"
                );

                return;
            }

            try {

                setLoading(true);

                await roomGroupService
                    .create({
                        groupName:
                            groupName.trim()
                    });

                toast.success(
                    "Thêm khu phòng thành công!"
                );

                // reload dropdown + đóng modal
                onSuccess?.();

            } catch (err) {

                toast.error(
                    err.response?.data?.message
                    || "Không thể thêm khu phòng!"
                );

            } finally {

                setLoading(false);
            }
        };

    return (
        <Modal
            open
            onClose={onClose}
        >

            <Box sx={style}>

                <Typography
                    variant="h6"
                    mb={3}
                    fontWeight="bold"
                >

                    Thêm khu phòng

                </Typography>

                <Stack spacing={3}>

                    <TextField
                        label="Tên khu phòng"
                        value={groupName}
                        onChange={(e) =>
                            setGroupName(
                                e.target.value
                            )
                        }
                        placeholder="Ví dụ: Phòng A"
                        fullWidth
                    />

                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="flex-end"
                    >

                        <Button
                            variant="contained"
                            color="error"
                            onClick={onClose}
                            disabled={loading}
                        >

                            Hủy

                        </Button>

                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={loading}
                        >

                            {loading
                                ? <CircularProgress
                                    size={22}
                                    color="inherit"
                                />
                                : "Lưu"
                            }

                        </Button>

                    </Stack>

                </Stack>

            </Box>

        </Modal>
    );
};

export default RegisterRoomGroupModal;
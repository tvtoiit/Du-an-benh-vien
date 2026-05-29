import React, {
    useState,
    useEffect
} from "react";

import {
    Box,
    Modal,
    Typography,
    TextField,
    Button,
    Stack,
    MenuItem,
    Avatar,
    Divider
} from "@mui/material";

import MeetingRoomIcon
    from "@mui/icons-material/MeetingRoom";

import roomService
    from "../../../services/roomService";

import roomGroupService
    from "../../../services/roomGroupService";

import RegisterRoomGroupModal
    from "./RegisterRoomGroupModal";

import { toast }
    from "react-toastify";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform:
        "translate(-50%, -50%)",
    width: 450,
    bgcolor: "background.paper",
    borderRadius: 4,
    boxShadow: 24,
    p: 4,
};

const RegisterRoomModal = ({
    onClose
}) => {

    const [form, setForm] =
        useState({
            roomName: "",
            roomGroupId: "",
            status: "ACTIVE"
        });

    const [roomGroups,
        setRoomGroups] =
        useState([]);

    // modal thêm khu phòng
    const [openRoomGroupModal,
        setOpenRoomGroupModal]
        = useState(false);

    // ==========================================
    // LOAD ROOM GROUP
    // ==========================================
    const loadRoomGroups =
        async () => {

            try {

                const res =
                    await roomGroupService
                        .getAll();

                const list =
                    res.data ?? res;

                setRoomGroups(
                    Array.isArray(list)
                        ? list
                        : []
                );

            } catch (err) {

                console.error(err);
            }
        };

    useEffect(() => {

        loadRoomGroups();

    }, []);

    // ==========================================
    // HANDLE CHANGE
    // ==========================================
    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]:
                e.target.value
        });
    };

    // ==========================================
    // SUBMIT
    // ==========================================
    const handleSubmit = async () => {

        if (
            !form.roomName ||
            !form.roomGroupId
        ) {

            toast.error(
                "Vui lòng nhập đầy đủ thông tin"
            );

            return;
        }

        try {

            await roomService.create({

                roomName:
                    form.roomName,

                status:
                    form.status,

                roomGroup: {
                    roomGroupId:
                        form.roomGroupId
                }
            });

            toast.success(
                "Thêm phòng thành công!"
            );

            onClose(true);

        } catch (err) {

            toast.error(
                err.response?.data?.message
                || "Có lỗi xảy ra!"
            );
        }
    };

    return (
        <>
            <Modal
                open
                onClose={() =>
                    onClose(false)
                }
            >

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

                            <MeetingRoomIcon />

                        </Avatar>

                        <Box>

                            <Typography
                                variant="h6"
                                fontWeight="bold"
                            >

                                Thêm phòng khám

                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >

                                Khu phòng và số phòng

                            </Typography>

                        </Box>

                    </Stack>

                    <Divider sx={{ mb: 3 }} />

                    {/* FORM */}
                    <Stack spacing={3}>

                        {/* ROOM GROUP */}
                        <Stack
                            direction="row"
                            spacing={1}
                        >

                            <TextField
                                select
                                label="Khu phòng"
                                name="roomGroupId"
                                fullWidth
                                value={form.roomGroupId}
                                onChange={handleChange}
                            >

                                {roomGroups.map((g) => (

                                    <MenuItem
                                        key={g.roomGroupId}
                                        value={g.roomGroupId}
                                    >

                                        {g.groupName}

                                    </MenuItem>

                                ))}

                            </TextField>

                            {/* BUTTON ADD GROUP */}
                            <Button
                                variant="contained"
                                onClick={() =>
                                    setOpenRoomGroupModal(true)
                                }
                                sx={{
                                    minWidth: 55,
                                    fontSize: 24
                                }}
                            >

                                +

                            </Button>

                        </Stack>

                        {/* ROOM NAME */}
                        <TextField
                            label="Số phòng"
                            name="roomName"
                            fullWidth
                            placeholder="Ví dụ: 101"
                            value={form.roomName}
                            onChange={handleChange}
                        />

                        {/* STATUS */}
                        <TextField
                            select
                            label="Trạng thái"
                            name="status"
                            fullWidth
                            value={form.status}
                            onChange={handleChange}
                        >

                            <MenuItem value="ACTIVE">
                                Hoạt động
                            </MenuItem>

                            <MenuItem value="INACTIVE">
                                Ngưng hoạt động
                            </MenuItem>

                            <MenuItem value="MAINTENANCE">
                                Bảo trì
                            </MenuItem>

                        </TextField>

                        {/* BUTTON */}
                        <Stack
                            direction="row"
                            spacing={2}
                            justifyContent="flex-end"
                        >

                            <Button
                                variant="contained"
                                color="error"
                                onClick={() =>
                                    onClose(false)
                                }
                            >

                                Đóng

                            </Button>

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                            >

                                Lưu phòng

                            </Button>

                        </Stack>

                    </Stack>

                </Box>

            </Modal>

            {/* MODAL THÊM KHU PHÒNG */}
            {openRoomGroupModal && (

                <RegisterRoomGroupModal

                    onClose={() =>
                        setOpenRoomGroupModal(false)
                    }

                    onSuccess={() => {

                        loadRoomGroups();

                        setOpenRoomGroupModal(false);
                    }}
                />
            )}

        </>
    );
};

export default RegisterRoomModal;
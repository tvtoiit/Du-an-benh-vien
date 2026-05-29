import React, {
    useEffect,
    useState
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

const EditRoomModal = ({
    room,
    onClose
}) => {

    const [form, setForm] =
        useState({

            roomName:
                room.roomName || "",

            roomGroupId:
                room.roomGroup
                    ?.roomGroupId || "",

            status:
                room.status || "ACTIVE"
        });

    const [roomGroups,
        setRoomGroups]
        = useState([]);

    // ==========================================
    // LOAD ROOM GROUPS
    // ==========================================
    useEffect(() => {

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
    const handleSubmit =
        async () => {

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

                await roomService.update(

                    room.roomId,

                    {

                        roomName:
                            form.roomName,

                        status:
                            form.status,

                        roomGroup: {

                            roomGroupId:
                                form.roomGroupId
                        }
                    }
                );

                toast.success(
                    "Cập nhật phòng thành công!"
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

                            Chỉnh sửa phòng

                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >

                            Cập nhật thông tin phòng khám

                        </Typography>

                    </Box>

                </Stack>

                <Divider sx={{ mb: 3 }} />

                {/* FORM */}
                <Stack spacing={3}>

                    {/* ROOM GROUP */}
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

                    {/* ROOM NAME */}
                    <TextField
                        label="Số phòng"
                        name="roomName"
                        fullWidth
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
                        justifyContent="flex-end"
                        spacing={2}
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

                            Lưu thay đổi

                        </Button>

                    </Stack>

                </Stack>

            </Box>

        </Modal>
    );
};

export default EditRoomModal;
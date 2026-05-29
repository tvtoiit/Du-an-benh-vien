import { useState, useEffect } from "react";

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

import LocalHospitalIcon
    from "@mui/icons-material/LocalHospital";

import doctorService
    from "../../../services/doctorService";

import userService
    from "../../../services/userService";

import roomGroupService
    from "../../../services/roomGroupService";

import roomService
    from "../../../services/roomService";

import { toast }
    from "react-toastify";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform:
        "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    borderRadius: 4,
    boxShadow: 24,
    p: 4,
};

// AUTO FEE
const degreeFees = {

    "Bác sĩ": 100000,

    "Thạc sĩ": 200000,

    "Tiến sĩ": 300000,
};

const ModalDoctor = ({
    onClose,
    onSuccess
}) => {

    // ==========================================
    // FORM
    // ==========================================
    const [form, setForm]
        = useState({

            userId: "",

            degree: "",

            consultationFee: "",

            roomGroupId: "",

            roomId: ""
        });

    const [users,
        setUsers]
        = useState([]);

    const [roomGroups,
        setRoomGroups]
        = useState([]);

    const [rooms,
        setRooms]
        = useState([]);

    // ==========================================
    // LOAD DATA
    // ==========================================
    useEffect(() => {

        const fetchData =
            async () => {

                try {

                    // USERS
                    const userRes =
                        await userService
                            .getByRole();

                    setUsers(
                        userRes.data
                        ?? userRes
                    );

                    // ROOM GROUPS
                    const roomRes =
                        await roomGroupService
                            .getAll();

                    setRoomGroups(
                        roomRes.data
                        ?? roomRes
                    );

                } catch (err) {

                    console.error(err);
                }
            };

        fetchData();

    }, []);

    // ==========================================
    // HANDLE CHANGE
    // ==========================================
    const handleChange =
        async (e) => {

            const {
                name,
                value
            } = e.target;

            // AUTO FEE
            if (name === "degree") {

                setForm({

                    ...form,

                    degree: value,

                    consultationFee:
                        degreeFees[value]
                });

                return;
            }

            // ROOM GROUP
            if (name === "roomGroupId") {

                setForm({

                    ...form,

                    roomGroupId: value,

                    roomId: ""
                });

                try {

                    const res =
                        await roomService
                            .getByRoomGroup(value);

                    setRooms(
                        res.data
                        ?? res
                    );

                } catch (err) {

                    console.error(err);
                }

                return;
            }

            setForm({

                ...form,

                [name]: value
            });
        };

    // ==========================================
    // SUBMIT
    // ==========================================
    const handleSubmit =
        async () => {

            if (

                !form.userId ||

                !form.degree ||

                !form.consultationFee ||

                !form.roomId

            ) {

                toast.warning(
                    "Vui lòng nhập đầy đủ thông tin!"
                );

                return;
            }

            try {

                await doctorService.create({

                    userId:
                        form.userId,

                    degree:
                        form.degree,

                    consultationFee:
                        form.consultationFee,

                    roomId:
                        form.roomId
                });

                toast.success(
                    "Thêm bác sĩ thành công!"
                );

                onSuccess?.();

                onClose();

            } catch (err) {

                console.error(err);

                toast.error(
                    err.response?.data?.message
                    || "Không thể thêm bác sĩ"
                );
            }
        };

    return (
        <Modal
            open
            onClose={onClose}
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

                        <LocalHospitalIcon />

                    </Avatar>

                    <Box>

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >

                            Thêm bác sĩ mới

                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >

                            Thêm tài khoản bác sĩ

                        </Typography>

                    </Box>

                </Stack>

                <Divider sx={{ mb: 3 }} />

                {/* FORM */}
                <Stack spacing={3}>

                    {/* USER */}
                    <TextField
                        select
                        label="Chọn tài khoản"
                        name="userId"
                        fullWidth
                        value={form.userId}
                        onChange={handleChange}
                    >

                        {users.map((u) => (

                            <MenuItem
                                key={u.userId}
                                value={u.userId}
                            >

                                {u.fullName}
                                {" — "}
                                {u.email}

                            </MenuItem>

                        ))}

                    </TextField>

                    {/* DEGREE */}
                    <TextField
                        select
                        label="Trình độ"
                        name="degree"
                        fullWidth
                        value={form.degree}
                        onChange={handleChange}
                    >

                        <MenuItem value="Bác sĩ">

                            Bác sĩ

                        </MenuItem>

                        <MenuItem value="Thạc sĩ">

                            Thạc sĩ

                        </MenuItem>

                        <MenuItem value="Tiến sĩ">

                            Tiến sĩ

                        </MenuItem>

                    </TextField>

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

                    {/* ROOM */}
                    <TextField
                        select
                        label="Phòng khám"
                        name="roomId"
                        fullWidth
                        value={form.roomId}
                        onChange={handleChange}
                        disabled={!form.roomGroupId}
                    >

                        {rooms.map((r) => (

                            <MenuItem
                                key={r.roomId}
                                value={r.roomId}
                            >

                                {r.roomGroup?.groupName}
                                {" - "}
                                {r.roomName}

                            </MenuItem>

                        ))}

                    </TextField>

                    {/* CONSULTATION FEE */}
                    <TextField
                        label="Phí khám"
                        name="consultationFee"
                        type="number"
                        fullWidth
                        value={form.consultationFee}
                        onChange={handleChange}
                        helperText="Có thể chỉnh sửa phí khám"
                    />

                    {/* BUTTON */}
                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="flex-end"
                    >

                        <Button
                            variant="contained"
                            color="error"
                            onClick={onClose}
                            sx={{
                                borderRadius: 2,
                                px: 3
                            }}
                        >

                            Đóng

                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            sx={{
                                borderRadius: 2,
                                px: 3
                            }}
                        >

                            Lưu

                        </Button>

                    </Stack>

                </Stack>

            </Box>

        </Modal>
    );
};

export default ModalDoctor;
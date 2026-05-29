import React, { useEffect, useState } from "react";

import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Stack,
    Tooltip,
    CircularProgress,
    TextField,
    Avatar,
    Chip,
    InputAdornment
} from "@mui/material";

import SearchIcon
    from "@mui/icons-material/Search";

import MeetingRoomIcon
    from "@mui/icons-material/MeetingRoom";

import EditIcon
    from "@mui/icons-material/Edit";

import DeleteIcon
    from "@mui/icons-material/Delete";

import { FaPlus }
    from "react-icons/fa";

import roomService
    from "../../../services/roomService";

import RegisterRoomModal
    from "./RegisterRoomModal";

import EditRoomModal
    from "./EditRoomModal";

import { toast }
    from "react-toastify";

const RoomList = () => {

    const [rooms, setRooms] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [isModalOpen,
        setIsModalOpen]
        = useState(false);

    const [editingRoom,
        setEditingRoom]
        = useState(null);

    // ==========================================
    // LOAD ROOMS
    // ==========================================
    const loadRooms = async () => {

        setLoading(true);

        try {

            const res =
                await roomService.getAll();

            const list =
                res.data ?? res;

            setRooms(
                Array.isArray(list)
                    ? list
                    : []
            );

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        loadRooms();

    }, []);

    // ==========================================
    // STATUS CONFIG
    // ==========================================
    const getStatusConfig = (
        status
    ) => {

        switch (status) {

            case "ACTIVE":

                return {
                    label: "Hoạt động",
                    color: "success"
                };

            case "MAINTENANCE":

                return {
                    label: "Bảo trì",
                    color: "warning"
                };

            case "INACTIVE":

                return {
                    label:
                        "Ngưng hoạt động",
                    color: "error"
                };

            default:

                return {
                    label:
                        "Không xác định",
                    color: "default"
                };
        }
    };

    // ==========================================
    // FILTER + SORT
    // ==========================================
    const filteredRooms =
        rooms
            .sort((a, b) =>
                a.roomGroup?.groupName
                    ?.localeCompare(
                        b.roomGroup?.groupName
                    )
            )
            .filter((r) => {

                const keyword =
                    search.toLowerCase();

                return (

                    r.roomName
                        ?.toLowerCase()
                        .includes(keyword)

                    ||

                    r.roomGroup
                        ?.groupName
                        ?.toLowerCase()
                        .includes(keyword)
                );
            });

    // ==========================================
    // DELETE
    // ==========================================
    const handleDelete =
        async (roomId) => {

            if (
                !window.confirm(
                    "Bạn có chắc muốn xóa phòng này?"
                )
            ) {
                return;
            }

            try {

                await roomService
                    .delete(roomId);

                toast.success(
                    "Xóa phòng thành công!"
                );

                loadRooms();

            } catch (err) {

                toast.error(
                    "Không thể xóa phòng!"
                );
            }
        };

    // ==========================================
    // LOADING
    // ==========================================
    if (loading) {

        return (
            <Box
                display="flex"
                justifyContent="center"
                mt={6}
            >

                <CircularProgress />

            </Box>
        );
    }

    return (
        <Box
            sx={{
                p: 4,
                background:
                    "#f5f7fb",
                minHeight: "100vh"
            }}
        >

            {/* HEADER */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 4,
                    background:
                        "linear-gradient(135deg, #1976d2, #42a5f5)",
                    color: "#fff"
                }}
            >

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >

                    <Box>

                        <Typography
                            variant="h5"
                            fontWeight="bold"
                        >

                            Quản lý phòng khám

                        </Typography>

                        <Typography
                            variant="body2"
                        >

                            Tổng số phòng:
                            {" "}

                            <strong>
                                {rooms.length}
                            </strong>

                        </Typography>

                    </Box>

                    <Avatar
                        sx={{
                            bgcolor: "#fff",
                            color: "#1976d2",
                            width: 60,
                            height: 60
                        }}
                    >

                        <MeetingRoomIcon
                            fontSize="large"
                        />

                    </Avatar>

                </Stack>

            </Paper>

            {/* SEARCH + BUTTON */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 4,
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems:
                        "center",
                    gap: 2
                }}
            >

                <TextField
                    size="small"
                    placeholder="Tìm khu phòng hoặc số phòng..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                    sx={{
                        width: 350,
                        bgcolor: "#fff",
                        borderRadius: 2
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">

                                <SearchIcon />

                            </InputAdornment>
                        ),
                    }}
                />

                <Button
                    variant="contained"
                    startIcon={<FaPlus />}
                    onClick={() =>
                        setIsModalOpen(true)
                    }
                    sx={{
                        borderRadius: 2,
                        textTransform:
                            "none",
                        px: 3
                    }}
                >

                    Thêm phòng

                </Button>

            </Paper>

            {/* TABLE */}
            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    borderRadius: 4
                }}
            >

                <Table>

                    <TableHead>

                        <TableRow
                            sx={{
                                background:
                                    "#f1f5f9"
                            }}
                        >

                            <TableCell>

                                <strong>
                                    Khu phòng
                                </strong>

                            </TableCell>

                            <TableCell>

                                <strong>
                                    Số phòng
                                </strong>

                            </TableCell>

                            <TableCell>

                                <strong>
                                    Trạng thái
                                </strong>

                            </TableCell>

                            <TableCell align="center">

                                <strong>
                                    Thao tác
                                </strong>

                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {filteredRooms.length === 0 ? (

                            <TableRow>

                                <TableCell
                                    colSpan={4}
                                    align="center"
                                >

                                    <Box
                                        py={5}
                                    >

                                        <MeetingRoomIcon
                                            sx={{
                                                fontSize: 60,
                                                color:
                                                    "#cbd5e1"
                                            }}
                                        />

                                        <Typography
                                            color="text.secondary"
                                        >

                                            Không có phòng nào

                                        </Typography>

                                    </Box>

                                </TableCell>

                            </TableRow>

                        ) : (

                            filteredRooms.map((r) => (

                                <TableRow
                                    key={r.roomId}
                                    hover
                                    sx={{
                                        transition:
                                            "0.2s",

                                        "&:hover":
                                        {
                                            background:
                                                "#f8fafc"
                                        }
                                    }}
                                >

                                    {/* ROOM GROUP */}
                                    <TableCell>

                                        <Chip
                                            label={
                                                r.roomGroup
                                                    ?.groupName
                                            }
                                            color="primary"
                                            variant="outlined"
                                            sx={{
                                                fontWeight:
                                                    "bold"
                                            }}
                                        />

                                    </TableCell>

                                    {/* ROOM */}
                                    <TableCell>

                                        <Stack
                                            direction="row"
                                            spacing={2}
                                            alignItems="center"
                                        >

                                            <Avatar
                                                sx={{
                                                    bgcolor:
                                                        "#1976d2"
                                                }}
                                            >

                                                <MeetingRoomIcon />

                                            </Avatar>

                                            <Typography
                                                fontWeight="bold"
                                            >

                                                {r.roomName}

                                            </Typography>

                                        </Stack>

                                    </TableCell>

                                    {/* STATUS */}
                                    <TableCell>

                                        <Chip
                                            label={
                                                getStatusConfig(
                                                    r.status
                                                ).label
                                            }
                                            color={
                                                getStatusConfig(
                                                    r.status
                                                ).color
                                            }
                                            size="small"
                                        />

                                    </TableCell>

                                    {/* ACTION */}
                                    <TableCell
                                        align="center"
                                    >

                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            justifyContent="center"
                                        >

                                            {/* EDIT */}
                                            <Tooltip title="Chỉnh sửa phòng">

                                                <IconButton
                                                    color="warning"
                                                    onClick={() =>
                                                        setEditingRoom(r)
                                                    }
                                                >

                                                    <EditIcon />

                                                </IconButton>

                                            </Tooltip>

                                            {/* DELETE */}
                                            <Tooltip title="Xóa phòng">

                                                <IconButton
                                                    color="error"
                                                    onClick={() =>
                                                        handleDelete(
                                                            r.roomId
                                                        )
                                                    }
                                                >

                                                    <DeleteIcon />

                                                </IconButton>

                                            </Tooltip>

                                        </Stack>

                                    </TableCell>

                                </TableRow>
                            ))
                        )}

                    </TableBody>

                </Table>

            </TableContainer>

            {/* MODAL CREATE */}
            {isModalOpen && (

                <RegisterRoomModal
                    onClose={(reload) => {

                        setIsModalOpen(false);

                        if (reload) {

                            loadRooms();
                        }
                    }}
                />
            )}

            {/* MODAL EDIT */}
            {editingRoom && (

                <EditRoomModal
                    room={editingRoom}
                    onClose={() => {

                        setEditingRoom(null);

                        loadRooms();
                    }}
                />
            )}

        </Box>
    );
};

export default RoomList;
import React, { useEffect, useState } from "react";
import roomService from "../../../services/roomService";
import RegisterRoomModal from "./RegisterRoomModal";
import EditRoomModal from "./EditRoomModal";

import {
    Box, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button, IconButton,
    Stack, Tooltip, CircularProgress
} from "@mui/material";

import { FaPlus } from "react-icons/fa";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const RoomList = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);

    const loadRooms = async () => {
        setLoading(true);
        try {
            const res = await roomService.getAll();
            setRooms(Array.isArray(res) ? res : []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRooms();
    }, []);


    const handleOpenModal = () => setIsModalOpen(true);

    const handleCloseModal = (reload = false) => {
        setIsModalOpen(false);
        if (reload) loadRooms();
    };

    const handleEdit = (room) => setEditingRoom(room);

    const handleDelete = async (roomId) => {
        if (!window.confirm("Bạn có chắc muốn xóa phòng này?")) return;
        try {
            await roomService.delete(roomId);
            loadRooms();
        } catch (error) {
            alert("Không thể xóa phòng!");
        }
    };

    if (loading) return <CircularProgress sx={{ m: 4 }} />;

    return (
        <Box sx={{ p: 4 }}>
            <Paper sx={{ p: 2, mb: 3, display: "flex", justifyContent: "space-between" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Quản lý danh sách phòng
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenModal}
                    startIcon={<FaPlus />}
                >
                    Thêm Phòng Mới
                </Button>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                            <TableCell>Mã phòng</TableCell>
                            <TableCell>Tên phòng</TableCell>
                            <TableCell>Khoa</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rooms.map((r) => (
                            <TableRow key={r.roomId} hover>
                                <TableCell>{r.roomId}</TableCell>
                                <TableCell>{r.roomName}</TableCell>
                                <TableCell>{r.department?.name}</TableCell>

                                <TableCell align="center">
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                        <Tooltip title="Sửa thông tin">
                                            <IconButton color="warning" onClick={() => handleEdit(r)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Xóa phòng">
                                            <IconButton color="error" onClick={() => handleDelete(r.roomId)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {isModalOpen && <RegisterRoomModal onClose={handleCloseModal} />}

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

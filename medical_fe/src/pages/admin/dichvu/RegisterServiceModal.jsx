import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Typography,
    Divider,
} from "@mui/material";

import serviceService from "../../../services/servicesServices";
import roomGroupService from "../../../services/roomGroupService";

const RegisterServiceModal = ({ onClose }) => {

    const [roomGroups, setRoomGroups] =
        useState([]);

    const [form, setForm] = useState({
        serviceName: "",
        price: "",
        description: "",
        serviceType: "",
        roomGroupId: "",
    });

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    // =========================
    // LOAD ROOM GROUP
    // =========================
    useEffect(() => {

        const loadRoomGroups =
            async () => {

                try {

                    const res =
                        await roomGroupService
                            .getAll();

                    const data = res ?? [];

                    setRoomGroups(
                        Array.isArray(data)
                            ? data
                            : []
                    );

                } catch (err) {

                    console.error(err);
                }
            };

        loadRoomGroups();

    }, []);

    // =========================
    // CHANGE
    // =========================
    const handleChange = (e) => {

        const { name, value } =
            e.target;

        setForm((prev) => ({
            ...prev,
            [name]:
                name === "price"
                    ? Number(value)
                    : value,
        }));
    };

    // =========================
    // VALIDATE
    // =========================
    const validateForm = () => {

        if (
            !form.serviceName.trim()
        ) {
            return "Tên dịch vụ không được để trống";
        }

        if (
            !form.price ||
            Number(form.price) <= 0
        ) {
            return "Giá dịch vụ phải lớn hơn 0";
        }

        if (!form.serviceType) {
            return "Vui lòng chọn loại dịch vụ";
        }

        if (
            form.serviceType ===
            "DOCTOR" &&
            !form.roomGroupId
        ) {
            return "Vui lòng chọn chuyên khoa";
        }

        return "";
    };

    // =========================
    // SUBMIT
    // =========================
    const handleSubmit =
        async () => {

            setError("");

            const validateMsg =
                validateForm();

            if (validateMsg) {

                setError(
                    validateMsg
                );

                return;
            }

            try {

                setLoading(true);

                await serviceService
                    .createDichVu(
                        form
                    );

                onClose(true);

            } catch (err) {

                const msg =
                    err?.response
                        ?.data
                        ?.message ||
                    err?.response
                        ?.data ||
                    "Không thể thêm dịch vụ";

                setError(msg);

            } finally {

                setLoading(false);
            }
        };

    return (
        <Dialog
            open
            onClose={() =>
                onClose(false)
            }
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                Thêm dịch vụ mới
            </DialogTitle>

            <DialogContent>

                <Stack
                    spacing={2}
                    sx={{ mt: 1 }}
                >

                    {error && (

                        <Alert severity="error">
                            {error}
                        </Alert>

                    )}

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Khai báo dịch vụ
                        khám hoặc cận
                        lâm sàng
                    </Typography>

                    <Divider />

                    <TextField
                        label="Tên dịch vụ"
                        name="serviceName"
                        value={
                            form.serviceName
                        }
                        onChange={
                            handleChange
                        }
                        fullWidth
                        required
                    />

                    <FormControl
                        fullWidth
                        required
                    >
                        <InputLabel>
                            Loại dịch vụ
                        </InputLabel>
                        <Select
                            name="serviceType"
                            value={form.serviceType}
                            label="Loại dịch vụ"
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>Chọn loại dịch vụ</em>
                            </MenuItem>

                            <MenuItem value="DOCTOR">
                                Dịch vụ bác sĩ
                            </MenuItem>

                            <MenuItem value="CLINICAL">
                                Cận lâm sàng
                            </MenuItem>
                        </Select>

                    </FormControl>

                    <FormControl
                        fullWidth
                        required
                    >
                        <InputLabel>
                            Chuyên khoa
                        </InputLabel>

                        <Select
                            name="roomGroupId"
                            value={form.roomGroupId}
                            label="Chuyên khoa"
                            onChange={handleChange}
                        >

                            {roomGroups.map(group => (

                                <MenuItem
                                    key={group.roomGroupId}
                                    value={group.roomGroupId}
                                >
                                    {group.groupName}
                                </MenuItem>

                            ))}

                        </Select>

                    </FormControl>

                    <TextField
                        label="Giá dịch vụ (VNĐ)"
                        name="price"
                        type="number"
                        value={
                            form.price
                        }
                        onChange={
                            handleChange
                        }
                        fullWidth
                        required
                        inputProps={{
                            min: 0,
                        }}
                    />

                    <TextField
                        label="Mô tả"
                        name="description"
                        value={
                            form.description
                        }
                        onChange={
                            handleChange
                        }
                        fullWidth
                        multiline
                        rows={3}
                    />

                </Stack>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={() =>
                        onClose(false)
                    }
                    disabled={loading}
                >
                    Hủy
                </Button>

                <Button
                    variant="contained"
                    onClick={
                        handleSubmit
                    }
                    disabled={loading}
                >
                    {loading
                        ? "Đang lưu..."
                        : "Lưu"}
                </Button>

            </DialogActions>

        </Dialog >
    );
};

export default RegisterServiceModal
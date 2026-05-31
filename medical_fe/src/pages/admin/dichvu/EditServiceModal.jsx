import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Stack,
    Typography,
    Alert,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

import serviceService from "../../../services/servicesServices";
import roomGroupService from "../../../services/roomGroupService";

const EditServiceModal = ({
    service,
    onClose,
}) => {

    const [roomGroups,
        setRoomGroups] =
        useState([]);

    const [form, setForm] =
        useState({
            serviceName:
                service.serviceName || "",

            price:
                service.price || 0,

            description:
                service.description || "",

            roomGroupId:
                service.roomGroupId || "",
        });

    const [error, setError] =
        useState("");

    const [loading,
        setLoading] =
        useState(false);

    // =========================
    // LOAD ROOM GROUPS
    // =========================
    useEffect(() => {

        const loadRoomGroups =
            async () => {

                try {

                    const res =
                        await roomGroupService
                            .getAll();

                    const data =
                        res?.data?.data ??
                        res?.data ??
                        [];

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
    const handleChange =
        (e) => {

            const {
                name,
                value,
            } = e.target;

            setForm(
                (prev) => ({
                    ...prev,
                    [name]:
                        name ===
                            "price"
                            ? Number(
                                value
                            )
                            : value,
                })
            );
        };

    // =========================
    // VALIDATE
    // =========================
    const validateForm =
        () => {

            if (
                !form.serviceName
                    .trim()
            ) {
                return "Tên dịch vụ không được để trống";
            }

            if (
                !form.price ||
                Number(
                    form.price
                ) <= 0
            ) {
                return "Giá dịch vụ phải lớn hơn 0";
            }

            if (
                service.serviceType ===
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

            const msg =
                validateForm();

            if (msg) {

                setError(msg);

                return;
            }

            try {

                setLoading(
                    true
                );

                await serviceService
                    .updateDichVu(
                        service.serviceId,
                        form
                    );

                onClose(true);

            } catch (err) {

                const errorMsg =
                    err?.response
                        ?.data
                        ?.message ||
                    err?.response
                        ?.data ||
                    "Cập nhật dịch vụ thất bại";

                setError(
                    errorMsg
                );

            } finally {

                setLoading(
                    false
                );
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
                Cập nhật dịch vụ
            </DialogTitle>

            <DialogContent>

                <Stack
                    spacing={2}
                    sx={{
                        mt: 1,
                    }}
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
                        Chỉnh sửa
                        thông tin
                        dịch vụ
                    </Typography>

                    <Divider />

                    <Typography
                        variant="body2"
                    >
                        Loại dịch vụ:
                        {" "}
                        <strong>
                            {service.serviceType ===
                                "CLINICAL"
                                ? "Cận lâm sàng"
                                : "Dịch vụ bác sĩ"}
                        </strong>
                    </Typography>

                    {service.serviceType ===
                        "DOCTOR" && (

                            <FormControl
                                fullWidth
                                required
                            >
                                <InputLabel>
                                    Chuyên khoa
                                </InputLabel>

                                <Select
                                    name="roomGroupId"
                                    value={
                                        form.roomGroupId
                                    }
                                    label="Chuyên khoa"
                                    onChange={
                                        handleChange
                                    }
                                >

                                    {roomGroups.map(
                                        (
                                            group
                                        ) => (

                                            <MenuItem
                                                key={
                                                    group.roomGroupId
                                                }
                                                value={
                                                    group.roomGroupId
                                                }
                                            >
                                                {
                                                    group.groupName
                                                }
                                            </MenuItem>

                                        )
                                    )}

                                </Select>

                            </FormControl>

                        )}

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

                    <TextField
                        label="Giá (VNĐ)"
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
                    disabled={
                        loading
                    }
                >
                    Hủy
                </Button>

                <Button
                    variant="contained"
                    onClick={
                        handleSubmit
                    }
                    disabled={
                        loading
                    }
                >
                    {loading
                        ? "Đang cập nhật..."
                        : "Cập nhật"}
                </Button>

            </DialogActions>

        </Dialog>
    );
};

export default EditServiceModal;
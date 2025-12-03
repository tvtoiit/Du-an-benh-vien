import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

export default function DetailModal({ open, onClose, title, data }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent dividers>
                {Object.entries(data).map(([key, value]) => (
                    <p key={key} style={{ marginBottom: "8px" }}>
                        <strong>{key}:</strong> {value}
                    </p>
                ))}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="contained">
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
}

"use client"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import 'react-toastify/dist/ReactToastify.css';


interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string,
    description: string,
    button: string
}

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, description, button }: Props) {
    return (
        <Dialog open={isOpen} onClose={onClose} component='form'>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{description}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error" variant="contained">Cancelar</Button>
                <Button onClick={onConfirm} color="success" variant="contained">{button}</Button>
            </DialogActions>
        </Dialog>
    )
}
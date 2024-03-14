"use client"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import 'react-toastify/dist/ReactToastify.css';


interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function ConfirmDialog({ isOpen, onClose, onConfirm }: Props) {
    return (
        <Dialog open={isOpen} onClose={onClose} component='form'>
            <DialogTitle>Confirmação</DialogTitle>
            <DialogContent>
                <DialogContentText>Você tem certeza que quer deletar esse usuário?</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={onConfirm} color="error">Deletar</Button>
            </DialogActions>
        </Dialog>
    )
}
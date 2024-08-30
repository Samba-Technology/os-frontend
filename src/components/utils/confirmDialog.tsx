"use client"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip } from "@mui/material";
import 'react-toastify/dist/ReactToastify.css';
import CloseIcon from '@mui/icons-material/Close';

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
            <DialogTitle className="flex justify-between items-center">
                {title}
                <div className="cursor-pointer" onClick={() => {
                    onClose();
                }}>
                    <Tooltip title="Fechar">
                        <CloseIcon />
                    </Tooltip>
                </div>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>{description}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onConfirm} color="error" variant="contained">{button}</Button>
            </DialogActions>
        </Dialog>
    )
}
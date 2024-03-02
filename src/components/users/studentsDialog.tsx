"use client"
import yup from "@/helpers/validation";
import { UsersService } from "@/services/api/users.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function StudentsDialog({ isOpen, onClose }: Props) {
    return (
        <Dialog open={isOpen} onClose={onClose} component="form" >
            <DialogTitle>Criação de estudante</DialogTitle>
            <DialogContent className="flex flex-col w-full gap-2">
                <DialogContentText>Insira algumas informações do estudante que será criado.</DialogContentText>
                <Box className="flex gap-1">
                    <TextField className="w-full" label="Nome Completo" variant="filled" />
                    <TextField className="w-1/3" label="Série" variant="filled" />
                </Box>
                <TextField label="RA (Opicional)" variant="filled" />
            </DialogContent>
            <DialogActions className="flex gap-1">
                <Button variant="contained" onClick={onClose}>Cancel</Button>
                <Button variant="contained" type="submit">Criar</Button>
            </DialogActions>
        </Dialog>
    )
}
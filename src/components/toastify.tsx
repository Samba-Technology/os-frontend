"use client"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

export default function Toastify() {
    return (
        <ToastContainer theme="dark" autoClose={5000} toastClassName="toasty-body"/>
    )
}
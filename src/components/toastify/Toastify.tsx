"use client"
import { ThemeContext } from "@/contexts/theme/themeContext";
import { useContext } from "react";
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

export default function Toastify() {
    const { theme } = useContext(ThemeContext);
  
    return (
      <ToastContainer
        theme={theme.palette.mode === 'light' ? 'light' : 'dark'}
        autoClose={5000}
        toastClassName="toasty-body"
      />
    );
  }
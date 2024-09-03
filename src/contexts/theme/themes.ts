import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#7A4BFD",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "::-webkit-scrollbar": {
          width: "10px",
        },
        "::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },
        "::-webkit-scrollbar-thumb": {
          backgroundColor: "#888",
          borderRadius: "4px",
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#7A4BFD",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& input:-webkit-autofill": {
            backgroundColor: "#f3e5f5",
            WebkitTextFillColor: "inherit",
            WebkitBoxShadow: "0 0 0 100px inherit inset",
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        "::-webkit-scrollbar": {
          width: "10px",
        },
        "::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },
        "::-webkit-scrollbar-thumb": {
          backgroundColor: "#555",
          borderRadius: "4px"
        },
      },
    },
  },
});

export { lightTheme, darkTheme };

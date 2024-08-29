import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#7A4BFD"
    }
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#7A4BFD"
    }
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& input:-webkit-autofill': {
            backgroundColor: '#f3e5f5',
            WebkitTextFillColor: 'inherit',
            WebkitBoxShadow: '0 0 0 100px inherit inset',
          },
        },
      },
    },
  },

});

export { lightTheme, darkTheme };

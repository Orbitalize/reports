import {
  CssBaseline,
  GlobalStyles,
  Interpolation,
  PaletteMode,
  Theme,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type ThemeContextProps = {
  toggleColorMode: () => void;
  colorMode: PaletteMode;
};
export const ThemeContext = createContext<ThemeContextProps>({
  toggleColorMode: () => {},
  colorMode: "light",
});

export const useTheme = () => useContext(ThemeContext);

export const CustomThemeProvider = ({
  children,
}: PropsWithChildren<unknown>) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [mode, setMode] = useState<PaletteMode>("light");

  useEffect(
    () => setMode(prefersDarkMode ? "dark" : "light"),
    [prefersDarkMode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
        components: {
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
            },
          },
        },
      }),
    [mode]
  );

  const globalStyles: Interpolation<Theme> = (theme) => {
    const borderColor =
      theme.palette.mode === "light"
        ? theme.palette.grey[500]
        : theme.palette.grey[700];
    return {
      body: {
        backgroundColor:
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
      },
      // table: {
      //   borderCollapse: "collapse",
      //   border: `1px solid ${borderColor}`,
      // },
      // th: {
      //   border: `1px solid ${borderColor}`,
      //   backgroundColor:
      //     theme.palette.mode === "light"
      //       ? theme.palette.grey[300]
      //       : theme.palette.grey[800],
      // },
      // td: {
      //   border: `1px solid ${borderColor}`,
      //   padding: 8,
      // },
    };
  };

  const toggleColorMode = () =>
    setMode((prevMode: PaletteMode) =>
      prevMode === "light" ? "dark" : "light"
    );

  return (
    <ThemeContext.Provider value={{ toggleColorMode, colorMode: mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={globalStyles} />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

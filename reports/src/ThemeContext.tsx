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
    return {
      body: {
        backgroundColor:
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[800],
      },
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

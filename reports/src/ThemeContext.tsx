import {
  CssBaseline,
  GlobalStyles,
  Interpolation,
  PaletteMode,
  Theme,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import {
  PropsWithChildren,
  createContext,
  useContext,
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
  const [mode, setMode] = useState<PaletteMode>("light");

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
      table: {
        borderCollapse: "collapse",
        border: `1px solid ${borderColor}`,
      },
      th: {
        border: `1px solid ${borderColor}`,
        backgroundColor:
          theme.palette.mode === "light"
            ? theme.palette.grey[300]
            : theme.palette.grey[800],
      },
      td: {
        border: `1px solid ${borderColor}`,
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

import {
  AppBar,
  Toolbar,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  SelectChangeEvent,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Capability, Report } from "./capabilityTypes";
import { useTheme } from "../ThemeContext";
import { useLocation, useNavigate } from "react-router-dom";

type CapabilityTableHeaderProps = {
  capability: Capability;
  report: Report;
};

export const CapabilityTableHeader = ({
  capability,
  report,
}: CapabilityTableHeaderProps) => {
  const { colorMode, toggleColorMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const ussp = parseInt(location.pathname.split("/")[1]) || 0;

  const handleUsspSelect = (event: SelectChangeEvent<number>) => {
    console.log(event.target.value);
    const id = event.target.value;
    navigate(`/${id}`);
  };
  return (
    <AppBar position="fixed" enableColorOnDark>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {report.name} - {capability.name}
        </Typography>
        <FormControl
          size="small"
          sx={(theme) => ({
            color: theme.palette.primary.contrastText,
            bgColor: theme.palette.primary.main,
          })}
        >
          <InputLabel
            id="ussp-select-label"
            sx={(theme) => ({
              color: theme.palette.primary.contrastText,
              "&.Mui-focused": {
                color: theme.palette.primary.contrastText,
              },
            })}
          >
            USSP
          </InputLabel>

          <Select
            label="USSP"
            value={ussp}
            onChange={handleUsspSelect}
            labelId="ussp-select-label"
            sx={(theme) => ({
              color: theme.palette.primary.contrastText,
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.contrastText,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.contrastText,
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.contrastText,
              },
              "& .MuiSvgIcon-root": {
                color: theme.palette.primary.contrastText,
              },
            })}
          >
            {report.participants?.map((p, i) => (
              <MenuItem value={i} key={i}>
                {p}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
          {colorMode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

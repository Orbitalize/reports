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
    const id = event.target.value;
    navigate(`/${id}`);
  };
  return (
    <AppBar position="fixed" enableColorOnDark color="default">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {report.name} - {capability.name}
        </Typography>
        <FormControl size="small">
          <InputLabel id="ussp-select-label">USSP</InputLabel>

          <Select
            label="USSP"
            value={ussp}
            onChange={handleUsspSelect}
            labelId="ussp-select-label"
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

import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Capability, Report } from "./capabilityTypes";
import { useTheme } from "../ThemeContext";
import { ParticipantSelector } from "./ParticipantSelector";

type CapabilityTableHeaderProps = {
  capability: Capability;
  report: Report;
};

export const CapabilityTableHeader = ({
  capability,
  report,
}: CapabilityTableHeaderProps) => {
  const { colorMode, toggleColorMode } = useTheme();
  return (
    <AppBar position="fixed" enableColorOnDark color="default">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {report.name} - {capability.name}
        </Typography>
        <Box>
          <ParticipantSelector report={report} hideIfNoParticipant />
          <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
            {colorMode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

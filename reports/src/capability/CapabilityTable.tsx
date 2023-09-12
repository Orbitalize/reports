import {
  Box,
  Breadcrumbs,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { Capability } from "./capabilityTypes";
import { useMatches, useNavigate } from "react-router-dom";
import { ReactNode } from "react";
import { Report } from "./capabilityTypes";
import { CapabilityTableHeader } from "./CapabilityTableHeader";
import { RequirementTable } from "./RequirementTable";
import { ChildCapabilityTable } from "./ChildCapabilityTable";

type CapabilityTableProps = {
  capability: Capability;
  report: Report;
  participantMissing?: boolean;
};

type CrumbHandle = { crumb: (i?: number | string) => ReactNode };

function CapabilityBreadcrumbs({ capability }: { capability: Capability }) {
  const matches = useMatches();
  const parentCrumbs = matches
    // first get rid of any matches that don't have handle and crumb
    .filter((match) =>
      Boolean((match.handle as CrumbHandle | undefined)?.crumb)
    )
    .slice(0, -1) // Skip last crumb
    .map((match, i) => (match.handle as CrumbHandle).crumb(i))
    .reverse();

  const here = <Typography key={-1}>{capability.name}</Typography>;
  const crumbs = [here, ...parentCrumbs];

  return <Breadcrumbs separator="<=">{crumbs}</Breadcrumbs>;
}

export const CapabilityTable = ({
  capability,
  report,
  participantMissing,
}: CapabilityTableProps) => {
  const navigate = useNavigate();
  if (!capability) {
    return <span>Capability not found</span>;
  }

  return (
    <>
      <CapabilityTableHeader capability={capability} report={report} />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          padding: 8,
          paddingTop: 10,
        }}
      >
        {participantMissing ? (
          <>
            <Typography variant="h3" gutterBottom>
              {report.participants?.length ? "Participants" : "Participant"}
            </Typography>
            <Paper>
              <List>
                {report.participants?.map((p, i) => (
                  <ListItem key={i}>
                    <ListItemButton onClick={() => navigate(`/${i}`)}>
                      <ListItemText primary={p} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </>
        ) : (
          <>
            <CapabilityBreadcrumbs capability={capability} />
            <Typography variant="h4" gutterBottom sx={{ marginTop: 1 }}>
              Requirements
            </Typography>
            <RequirementTable capability={capability} />
            <Typography variant="h4" gutterBottom sx={{ marginTop: 1 }}>
              Child capabilities
            </Typography>
            <ChildCapabilityTable capability={capability} />
          </>
        )}
      </Box>
    </>
  );
};

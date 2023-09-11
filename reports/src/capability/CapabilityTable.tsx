import { Box, Breadcrumbs, Typography } from "@mui/material";
import { Capability } from "./capabilityTypes";
import { useMatches } from "react-router-dom";
import { ReactNode } from "react";
import { Report } from "./capabilityTypes";
import { CapabilityTableHeader } from "./CapabilityTableHeader";
import { RequirementTable } from "./RequirementTable";
import { ChildCapabilityTable } from "./ChildCapabilityTable";

type CapabilityTableProps = {
  capability: Capability;
  report: Report;
  empty?: boolean;
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
  console.log(crumbs);

  return <Breadcrumbs separator="<=">{crumbs}</Breadcrumbs>;
}

export const CapabilityTable = ({
  capability,
  report,
  empty,
}: CapabilityTableProps) => {
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
        {empty ? (
          <Typography variant="overline">
            Select a participant in the top bar
          </Typography>
        ) : (
          <>
            <CapabilityBreadcrumbs capability={capability} />
            <Typography variant="h3" gutterBottom sx={{ marginTop: 1 }}>
              Requirements
            </Typography>
            <RequirementTable capability={capability} />
            <Typography variant="h3" gutterBottom sx={{ marginTop: 1 }}>
              Child capabilities
            </Typography>
            <ChildCapabilityTable capability={capability} />
          </>
        )}
      </Box>
    </>
  );
};

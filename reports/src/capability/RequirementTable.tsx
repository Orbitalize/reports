import { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Dialog,
  DialogContent,
  Typography,
  Link,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Capability, Check, Requirement } from "./capabilityTypes";

const CheckLabel = ({ name, docUrl }: { name: string; docUrl?: string }) => {
  return docUrl ? <Link href={docUrl}>{name}</Link> : <>{name}</>;
};
const CheckStatusTag = ({ check }: { check: Check }) => {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div>
      <Chip
        label={check.result === "pass" ? "PASS" : "FAIL"}
        color={check.result === "pass" ? "success" : "error"}
        onClick={() => setShowDetails(true)}
      />
      <Dialog
        fullWidth
        maxWidth="xl"
        onClose={() => setShowDetails(false)}
        open={showDetails}
      >
        <DialogContent>
          <Typography variant="h2" gutterBottom>
            {check.name} was evaluated in step {check.step.name}
          </Typography>
          <Typography>Details:</Typography>
          <pre>{JSON.stringify(check.details, null, 2)}</pre>
        </DialogContent>
      </Dialog>
    </div>
  );
};
const AggregatedStatusTag = ({ checks }: { checks: Check[] }) => {
  const successfulChecks = checks.reduce(
    (acc, check) => acc + (check.result === "pass" ? 1 : 0),
    0
  );
  const pass = successfulChecks === checks.length;
  const label = pass ? "PASS" : "FAIL";
  return <Chip label={label} color={pass ? "success" : "error"} />;
};

const CheckAggregateRow = ({ checks }: { checks: Check[] }) => {
  const separator = " :: ";
  const checkSource = (
    <>
      <CheckLabel {...checks[0].scenario} />
      {separator}
      <CheckLabel {...checks[0].case} />
      {separator}
      <CheckLabel {...checks[0].step} />
      {separator}
      <CheckLabel name={checks[0].name} />
    </>
  );
  return (
    <TableRow>
      <TableCell style={{ padding: 0 }}>
        <Accordion square disableGutters sx={{ boxShadow: "none" }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              "& .MuiAccordionSummary-content": {
                display: "flex",
                justifyContent: "space-between",
              },
            }}
          >
            <Typography>{checkSource}</Typography>
            <AggregatedStatusTag checks={checks} />
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {checks.map((c) => (
                <CheckStatusTag check={c} />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      </TableCell>
    </TableRow>
  );
};

const getCheckId = (check: Check): string => {
  return [
    check.scenario.name,
    check.case.name,
    check.step.name,
    check.name,
  ].join("-");
};

const checkAggregatedRows = (requirement: Requirement) => {
  // Group checks by ID
  const aggregatedChecks = requirement.checks.reduce((acc, check) => {
    const checkId = getCheckId(check);
    if (checkId in acc) {
      return { ...acc, [checkId]: [...acc[checkId], check] };
    } else {
      return { ...acc, [checkId]: [check] };
    }
  }, {} as Record<string, Check[]>);

  // For each check, display a checkRow
  // Aggregate titles by check ID
  return Object.keys(aggregatedChecks)
    .map((key) => {
      const checks = aggregatedChecks[key];
      return <CheckAggregateRow checks={checks} />;
    })
    .flat();
};
const requirementRow = (requirement: Requirement) => {
  const checks = checkAggregatedRows(requirement);
  const requirementHeader = (
    <TableRow>
      <TableCell rowSpan={checks.length + 1}>{requirement.name}</TableCell>
      {!checks.length && <TableCell>Not tested</TableCell>}
    </TableRow>
  );

  if (checks.length) {
    return [requirementHeader, ...checks];
  } else {
    return [requirementHeader];
  }
};

export const RequirementTable = ({
  capability,
}: {
  capability: Capability;
}) => {
  const requirements = capability.requirements
    .sort((a, b) => (a.name > b.name ? 1 : -1))
    .flatMap((r) => requirementRow(r))
    .flat();

  if (!requirements.length) {
    return <Typography variant="overline">No requirements</Typography>;
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>Requirement</TableCell>
            <TableCell>Test Check</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{requirements}</TableBody>
      </Table>
    </TableContainer>
  );
};

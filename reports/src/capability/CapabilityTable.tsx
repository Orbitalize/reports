import { Link as RouterLink } from "react-router-dom";
import {
  Breadcrumbs,
  Button,
  Link,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";
import { Capability, Check, Requirement } from "./capabilityTypes";
import { useEffect, useState } from "react";
import { useMatches } from "react-router-dom";
import { ReactNode } from "react";

type CapabilityTableProps = {
  capability: Capability;
};

export const CheckLabel = ({
  name,
  docUrl,
}: {
  name: string;
  docUrl?: string;
}) => {
  return docUrl ? <Link href={docUrl}>{name}</Link> : <>{name}</>;
};

export const CheckRow = ({ check }: { check: Check }) => {
  const [showDetails, setShowDetails] = useState(false);
  const separator = " :: ";
  const checkSource = (
    <>
      <CheckLabel {...check.scenario} />
      {separator}
      <CheckLabel {...check.case} />
      {separator}
      <CheckLabel {...check.step} />
      {separator}
      <CheckLabel name={check.name} />
    </>
  );

  return (
    <tr>
      <td>{checkSource}</td>
      <td className={check.result === "pass" ? "pass" : "fail"}>
        {check.result === "pass" ? "PASS" : "FAIL"}
      </td>
      <td>
        <Button onClick={() => setShowDetails(true)}>Open</Button>
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
      </td>
    </tr>
  );
};

const requirementRow = (requirement: Requirement) => {
  const checks = requirement.checks.map((c) => <CheckRow check={c} />);
  const requirementHeader = (
    <tr>
      <td rowSpan={checks.length + 1}>{requirement.name}</td>
      {!checks.length && <td colSpan={3}>Not tested</td>}
    </tr>
  );

  if (checks.length) {
    return [requirementHeader, ...checks];
  } else {
    return [requirementHeader];
  }
};

export const ChildCapabilityRow = ({
  capability,
  path,
}: {
  capability: Capability;
  path: string;
}) => {
  return (
    <tr>
      <td colSpan={2}>
        <Link to={path} component={RouterLink}>
          {capability.name} ({capability.participant_id})
        </Link>
      </td>
      <td
        className={capability.result === "pass" ? "pass" : "fail"}
        colSpan={2}
      >
        {capability.result === "pass" ? "PASS" : "FAIL"}
      </td>
    </tr>
  );
};

const ChildCapabilityHeader = () => {
  return (
    <tr>
      <th colSpan={2}>Child Capability</th>
      <th colSpan={2}>Result</th>
    </tr>
  );
};

export const CapabilityRows = ({ capability }: { capability: Capability }) => {
  const requirements = capability.requirements
    .flatMap((r) => requirementRow(r))
    .flat();
  const childCapabilities = capability.childCapabilities.map((c, i) => (
    <ChildCapabilityRow capability={c} path={i.toString()} />
  ));
  const childTable = childCapabilities
    ? [<ChildCapabilityHeader />, ...childCapabilities]
    : [];

  const allRows = [...requirements, ...childTable];
  return [
    <tr>
      <td rowSpan={allRows.length + 1}>
        {capability.name} ({capability.participant_id})
      </td>
    </tr>,
    ...allRows,
  ];
};

export const CapabilityDebug = ({ capability }: { capability: Capability }) => {
  // return <code><pre style={{textAlign:"left"}}>{JSON.stringify(capability, null, 2)}</pre></code>;
  useEffect(
    () => console.info("Displayed Capability: ", capability),
    [capability]
  );
  return <></>;
};

type CrumbHandle = { crumb: () => ReactNode };

function CapabilityBreadcrumbs() {
  const matches = useMatches();
  const crumbs = matches
    // first get rid of any matches that don't have handle and crumb
    .filter((match) =>
      Boolean((match.handle as CrumbHandle | undefined)?.crumb)
    )
    .slice(0, -1) // Skip last crumb
    .map((match) => (match.handle as CrumbHandle).crumb())
    .reverse();

  return <Breadcrumbs separator="<=">{crumbs}</Breadcrumbs>;
}

export const CapabilityTable = ({ capability }: CapabilityTableProps) => {
  if (!capability) {
    return <span>Capability not found</span>;
  }
  return (
    <>
      <CapabilityBreadcrumbs />
      <table>
        <thead>
          <tr>
            <th>Capability</th>
            <th>Requirement</th>
            <th>Test Check</th>
            <th>Result</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <CapabilityRows capability={capability} />
        </tbody>
      </table>
      <CapabilityDebug capability={capability} />
    </>
  );
};

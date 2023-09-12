import {
  Chip,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Capability } from "./capabilityTypes";

export const ChildCapabilityRow = ({
  capability,
  path,
}: {
  capability: Capability;
  path: string;
}) => {
  const pass = capability.result === "pass";
  return (
    <TableRow>
      <TableCell>
        <Link to={path} component={RouterLink}>
          {capability.name}
        </Link>
      </TableCell>
      <TableCell>
        <Chip
          label={pass ? "PASS" : "FAIL"}
          color={pass ? "success" : "error"}
        />
      </TableCell>
    </TableRow>
  );
};

export const ChildCapabilityTable = ({
  capability,
}: {
  capability: Capability;
}) => {
  const childCapabilities = capability.childCapabilities.map((c, i) => (
    <ChildCapabilityRow key={c.name} capability={c} path={i.toString()} />
  ));

  if (!childCapabilities.length) {
    return <Typography variant="overline">No child capability</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>Child Capability</TableCell>
            <TableCell>Result</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{childCapabilities}</TableBody>
      </Table>
    </TableContainer>
  );
};

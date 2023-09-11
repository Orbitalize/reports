import { Chip, Link } from "@mui/material";
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
    <tr>
      <td>
        <Link to={path} component={RouterLink}>
          {capability.name} ({capability.participant_id})
        </Link>
      </td>
      <td>
        <Chip
          label={pass ? "PASS" : "FAIL"}
          color={pass ? "success" : "error"}
        />
      </td>
    </tr>
  );
};

export const ChildCapabilityTable = ({
  capability,
}: {
  capability: Capability;
}) => {
  const childCapabilities = capability.childCapabilities.map((c, i) => (
    <ChildCapabilityRow capability={c} path={i.toString()} />
  ));

  return (
    <table>
      <thead>
        <tr>
          <th>Child Capability</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>{childCapabilities}</tbody>
    </table>
  );
};

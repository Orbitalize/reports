import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { Report } from "./capabilityTypes";

export const ParticipantSelector = ({
  report,
  hideIfNoParticipant,
}: {
  report: Report;
  hideIfNoParticipant?: boolean;
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const ussp = parseInt(location.pathname.split("/")[1]);

  const handleUsspSelect = (event: SelectChangeEvent<number>) => {
    const id = event.target.value;
    navigate(`/${id}`);
  };
  if (hideIfNoParticipant && Number.isNaN(ussp)) {
    return null;
  }
  return (
    <FormControl size="small">
      <InputLabel id="ussp-select-label">USSP</InputLabel>
      <Select
        displayEmpty={true}
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
  );
};

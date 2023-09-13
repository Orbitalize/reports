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
  const participantId = parseInt(location.pathname.split("/")[1]);

  const handleParticipantSelect = (event: SelectChangeEvent<number>) => {
    const id = event.target.value;
    navigate(`/${id}`);
  };
  if (hideIfNoParticipant && Number.isNaN(participantId)) {
    return null;
  }
  return (
    <FormControl size="small">
      <InputLabel id="ussp-select-label">Participant</InputLabel>
      <Select
        displayEmpty={true}
        label="Participant"
        value={participantId}
        onChange={handleParticipantSelect}
        sx={{ minWidth: 90 }}
      >
        {report.participants?.map((p, i) => (
          <MenuItem value={i} key={i} sx={{ minWidth: 30 }}>
            {p}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

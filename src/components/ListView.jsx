import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";

export function ListView({
  coeffs,
  cstatus,
  editA,
  editB,
  editC,
  editS,
  editCoeffs,
  editCstatus,
}) {
  function round3(val) {
    return Math.round(val * 1000) / 1000;
  }

  function drawCard(coeff, status, index) {
    const norm = Math.sqrt(coeff[0] * coeff[0] + coeff[1] * coeff[1]);
    return (
      <ListItem disablePadding key={`card_${index}`}>
        <Stack direction="row">
          <TextField
            label="a"
            value={round3(coeff[0])}
            type="number"
            inputProps={{ step: 0.02 }}
            onChange={(e) => {
              editA(index, parseFloat(e.target.value));
            }}
            variant="outlined"
          />
          <TextField
            label="b"
            value={round3(coeff[1])}
            type="number"
            inputProps={{ step: 0.02 }}
            onChange={(e) => {
              editB(index, parseFloat(e.target.value));
            }}
            variant="outlined"
          />
          <TextField
            label="c"
            value={round3(coeff[2])}
            type="number"
            inputProps={{ step: 0.02 }}
            onChange={(e) => {
              editC(index, parseFloat(e.target.value));
            }}
            variant="outlined"
          />
          <TextField
            label="s"
            value={round3(coeff[3])}
            type="number"
            inputProps={{ step: 0.02 }}
            onChange={(e) => {
              editS(index, parseFloat(e.target.value));
            }}
            variant="outlined"
          />
          <span style={{ width: "50px", display: "inline-block" }}></span>
          <TextField
            label="Norm"
            value={round3(norm)}
            type="number"
            inputProps={{ min: 0.001, step: 0.05 }}
            onChange={(e) => {
              const normNew = parseFloat(e.target.value);
              editCoeffs(
                index,
                (coeff[0] / norm) * normNew,
                (coeff[1] / norm) * normNew,
                (coeff[2] / norm) * normNew
              );
            }}
            variant="outlined"
          />
          <Checkbox
            checked={status}
            onChange={(e) => {
              editCstatus(index, e.target.checked);
            }}
          />
        </Stack>
      </ListItem>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 600, bgcolor: "background.paper" }}>
      <List
        sx={{
          maxHeight: 500,
          overflow: "auto",
        }}
      >
        {coeffs.map((coeff, index) => drawCard(coeff, cstatus[index], index))}
      </List>
    </Box>
  );
}

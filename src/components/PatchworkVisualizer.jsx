import { useState, useRef, useEffect } from "react";
import { Application } from "@pixi/react";
import { ShaderPlane } from "./ShaderPlane";
import { LineEditor } from "./LineEditor";
import { ListView } from "./ListView";
import Box from "@mui/material/Box";
import { produce } from "immer";

import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Slider from "@mui/material/Slider";
import MuiInput from "@mui/material/Input";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";

import { BlockMath } from "react-katex";

export default function PatchworkVisualizer() {
  const dim = 700;
  const MAX_NUM_LINES = 256;

  const [coeffs, setCoeffs] = useState([]);
  const [cstatus, setCstatus] = useState([]);
  const coeffsArray = useRef(
    new Float32Array(
      Array.from({ length: MAX_NUM_LINES }, () =>
        Array.from({ length: 4 }, () => 0),
      ).flat(),
    ),
  );
  const cstatusArray = useRef(
    new Float32Array(
      Array.from({ length: MAX_NUM_LINES }, () =>
        Array.from({ length: 2 }, () => true),
      ).flat(),
    ),
  );

  const addCoeffs = (a, b, c) => {
    if (coeffs.length > MAX_NUM_LINES) {
      setAlert(true);
    } else {
      const index = coeffs.length;
      coeffsArray.current[index * 4] = a;
      coeffsArray.current[index * 4 + 1] = b;
      coeffsArray.current[index * 4 + 2] = c;
      coeffsArray.current[index * 4 + 3] = 1;

      setCoeffs([...coeffs, [a, b, c, 1]]);

      cstatusArray.current[index * 2] = true;
      setCstatus([...cstatus, true]);
    }
  };

  const editCoeffs = (index, a, b, c) => {
    coeffsArray.current[index * 4] = a;
    coeffsArray.current[index * 4 + 1] = b;
    coeffsArray.current[index * 4 + 2] = c;

    setCoeffs((prev) =>
      produce(prev, (draft) => {
        draft[index][0] = a;
        draft[index][1] = b;
        draft[index][2] = c;
      }),
    );
  };

  const editA = (index, a) => {
    coeffsArray.current[index * 4] = a;

    setCoeffs((prev) =>
      produce(prev, (draft) => {
        draft[index][0] = a;
      }),
    );
  };

  const editB = (index, b) => {
    coeffsArray.current[index * 4 + 1] = b;
    setCoeffs((prev) =>
      produce(prev, (draft) => {
        draft[index][1] = b;
      }),
    );
  };

  const editC = (index, c) => {
    coeffsArray.current[index * 4 + 2] = c;
    setCoeffs((prev) =>
      produce(prev, (draft) => {
        draft[index][2] = c;
      }),
    );
  };

  const editS = (index, s) => {
    coeffsArray.current[index * 4 + 3] = s;
    setCoeffs((prev) =>
      produce(prev, (draft) => {
        draft[index][3] = s;
      }),
    );
  };

  const editCstatus = (index, s) => {
    cstatusArray.current[index * 2] = s;
    setCstatus((prev) =>
      produce(prev, (draft) => {
        draft[index] = s;
      }),
    );
  };

  const appRef = useRef();
  const editorColor = "#6f6f6fff";
  const [editorPos, setEditorPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const canvas = appRef.current.getCanvas();
    const rect = canvas.getBoundingClientRect();
    const absoluteX = rect.left + window.scrollX;
    const absoluteY = rect.top + window.scrollY;
    setEditorPos(absoluteX, absoluteY);
  }, []);

  const [beta, setBeta] = useState(50);
  const [softmax, setSoftmax] = useState(true);
  const [serialize, setSerialize] = useState(false);
  const [coeffsStr, setCoeffsStr] = useState("");
  const [alert, setAlert] = useState(false);
  const [boundary, setBoundary] = useState(false);
  const [initN, setInitN] = useState(3);
  const [control, setControl] = useState(true);
  const [active, setActive] = useState(true);
  const [free, setFree] = useState(false);
  const [clear, setClear] = useState(false);
  const [padEps, setPadEps] = useState(true);
  const [k, setK] = useState(1);
  const [eps, setEps] = useState(0.1);

  return (
    <>
      <Stack direction="col" spacing={2}>
        <Grid container spacing={2} sx={{ alignItems: "center" }}>
          <Grid>
            <p>Beta</p>
          </Grid>
          <Grid size="grow">
            <Slider
              sx={{ width: 100 }}
              value={Math.log(beta)}
              min={0}
              max={Math.log(10000)}
              step={0.1}
              // scale={(x) => 10 ** x}
              onChange={(e, newValue) => setBeta(Math.exp(newValue))}
            />
          </Grid>
          <Grid>
            <MuiInput
              label="Beta"
              value={beta}
              type="number"
              sx={{ width: 60 }}
              inputProps={{ step: 10, min: 1, max: 10000 }}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setBeta(Math.max(1, val));
              }}
              variant="outlined"
            />
          </Grid>
        </Grid>
        <FormControlLabel
          control={
            <Switch
              checked={softmax}
              onChange={(e, newValue) => setSoftmax(newValue)}
            />
          }
          label="Softmax"
        />
        <span style={{ width: "10px", display: "inline-block" }}></span>
        <FormControlLabel
          control={
            <Switch
              checked={padEps}
              onChange={(e, newValue) => setPadEps(newValue)}
            />
          }
          label="Pad Epsilon"
        />
        <span style={{ width: "10px", display: "inline-block" }}></span>
        <TextField
          label="N"
          defaultValue={initN}
          type="number"
          sx={{ width: 100 }}
          inputProps={{ min: 1, step: 1 }}
          onChange={(e) => {
            setInitN(parseInt(e.target.value));
          }}
          id="fullWidth"
        />
        <span style={{ width: "10px", display: "inline-block" }}></span>
        <Button
          variant="outlined"
          onClick={() => {
            // Initialization conflicts with padding
            setPadEps(false);

            let index = 0;

            const initCoeffs = [];
            const status = [];
            for (let k = -initN; k < initN + 1; k++) {
              for (let l = -initN; l < initN + 1; l++) {
                const a = k;
                const b = l;
                const c = -(k * k + l * l + k * l) * 0.1 + 1;

                let s = 1;
                if (k != -initN && k != initN && l != -initN && l != initN) {
                  s = -1;
                }

                coeffsArray.current[index * 4] = a;
                coeffsArray.current[index * 4 + 1] = b;
                coeffsArray.current[index * 4 + 2] = c;
                coeffsArray.current[index * 4 + 3] = s;

                initCoeffs.push([a, b, c, s]);

                cstatusArray.current[index * 2] = true;
                status.push(true);

                index++;
              }
            }
            setCoeffs(initCoeffs);
            setCstatus(status);
          }}
        >
          Initialize
        </Button>
        <span style={{ width: "10px", display: "inline-block" }}></span>
        <Button
          variant="outlined"
          onClick={() => {
            setCoeffsStr(JSON.stringify(coeffs));
            setSerialize(true);
          }}
        >
          Serialize
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setCoeffs([]);
            setCstatus([]);
          }}
        >
          Reset
        </Button>
      </Stack>

      <Dialog
        open={serialize}
        onClose={() => {
          setSerialize(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <TextField
            fullWidth
            label="Coeffs"
            defaultValue={coeffsStr}
            onChange={(e) => {
              setCoeffsStr(e.target.value);
            }}
            id="fullWidth"
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(coeffs));
              setSerialize(false);
            }}
          >
            Copy
          </Button>
          <Button
            // disabled
            onClick={() => {
              const newCoeffs = JSON.parse(coeffsStr);
              const status = [];
              for (let index = 0; index < newCoeffs.length; index++) {
                coeffsArray.current[index * 4] = newCoeffs[index][0];
                coeffsArray.current[index * 4 + 1] = newCoeffs[index][1];
                coeffsArray.current[index * 4 + 2] = newCoeffs[index][2];
                coeffsArray.current[index * 4 + 3] = newCoeffs[index][3];
                cstatusArray.current[index * 2] = true;
                status.push(true);
              }
              setCstatus(status);
              setCoeffs(newCoeffs);
              setSerialize(false);
            }}
          >
            Load
          </Button>
        </DialogActions>
      </Dialog>

      <Stack direction="col" spacing={2}>
        <Grid container spacing={2} sx={{ alignItems: "center" }}>
          <Grid>
            <p>Zoom</p>
          </Grid>
          <Grid size="grow">
            <Slider
              sx={{ width: 100 }}
              value={k}
              min={0.1}
              max={10}
              step={0.1}
              // scale={(x) => 10 ** x}
              onChange={(e, newValue) => setK(newValue)}
            />
          </Grid>
          <Grid>
            <MuiInput
              label="K"
              value={k}
              type="number"
              sx={{ width: 50 }}
              inputProps={{ step: 0.1, min: 1, max: 10 }}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setK(Math.max(0, val));
              }}
              variant="outlined"
            />
          </Grid>
        </Grid>
        <span style={{ width: "10px", display: "inline-block" }}></span>
        <Grid container spacing={2} sx={{ alignItems: "center" }}>
          <Grid>
            <p>Line width</p>
          </Grid>
          <Grid size="grow">
            <Slider
              sx={{ width: 50 }}
              value={Math.log(eps)}
              min={Math.log(0.01)}
              max={Math.log(10)}
              step={0.01}
              // scale={(x) => 10 ** x}
              onChange={(e, newValue) => setEps(Math.exp(newValue))}
            />
          </Grid>
          <Grid>
            <MuiInput
              label="Epsilon"
              value={Math.round(eps * 1000) / 1000}
              type="number"
              sx={{ width: 50 }}
              inputProps={{ step: 0.01, min: 0.01, max: 1 }}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setEps(Math.max(0.01, val));
              }}
              variant="outlined"
            />
          </Grid>
        </Grid>
        <FormControlLabel
          control={
            <Switch
              checked={control}
              onChange={(e, newValue) => setControl(newValue)}
            />
          }
          label="Design Lines"
        />
        <FormControlLabel
          control={
            <Switch
              checked={boundary}
              onChange={(e, newValue) => setBoundary(newValue)}
            />
          }
          label="Equality Lines"
        />
        <FormControlLabel
          control={
            <Switch
              checked={active}
              onChange={(e, newValue) => setActive(newValue)}
            />
          }
          label="Candidate Segments"
        />
        {/* <FormControlLabel
          control={
            <Switch
              checked={free}
              onChange={(e, newValue) => setFree(newValue)}
            />
          }
          label="Draw"
        />
        <span style={{ width: "10px", display: "inline-block" }}></span>
        <Button
          variant="outlined"
          onClick={() => {
            setClear(!clear);
          }}
        >
          Clear
        </Button> */}
      </Stack>

      {/* <Box
        sx={{
          width: 100,
          height: 60,
        }}
      >
        {softmax ? (
          <BlockMath
            math={"F(x,y)=\frac{1}{\beta}\log\sum_i^ns_i\exp(\beta(a_ix+b_iy+c_i))"}
          />
        ) : (
          <BlockMath
            math={String.raw`f(x, y) = \max_{i:s_i>0} \{a_i x + b_i y + c_i\} - \max_{i:s_i<0} \{a_i x + b_i y + c_i\} = 0`}
          />
        )}
      </Box> */}

      {alert && <Alert severity="warning">Cannot add more lines.</Alert>}

      <Box display="flex" gap={2} alignItems="flex-start">
        <LineEditor
          editorPos={editorPos}
          editorColor={editorColor}
          dim={dim}
          addCoeffs={addCoeffs}
          editCoeffs={editCoeffs}
          coeffs={coeffs}
          cstatus={cstatus}
          boundary={boundary}
          control={control}
          free={free}
          clear={clear}
          k={k}
        />
        <Application ref={appRef} width={dim} height={dim} preference="webgl">
          <ShaderPlane
            limit={MAX_NUM_LINES}
            coeffsArray={coeffsArray}
            cstatusArray={cstatusArray}
            dim={dim}
            count={coeffs.length}
            beta={beta}
            softmax={softmax}
            active={active}
            padEps={padEps}
            k={k}
            eps={eps}
          />
        </Application>
        <ListView
          coeffs={coeffs}
          cstatus={cstatus}
          editA={editA}
          editB={editB}
          editC={editC}
          editS={editS}
          editCoeffs={editCoeffs}
          editCstatus={editCstatus}
        />
      </Box>
    </>
  );
}

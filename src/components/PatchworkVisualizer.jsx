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

  const amongUsCoeffs = [
    [-0.55433166, -0.9329911, 0.3987917, 0.99999964],
    [-0.57354707, -1.3151859, 0.17843115, 0.99999964],
    [-0.29138783, -1.6864872, -0.039087, 0.99999964],
    [0.03944795, -1.7647891, -0.08587396, 0.99999964],
    [0.6067775, -1.6922879, -0.1146732, 0.99999964],
    [0.8979069, -1.5317135, -0.09503102, 0.99999857],
    [0.8791579, -1.5143505, -0.07341152, 0.99999964],
    [0.9216845, -1.3278505, 0.03999251, 0.99999964],
    [1.1550208, -1.1016475, 0.0566777, 0.99999964],
    [1.0652157, -1.0817294, 0.11609447, 0.99999785],
    [1.305855, -0.6792654, 0.15110743, 0.9999994],
    [1.1490159, -0.28778213, 0.3415937, 0.99999964],
    [1.1363534, -0.42613962, 0.3250813, 0.9999994],
    [1.2354863, -0.11419956, 0.30847716, 0.99999964],
    [0.9092025, 1.1760161, 0.1398747, 0.9999993],
    [1.2254193, 1.293752, -0.10025895, 0.99999964],
    [0.9704336, 1.5135123, -0.11499977, 0.99999964],
    [0.8902344, 1.6291468, -0.16831177, 0.99999964],
    [0.8428741, 1.5754937, -0.10509354, 0.9999993],
    [0.5765671, 1.3408829, 0.1609304, 0.9999988],
    [0.5205412, 1.3130753, 0.19454473, 0.99999964],
    [0.2721128, 0.9346366, 0.45622787, 0.99999964],
    [-0.05336088, 1.1699936, 0.35020354, 0.99999964],
    [-0.02210792, 1.6615894, 0.00301468, 0.99999964],
    [-0.24355009, 1.7902124, -0.12279564, 0.9999989],
    [-0.32970518, 1.7199357, -0.07364488, 0.99999905],
    [-0.6709323, 1.5547656, -0.02347487, 0.99999964],
    [-0.6261182, 1.5688881, -0.02002996, 0.99999964],
    [-0.6890856, 1.2600068, 0.17770344, 0.99999964],
    [-0.75935394, 0.9749217, 0.31155467, 0.99999964],
    [-0.71019316, 0.4551824, 0.51524806, 0.99999964],
    [-0.6916564, -0.21311049, 0.5624127, 0.99999964],
    [0.11475186, -1.0367321, 0.4212447, 0.99999964],
    [0.03593601, -0.79413164, 0.5351919, 0.99999964],
    [0.08046269, -0.5544821, 0.61471736, 0.99999964],
    [0.17315188, -0.3710358, 0.65130424, 0.99999964],
    [0.17849062, -0.28464478, 0.6650927, 0.99999964],
    [0.718979, -0.2897198, 0.5430112, 0.9999995],
    [1.1817589, -0.38053185, 0.30789042, 0.99999964],
    [1.3012153, -0.6597707, 0.16131824, 0.99999964],
    [1.3048941, -0.68744564, 0.14866227, 0.99996305],
    [1.3125637, -0.8304999, 0.09021175, 0.99999964],
    [1.1634582, -1.0515122, 0.07625937, 0.99999964],
    [1.0680918, -1.0269474, 0.14455676, 0.9999993],
    [0.5723885, -1.12756, 0.29343992, 0.9999995],
    [0.20346135, -1.1350769, 0.3608415, 0.99999964],
    [-0.7728589, -0.6368674, 0.44258085, 0.99999964],
    [-0.7001092, -0.63292485, 0.47023973, 0.99999964],
    [-1.1789204, -0.54828644, 0.27060094, 0.99999964],
    [-1.1736445, -0.55898255, 0.27031153, 0.9999995],
    [-1.222497, 0.9484284, 0.09466261, 0.9999995],
    [-1.2178221, 0.94787097, 0.09803665, 0.9999995],
    [-0.9947014, 1.0536321, 0.16826653, 0.99999964],
    [-0.8769361, 0.9586354, 0.27125552, 0.99999964],
    [-1.1576409, 0.07017218, 0.3580626, 0.99999964],
    [-0.88602203, 0.4473543, 0.44690686, 0.99999964],
    [-0.85792464, -0.22443573, 0.4966765, 0.99999964],
    [-0.78484213, -0.9659835, 0.30581886, -0.99999964],
    [-0.6575003, -1.3274624, 0.14442033, -0.9999993],
    [-0.6302099, -1.3356277, 0.14800292, -0.99999964],
    [-0.3053383, -1.7082318, -0.0595994, -0.99999964],
    [0.03892687, -1.8304517, -0.14488411, -0.99999964],
    [0.6105317, -1.7024509, -0.12444091, -0.99999964],
    [0.8979637, -1.5318676, -0.0951615, -0.99999964],
    [1.0775219, -1.3818963, -0.07456404, -0.99999964],
    [1.1680921, -1.1187245, 0.03967583, -0.99999964],
    [1.3487592, -0.84279305, 0.06076109, -0.99999964],
    [1.4714892, -0.73590404, 0.01619577, -0.9999995],
    [1.4408029, -0.6407857, 0.07163179, -0.99999964],
    [1.3455013, -0.27366987, 0.22282189, -0.9999995],
    [1.2383093, -0.11432964, 0.30672556, -0.99999964],
    [1.5299425, 1.2352765, -0.2737038, -0.9999995],
    [1.2257389, 1.2938098, -0.10048211, -0.99999964],
    [1.120052, 1.6257446, -0.28117114, -0.99999964],
    [0.8958891, 1.6573532, -0.19400239, -0.99999964],
    [0.7780511, 1.769121, -0.24081641, -0.99999964],
    [0.38281545, 1.4495112, 0.13114655, -0.99999964],
    [0.45989996, 1.3164736, 0.20704883, -0.99999964],
    [0.2551148, 1.1746061, 0.331603, -0.9999989],
    [0.25391525, 1.1915113, 0.32281795, -0.99999964],
    [0.13254635, 1.6724582, -0.0107832, -0.9999995],
    [0.01368808, 1.7006623, -0.02989566, -0.99999964],
    [-0.24226336, 1.8040378, -0.1350283, -0.99999964],
    [-0.36330882, 1.8693895, -0.21364188, -0.99999964],
    [-0.72475624, 1.6840765, -0.147277, -0.99999964],
    [-0.6927425, 1.561651, -0.03640389, -0.99999964],
    [-0.79311377, 1.2683926, 0.13328117, -0.99999964],
    [-0.8349946, 0.95959705, 0.2885964, -0.99999964],
    [-0.77737516, 0.45251164, 0.4909432, -0.99999964],
    [-0.75571644, -0.220522, 0.53811884, -0.99999964],
    [0.15621985, -1.0093038, 0.43269983, -0.99999964],
    [0.07520014, -0.79384094, 0.5342152, -0.99999964],
    [0.11283405, -0.56593263, 0.60997164, -0.99999964],
    [0.20902705, -0.39728, 0.642902, -0.99999964],
    [0.2080584, -0.38789442, 0.6445734, -0.99999964],
    [0.71611667, -0.31649187, 0.5400508, -0.9999995],
    [1.1354461, -0.42619404, 0.32566887, -0.99999964],
    [1.244329, -0.6631571, 0.19618094, -0.99999964],
    [1.1864812, -0.78143054, 0.18857479, -0.99999964],
    [1.0594746, -1.0099322, 0.15790969, -0.9999995],
    [0.57035697, -1.1014739, 0.3086053, -0.9999995],
    [0.21963571, -1.0633469, 0.39831993, -0.99999964],
    [-0.7525965, -0.636101, 0.4507947, -0.99999964],
    [-0.8023604, -0.9645938, 0.299788, -0.99999964],
    [-1.1790171, -0.5483259, 0.27052793, -0.9999994],
    [-1.2921182, -0.7868476, 0.12078238, -0.99999964],
    [-1.6004667, -0.50546336, -0.01125795, -0.99999964],
    [-1.4340155, 0.97776705, -0.05994475, -0.99999964],
    [-1.5839198, 0.06294935, 0.06537902, -0.99999964],
    [-1.2461926, 1.0789566, 0.01317954, -0.9999995],
    [-1.2582237, 0.9892561, 0.05291522, -0.9999995],
    [-1.0062464, 1.1068162, 0.13381779, -0.99999964],
    [-0.77039254, 0.97461504, 0.30751562, -0.99999964],
    [-0.777375, 0.45251182, 0.49094322, -0.99999964],
    [-0.7238001, -0.21422054, 0.5507726, -0.99999964],
  ];

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

  const [beta, setBeta] = useState(50);
  const [softmax, setSoftmax] = useState(false);
  const [serialize, setSerialize] = useState(false);
  const [coeffsStr, setCoeffsStr] = useState("");
  const [alert, setAlert] = useState(false);
  const [boundary, setBoundary] = useState(false);
  const [initN, setInitN] = useState(3);
  const [control, setControl] = useState(false);
  const [active, setActive] = useState(true);
  const [free, setFree] = useState(false);
  const [clear, setClear] = useState(false);
  const [padEps, setPadEps] = useState(false);
  const [k, setK] = useState(1);
  const [eps, setEps] = useState(0.1);

  useEffect(() => {
    const status = [];
    for (let index = 0; index < amongUsCoeffs.length; index++) {
      coeffsArray.current[index * 4] = amongUsCoeffs[index][0];
      coeffsArray.current[index * 4 + 1] = amongUsCoeffs[index][1];
      coeffsArray.current[index * 4 + 2] = amongUsCoeffs[index][2];
      coeffsArray.current[index * 4 + 3] = amongUsCoeffs[index][3];
      cstatusArray.current[index * 2] = true;
      status.push(true);
    }
    setCstatus(status);
    setCoeffs(amongUsCoeffs);

    const canvas = appRef.current.getCanvas();
    const rect = canvas.getBoundingClientRect();
    const absoluteX = rect.left + window.scrollX;
    const absoluteY = rect.top + window.scrollY;
    setEditorPos(absoluteX, absoluteY);
  }, []);

  return (
    <>
      <Stack direction="col" spacing={2}>
        {/* <Grid container spacing={2} sx={{ alignItems: "center" }}>
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
        </Grid> */}
        {/* <FormControlLabel
          control={
            <Switch
              checked={softmax}
              onChange={(e, newValue) => setSoftmax(newValue)}
            />
          }
          label="Softmax"
        />
        <span style={{ width: "10px", display: "inline-block" }}></span> */}
        {/* <FormControlLabel
          control={
            <Switch
              checked={padEps}
              onChange={(e, newValue) => setPadEps(newValue)}
            />
          }
          label="Pad Epsilon"
        /> */}
        {/* <span style={{ width: "10px", display: "inline-block" }}></span>
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
        /> */}
        {/* <span style={{ width: "10px", display: "inline-block" }}></span> */}
        {/* <Button
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
        </Button> */}
        <span style={{ width: "10px", display: "inline-block" }}></span>
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
              const status = [];
              for (let index = 0; index < amongUsCoeffs.length; index++) {
                coeffsArray.current[index * 4] = amongUsCoeffs[index][0];
                coeffsArray.current[index * 4 + 1] = amongUsCoeffs[index][1];
                coeffsArray.current[index * 4 + 2] = amongUsCoeffs[index][2];
                coeffsArray.current[index * 4 + 3] = amongUsCoeffs[index][3];
                cstatusArray.current[index * 2] = true;
                status.push(true);
              }
              setCstatus(status);
              setCoeffs(amongUsCoeffs);
              setSerialize(false);
            }}
          >
            Reset
          </Button>
        </Grid>
        {/* <FormControlLabel
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
        /> */}
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
        {/* <LineEditor
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
        /> */}
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

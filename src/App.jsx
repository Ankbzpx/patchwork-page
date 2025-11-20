import "./App.css";
import SplitViewer from "./components/SplitViewer";
import FullscreenCanvas from "./components/FullscreenCanvas";
import { PerspectiveCamera } from "@react-three/drei";
import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const roofList = [
  "BK39_500_012028_0009",
  "BK39_500_012032_0054",
  "BK39_500_014026_0009",
  "BK39_500_015031_0034",
  "CG10_500_048076_0052",
  "CG10_500_048073_0008",
  "CG10_500_048067_0009",
  "CG10_500_048063_0002",
  "CG10_500_045072_0039",
  "CG10_500_044069_0003",
  "CG10_500_044065_0005",
  "CG10_500_043073_0009",
  "CG10_500_043069_0057",
  "CG10_500_039072_0020",
  "CG10_500_040066_0034",
];

const generalList = [
  "00011602_c087f04c99464bf7ab2380c4",
  "00014489_f4297f01e3434034b7051ebb",
  "00017682_f0ea0b827ae34675a4162390",
  "00018330_ae93a6d282364256a7bb3358",
  "00019935_1935a08cf21c47e1ab92af60",
  "00992087_adbf0b351ea40b651859747a",
  "00993632_eb58d1abb0fc233d8b912460",
  "73133",
  "93497",
  "44234",
  "46459",
  "46461",
  "53159",
  "398259",
  "316358",
];

function App() {
  const [roofItem, setRoofItem] = useState(roofList[0]);
  const [generalItem, setGeneralItem] = useState(generalList[0]);

  return (
    <>
      <FullscreenCanvas />
      <h1>Patchwork: A compact representation for 3D polygonal shapes</h1>
      <p>Anonymous Authors</p>
      <div className="teaser">
        <img src="./images/teaser.jpg" width="100%" height="100%" />
      </div>
      <h1 className="mid">Abstract</h1>
      <div className="abstract">
        <p>
          We introduce Patchwork, a new general-purpose shape representation
          capable of modeling 2D and 3D geometry with a very small number of
          parameters. Patchwork is grounded in a rigorous mathematical
          framework, providing provable complexity bounds and the ability to
          approximate arbitrary shapes with arbitrary precision in any
          dimension. We propose an efficient gradient-based optimization scheme
          to fit Patchwork representations to 2D and 3D data, along with a novel
          regularization loss that progressively prunes redundant elements,
          yielding near-optimal compactness after convergence. Our approach
          offers fast fitting performance, a smaller number of required
          parameters compared to existing alternatives, and native support for
          inside-outside classification. With a small additional computational
          cost, Patchwork can also approximate signed distance fields, making it
          a versatile and compact representation for geometric learning and
          reconstruction tasks, and with future potential for 3D generation.
        </p>
      </div>
      <span style={{ height: "50px", display: "inline-block" }}></span>
      <h1 className="mid">Results</h1>
      <p style={{ textAlign: "left" }}>Roof Modeling</p>
      <Box sx={{ width: 300 }}>
        <FormControl fullWidth>
          <InputLabel>Model</InputLabel>
          <Select
            value={roofItem}
            label="Model"
            onChange={(e) => setRoofItem(e.target.value)}
          >
            {roofList.map((item, index) => {
              return (
                <MenuItem key={index} value={item}>
                  {item}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
      <SplitViewer modelName={roofItem} category={"roof"} />
      <span style={{ height: "50px", display: "inline-block" }}></span>
      <p style={{ textAlign: "left" }}>ABC and Thingi10k</p>
      <Box sx={{ width: 300 }}>
        <FormControl fullWidth>
          <InputLabel>Model</InputLabel>
          <Select
            value={generalItem}
            label="Model"
            onChange={(e) => setGeneralItem(e.target.value)}
          >
            {generalList.map((item, index) => {
              return (
                <MenuItem key={index} value={item}>
                  {item}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
      <SplitViewer
        modelName={generalItem}
        category={"general"}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </>
  );
}

export default App;

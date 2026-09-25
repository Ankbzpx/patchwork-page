import "./App.css";
import PatchworkVisualizer from "./components/PatchworkVisualizer";
import SplitViewer from "./components/SplitViewer";
import FullscreenCanvas from "./components/FullscreenCanvas";
import { PerspectiveCamera } from "@react-three/drei";
import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faFileCode } from "@fortawesome/free-solid-svg-icons";

const roofList = [
  "BJ39_500_099049_0005",
  "BK39_500_014026_0009",
  "BK39_500_014030_0013",
  "CG10_500_035060_0007",
  "CG10_500_037056_0018",
  "CG10_500_040066_0028",
  "CG10_500_041067_0015",
  "CG10_500_044065_0005",
  "CG10_500_049074_0064",
  "CG10_500_049069_0046",
];

const generalList = [
  "00010218_4769314c71814669ba5d3512",
  "00011563_26a622427a024bf3af381ee6",
  "00014221_57e4213b31844b5b95cc62cd",
  "00015685_bca56983eee140db9aa4c9a1",
  "00017682_f0ea0b827ae34675a4162390",
  "00019152_71752f2bc5bc4c6388aece57",
  "00016606_3d6966cd42eb44ab8f4224f2",
  "00017012_cd8dbafbc2a3422eb55090d7",
  "00993706_f8bc5c196ab9685d0182bbed",
  "00993722_a1f027f5424cd7a5f7bcf3a9",
  "398259",
  "316358",
  "274379",
  "86848",
  "83229",
  "77245",
  "75496",
  "72879",
  "54725",
  "53159",
];

const shapenetList = [
  "d23eecb0437107756c63b8b48495261a",
  "c930760585e923cbdeee898eeed8aea9",
  "d1aed86c38d9ea6761462fc0fa9b0bb4",
  "d284b73d5983b60f51f77a6d7299806",
  "d1948365bbed9de270bb6bcb670ecdf5",
  "d16bb6b2f26084556acbef8d3bef8f28",
  "cddbf3a55a623e423002761e7a3ba3bd",
  "d04816fe3c531b66f647317afa6ffdd4",
  "cfffdac8ecda7575de208b4547dba0e",
  "ceaacadde93c2be6ee138bcc5a7d5853",
];

function App() {
  const [roofItem, setRoofItem] = useState(roofList[0]);
  const [generalItem, setGeneralItem] = useState(generalList[0]);
  const [shapenetItem, setShapenetItem] = useState(shapenetList[0]);

  return (
    <>
      <FullscreenCanvas />
      <h1>
        Patchwork: A Polyhedral Implicit Representation <br></br>for Highly
        Detailed 3D Shapes
      </h1>
      <p>Anonymous authors</p>
      <h1 className="mid">Abstract</h1>
      <div className="abstract">
        <p>
          We introduce patchwork, a highly expressive shape representation that
          explicitly encodes 3D shapes as unions of polyhedra while admitting a
          simple closed-form zero-level-set equation. It is grounded in a
          rigorous mathematical framework that yields provable complexity bounds
          and guarantees approximation of arbitrary shapes to arbitrary
          precision. To fit patchwork to a given shape, we pair conventional
          gradient-based optimization with a novel combinatorial matching
          scheme. Experiments show that our approach achieves superior quality
          with only 17–34\% as many parameters as existing alternatives on
          average, and scales to highly detailed artist-created assets.
          Patchwork further supports explicit polygonalization and conforming
          volume mesh extraction, making it a versatile, scalable, yet compact
          representation for downstream tasks, with potential for geometric
          learning.
        </p>
      </div>
      <Stack
        direction="row"
        sx={{
          justifyContent: "center",
        }}
      >
        <Box
          component="img"
          src="./images/teaser.jpg"
          sx={{ height: "600px", width: "auto", display: "block" }}
        />
        <Box
          component="img"
          src="./images/normal.jpg"
          sx={{ height: "600px", width: "auto", display: "block" }}
        />
      </Stack>
      <span style={{ height: "50px", display: "inline-block" }}></span>
      <h1 className="mid">Visualizer</h1>
      <PatchworkVisualizer />
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
      <span style={{ height: "50px", display: "inline-block" }}></span>
      <p style={{ textAlign: "left" }}>ShapeNet</p>
      <Box sx={{ width: 300 }}>
        <FormControl fullWidth>
          <InputLabel>Model</InputLabel>
          <Select
            value={shapenetItem}
            label="Model"
            onChange={(e) => setShapenetItem(e.target.value)}
          >
            {shapenetList.map((item, index) => {
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
        modelName={shapenetItem}
        category={"shapenet"}
        rotation={[0, 0, 0]}
      />
    </>
  );
}

export default App;

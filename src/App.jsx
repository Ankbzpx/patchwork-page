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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faFileCode } from "@fortawesome/free-solid-svg-icons";

const roofList = [
  "CG10_500_049069_0046",
  "CG10_500_048075_0011",
  "CG10_500_048073_0034",
  "CG10_500_048067_0009",
  "CG10_500_045072_0039",
  "CG10_500_045068_0041",
  "CG10_500_045065_0012",
  "CG10_500_044065_0005",
  "CG10_500_043069_0057",
  "CG10_500_042073_0025",
  "CG10_500_042071_0037",
  "CG10_500_042065_0033",
  "CG10_500_042060_0021",
  "CG10_500_041069_0004",
  "CG10_500_041067_0015",
  "CG10_500_040075_0008",
  "CG10_500_040072_0039",
  "CG10_500_040066_0034",
  "CG10_500_038069_0028",
  "CG10_500_038065_0001",
];

const generalList = [
  "00994034_9299b4c10539bb6b50b162d7",
  "00993706_f8bc5c196ab9685d0182bbed",
  "00993520_252f32a9edf1094f9b436c94",
  "00992294_c5390f6bb4e80a940dae7c15",
  "00992087_adbf0b351ea40b651859747a",
  "00991916_78dc1680035fad414f8faec4",
  "00991357_6cc4a08efbae6c2c09cff23e",
  "00019203_1bcd132f82c84761b4e9851d",
  "00018330_ae93a6d282364256a7bb3358",
  "00017014_fbef9df8f24940a0a2df6ccb",
  "00015685_bca56983eee140db9aa4c9a1",
  "00014489_f4297f01e3434034b7051ebb",
  "00014221_57e4213b31844b5b95cc62cd",
  "00011827_73c6505f827541168d5410e4",
  "00010218_4769314c71814669ba5d3512",
  "527631",
  "316358",
  "274379",
  "93497",
  "88053",
  "75810",
  "75658",
  "73133",
  "72879",
  "64444",
  "59941",
  "54725",
  "47984",
  "46461",
  "44234",
];

function App() {
  const [roofItem, setRoofItem] = useState(roofList[0]);
  const [generalItem, setGeneralItem] = useState(generalList[0]);

  return (
    <>
      <FullscreenCanvas />
      <h1>Patchwork: A compact representation for 3D polygonal shapes</h1>
      <a>Ruichen Zheng</a>
      {", "}
      <a href="http://1zb.github.io">Biao Zhang</a>
      {", "}
      <a>Michael Birsak</a>
      {", "}
      <a href="https://users.mccme.ru/mskopenkov/">Mikhail Skopenkov</a>
      {", "}
      <a href="http://peterwonka.net">Peter Wonka</a>
      <br />
      King Abdullah University of Science and Technology
      <div class="vspacer">
        <span class="link-block">
          <a href="https://arxiv.org/abs/2605.16266">
            <FontAwesomeIcon icon={faFilePdf} />
            <span>Preprint</span>
          </a>
        </span>
        <span style={{ width: "10px", display: "inline-block" }}></span>
        <span>
          <a href="https://github.com/Ankbzpx/patchwork-experiment">
            <FontAwesomeIcon icon={faFileCode} />
            <span>Code</span>
          </a>
        </span>
      </div>
      <h1 className="mid">Abstract</h1>
      <div className="abstract">
        <p>
          We introduce Patchwork, a new general-purpose shape representation
          capable of modeling 2D and 3D geometry with a small number of
          parameters. Patchwork is grounded in a rigorous mathematical
          framework, providing provable complexity bounds and the ability to
          approximate arbitrary shapes with arbitrary precision in any
          dimension. We propose an efficient gradient-based optimization scheme
          to fit Patchwork representations to 2D and 3D data, along with a novel
          regularization loss that progressively prunes redundant elements,
          yielding high compactness after convergence. Our approach offers fast
          fitting performance, a fraction of the required parameters compared to
          existing alternatives, and native support for inside-outside
          classification, making it a versatile and compact representation for
          geometric learning and reconstruction tasks, with future potential for
          3D generation.
        </p>
      </div>
      <div className="teaser">
        <img src="./images/teaser.png" width="100%" height="100%" />
      </div>
      <span style={{ height: "50px", display: "inline-block" }}></span>
      <h1 className="mid">Visualizer</h1>
      <PatchworkVisualizer/>
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

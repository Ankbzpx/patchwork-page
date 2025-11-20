import { createRoot } from "react-dom/client";
import Stack from "@mui/material/Stack";
import {
  View,
  useGLTF,
  Environment,
  OrbitControls,
  AccumulativeShadows,
  RandomizedLight,
  PerspectiveCamera,
  ScreenQuad,
} from "@react-three/drei";
import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const floatsCount = {
  BK39_500_012028_0009: 135,
  BK39_500_012032_0054: 90,
  BK39_500_014026_0009: 155,
  BK39_500_015031_0034: 135,
  CG10_500_048076_0052: 145,
  CG10_500_048073_0008: 95,
  CG10_500_048067_0009: 110,
  CG10_500_048063_0002: 120,
  CG10_500_045072_0039: 145,
  CG10_500_044069_0003: 80,
  CG10_500_044065_0005: 120,
  CG10_500_043073_0009: 120,
  CG10_500_043069_0057: 130,
  CG10_500_039072_0020: 100,
  CG10_500_040066_0034: 95,
  "00011602_c087f04c99464bf7ab2380c4": 1900,
  "00014489_f4297f01e3434034b7051ebb": 3605,
  "00017682_f0ea0b827ae34675a4162390": 4675,
  "00018330_ae93a6d282364256a7bb3358": 2895,
  "00019935_1935a08cf21c47e1ab92af60": 1890,
  "00992087_adbf0b351ea40b651859747a": 3610,
  "00993632_eb58d1abb0fc233d8b912460": 3670,
  73133: 3345,
  93497: 4010,
  44234: 3345,
  46459: 4170,
  46461: 4040,
  53159: 3115,
  398259: 3235,
  316358: 3035,
};

const floatsCount2 = {
  mc: 343,
  rtfa: 343,
  spsr: 360,
  nksr: 360,
  siren: 353,
};

const floatsCount3 = {
  mc: 4096,
  rtfa: 4096,
  spsr: 4500,
  nksr: 4500,
  siren: 4481,
};

const tags = ["mc", "rtfa", "spsr", "nksr", "siren", "ours", "gt"];

const tagMap = {
  mc: "Grid (MC)",
  rtfa: "Grid (RTFA)",
  spsr: "PC (SPSR)",
  nksr: "PC (NKSR)",
  siren: "Siren",
  ours: "Ours",
  gt: "GT",
};

function GLTFModel({ tag, category, modelName, rotation }) {
  const gltf = useGLTF(`./meshes/${tag}/${category}/${modelName}.glb`, true);

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.material.color = new THREE.Color().setRGB(0.184, 0.412, 0.592);
      }
    });
  }, [gltf]);

  return (
    <>
      <primitive
        object={gltf.scene}
        rotation={rotation}
        scale={[2.0, 2.0, 2.0]}
      />
    </>
  );
}

function ModelView({ tag, category, modelName, hdrFile, rotation }) {
  return (
    <div style={{ position: "relative", width: 150, height: 225 }}>
      <View style={{ width: 150, height: 200 }}>
        <GLTFModel
          tag={tag}
          category={category}
          modelName={modelName}
          rotation={rotation}
        />
        <Environment
          files={hdrFile}
          environmentRotation={[0, -Math.PI / 2, 0]}
        />
        <OrbitControls />
      </View>
      <p>{tagMap[tag]}</p>
      {tag != "gt" && (
        <p>
          {tag == "ours"
            ? floatsCount[modelName]
            : category == "roof"
            ? floatsCount2[tag]
            : floatsCount3[tag]}{" "}
          FPs
        </p>
      )}
    </div>
  );
}

export default function SplitViewer({ modelName, category, rotation }) {
  const hdrFile = "./images/qwantani_moon_noon_puresky_1k.hdr";
  return (
    <div>
      <Stack direction="row" spacing={2}>
        {tags.map((tag) => (
          <ModelView
            tag={tag}
            category={category}
            modelName={modelName}
            hdrFile={hdrFile}
            rotation={rotation}
          />
        ))}
      </Stack>
    </div>
  );
}

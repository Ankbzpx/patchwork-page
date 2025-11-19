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

function GLTFModel({ tag, modelName }) {
  const gltf = useGLTF(`./meshes/${tag}/general/${modelName}.glb`, true);

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        console.log(child.material);
        child.material.color = new THREE.Color().setRGB(0.184, 0.412, 0.592);
      }
    });
  }, [gltf]);

  return (
    <>
      <primitive object={gltf.scene} />
    </>
  );
}

function ModelView({ tag, modelName, hdrFile }) {
  return (
    <div style={{ position: "relative", width: 150, height: 225 }}>
      <View style={{ width: 150, height: 200 }}>
        <GLTFModel tag={tag} modelName={modelName} />
        <Environment files={hdrFile} />
        <OrbitControls />
      </View>
      <p>{tagMap[tag]}</p>
    </div>
  );
}

export default function SplitViewer() {
  const hdrFile = "./images/qwantani_moon_noon_puresky_1k.hdr";
  return (
    <div>
      <Stack direction="row" spacing={2}>
        {tags.map((tag) => (
          <ModelView
            tag={tag}
            modelName={"00011602_c087f04c99464bf7ab2380c4"}
            hdrFile={hdrFile}
          />
        ))}
      </Stack>
    </div>
  );
}

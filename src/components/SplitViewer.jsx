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

import { View, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export default function SplitViewer() {
  return (
    // **IMPORTANT** Render with fullscreen canvas then GLScissor
    <Canvas
      eventSource={document.body}
      className="w-full h-full"
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        overflow: "hidden",
      }}
    >
      <View.Port />
    </Canvas>
  );
}

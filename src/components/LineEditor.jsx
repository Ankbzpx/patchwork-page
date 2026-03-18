import { useState, useRef, useEffect } from "react";
import { Stage, Layer, Line, Rect, Circle, Group } from "react-konva";
import { Point2D } from "./point2d";

export function LineEditor({
  editorPos,
  editorColor,
  dim,
  addCoeffs,
  editCoeffs,
  coeffs,
  cstatus,
  boundary,
  control,
  free,
  clear,
  k,
}) {
  function ncToScreen(p) {
    return new Point2D(
      0.5 * (p.x / k + 1) * (dim - 1),
      0.5 * (-p.y / k + 1) * (dim - 1),
    );
  }

  function screenToNC(p) {
    return new Point2D(
      2.0 * k * (p.x / (dim - 1) - 0.5),
      -2.0 * k * (p.y / (dim - 1) - 0.5),
    );
  }

  function computeCoeffs(p, q) {
    p = screenToNC(p);
    q = screenToNC(q);
    let a = p.y - q.y;
    let b = q.x - p.x;
    let c = p.x * q.y - q.x * p.y;
    const norm = Math.sqrt(a * a + b * b);
    return [a / norm, b / norm, c / norm];
  }

  function inBound(val) {
    return val >= -k && val <= k;
  }

  function computeInboundPoints(coeff) {
    const a = coeff[0];
    const b = coeff[1];
    const c = coeff[2];

    let points = [];
    if (inBound((a * k - c) / b)) {
      points.push(ncToScreen(new Point2D(-k, (a * k - c) / b)));
    }
    if (inBound(-(c + a * k) / b)) {
      points.push(ncToScreen(new Point2D(k, -(c + a * k) / b)));
    }
    if (inBound((b * k - c) / a)) {
      points.push(ncToScreen(new Point2D((b * k - c) / a, -k)));
    }
    if (inBound(-(b * k + c) / a)) {
      points.push(ncToScreen(new Point2D(-(b * k + c) / a, k)));
    }
    return [points[0], points[1]];
  }

  function computeNormal(p1, p2, coeff) {
    // Don't change to NC, as it flips y coordinate
    const dir = p1.sub(p2).orth().normalize();
    // Now convert to NC for correct normal computation
    const testPt = screenToNC(p1.add(dir.mul(0.025 * dim)).div(dim));
    const testVal = coeff[0] * testPt.x + coeff[1] * testPt.y + coeff[2];
    return testVal > 0 ? dir : dir.mul(-1);
  }

  function combination(n) {
    const arr = [...Array(n).keys()];
    const combos = [];
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        combos.push([arr[i], arr[j]]);
      }
    }
    return combos;
  }

  function reduced_combination(n) {
    const pos_set = [];
    const neg_set = [];

    for (let i = 0; i < n; i++) {
      const s = coeffs[i][3];
      if (s >= 0) {
        pos_set.push(i);
      } else {
        neg_set.push(i);
      }
    }

    const combos = [];
    for (let i = 0; i < pos_set.length; i++) {
      for (let j = 0; j < neg_set.length; j++) {
        combos.push([pos_set[i], neg_set[j]]);
      }
    }
    return combos;
  }

  function BoundaryLine({ coeff1, coeff2 }) {
    const a = coeff1[0] - coeff2[0];
    const b = coeff1[1] - coeff2[1];
    const c = coeff1[2] - coeff2[2];

    let [p1, p2] = computeInboundPoints([a, b, c]);

    // TODO: I need a better handling...
    if (p1 === undefined) {
      p1 = new Point2D(0, 0);
    }
    if (p2 === undefined) {
      p2 = new Point2D(0, 0);
    }

    return (
      <Line
        points={[p1.x, p1.y, p2.x, p2.y]}
        stroke={"#696969ff"}
        strokeWidth={2}
        lineCap="round"
        lineJoin="round"
        listening={false}
        dash={[10, 5]}
      />
    );
  }

  function EditableLine({ coeff, status, index, listening }) {
    let [p1, p2] = computeInboundPoints(coeff);

    // TODO: I need a better handling...
    if (p1 === undefined) {
      p1 = new Point2D(0, 0);
    }
    if (p2 === undefined) {
      p2 = new Point2D(0, 0);
    }

    let center = new Point2D(0, 0);
    let centerOffset = new Point2D(0, 0);
    if (p1.sub(p2).norm() !== 0) {
      let normal = computeNormal(p1, p2, coeff);
      center = p1.add(p2).div(2);
      centerOffset = center.sub(normal.mul(0.025 * dim));
    }

    const [drag, setDrag] = useState(false);
    const [target, setTarget] = useState(new Point2D(0, 0));

    return (
      <Group>
        <Line
          points={[p1.x, p1.y, p2.x, p2.y]}
          stroke={"#757575ff"}
          strokeWidth={4}
          lineCap="round"
          lineJoin="round"
          listening={listening}
          visible={control && status}
          draggable
          onDragEnd={(e) => {
            const target = e.target;
            const offset = new Point2D(target.x(), target.y());
            const curPoints = target.attrs.points;

            const aRef = coeff[0];
            let [a, b, c] = computeCoeffs(
              offset.add(new Point2D(curPoints[0], curPoints[1])),
              offset.add(new Point2D(curPoints[2], curPoints[3])),
            );
            const factor = aRef / a;
            editCoeffs(index, a * factor, b * factor, c * factor);

            target.x(0);
            target.y(0);
          }}
          onMouseEnter={() => {
            document.body.style.cursor = "pointer";
          }}
          onMouseLeave={() => {
            document.body.style.cursor = "default";
          }}
        ></Line>
        <Line
          points={[center.x, center.y, centerOffset.x, centerOffset.y]}
          stroke={editorColor}
          strokeWidth={4}
          lineCap="round"
          lineJoin="round"
          visible={drag}
          listening={false}
        ></Line>
        <Line
          points={[center.x, center.y, target.x, target.y]}
          visible={drag}
          stroke={editorColor}
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
          dash={[10, 10]}
          listening={false}
        />
        <Line
          points={[center.x, center.y, centerOffset.x, centerOffset.y]}
          stroke={"#717171ff"}
          strokeWidth={4}
          lineCap="round"
          lineJoin="round"
          visible={control && status}
          draggable
          onTap={() => {
            editCoeffs(index, -coeff[0], -coeff[1], -coeff[2]);
          }}
          onClick={() => {
            editCoeffs(index, -coeff[0], -coeff[1], -coeff[2]);
          }}
          onDragStart={(e) => {
            setDrag(true);
          }}
          onDragMove={(e) => {
            const target = e.target;
            const offset = new Point2D(target.x(), target.y());
            setTarget(center.add(offset));
          }}
          onDragEnd={(e) => {
            setDrag(false);
            const target = e.target;
            const offset = new Point2D(target.x(), target.y());
            const p2 = center.add(offset);

            let [a, b, c] = computeCoeffs(center, p2);
            const refNormal = centerOffset - center;
            const signFlag = new Point2D(0, 1).dot(refNormal);

            const normal = computeNormal(center, p2, [a, b, c]);
            const hDrag =
              (signFlag > 0
                ? Math.abs(p2.y - center.y) < Math.abs(p2.x - center.x)
                : Math.abs(p2.y - center.y) > Math.abs(p2.x - center.x)) &&
              p2.x - center.x < 0;

            // Translation should not change the sign
            if (hDrag || normal.dot(refNormal) < 0) {
              a = -a;
              b = -b;
              c = -c;
            }
            editCoeffs(index, a, b, c);

            target.x(0);
            target.y(0);
          }}
          onMouseEnter={() => {
            document.body.style.cursor = "pointer";
          }}
          onMouseLeave={() => {
            document.body.style.cursor = "default";
          }}
        ></Line>
      </Group>
    );
  }
  const stageRef = useRef();
  const [enableEditor, setEnableEditor] = useState(false);
  const [editorStart, setEditorStart] = useState(new Point2D(0, 0));
  const [editorEnd, setEditorEnd] = useState(new Point2D(0, 0));

  const [lines, setLines] = useState([]);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (!free) {
      setLines([]);
    }
  }, [free]);

  useEffect(() => {
    setLines([]);
  }, [clear]);

  function drawBegin(e) {
    const pos = stageRef.current.getPointerPosition();
    if (free) {
      setDrawing(true);
      setLines([...lines, { points: [pos.x, pos.y] }]);
    }
  }
  function drawProgress(e) {
    const pos = stageRef.current.getPointerPosition();
    if (free) {
      if (drawing) {
        // To draw line
        let lastLine = lines[lines.length - 1];
        // add point
        lastLine.points = lastLine.points.concat([pos.x, pos.y]);

        // replace last
        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
      }
    }
  }

  function drawEnd(e) {
    if (free) {
      setDrawing(false);
    }
  }

  function lineBegin(e) {
    const pos = stageRef.current.getPointerPosition();
    setEditorStart(new Point2D(pos.x, pos.y));
    setEditorEnd(new Point2D(pos.x, pos.y));
    setEnableEditor(true);
  }

  function lineProgress(e) {
    if (enableEditor) {
      const pos = stageRef.current.getPointerPosition();
      setEditorEnd(new Point2D(pos.x, pos.y));
    }
  }

  function lineEnd(e) {
    setEnableEditor(false);
    if (editorStart.sub(editorEnd).norm() < 0.05 * dim) {
      return;
    }
    const [a, b, c] = computeCoeffs(editorStart, editorEnd);
    if (a !== 0 || b !== 0) {
      addCoeffs(a, b, c);
    }
  }

  return (
    <Stage
      ref={stageRef}
      width={dim}
      height={dim}
      style={{
        position: "absolute",
        top: editorPos.x,
        left: editorPos.y,
        zIndex: 1,
      }}
      onMouseDown={drawBegin}
      onMouseMove={drawProgress}
      onMouseUp={drawEnd}
      onTouchStart={drawBegin}
      onTouchMove={drawProgress}
      onTouchEnd={drawEnd}
    >
      <Layer>
        {!free && (
          <Rect
            x={0}
            y={0}
            width={dim}
            height={dim}
            // fill={"#d8d8d8ff"}
            onMouseDown={lineBegin}
            onMouseMove={lineProgress}
            onMouseUp={lineEnd}
            onTouchStart={lineBegin}
            onTouchMove={lineProgress}
            onTouchEnd={lineEnd}
          />
        )}
        <Circle
          visible={enableEditor}
          x={editorStart.x}
          y={editorStart.y}
          listening={false}
          radius={5}
          stroke={editorColor}
          strokeWidth={2}
        />
        <Circle
          visible={enableEditor}
          x={editorEnd.x}
          y={editorEnd.y}
          listening={false}
          radius={5}
          stroke={editorColor}
          strokeWidth={2}
        />
        <Line
          points={[editorStart.x, editorStart.y, editorEnd.x, editorEnd.y]}
          visible={enableEditor}
          stroke={editorColor}
          strokeWidth={2}
          lineCap="round"
          lineJoin="round"
          dash={[10, 10]}
          listening={false}
        />
        {boundary &&
          combination(coeffs.length).map((pair) => (
            <BoundaryLine
              key={`line_${pair[0]}_${pair[1]}`}
              coeff1={coeffs[pair[0]]}
              coeff2={coeffs[pair[1]]}
            />
          ))}
        {coeffs.map((coeff, index) => (
          <EditableLine
            key={`line_${index}`}
            coeff={coeff}
            status={cstatus[index]}
            index={index}
            listening={!free}
          />
        ))}
        {lines.map((line, i) => (
          <Line
            key={i}
            points={line.points}
            stroke="#df4b26"
            strokeWidth={5}
            tension={0.5}
            lineCap="round"
            lineJoin="round"
            globalCompositeOperation={"source-over"}
          />
        ))}
      </Layer>
    </Stage>
  );
}

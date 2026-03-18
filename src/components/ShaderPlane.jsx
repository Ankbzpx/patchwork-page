import { extend } from "@pixi/react";
import { Mesh, Geometry, Shader } from "pixi.js";
import { useEffect, useMemo, useRef } from "react";

export function ShaderPlane({
  limit,
  coeffsArray,
  cstatusArray,
  dim,
  count,
  beta,
  softmax,
  active,
  padEps,
  k,
  eps,
}) {
  extend({ Mesh });

  const shaderRef = useRef();

  const vertex = useMemo(
    () =>
      `
    #version 300 es
    in vec2 aPosition;

    uniform mat3 uProjectionMatrix;
    uniform mat3 uWorldTransformMatrix;
    uniform mat3 uTransformMatrix;

    void main() {
        mat3 mvp = uProjectionMatrix * uWorldTransformMatrix * uTransformMatrix;
        gl_Position = vec4((mvp * vec3(aPosition, 1.0)).xy, 0.0, 1.0);
    }
  `,
    []
  );

  // FIXME: My current way of passing uniform buffer is too ugly. Let's use struct in the refactor
  const fragment = useMemo(
    () =>
      `
    #version 300 es
    uniform vec3      iResolution;
    uniform int       iCount;
    uniform vec4      iCoeffs[${limit}];
    uniform vec2      iEnable[${limit}];
    uniform float     iBeta;
    uniform bool      iSoftmax;
    uniform bool      iCandidate;
    uniform bool      iPadEps;
    uniform float     iScale;
    uniform float     iEps;

    out vec4 shadertoy_out_color;

    void main() {
      // Normalized coordinate system
      vec3 uv = vec3(2.0 * iScale * (gl_FragCoord.xy / iResolution.xy - 0.5), 1.0);
      vec4 lightColor = vec4(0.50980, 0.73333, 0.89020, 1.0);
      vec4 darkColor = vec4(0.0, 0.18039, 0.29804, 1.0);
      vec4 lineColor = vec4(0.90196, 0.90196, 0.90196, 1.0);
      vec4 activateColor = vec4(0.94902, 0.55686, 0.16863, 1.0);
      float eps = 0.0001;

      if (iCount == 0) {
        shadertoy_out_color = lightColor;
        return;
      }

      bool has_pos = false, has_neg = false;
      int idx_pos = 0, idx_neg = 0;
      float max_val_pos = -1e20, max_val_neg = -1e20;

      int idx_max = 0, idx_second = 0;
      float max_val = -1e20, second_max_val = -1e20;

      if (iPadEps) {
        has_pos = true;
        max_val_pos = eps;
      }
      
      for (int i = 0; i < iCount; i++) {
        if (iEnable[i].x == 0.) {
          continue;
        }

        float val = dot(iCoeffs[i].xyz, uv);
        if (iCoeffs[i].w >= 0.0) {
          has_pos = true;
          if (max_val_pos < val) {
            max_val_pos = val;
            idx_pos = i;
          }
        } else {
          has_neg = true;
          if (max_val_neg < val) {
            max_val_neg = val;
            idx_neg = i;
          }
        }

        if (max_val < val) {
          second_max_val = max_val;
          idx_second = idx_max;
          max_val = val;
          idx_max = i;
        } else if (second_max_val < val) {
          second_max_val = val;
          idx_second = i;
        }
      }
      float val_acc_pos = 0.0, val_acc_neg = 0.0;
      if (iSoftmax) {
        for (int i = 0; i < iCount; i++) {
          if (iEnable[i].x == 0.) {
            continue;
          }

          float val = dot(iCoeffs[i].xyz, uv);
          if (iCoeffs[i].w >= 0.0) {
            val = iBeta * (val - max_val_pos);
            val_acc_pos += iCoeffs[i].w * exp(val);
          } else {
            val = iBeta * (val - max_val_neg);
            val_acc_neg += (-iCoeffs[i].w) * exp(val);
          }
        }
      }
      if (iPadEps) {
        val_acc_pos += exp(iBeta * (eps - max_val_pos));
      }
      if (!has_pos) {
        max_val_pos = 0.0;
        val_acc_pos = 1.0;
      }
      if (!has_neg) {
        max_val_neg = 0.0;
        val_acc_neg = 1.0;
      }
      float sdf_max = (max_val_pos - max_val_neg);
      if (iSoftmax) {
        sdf_max += (log(val_acc_pos) - log(val_acc_neg)) / iBeta;
      }
      shadertoy_out_color = (sdf_max > 0.0) ? lightColor : darkColor;

      if (iCandidate) {
        float line_scale = length(iCoeffs[idx_max].xy - iCoeffs[idx_second].xy);
        if (abs(max_val - second_max_val) / line_scale < iEps * 0.06) {
          shadertoy_out_color = lineColor;
        }
      }

      // Activate segment
      if (has_pos && has_neg) {
        float sdf_scale = length(iCoeffs[idx_pos].xy - iCoeffs[idx_neg].xy);
        if ((abs(sdf_max) / sdf_scale) < iEps * 0.06) {
          shadertoy_out_color = activateColor;
        }
      }
    }
  `,
    []
  );

  const quadGeometry = useMemo(
    () =>
      new Geometry({
        attributes: {
          aPosition: [
            -100,
            -100, // x, y
            100,
            -100, // x, y
            100,
            100, // x, y,
            -100,
            100, // x, y,
          ],
          //   aUV: [0, 0, 1, 0, 1, 1, 0, 1],
        },
        indexBuffer: [0, 1, 2, 0, 2, 3],
      })
  );

  const shader = useMemo(
    () =>
      Shader.from({
        gl: {
          vertex,
          fragment,
        },
        resources: {
          shaderToyUniforms: {
            iResolution: { value: [dim, dim, 1], type: "vec3<f32>" },
            iCount: { value: count, type: "i32" },
            iCoeffs: {
              value: coeffsArray.current,
              type: "vec4<f32>",
              size: limit,
            },
            iEnable: {
              value: cstatusArray.current,
              type: "vec2<f32>",
              size: limit,
            },
            iBeta: { value: beta, type: "f32" },
            iSoftmax: { value: softmax, type: "i32" },
            iCandidate: { value: active, type: "i32" },
            iPadEps: { value: active, type: "i32" },
            iScale: { value: active, type: "f32" },
            iEps: { value: active, type: "f32" },
          },
        },
      }),
    []
  );

  useEffect(() => {
    if (!shader) return;
    shader.resources.shaderToyUniforms.uniforms.iCount = count;
  }, [shader, count]);

  useEffect(() => {
    if (!shader) return;
    shader.resources.shaderToyUniforms.uniforms.iBeta = beta;
  }, [shader, beta]);

  useEffect(() => {
    if (!shader) return;
    shader.resources.shaderToyUniforms.uniforms.iSoftmax = softmax;
  }, [shader, softmax]);

  useEffect(() => {
    if (!shader) return;
    shader.resources.shaderToyUniforms.uniforms.iCandidate = active;
  }, [shader, active]);

  useEffect(() => {
    if (!shader) return;
    shader.resources.shaderToyUniforms.uniforms.iPadEps = padEps;
  }, [shader, padEps]);

  useEffect(() => {
    if (!shader) return;
    shader.resources.shaderToyUniforms.uniforms.iScale = k;
  }, [shader, k]);

  useEffect(() => {
    if (!shader) return;
    shader.resources.shaderToyUniforms.uniforms.iEps = eps;
  }, [shader, eps]);

  return (
    <pixiMesh
      ref={shaderRef}
      width={dim}
      height={dim}
      x={dim / 2}
      y={dim / 2}
      geometry={quadGeometry}
      shader={shader}
    />
  );
}

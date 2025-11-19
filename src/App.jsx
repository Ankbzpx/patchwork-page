import { useState } from "react";
import "./App.css";

function App() {
  return (
    <>
      <h1>Patchwork: A compact representation for 3D polygonal shapes</h1>
      <p>Anonymous Authors</p>
      <div class="teaser">
        <img src="./images/teaser.jpg" width="100%" height="100%" />
      </div>
      <h1 class="mid">Abstract</h1>
      <div class="abstract">
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
      <h1 class="mid">Results</h1>
    </>
  );
}

export default App;

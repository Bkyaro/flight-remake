"use client";
import { gsap } from "gsap";
import * as THREE from "three";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import DrawSVGPlugin from "gsap";
import { use, useEffect, useLayoutEffect, useState } from "react";
import Loader from "../components/loader";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
// import Section from "../components/sections";
import "./style.css";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, DrawSVGPlugin);

export default function Home() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log("loading 3d module from url...");
    const loader = new OBJLoader();
    loader.load(
      "https://assets.codepen.io/557388/1405+Plane_1.obj",
      function () {
        console.log("3d module load complete!");
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      }
    );
  }, []);

  useLayoutEffect(() => {
    if (!loading) {
    }
  }, [loading]);

  return (
    <div className="content">
      {/* loading */}
      <div className={`loading ${loading ? "" : "loaded"}`}>
        <Loader />
      </div>
      {/* trigger */}
      <div className="trigger"></div>
      {/* section 1 */}
      <div className="section">
        <h1>飞机✈️</h1>
        <h3>平流层之上</h3>
        <p>穹顶之下</p>
        <div className="scroll-cta">Scroll</div>
      </div>
      {/* section 2 */}
      <div className="section right">
        <h2>俯瞰大地</h2>
      </div>

      {/* ground-cloud section */}
      <div className="ground-container">
        <div className="parallax ground"></div>
        <div className="section right">
          <h2>白云似海</h2>
        </div>
        <div className="section">
          <h2>一寸阶梯</h2>
          <p>三里庙</p>
        </div>
        <div className="section right">
          <h2>Lorem ipsum dolor sit amet.</h2>
        </div>
        <div className="parallax clouds"></div>
      </div>

      {/* blue-print section */}
      <div className="blueprint">
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <line
            id="line-length"
            x1="10"
            y1="80"
            x2="90"
            y2="80"
            strokeWidth="0.5"
          ></line>
          <path
            id="line-wingspan"
            d="M10 50, L40 35, M60 35 L90 50"
            strokeWidth="0.5"
          ></path>
          <circle
            id="circle-phalange"
            cx="60"
            cy="60"
            r="15"
            fill="transparent"
            strokeWidth="0.5"
          ></circle>
        </svg>
        <div className="section dark">
          <h2>The facts and figures.</h2>
          <p>Lets get into the nitty gritty...</p>
        </div>
        <div className="section dark length">
          <h2>Length.</h2>
          <p>Long.</p>
        </div>
        <div className="section dark wingspan">
          <h2>Wing Span.</h2>
          <p>I dunno, longer than a cat probably.</p>
        </div>
        <div className="section dark phalange">
          <h2>Left Phalange</h2>
          <p>Missing</p>
        </div>
        <div className="section dark">
          <h2>Engines</h2>
          <p>Turbine funtime</p>
        </div>
      </div>

      {/* sunset section */}
      <div className="sunset">
        <div className="section"></div>
        <div className="section end">
          <h2>Fin.</h2>
          <ul className="credits">
            <li>
              Plane model by
              <a
                href="https://poly.google.com/view/8ciDd9k8wha"
                target="_blank"
              >
                Google
              </a>
            </li>
            <li>
              Animated using
              <a href="https://greensock.com/scrolltrigger/" target="_blank">
                GSAP ScrollTrigger
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

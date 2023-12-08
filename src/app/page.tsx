"use client";

import { gsap } from "gsap";
import * as THREE from "three";

import { GUI } from "lil-gui";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";
import Loader from "../components/loader";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import "./style.css";

export default function Home() {
  const [loading, setLoading] = useState(true);
  // const [object, setObject] = useState();

  class Scene {
    views: any;
    renderer: any;
    scene: any;
    edges: any;
    line: any;
    w: any;
    h: any;
    modelGroup: any;
    light: any;
    constructor(model: any) {
      this.views = [
        { bottom: 0, height: 1 },
        { bottom: 0, height: 0 },
      ];

      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });

      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.setPixelRatio(window.devicePixelRatio);

      document.body.appendChild(this.renderer.domElement);

      // scene

      this.scene = new THREE.Scene();

      for (var ii = 0; ii < this.views.length; ++ii) {
        var view = this.views[ii];
        var camera = new THREE.PerspectiveCamera(
          45,
          window.innerWidth / window.innerHeight,
          1,
          2000
        );
        camera.position.fromArray([0, 0, 180]);
        camera.layers.disableAll();
        camera.layers.enable(ii);
        view["camera"] = camera;
        camera.lookAt(new THREE.Vector3(0, 5, 0));
        view.camera.add(this.light);
      }

      //light

      this.light = new THREE.PointLight(0xffffff, 0.85);
      this.light.position.set(70, -20, 150);
      this.scene.add(this.light);

      let softLight = new THREE.AmbientLight(0xffffff, 1.5);
      this.scene.add(softLight);

      // group

      this.onResize();
      window.addEventListener("resize", this.onResize, false);

      this.edges = new THREE.EdgesGeometry(model.children[0].geometry);
      this.line = new THREE.LineSegments(this.edges);
      this.line.material.depthTest = false;
      this.line.material.opacity = 0.5;
      this.line.material.transparent = true;
      this.line.position.x = 0.5;
      this.line.position.z = -1;
      this.line.position.y = 0.2;

      this.modelGroup = new THREE.Group();

      model.layers.set(0);
      this.line.layers.set(1);

      this.modelGroup.add(model);
      this.modelGroup.add(this.line);
      this.scene.add(this.modelGroup);

      const helper = new THREE.PointLightHelper(this.light);
      this.scene.add(helper);

      const gui = new GUI();
      gui.add(this.light, "intensity", 0, 2, 0.01);
      gui.add(this.light, "distance", 0, 40).onChange(() => {
        helper.update();
      });
    }

    render = () => {
      for (var ii = 0; ii < this.views.length; ++ii) {
        var view = this.views[ii];
        var camera = view.camera;

        var bottom = Math.floor(this.h * view.bottom);
        var height = Math.floor(this.w * view.height);

        this.renderer.setViewport(0, 0, this.w, this.h);
        this.renderer.setScissor(0, bottom, this.w, height);
        this.renderer.setScissorTest(true);

        camera.aspect = this.w / this.h;
        this.renderer.render(this.scene, camera);
      }
    };

    onResize = () => {
      this.w = window.innerWidth;
      this.h = window.innerHeight;

      for (var ii = 0; ii < this.views.length; ++ii) {
        var view = this.views[ii];
        var camera = view.camera;
        camera.aspect = this.w / this.h;
        let camZ = (screen.width - this.w * 1) / 3;
        camera.position.z = camZ < 180 ? 180 : camZ;
        camera.updateProjectionMatrix();
      }

      this.renderer.setSize(this.w, this.h);
      this.render();
    };
  }

  const loadModel = () => {
    let object: any;
    gsap.registerPlugin(ScrollTrigger);
    // gsap.set("#line-length", { drawSVG: 0 });
    // gsap.set("#line-wingspan", { drawSVG: 0 });
    // gsap.set("#circle-phalange", { drawSVG: 0 });

    function onModelLoaded() {
      object.traverse(function (child) {
        let mat = new THREE.MeshPhongMaterial({
          color: 0x171511,
          specular: 0xd0cbc7,
          shininess: 5,
          flatShading: true,
        });
        child.material = mat;
      });
      console.log("setupAnimation raned?");
      setupAnimation(object);
    }

    // function onModelLoaded(obj: any) {
    //   obj.traverse(function (child) {
    //     let mat = new THREE.MeshPhongMaterial({
    //       color: 0x171511,
    //       specular: 0xd0cbc7,
    //       shininess: 5,
    //       flatShading: true,
    //     });
    //     child.material = mat;
    //   });
    //   console.log("setupAnimation raned?");
    //   setupAnimation(obj);
    //   setLoading(false);
    // }

    var manager = new THREE.LoadingManager(onModelLoaded);
    manager.onProgress = (item: any, loaded: any, total: any) =>
      console.log(item, loaded, total);
    const loader = new OBJLoader(manager);
    loader.load(
      "https://assets.codepen.io/557388/1405+Plane_1.obj",
      function (obj: any) {
        console.log("3d module load complete!");
        setLoading(false);
        object = obj;
      }
    );
  };

  const setupAnimation = (model) => {
    let scene = new Scene(model);
    let plane = scene.modelGroup;

    gsap.fromTo(
      "canvas",
      { x: "50%", autoAlpha: 0 },
      { duration: 1, x: "0%", autoAlpha: 1 }
    );
    gsap.to(".loading", { autoAlpha: 0 });
    gsap.to(".scroll-cta", { opacity: 1 });
    // gsap.set("svg", { autoAlpha: 1 });

    let tau = Math.PI * 2;

    gsap.set(plane.rotation, { y: tau * -0.25 });
    gsap.set(plane.position, { x: 80, y: -32, z: -60 });

    console.log("scene rendered?");
    scene.render();

    var sectionDuration = 1;
    gsap.fromTo(
      scene.views[1],
      { height: 1, bottom: 0 },
      {
        height: 0,
        bottom: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".blueprint",
          scrub: true,
          start: "bottom bottom",
          end: "bottom top",
        },
      }
    );

    gsap.fromTo(
      scene.views[1],
      { height: 0, bottom: 0 },
      {
        height: 1,
        bottom: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".blueprint",
          scrub: true,
          start: "top bottom",
          end: "top top",
        },
      }
    );

    gsap.to(".ground", {
      y: "30%",
      scrollTrigger: {
        trigger: ".ground-container",
        scrub: true,
        start: "top bottom",
        end: "bottom top",
      },
    });

    gsap.from(".clouds", {
      y: "25%",
      scrollTrigger: {
        trigger: ".ground-container",
        scrub: true,
        start: "top bottom",
        end: "bottom top",
      },
    });

    // gsap.to("#line-length", {
    //   drawSVG: 100,
    //   scrollTrigger: {
    //     trigger: ".length",
    //     scrub: true,
    //     start: "top bottom",
    //     end: "top top",
    //   },
    // });

    // gsap.to("#line-wingspan", {
    //   drawSVG: 100,
    //   scrollTrigger: {
    //     trigger: ".wingspan",
    //     scrub: true,
    //     start: "top 25%",
    //     end: "bottom 50%",
    //   },
    // });

    // gsap.to("#circle-phalange", {
    //   drawSVG: 100,
    //   scrollTrigger: {
    //     trigger: ".phalange",
    //     scrub: true,
    //     start: "top 50%",
    //     end: "bottom 100%",
    //   },
    // });

    // gsap.to("#line-length", {
    //   opacity: 0,
    //   drawSVG: 0,
    //   scrollTrigger: {
    //     trigger: ".length",
    //     scrub: true,
    //     start: "top top",
    //     end: "bottom top",
    //   },
    // });

    // gsap.to("#line-wingspan", {
    //   opacity: 0,
    //   drawSVG: 0,
    //   scrollTrigger: {
    //     trigger: ".wingspan",
    //     scrub: true,
    //     start: "top top",
    //     end: "bottom top",
    //   },
    // });

    // gsap.to("#circle-phalange", {
    //   opacity: 0,
    //   drawSVG: 0,
    //   scrollTrigger: {
    //     trigger: ".phalange",
    //     scrub: true,
    //     start: "top top",
    //     end: "bottom top",
    //   },
    // });

    //@ts-ignore
    let tl = new gsap.timeline({
      onUpdate: scene.render,
      scrollTrigger: {
        trigger: ".content",
        scrub: true,
        start: "top top",
        end: "bottom bottom",
      },
      defaults: { duration: sectionDuration, ease: "power2.inOut" },
    });

    let delay = 0;

    tl.to(".scroll-cta", { duration: 0.25, opacity: 0 }, delay);
    tl.to(plane.position, { x: -10, ease: "power1.in" }, delay);

    delay += sectionDuration;

    tl.to(
      plane.rotation,
      { x: tau * 0.25, y: 0, z: -tau * 0.05, ease: "power1.inOut" },
      delay
    );
    tl.to(
      plane.position,
      { x: -40, y: 0, z: -60, ease: "power1.inOut" },
      delay
    );

    delay += sectionDuration;

    tl.to(
      plane.rotation,
      { x: tau * 0.25, y: 0, z: tau * 0.05, ease: "power3.inOut" },
      delay
    );
    tl.to(plane.position, { x: 40, y: 0, z: -60, ease: "power2.inOut" }, delay);

    delay += sectionDuration;

    tl.to(
      plane.rotation,
      { x: tau * 0.2, y: 0, z: -tau * 0.1, ease: "power3.inOut" },
      delay
    );
    tl.to(
      plane.position,
      { x: -40, y: 0, z: -30, ease: "power2.inOut" },
      delay
    );

    delay += sectionDuration;

    tl.to(plane.rotation, { x: 0, z: 0, y: tau * 0.25 }, delay);
    tl.to(plane.position, { x: 0, y: -10, z: 50 }, delay);

    delay += sectionDuration;
    delay += sectionDuration;

    tl.to(
      plane.rotation,
      { x: tau * 0.25, y: tau * 0.5, z: 0, ease: "power4.inOut" },
      delay
    );
    tl.to(plane.position, { z: 30, ease: "power4.inOut" }, delay);

    delay += sectionDuration;

    tl.to(
      plane.rotation,
      { x: tau * 0.25, y: tau * 0.5, z: 0, ease: "power4.inOut" },
      delay
    );
    tl.to(plane.position, { z: 60, x: 30, ease: "power4.inOut" }, delay);

    delay += sectionDuration;

    tl.to(
      plane.rotation,
      { x: tau * 0.35, y: tau * 0.75, z: tau * 0.6, ease: "power4.inOut" },
      delay
    );
    tl.to(plane.position, { z: 100, x: 20, y: 0, ease: "power4.inOut" }, delay);

    delay += sectionDuration;

    tl.to(
      plane.rotation,
      { x: tau * 0.15, y: tau * 0.85, z: -tau * 0, ease: "power1.in" },
      delay
    );
    tl.to(plane.position, { z: -150, x: 0, y: 0, ease: "power1.inOut" }, delay);

    delay += sectionDuration;

    tl.to(
      plane.rotation,
      {
        duration: sectionDuration,
        x: -tau * 0.05,
        y: tau,
        z: -tau * 0.1,
        ease: "none",
      },
      delay
    );
    tl.to(
      plane.position,
      { duration: sectionDuration, x: 0, y: 30, z: 320, ease: "power1.in" },
      delay
    );

    // tl.to(
    //   scene.light.position,
    //   { duration: sectionDuration, x: 0, y: 0, z: 0 },
    //   delay
    // );
  };

  // gasp动画设置

  useEffect(() => {
    console.log("loading 3d module from url...");
    loadModel();
  }, []);

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
          <h2>云如海</h2>
        </div>
        <div className="section">
          <h2>一寸阶梯</h2>
          <p>三里庙</p>
        </div>

        <div className="section right">
          <h2>繁星入海口</h2>
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
          <h2>万般思愁</h2>
          <p>难投笔</p>
        </div>
        <div className="section dark length">
          <h2>此经年</h2>
          <p>又恨早</p>
        </div>
        <div className="section dark wingspan">
          <h2>满床笏</h2>
          <p>罔替交</p>
        </div>
        <div className="section dark phalange">
          <h2>昨日如萤火</h2>
          <p></p>
        </div>
        <div className="section dark">
          <h2>照亮一切悲伤</h2>
          <p>狂奔而过</p>
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

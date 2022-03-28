import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

// Cursor
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = e.clientY / sizes.height - 0.5;
});

// Scene
const scene = new THREE.Scene();

// Lighting
const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

const pointLight = new THREE.PointLight(0xff0000, 1, 100);
light.position.set(50, 50, 50);
scene.add(pointLight);

// Textures
const textLoadManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(textLoadManager);

const matcap = textureLoader.load("./assets/matcaps/8.png");

// Axes Helper
// const axesHelper = new THREE.AxesHelper();

// scene.add(axesHelper);

// Font Loader
const fontLoadManager = new THREE.LoadingManager();
const fontLoader = new FontLoader(fontLoadManager);

function generateRandomPoint() {
  return (Math.random() - 0.5) * 20;
}

fontLoader.load("./assets/fonts/noto_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Hello, Khan!", {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 4,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry.computeBoundingBox();

  // if (textGeometry.boundingBox) {
  //   textGeometry.translate(
  //     -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
  //     -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
  //     -(textGeometry.boundingBox.max.z - 0.03) * 0.5
  //   );
  // }

  textGeometry.center();

  const material = new THREE.MeshMatcapMaterial({
    matcap,
  });

  const text = new THREE.Mesh(textGeometry, material);

  scene.add(text);

  const donutGeometry = new THREE.TorusGeometry(0.4, 0.15, 64, 128);

  console.time("donuts");

  for (let i = -50; i < 50; i++) {
    const donut = new THREE.Mesh(donutGeometry, material);
    scene.add(donut);
    donut.position.set(
      generateRandomPoint(),
      generateRandomPoint(),
      generateRandomPoint()
    );
    donut.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    const scale = Math.random();
    donut.scale.set(scale, scale, scale);
  }
  console.timeEnd("donuts");
});

// Meshes
// const geometry = new THREE.BoxGeometry(1, 1, 1);

// const materialOptions: THREE.MeshBasicMaterialParameters = {
//   color: 0xff0000,
// };
// const material = new THREE.MeshBasicMaterial(materialOptions);

// const mesh = new THREE.Mesh(geometry, material);

// scene.add(mesh);

// mesh.position.set(0, 0, 0);

// Camera

const canvas = document.createElement("canvas");

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  1000
);

window.addEventListener("resize", (_) => {
  // Update Sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update Renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", (_) => {
  const doc: any = window.document;
  const fullscreenElement =
    doc.fullscreenElement || doc.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
      //@ts-ignore
    } else if (canvas.webkitRequestFullscreen) {
      //@ts-ignore
      canvas.webkitRequestFullscreen();
    }
    return;
  }

  if (doc.exitFullscreen) {
    doc.exitFullscreen();
    return;
  }

  if (doc.webkitExitFullscreen) {
    doc.webkitExitFullscreen();
  }
});

camera.position.set(0, 0, 3);

scene.add(camera);

// Controls

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer

document.body.appendChild(canvas);

const rendererOptions: THREE.WebGLRendererParameters = {
  canvas,
};

const renderer = new THREE.WebGLRenderer(rendererOptions);

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animations

// const clock = new THREE.Clock();

const tick = () => {
  // const elapsedTime = clock.getElapsedTime();

  // Update Camera Via Orbit Controls

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();

import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  PlaneGeometry,
  Mesh,
  ShaderMaterial,
} from "three";
import vertexShader from "./vs.glsl";
import fragmentShader from "./fs.glsl";
import loader from "../components/loader";

const world = {
  init,
  render,
  scene: new Scene(),
  renderer: null,
  canvasInfo: {},
  cameraInfo: {
    near: 1500,
    far: 2500,
    cameraZ: 2000,
  },
  os: [],
  meshes: [],
};

async function init(canvas, canvasRect, dataWebglElems) {
  world.canvasInfo.canvasRect = canvasRect;
  world.canvasInfo.width = world.canvasInfo.canvasRect.width;
  world.canvasInfo.height = world.canvasInfo.canvasRect.height;

  // ----------------------------------
  //renderer
  world.renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    pixelRatio: 1,
    debug: window.debug,
  });
  world.renderer.setSize(
    world.canvasInfo.width,
    world.canvasInfo.height,
    false
  );

  // ----------------------------------
  //camera
  world.cameraInfo.width = world.canvasInfo.width;
  world.cameraInfo.height = world.canvasInfo.height;
  world.cameraInfo.aspect = world.cameraInfo.width / world.cameraInfo.height;

  world.cameraInfo.radian =
    2 * Math.atan(world.cameraInfo.height / 2 / world.cameraInfo.cameraZ);
  world.cameraInfo.fov = world.cameraInfo.radian * (180 / Math.PI);

  world.camera = new PerspectiveCamera(
    world.cameraInfo.fov,
    world.cameraInfo.aspect,
    world.cameraInfo.near,
    world.cameraInfo.far
  );
  world.camera.position.z = world.cameraInfo.cameraZ;

  // ----------------------------------
  //geometry, material, mesh
  const segNum = 3;

  const prms = [...dataWebglElems].map(async (elem) => {
    const elemRect = elem.getBoundingClientRect();

    const url = loader.getTexByElement(elem);

    const geometry = new PlaneGeometry(
      elemRect.width,
      elemRect.height,
      segNum,
      segNum
    );
    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTex: { value: url },
        uFluctuation: { value: 0 },
        uProgress: { value: 0 },
      },
    });
    const mesh = new Mesh(geometry, material);
    mesh.position.z = -400;

    const { x, y } = _getWorldPosition(elemRect, canvasRect);
    mesh.position.x = x;
    mesh.position.y = y;

    world.scene.add(mesh);

    const o = {
      elemRect,
      geometry,
      material,
      mesh,
      $: {
        elem,
      },
    };
    world.os.push(o);

    mesh.userData.img = elem;
    world.meshes.push(mesh);

    return o;
  });

  await Promise.all(prms);

  window.addEventListener("resize", onResize);
}

function render() {
  requestAnimationFrame(render);

  world.os.forEach((o) => _scrollElem(o));

  world.renderer.render(world.scene, world.camera);
}

let timeoutID = null;
function onResize() {
  clearTimeout(timeoutID);
  timeoutID = setTimeout(() => {
    // const canvas = document.querySelector("#canvas"); //TODO
    const newCanvasRect = canvas.getBoundingClientRect();
    world.canvasInfo.canvasRect = newCanvasRect;
    world.canvasInfo.width = world.canvasInfo.canvasRect.width;
    world.canvasInfo.height = world.canvasInfo.canvasRect.height;

    world.renderer.setSize(
      world.canvasInfo.width,
      world.canvasInfo.height,
      false
    );

    world.cameraInfo.width = world.canvasInfo.canvasRect.width;
    world.cameraInfo.height = world.canvasInfo.canvasRect.height;
    world.cameraInfo.aspect = world.cameraInfo.width / world.cameraInfo.height;

    world.cameraInfo.radian =
      2 * Math.atan(world.cameraInfo.height / 2 / world.cameraInfo.cameraZ);
    world.cameraInfo.fov = world.cameraInfo.radian * (180 / Math.PI);

    world.camera.aspect = world.cameraInfo.aspect;
    world.camera.fov = world.cameraInfo.fov;
    world.camera.updateProjectionMatrix();

    world.os.forEach((o) => _resizeElem(o, newCanvasRect));
  }, 100);
}

// ----------------------------------
//scrollElem
function _scrollElem(o) {
  const {
    mesh,
    $: { elem },
  } = o;
  const elemRect = elem.getBoundingClientRect();
  const { y } = _getWorldPosition(elemRect, world.canvasInfo.canvasRect);
  mesh.position.y = y;
}

// ----------------------------------
//resizeElem
function _resizeElem(o, newCanvasRect) {
  const {
    elemRect,
    mesh,
    geometry,
    $: { elem },
  } = o;
  const newElemRect = elem.getBoundingClientRect();
  const { x, y } = _getWorldPosition(newElemRect, newCanvasRect);
  mesh.position.x = x;
  mesh.position.y = y;

  geometry.scale(
    newElemRect.width / elemRect.width,
    newElemRect.height / elemRect.height,
    1
  );

  o.elemRect = newElemRect;
}

function _getWorldPosition(elemRect, canvasRect) {
  const x = elemRect.left + elemRect.width / 2 - canvasRect.width / 2;
  const y = -elemRect.top - elemRect.height / 2 + canvasRect.height / 2;
  return { x, y };
}

export default world;

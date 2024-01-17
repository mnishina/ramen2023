import loader from "./components/loader";
import world from "./glsl/world";
import { iso } from "./components/intersectionObserver";
import { pageScroller } from "./components/pageScroller";

init();
async function init() {
  const canvas = document.querySelector("#canvas");
  const canvasRect = canvas.getBoundingClientRect();
  const dataWebglElems = document.querySelectorAll("[data-webgl]");
  const listElems = document.querySelectorAll("ul li");

  loader.init();

  loader.addProgressAction((progress, total) => {
    const loadNum = document.querySelector(".load span");
    loadNum.innerHTML = Math.round((progress / total) * 100);
  });
  await loader.loadAllAssets(dataWebglElems);

  await world.init(canvas, canvasRect, dataWebglElems);

  await loader.begin();
  iso.init(listElems, world.meshes);

  pageScroller.init();

  world.render();
}

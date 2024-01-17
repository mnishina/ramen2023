import gsap from "gsap";
import { LinearFilter, TextureLoader } from "three";

const textureCache = new Map();
const texLoader = new TextureLoader();
const loader = {
  init,
  loadAllAssets,
  loadImg,
  getTexByElement,
  addProgressAction,
  begin,
  // addLoadingAnimation,
  isLoaded: false,
};

const $ = {};

function init() {
  $.loader = document.querySelector(".load");
  $.globalContainer = document.querySelector(".globalContainer");
}

async function loadAllAssets(dataWebglElems) {
  for (const elems of dataWebglElems) {
    const data = elems.dataset;
    for (let key in data) {
      if (!key.startsWith("tex")) continue;

      const url = data[key];
      // 重複は無視する
      if (!textureCache.has(url)) {
        textureCache.set(url, null);
      }
    }
  }

  const texPrms = [];

  textureCache.forEach((_, url) => {
    const prms = loadImg(url).then((tex) => {
      textureCache.set(url, tex);
    });
    texPrms.push(prms);
  });

  await Promise.all(texPrms);
}
function getTexByElement(elem) {
  const tex = elem.dataset["tex"];
  const url = textureCache.get(tex);
  return url;
}

let total = 0;
let progress = 0;
let _progressAction = null;

async function loadImg(url) {
  incrementTotal();
  const tex = await texLoader.loadAsync(url);
  incrementProgress();

  tex.magFilter = LinearFilter;
  tex.minFilter = LinearFilter;
  tex.needsUpdate = false;
  return tex;
}

function incrementTotal() {
  total++;
}
function incrementProgress() {
  progress++;
  if (_progressAction) {
    _progressAction(progress, total);
  }
}
function addProgressAction(_callback) {
  _progressAction = _callback;
}

function _loadingAnimationStart() {
  const tl = gsap.timeline();
  tl.to($.loader, {
    opacity: 0,
    duration: 0.6,
    scale: 0.3,
    delay: 0.5,
    ease: "back.in(5)",
  }).set($.loader, {
    display: "none",
  });

  return tl;
}

async function _loadingAnimationEnd(tl) {
  return new Promise((resolve) => {
    tl.to($.globalContainer, {
      opacity: 1,
      duration: 0.7,
      ease: "sine.out",
      onComplete() {
        loader.isLoaded = true;
        resolve();
      },
    });
  });
}

// let loadingAnimation = null;
// function addLoadingAnimation(_loadingAnimation) {
//   loadingAnimation = _loadingAnimation;
// }

async function begin() {
  const tl = _loadingAnimationStart();
  // loadingAnimation && loadingAnimation(tl);

  return await _loadingAnimationEnd(tl);
}

export default loader;

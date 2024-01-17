import gsap from "gsap";

const iso = {
  init,
  options: {
    root: null,
    rootMargin: "0px",
    threshold: 0,
  },
};

function init(targets, meshes) {
  const cb = (entries, observer) => {
    entries.forEach((entry) => {
      const img = entry.target.firstElementChild.firstElementChild; //TODO
      const mesh = meshes.find((m) => m.userData.img === img);
      const uFluctuation = mesh.material.uniforms.uFluctuation;
      const uProgress = mesh.material.uniforms.uProgress;

      const num = entry.isIntersecting ? 1 : 0;
      _gsapFunc(uFluctuation, num, 1.8, "power2.out");
      _gsapFunc(uProgress, num, 0.7, "sine.inOut");
    });
  };

  const observer = new IntersectionObserver(cb, iso.options);

  targets.forEach((target) => {
    observer.observe(target);
  });
}

function _gsapFunc(val, num, time, ease) {
  gsap.to(val, {
    value: num,
    duration: time,
    ease: ease,
  });
}

export { iso };

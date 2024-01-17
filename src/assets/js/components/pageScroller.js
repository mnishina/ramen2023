import Lenis from "@studio-freight/lenis";

const pageScroller = {
  init,
  lenis: new Lenis(),
};

function init() {
  // lenis.on('scroll', (e) => {
  //   console.log(e)
  // })

  requestAnimationFrame(raf);
}

function raf(time) {
  pageScroller.lenis.raf(time);
  requestAnimationFrame(raf);
}

export { pageScroller };

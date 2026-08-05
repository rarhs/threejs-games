import * as THREE from "three";

export interface GameOptions {
  /** Element the canvas is appended to. Defaults to document.body. */
  container?: HTMLElement;
  /** Camera field of view in degrees. Default 60. */
  fov?: number;
  /** Scene background color. Default 0x111318. */
  background?: THREE.ColorRepresentation;
  /** Enable shadow maps. Default false. */
  shadows?: boolean;
}

export interface Game {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  /**
   * Start the render loop. `update` runs every frame with dt (seconds) and elapsed time.
   * Elapsed time pauses while stopped or while the tab is hidden; it does not reset on restart.
   */
  start(update?: (dt: number, elapsed: number) => void): void;
  /** Stop the render loop. */
  stop(): void;
  /** Stop the loop and release GPU resources. */
  dispose(): void;
}

/**
 * Boilerplate-free three.js setup: renderer, scene, perspective camera,
 * automatic resize handling, and a fixed-cap delta-time render loop.
 */
export function createGame(options: GameOptions = {}): Game {
  const {
    container = document.body,
    fov = 60,
    background = 0x111318,
    shadows = false,
  } = options;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);
  renderer.shadowMap.enabled = shadows;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(background);

  const camera = new THREE.PerspectiveCamera(
    fov,
    renderer.domElement.width / renderer.domElement.height,
    0.1,
    1000,
  );
  camera.position.set(0, 2, 5);

  function resize(): void {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  const timer = new THREE.Timer();
  // Page Visibility API: while the tab is hidden the timer reports zero delta,
  // so elapsed time excludes hidden periods.
  timer.connect(document);
  let running = false;

  return {
    renderer,
    scene,
    camera,
    start(update) {
      if (running) return;
      running = true;
      timer.reset();
      renderer.setAnimationLoop((time) => {
        timer.update(time);
        // Cap dt so a long stall doesn't produce a giant physics step.
        const dt = Math.min(timer.getDelta(), 1 / 30);
        update?.(dt, timer.getElapsed());
        renderer.render(scene, camera);
      });
    },
    stop() {
      running = false;
      renderer.setAnimationLoop(null);
    },
    dispose() {
      this.stop();
      window.removeEventListener("resize", resize);
      timer.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

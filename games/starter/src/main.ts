import * as THREE from "three";
import { createGame, damp } from "@games/shared";

const game = createGame({ background: 0x0e1016, shadows: true });
const { scene, camera } = game;

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const sun = new THREE.DirectionalLight(0xffffff, 2);
sun.position.set(4, 8, 3);
sun.castShadow = true;
scene.add(sun);

// Ground
const ground = new THREE.Mesh(
  new THREE.CircleGeometry(6, 48).rotateX(-Math.PI / 2),
  new THREE.MeshStandardMaterial({ color: 0x1f2733, roughness: 0.9 }),
);
ground.receiveShadow = true;
scene.add(ground);

// Spinning cube
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x4f9dff, roughness: 0.3, metalness: 0.2 }),
);
cube.castShadow = true;
cube.position.y = 1;
scene.add(cube);

camera.position.set(0, 2.5, 5);
camera.lookAt(0, 1, 0);

// Follow the mouse a little, smoothly
let targetX = 0;
window.addEventListener("pointermove", (e) => {
  targetX = (e.clientX / window.innerWidth - 0.5) * 4;
});

game.start((dt, elapsed) => {
  cube.rotation.x += dt * 0.8;
  cube.rotation.y += dt * 1.2;
  cube.position.x = damp(cube.position.x, targetX, 4, dt);
  cube.position.y = 1 + Math.sin(elapsed * 2) * 0.15;
});

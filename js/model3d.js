import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const MODEL_URL = 'assets/vinidrift3d.glb';

const container = document.querySelector('.model');
const statusEl = document.getElementById('model3dStatus');

function setStatus(text) {
  if (statusEl) statusEl.textContent = text;
}

// --- Cena ---
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(4.5, 2.4, 4.5);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.1;
controls.minDistance = 2;
controls.maxDistance = 12;

// Luzes
scene.add(new THREE.AmbientLight(0xffffff, 0.7));
const dirLight = new THREE.DirectionalLight(0xffffff, 1.3);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);
const backLight = new THREE.DirectionalLight(0xff2fa0, 0.35);
backLight.position.set(-5, -2, -5);
scene.add(backLight);

// Chão sutil (contato visual, sem grade chamativa)
const ground = new THREE.Mesh(
  new THREE.CircleGeometry(6, 48),
  new THREE.MeshStandardMaterial({ color: 0x101010, roughness: 1 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.01;
scene.add(ground);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Redimensiona acompanhando o tamanho do container (não da janela)
const resizeObserver = new ResizeObserver(() => {
  const { clientWidth, clientHeight } = container;
  if (clientWidth === 0 || clientHeight === 0) return;
  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(clientWidth, clientHeight);
});
resizeObserver.observe(container);

function centerAndFrameModel(object) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  // Centraliza em X/Z e apoia a base do modelo em y=0
  object.position.x -= center.x;
  object.position.z -= center.z;
  object.position.y -= box.min.y;

  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const distance = maxDim * 1.8;
  camera.position.set(distance, distance * 0.55, distance);
  camera.lookAt(0, size.y / 4, 0);
  controls.target.set(0, size.y / 4, 0);
  controls.update();
}

// --- Carrega o modelo ---
setStatus('Carregando modelo 3D...');
const loader = new GLTFLoader();
loader.load(
  MODEL_URL,
  (gltf) => {
    scene.add(gltf.scene);
    centerAndFrameModel(gltf.scene);
    setStatus('');
    if (statusEl) statusEl.style.display = 'none';
  },
  undefined,
  (error) => {
    console.error('Erro ao carregar modelo 3D:', error);
    setStatus('Não foi possível carregar o modelo 3D.');
  }
);
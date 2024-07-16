// Assicurati di avere Three.js installato nella tua directory di lavoro.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Creazione della scena e della camera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Sfondo nero per uno stile scuro

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Creazione del renderer
const renderer = new THREE.WebGLRenderer({ 
    alpha: true,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.domElement.style.position = 'fixed';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.width = '100%';
renderer.domElement.style.height = '100%';
renderer.domElement.style.zIndex = '-1';
document.body.appendChild(renderer.domElement); // Aggiungi il canvas direttamente al body

// Creazione delle luci
const ambientLight = new THREE.AmbientLight(0x111122, 3); // Luce ambientale per illuminare la scena
scene.add(ambientLight);

function createLight(color) {
    const intensity = 200;
    const light = new THREE.PointLight(color, intensity, 20);
    light.castShadow = true;
    light.shadow.bias = -0.005; // Riduce l'autosombreggiamento su oggetti a doppia faccia

    let geometry = new THREE.SphereGeometry(0.3, 12, 6);
    let material = new THREE.MeshBasicMaterial({ color: color });
    material.color.multiplyScalar(intensity);
    let sphere = new THREE.Mesh(geometry, material);
    light.add(sphere);

    const texture = new THREE.CanvasTexture(generateTexture());
    texture.magFilter = THREE.NearestFilter;
    texture.wrapT = THREE.RepeatWrapping;
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(1, 4.5);

    geometry = new THREE.SphereGeometry(2, 32, 8);
    material = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        alphaMap: texture,
        alphaTest: 0.5
    });

    sphere = new THREE.Mesh(geometry, material);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    light.add(sphere);

    return light;
}

const pointLight = createLight(0x000088); // Blu scuro
scene.add(pointLight);

const pointLight2 = createLight(0xff0000); // Rosso
scene.add(pointLight2);

const pointLight3 = createLight(0x008800); // Verde scuro
scene.add(pointLight3);

// Creazione del cubo retroilluminato
const geometry = new THREE.BoxGeometry(30, 30, 30);
const material = new THREE.MeshPhongMaterial({
    color: 0xa0adaf,
    shininess: 10,
    specular: 0x111111,
    side: THREE.BackSide
});
const mesh = new THREE.Mesh(geometry, material);
mesh.position.y = 10;
mesh.receiveShadow = true;
scene.add(mesh);

// Controlli della telecamera
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 10, 0);
controls.update();

// Funzione per generare una texture per le luci
function generateTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 2;
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 1, 2, 1);
    return canvas;
}

// Funzione di aggiornamento della dimensione della finestra
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Aggiunta dell'evento di ridimensionamento della finestra
window.addEventListener('resize', onWindowResize);

// Funzione di animazione
function animate() {
    requestAnimationFrame(animate);

    // Movimento e rotazione delle luci nel tempo
    let time = performance.now() * 0.001;
    pointLight.position.x = Math.sin(time * 0.3) * 6;
    pointLight.position.y = Math.sin(time * 0.4) * 6 + 6;
    pointLight.position.z = Math.sin(time * 0.5) * 6;
    pointLight.rotation.x = time;
    pointLight.rotation.z = time;

    pointLight2.position.x = Math.sin(time * 0.3 + Math.PI / 2) * 6;
    pointLight2.position.y = Math.sin(time * 0.4 + Math.PI / 2) * 6 + 6;
    pointLight2.position.z = Math.sin(time * 0.5 + Math.PI / 2) * 6;
    pointLight2.rotation.x = time;
    pointLight2.rotation.z = time;

    pointLight3.position.x = Math.sin(time * 0.3 + Math.PI) * 6;
    pointLight3.position.y = Math.sin(time * 0.4 + Math.PI) * 6 + 6;
    pointLight3.position.z = Math.sin(time * 0.5 + Math.PI) * 6;
    pointLight3.rotation.x = time;
    pointLight3.rotation.z = time;

    renderer.render(scene, camera);
}
animate();


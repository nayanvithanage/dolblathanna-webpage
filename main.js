import * as THREE from 'three';
import { config } from './config.js';

// --- THREE.JS SCENE SETUP ---
// Decorative particle-field background, independent of the trip-planner/app-mode logic (that lives
// in app-mode.js now — see its own file header for why the split).
const canvas = document.querySelector('#three-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Add some "Dolblathanna" atmosphere - Floating particles as "flowers"
const isMobile = window.innerWidth < 768;
const particlesCount = isMobile ? 800 : 2000;
const positions = new Float32Array(particlesCount * 3);
const colors = new Float32Array(particlesCount * 3);
const gold = new THREE.Color(config.brand.colors.primary);
const rust = new THREE.Color(config.brand.colors.accent);

for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

    const mixedColor = gold.clone().lerp(rust, Math.random());
    colors[i * 3] = mixedColor.r;
    colors[i * 3 + 1] = mixedColor.g;
    colors[i * 3 + 2] = mixedColor.b;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

camera.position.z = 3;

// Mouse Movement Effect
let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 0.5;
    mouseY = (event.clientY / window.innerHeight - 0.5) * 0.5;
});

// Animation Loop
const animate = () => {
    requestAnimationFrame(animate);

    particles.rotation.y += 0.001;
    particles.rotation.x += 0.0005;

    // Smoother camera follow
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
};

animate();

// Resize Handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Smooth Scroll — only for genuine same-page anchors (e.g. "#hero"), not app-mode's own
// "#app=topic:..." routing hashes, which app-mode.js handles itself. Guarded: a bare "#" or an
// "#app=..." hash isn't a valid CSS id selector and would throw if passed to querySelector, and even
// if it were valid, scrolling the underlying homepage to a matching element while app mode is a
// separate full-screen overlay on top would be visibly wrong.
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#' || href.startsWith('#app=')) return;
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

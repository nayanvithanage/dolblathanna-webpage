import * as THREE from 'three';
import { config } from './config.js';

// --- INITIALIZATION ---
const heroTitle = document.getElementById('hero-title');
const heroSubtitle = document.getElementById('hero-subtitle');
const roomsGrid = document.getElementById('rooms-grid');
const rentalsSubtitle = document.getElementById('rentals-subtitle');
const rentalsGrid = document.getElementById('rentals-grid');
const contactDetails = document.getElementById('contact-details');
const socialLinks = document.getElementById('social-links');
const mapContainer = document.getElementById('map-container');

// Populate Content
heroTitle.textContent = config.sections.hero.title;
heroSubtitle.textContent = config.sections.hero.subtitle;

config.sections.rooms.forEach(room => {
    const roomEl = document.createElement('div');
    roomEl.className = 'room-card';
    roomEl.innerHTML = `
        <img src="${room.image}" alt="${room.name}">
        <div class="room-details">
            <h3>${room.name}</h3>
            <p>${room.description}</p>
        </div>
    `;
    roomsGrid.appendChild(roomEl);
});

rentalsSubtitle.textContent = config.sections.rentals.subtitle;
config.sections.rentals.vehicles.forEach(vehicle => {
    const vehicleEl = document.createElement('div');
    vehicleEl.className = 'rental-card';
    vehicleEl.innerHTML = `
        <div class="rental-icon">${vehicle.icon}</div>
        <h3>${vehicle.type}</h3>
        <p>${vehicle.description}</p>
        <a href="https://wa.me/${config.contact.whatsapp.replace('+', '')}" class="btn secondary" style="margin-top: 1rem; display: inline-block;">Inquire Now</a>
    `;
    rentalsGrid.appendChild(vehicleEl);
});

contactDetails.innerHTML = `
    <div class="contact-item">📍 ${config.contact.address}</div>
    <div class="contact-item">📧 ${config.contact.email}</div>
    <div class="contact-item">📱 ${config.contact.phone}</div>
    <div class="contact-item">💬 WhatsApp: ${config.contact.whatsapp}</div>
`;

if (config.contact.social) {
    if (config.contact.social.facebook) {
        socialLinks.innerHTML += `
            <a href="${config.contact.social.facebook}" class="social-item" target="_blank">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                <span>Facebook</span>
            </a>`;
    }
    if (config.contact.social.tiktok) {
        socialLinks.innerHTML += `
            <a href="${config.contact.social.tiktok}" class="social-item" target="_blank">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V2h5v4h-2a3 3 0 0 0-3 3h2v4h-2a4 4 0 0 1-4-4z"></path></svg>
                <span>TikTok</span>
            </a>`;
    }
}

mapContainer.innerHTML = `
    <iframe 
        src="${config.map.embedUrl}" 
        width="100%" 
        height="100%" 
        style="border:0; border-radius: 20px;" 
        allowfullscreen="" 
        loading="lazy" 
        referrerpolicy="no-referrer-when-downgrade">
    </iframe>
`;

// --- THREE.JS SCENE SETUP ---
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

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

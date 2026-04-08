// Three.js setup for background magic particles
const sceneContainer = document.getElementById('scene-container');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
sceneContainer.appendChild(renderer.domElement);

// Create Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 15; 
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Golden glowing material for particles
const material = new THREE.PointsMaterial({
    size: 0.03,
    color: 0xffd700,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, material);
scene.add(particlesMesh);

camera.position.z = 4;

let mouseX = 0;
let mouseY = 0;

// Track mouse for subtle parallax effect
document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
});

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Rotate particle system slowly
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = elapsedTime * 0.02;

    // Subtle sway with mouse movement
    camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.8 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Door interaction and magical transition logic
const doorFrame = document.getElementById('door-frame');
const leftDoor = document.getElementById('left-door');
const rightDoor = document.getElementById('right-door');
const topLogo = document.getElementById('top-logo');
const flashOverlay = document.getElementById('flash-overlay');
const doorsWrapper = document.getElementById('doors-wrapper');
const content = document.getElementById('content');
const fadeElements = document.querySelectorAll('.fade-in');
const flyingPhotosContainer = document.getElementById('flying-photos-container');

const photos = [
    'images/DSC09956.jpg',
    'images/WhatsApp Image 2026-04-07 at 7.01.04 PM.jpeg',
    'images/WhatsApp Image 2026-04-07 at 7.01.04 PM (1).jpeg',
    'images/WhatsApp Image 2026-04-07 at 7.01.04 PM (2).jpeg',
    'images/WhatsApp Image 2026-04-07 at 7.01.04 PM (3).jpeg'
];

let isOpen = false;

function triggerFlyingPhotos() {
    // Generate a burst of 15 photos based on the 5 we have
    const photoBurst = [...photos, ...photos, ...photos];
    
    photoBurst.forEach((src, iter) => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'flying-photo';
        
        const startRot = (Math.random() - 0.5) * 180 + 'deg';
        const startRX = (Math.random() - 0.5) * 60 + 'deg';
        const startRY = (Math.random() - 0.5) * 60 + 'deg';
        
        const endRot = (Math.random() - 0.5) * 360 + 'deg';
        const endRX = (Math.random() - 0.5) * 180 + 'deg';
        const endRY = (Math.random() - 0.5) * 180 + 'deg';
        
        const endTX = `calc(-50% + ${(Math.random() - 0.5) * 150}vw)`;
        const endTY = `calc(-50% + ${(Math.random() - 0.5) * 150}vh)`;
        
        img.style.setProperty('--start-rot', startRot);
        img.style.setProperty('--start-rx', startRX);
        img.style.setProperty('--start-ry', startRY);
        img.style.setProperty('--end-rot', endRot);
        img.style.setProperty('--end-rx', endRX);
        img.style.setProperty('--end-ry', endRY);
        img.style.setProperty('--end-tx', endTX);
        img.style.setProperty('--end-ty', endTY);
        
        flyingPhotosContainer.appendChild(img);
        
        // Stagger animation onset
        setTimeout(() => {
            img.classList.add('fly');
        }, 1500 + iter * 200); 
    });
}

document.body.addEventListener('click', () => {
    if (isOpen) return;
    isOpen = true;

    // 1. Open doors and animate logo
    leftDoor.classList.add('open');
    rightDoor.classList.add('open');
    doorFrame.classList.add('opening');
    if (topLogo) topLogo.classList.add('hidden');

    // 2. Trigger Flash when doors are halfway open and burst photos
    setTimeout(() => {
        flashOverlay.classList.add('active');
        triggerFlyingPhotos();
    }, 1200); 

    // 3. Hide doors, fade out flash, and show inner content
    setTimeout(() => {
        doorsWrapper.style.display = 'none';
        content.classList.remove('hidden');
        
        setTimeout(() => {
            flashOverlay.classList.remove('active');
            
            // Trigger staggered text reveal
            setTimeout(() => {
                fadeElements.forEach((el) => el.classList.add('visible'));
            }, 500);

        }, 1000);

    }, 3000); 
});

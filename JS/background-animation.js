document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('background-animation-container');
    if (!container) return;

    const particleCount = 50; // Number of particles
    const particles = [];

    // --- Configuration ---
    const minSize = 1;
    const maxSize = 7;
    const minOpacity = 0.05;
    const maxOpacity = 0.15;
    const flashColor = 'rgba(255, 255, 255, 0.8)'; // Color during flash
    const flashDuration = 500; // ms duration of the flash visibility
    const minFlashInterval = 500; // Minimum ms between flashes
    const maxFlashInterval = 3000; // Maximum ms between flashes
    const maxFlashes = 20; // Maximum number of flashes per particle (0 for infinite)
    const moveSpeed = 0.01; // Base speed factor for movement
    const minDirection = -0.5; // Min value for dx/dy
    const maxDirection = 0.5; // Max value for dx/dy

    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    function createParticle(index) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const size = getRandom(minSize, maxSize);
        const initialOpacity = getRandom(minOpacity, maxOpacity);
        const initialColor = `rgba(255, 255, 255, ${initialOpacity})`;
        const x = getRandom(0, 100); // Initial X position (%)
        const y = getRandom(0, 100); // Initial Y position (%)
        const dx = getRandom(minDirection, maxDirection) * moveSpeed; // Horizontal speed/direction
        const dy = getRandom(minDirection, maxDirection) * moveSpeed; // Vertical speed/direction

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        particle.style.backgroundColor = initialColor;
        particle.style.opacity = 0; // Start hidden for fade-in

        container.appendChild(particle);
        
        const particleData = { 
            element: particle, 
            initialColor: initialColor, 
            initialOpacity: initialOpacity,
            flashCount: 0, // Initialize flash count
            x: x, // Store position as number for calculation
            y: y,
            dx: dx,
            dy: dy
        };
        particles.push(particleData);

        // Initial fade-in
        setTimeout(() => {
            particle.style.opacity = 1; 
        }, 100 + index * 10); 

        // Start the flash animation loop
        scheduleFlash(particleData);
    }

    function scheduleFlash(particleData) {
        // Stop scheduling if max flashes reached (and maxFlashes > 0)
        if (maxFlashes > 0 && particleData.flashCount >= maxFlashes) {
            return; 
        }

        const interval = getRandom(minFlashInterval, maxFlashInterval);

        setTimeout(() => {
            // Check again in case maxFlashes was reached while waiting
            if (maxFlashes > 0 && particleData.flashCount >= maxFlashes) {
                return;
            }

            particleData.flashCount++; // Increment flash count
            const { element, initialColor } = particleData;

            // Flash ON
            element.style.backgroundColor = flashColor;

            // Flash OFF
            setTimeout(() => {
                element.style.backgroundColor = initialColor;
                
                // Schedule the next flash
                scheduleFlash(particleData);
            }, flashDuration);

        }, interval);
    }

    function animateParticles() {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        particles.forEach(p => {
            // Update position based on direction vector
            p.x += p.dx;
            p.y += p.dy;

            // Boundary check (wrap around)
            if (p.x < -5) p.x = 100; // Start slightly off-screen when wrapping
            if (p.x > 105) p.x = 0;
            if (p.y < -5) p.y = 100;
            if (p.y > 105) p.y = 0;

            // Apply updated position
            p.element.style.left = `${p.x}%`;
            p.element.style.top = `${p.y}%`;
        });

        requestAnimationFrame(animateParticles); // Loop the animation
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        createParticle(i);
    }

    // Start the movement animation
    animateParticles(); 
});

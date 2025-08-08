(function() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
        width = canvas.width = canvas.offsetWidth = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.offsetHeight = canvas.parentElement.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Define your custom color palette
    const COLORS = [
        "#C8A2C8", // dusty rose
        "#B4C4A3", // Sage green
    ];

    // Particle properties
    const PARTICLE_COUNT = 60;
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: 1.5 + Math.random() * 2.5,
            baseR: 1.5 + Math.random() * 2.5,
            dx: (Math.random() - 0.5) * 0.7,
            dy: (Math.random() - 0.5) * 0.7,
            alpha: 0.3 + Math.random() * 0.7,
            pulse: Math.random() * Math.PI * 2,
            color: COLORS[i % COLORS.length] // cycle through your palette
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw lines between close particles
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            for (let j = i + 1; j < PARTICLE_COUNT; j++) {
                const p1 = particles[i], p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.save();
                    ctx.globalAlpha = 0.1 + 0.3 * (1 - dist / 100);
                    // Use a gradient between the two particle colors
                    const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                    grad.addColorStop(0, p1.color);
                    grad.addColorStop(1, p2.color);
                    ctx.strokeStyle = grad;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }

        // Draw and animate particles
        for (let p of particles) {
            // Pulse effect
            p.pulse += 0.03;
            p.r = p.baseR + Math.sin(p.pulse) * 0.7;

            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 64;
            ctx.fill();
            ctx.restore();

            p.x += p.dx;
            p.y += p.dy;

            // Bounce off edges
            if (p.x < 0 || p.x > width) p.dx *= -1;
            if (p.y < 0 || p.y > height) p.dy *= -1;
        }
        requestAnimationFrame(animate);
    }
    animate();
})();
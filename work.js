(async function() {
    // Load config from JSON
    let config = {
        particleCount: 300,
        heartSize: 120,
        beatSpeed: 1.2,
        particleColor: "#e53935",
        particleSize: 3,
        dispersion: 50,
        backgroundColor: "rgba(255, 224, 130, 1)"
    };
    try {
        const resp = await fetch('animations.json');
        if (resp.ok) config = {...config, ...(await resp.json())};
    } catch (e) {}

    const canvas = document.getElementById('heart-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Responsive sizing
    function resizeCanvas() {
        const section = document.getElementById('home');
        canvas.width = section.offsetWidth;
        canvas.height = Math.max(300, section.offsetHeight * 0.7);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Heart parametric equation
    function heartFunction(t, scale=1) {
        // t in [0, 2PI]
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
        return [x * scale, -y * scale];
    }

    // Generate particles
    const particles = [];
    for (let i = 0; i < config.particleCount; i++) {
        const t = Math.random() * Math.PI * 2;
        const [hx, hy] = heartFunction(t, config.heartSize / 16);
        particles.push({
            base: {x: hx, y: hy},
            x: hx,
            y: hy,
            angle: t,
            dispersion: Math.random() * config.dispersion,
            phase: Math.random() * Math.PI * 2
        });
    }

    // Animation loop
    let lastTime = 0;
    function animate(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = config.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Heartbeat: scale and dispersion
        const beat = Math.abs(Math.sin(time * 0.001 * config.beatSpeed));
        const scale = 1 + 0.08 * beat;
        const disperse = Math.pow(beat, 2);

        // Center of canvas
        const cx = canvas.width / 2;
        const cy = canvas.height / 2 + 20;

        // Draw particles
        for (let p of particles) {
            // Beating and dispersion
            const px = p.base.x * scale + Math.cos(p.angle + time*0.001 + p.phase) * p.dispersion * disperse;
            const py = p.base.y * scale + Math.sin(p.angle + time*0.001 + p.phase) * p.dispersion * disperse;
            ctx.beginPath();
            ctx.arc(cx + px, cy + py, config.particleSize, 0, 2 * Math.PI);
            ctx.fillStyle = config.particleColor;
            ctx.globalAlpha = 0.85;
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;

        requestAnimationFrame(animate);
    }
    animate(0);
})();
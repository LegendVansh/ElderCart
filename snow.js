// Lightweight falling snow effect using a full-screen canvas
(function(){
    try {
        const canvas = document.createElement('canvas');
        canvas.id = 'snow-canvas';
        canvas.style.position = 'fixed';
        canvas.style.left = '0';
        canvas.style.top = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        function resize(){
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        const flakes = [];
        const FLake_COUNT = Math.max(24, Math.floor((canvas.width * canvas.height) / 160000));
        for(let i=0;i<FLake_COUNT;i++){
            flakes.push({
                x: Math.random()*canvas.width,
                y: Math.random()*canvas.height,
                r: 1 + Math.random()*3.5,
                d: Math.random()*FLake_COUNT,
                // even slower base speed (gentle fall)
                speed: 0.08 + Math.random()*0.5
            });
        }

        let angle = 0;
        function draw(){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            // very gentle wind/oscillation
            angle += 0.0025;
            for(let i=0;i<flakes.length;i++){
                const f = flakes[i];
                ctx.beginPath();
                ctx.fillStyle = 'rgba(255,255,255,0.92)';
                ctx.arc(f.x, f.y, f.r, 0, Math.PI*2);
                ctx.fill();

                // update positions (further reduced vertical and horizontal movement)
                f.y += (Math.cos(angle + f.d) * 0.35) + f.speed + f.r*0.18;
                f.x += Math.sin(angle) * 0.18;

                // recycle
                if(f.y > canvas.height + 12){
                    flakes[i] = { x: Math.random()*canvas.width, y: -12, r: f.r, d: f.d, speed: f.speed };
                }
            }
            requestAnimationFrame(draw);
        }

        // pause animation on hidden tabs to save CPU
        let running = true;
        document.addEventListener('visibilitychange', function(){
            running = !document.hidden;
            if(running) requestAnimationFrame(draw);
        });

        requestAnimationFrame(draw);
    } catch(e) {
        console.error('Snow effect failed to initialize', e);
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    // Get user data
    const user = JSON.parse(localStorage.getItem('user')) || { 
        name: 'Guest', 
        email: 'guest@example.com' 
    };

    // Display user data
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-email').textContent = user.email;

    // Logout button
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });

    // Confetti effect
    const canvas = document.getElementById('confetti-canvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const ctx = canvas.getContext('2d');
        const pieces = [];
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
        
        // Create confetti pieces
        for (let i = 0; i < 150; i++) {
            pieces.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                rotation: Math.random() * 360,
                size: Math.random() * 10 + 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: Math.random() * 3 + 2,
                sway: Math.random() * 2 - 1,
                swaySpeed: Math.random() * 0.02 + 0.01
            });
        }
        
        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            pieces.forEach(p => {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
                
                ctx.restore();
                
                p.y += p.speed;
                p.x += p.sway;
                p.rotation += 1;
                p.sway = Math.sin(Date.now() * p.swaySpeed) * 2;
                
                if (p.y > canvas.height) {
                    p.y = -p.size;
                    p.x = Math.random() * canvas.width;
                }
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }
});
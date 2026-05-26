import React, { useEffect, useRef } from 'react';

const TechBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const nodes: { x: number, y: number, z: number, vx: number, vy: number, vz: number }[] = [];
    const numNodes = Math.min(150, Math.floor((width * height) / 10000)); // responsive count
    const maxZ = 1000;

    for (let i = 0; i < numNodes; i++) {
        nodes.push({
            x: Math.random() * width * 2 - width,
            y: Math.random() * height * 2 - height,
            z: Math.random() * maxZ,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            vz: (Math.random() - 0.5) * 4
        });
    }

    let animationFrameId: number;
    let mouseX = width / 2;
    let mouseY = height / 2;
    
    const handleMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }
    
    window.addEventListener('mousemove', handleMouseMove);

    // Get the current CSS variable for neon-green or fallback
    let neonColor = '0, 255, 136'; // default
    try {
        const computed = getComputedStyle(document.documentElement).getPropertyValue('--color-neon-green').trim();
        if (computed.startsWith('#')) {
            const r = parseInt(computed.slice(1, 3), 16);
            const g = parseInt(computed.slice(3, 5), 16);
            const b = parseInt(computed.slice(5, 7), 16);
            neonColor = `${r}, ${g}, ${b}`;
        }
    } catch(e){}

    const render = () => {
        ctx.fillStyle = 'rgba(5, 5, 5, 0.3)'; // slight trail
        ctx.fillRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;
        const offsetX = (mouseX - cx) * 0.05;
        const offsetY = (mouseY - cy) * 0.05;

        // Update and project
        const projectedNodes: { px: number, py: number, pz: number, opacity: number }[] = [];

        for (let i = 0; i < numNodes; i++) {
            const node = nodes[i];

            // move
            node.x += node.vx;
            node.y += node.vy - 1.5; // Flow upwards natively
            node.z += node.vz;

            // wrap smoothly
            if (node.x > width * 1.5) node.x = -width * 1.5;
            if (node.x < -width * 1.5) node.x = width * 1.5;
            if (node.y < -height * 1.5) {
                node.y = height * 1.5;
                node.x = Math.random() * width * 2 - width;
            }
            if (node.y > height * 1.5) node.y = -height * 1.5;
            
            // wrap depth
            if (node.z <= 0) { node.z = maxZ; }
            else if (node.z > maxZ) { node.z = 0; }

            const k = 400.0 / node.z;
            const px = node.x * k + cx - offsetX;
            const py = node.y * k + cy - offsetY;
            
            const opacity = Math.max(0, 1 - node.z / maxZ);
            
            projectedNodes.push({ px, py, pz: node.z, opacity });
            
            // draw node
            if (px >= 0 && px <= width && py >= 0 && py <= height) {
                const size = Math.max(0.1, (1 - node.z / maxZ) * 2.5);
                ctx.beginPath();
                ctx.arc(px, py, size, 0, Math.PI * 2);
                ctx.fillStyle = i % 3 === 0 ? `rgba(${neonColor}, ${opacity})` : `rgba(255, 255, 255, ${opacity * 0.5})`;
                ctx.fill();
            }
        }

        // draw connections (Plexus effect)
        for (let i = 0; i < projectedNodes.length; i++) {
            for (let j = i + 1; j < projectedNodes.length; j++) {
                const a = projectedNodes[i];
                const b = projectedNodes[j];
                
                // Only connect if somewhat close in 3D depth and close in 2D space
                const dist2D = Math.hypot(a.px - b.px, a.py - b.py);
                const maxDist = 120;
                
                if (dist2D < maxDist && Math.abs(a.pz - b.pz) < 200) {
                    const avgOpacity = (a.opacity + b.opacity) / 2;
                    const lineOpacity = avgOpacity * (1 - dist2D / maxDist) * 0.4;
                    
                    if (lineOpacity > 0.02) {
                        ctx.beginPath();
                        ctx.moveTo(a.px, a.py);
                        ctx.lineTo(b.px, b.py);
                        ctx.strokeStyle = `rgba(${neonColor}, ${lineOpacity})`;
                        ctx.lineWidth = 0.5 + (1 - a.pz/maxZ)*0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen"
      style={{ background: 'transparent' }}
    />
  );
};

export default TechBackground;

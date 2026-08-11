import React, { useEffect, useRef } from 'react';

interface Futuristic3DCanvasProps {
  className?: string;
  theme?: 'cyber' | 'hologram' | 'matrix';
}

export const Futuristic3DCanvas: React.FC<Futuristic3DCanvasProps> = ({
  className = '',
  theme = 'cyber'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse tracking for 3D tilt
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let rotX = 0;
    let rotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;
      mouseX = x / (width / 2);
      mouseY = y / (height / 2);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 3D Sphere Node System
    const numNodes = 75;
    const sphereRadius = Math.min(width, height) * 0.32;
    const nodes: Array<{
      x: number;
      y: number;
      z: number;
      origX: number;
      origY: number;
      origZ: number;
      size: number;
      pulse: number;
      speed: number;
      label?: string;
    }> = [];

    // Initialize Fibonacci sphere distribution
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < numNodes; i++) {
      const theta = 2 * Math.PI * i / goldenRatio;
      const phi = Math.acos(1 - 2 * (i + 0.5) / numNodes);
      const x = sphereRadius * Math.cos(theta) * Math.sin(phi);
      const y = sphereRadius * Math.sin(theta) * Math.sin(phi);
      const z = sphereRadius * Math.cos(phi);

      nodes.push({
        x,
        y,
        z,
        origX: x,
        origY: y,
        origZ: z,
        size: Math.random() * 2.5 + 2,
        pulse: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.03,
        label: i % 12 === 0 ? `NODE-0x${(i * 137).toString(16).slice(0, 4).toUpperCase()}` : undefined
      });
    }

    // Outer cybernetic orbiting rings
    const rings = [
      { radius: sphereRadius * 1.35, tiltX: 0.6, tiltZ: 0.3, speed: 0.012, color: 'rgba(168, 85, 247, 0.4)' },
      { radius: sphereRadius * 1.55, tiltX: -0.5, tiltZ: 0.8, speed: -0.008, color: 'rgba(59, 130, 246, 0.35)' },
      { radius: sphereRadius * 1.75, tiltX: 0.2, tiltZ: -0.6, speed: 0.015, color: 'rgba(16, 185, 129, 0.3)' }
    ];

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      targetRotX = mouseY * 0.45;
      targetRotY = mouseX * 0.6;
      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.05;

      angle += 0.008;

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw glowing central core aura
      const coreGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        sphereRadius * 0.1,
        centerX,
        centerY,
        sphereRadius * 1.2
      );
      coreGradient.addColorStop(0, 'rgba(147, 51, 234, 0.25)');
      coreGradient.addColorStop(0.4, 'rgba(79, 70, 229, 0.12)');
      coreGradient.addColorStop(0.8, 'rgba(16, 185, 129, 0.04)');
      coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sphereRadius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Transform and project 3D Nodes
      const currentRotY = angle + rotY;
      const currentRotX = rotX;

      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);
      const cosX = Math.cos(currentRotX);
      const sinX = Math.sin(currentRotX);

      const projectedNodes: Array<{
        px: number;
        py: number;
        pz: number;
        size: number;
        alpha: number;
        label?: string;
      }> = [];

      nodes.forEach((node) => {
        // Rotate around Y
        const x1 = node.origX * cosY - node.origZ * sinY;
        const z1 = node.origZ * cosY + node.origX * sinY;

        // Rotate around X
        const y2 = node.origY * cosX - z1 * sinX;
        const z2 = z1 * cosX + node.origY * sinX;

        // Perspective projection
        const fov = 420;
        const scale = fov / (fov + z2);
        const px = centerX + x1 * scale;
        const py = centerY + y2 * scale;
        const alpha = Math.max(0.15, (z2 + sphereRadius) / (sphereRadius * 2));

        node.pulse += node.speed;
        const pulseSize = node.size * (1 + Math.sin(node.pulse) * 0.25);

        projectedNodes.push({
          px,
          py,
          pz: z2,
          size: pulseSize * scale,
          alpha,
          label: node.label
        });
      });

      // Sort by Z for proper depth
      projectedNodes.sort((a, b) => a.pz - b.pz);

      // Draw node connection lattices (cryptographic consensus links)
      ctx.lineWidth = 0.8;
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const n1 = projectedNodes[i];
          const n2 = projectedNodes[j];
          const dist = Math.hypot(n1.px - n2.px, n1.py - n2.py);

          if (dist < 75) {
            const linkAlpha = (1 - dist / 75) * 0.35 * Math.min(n1.alpha, n2.alpha);
            ctx.strokeStyle = `rgba(168, 85, 247, ${linkAlpha})`;
            ctx.beginPath();
            ctx.moveTo(n1.px, n1.py);
            ctx.lineTo(n2.px, n2.py);
            ctx.stroke();
          }
        }
      }

      // Draw Orbiting Rings
      rings.forEach((ring) => {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(ring.tiltZ + angle * ring.speed * 2);
        ctx.scale(1, Math.cos(ring.tiltX + rotX * 0.5));

        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([8, 12]);
        ctx.beginPath();
        ctx.arc(0, 0, ring.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Orbiting satellite data packet on the ring
        const satAngle = angle * ring.speed * 8;
        const satX = Math.cos(satAngle) * ring.radius;
        const satY = Math.sin(satAngle) * ring.radius;

        ctx.setLineDash([]);
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(satX, satY, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
      });

      // Draw 3D Nodes & Labels
      projectedNodes.forEach((node) => {
        const glow = node.alpha > 0.6;
        ctx.fillStyle = glow
          ? `rgba(52, 211, 153, ${node.alpha})`
          : `rgba(192, 132, 252, ${node.alpha})`;

        if (glow) {
          ctx.shadowColor = '#34d399';
          ctx.shadowBlur = 8;
        }

        ctx.beginPath();
        ctx.arc(node.px, node.py, node.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Render node HUD tag for select nodes
        if (node.label && node.alpha > 0.75) {
          ctx.fillStyle = 'rgba(226, 232, 240, 0.85)';
          ctx.font = '8px monospace';
          ctx.fillText(node.label, node.px + 8, node.py + 3);

          // Connection line to tag
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(node.px, node.py);
          ctx.lineTo(node.px + 6, node.py);
          ctx.stroke();
        }
      });

      // Futuristic Scanline overlay
      ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 1);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <div className={`relative w-full h-full min-h-[380px] flex items-center justify-center overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />
      
      {/* Sci-Fi HUD Crosshairs & telemetry markers */}
      <div className="absolute top-4 left-4 font-mono text-[9px] text-purple-400/80 uppercase tracking-widest pointer-events-none flex flex-col gap-1">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>CONSENSUS ENGINE // 3D LEDGER</span>
        </span>
        <span className="text-slate-500">NODES: 75 ACTIVE // BYZANTINE FAULT TOLERANCE</span>
      </div>

      <div className="absolute bottom-4 right-4 font-mono text-[9px] text-slate-500 uppercase tracking-widest pointer-events-none text-right">
        <span>ZERO-KNOWLEDGE VERIFIER v3.4</span>
        <div className="text-emerald-400/80 font-bold">LATENCY: 12ms // ETHEREUM TESTNET</div>
      </div>
    </div>
  );
};

export default Futuristic3DCanvas;

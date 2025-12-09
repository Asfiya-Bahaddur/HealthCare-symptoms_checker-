import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

export function FloatingDNA() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 600;

    let animationFrameId: number;
    let time = 0;

    const drawDNA = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const helixRadius = 80;
      const verticalSpacing = 15;
      const numPoints = 40;

      // Draw DNA helix
      for (let i = 0; i < numPoints; i++) {
        const y = (i * verticalSpacing) + (time * 2) % (canvas.height + 100) - 100;
        const angle = (i * 0.5) + time * 0.02;
        
        // Left strand
        const x1 = centerX + Math.cos(angle) * helixRadius;
        const x2 = centerX - Math.cos(angle) * helixRadius;
        
        // Create gradient for glow effect
        const gradient1 = ctx.createRadialGradient(x1, y, 0, x1, y, 10);
        gradient1.addColorStop(0, `rgba(59, 130, 246, ${1 - (i / numPoints) * 0.5})`);
        gradient1.addColorStop(1, 'rgba(59, 130, 246, 0)');
        
        const gradient2 = ctx.createRadialGradient(x2, y, 0, x2, y, 10);
        gradient2.addColorStop(0, `rgba(168, 85, 247, ${1 - (i / numPoints) * 0.5})`);
        gradient2.addColorStop(1, 'rgba(168, 85, 247, 0)');

        // Draw nucleotide pairs
        ctx.strokeStyle = `rgba(147, 197, 253, ${0.3 + Math.sin(angle) * 0.2})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();

        // Draw left strand point
        ctx.fillStyle = gradient1;
        ctx.beginPath();
        ctx.arc(x1, y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw right strand point
        ctx.fillStyle = gradient2;
        ctx.beginPath();
        ctx.arc(x2, y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Add connecting bonds
        if (Math.abs(Math.cos(angle)) > 0.7) {
          const bondY = y;
          const bondX1 = x1 + (x2 - x1) * 0.3;
          const bondX2 = x1 + (x2 - x1) * 0.7;
          
          ctx.fillStyle = 'rgba(236, 72, 153, 0.6)';
          ctx.beginPath();
          ctx.arc(bondX1, bondY, 3, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(bondX2, bondY, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      time += 1;
      animationFrameId = requestAnimationFrame(drawDNA);
    };

    drawDNA();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <motion.div
      animate={{
        rotateY: [0, 10, 0, -10, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="relative w-full h-[600px] flex items-center justify-center"
    >
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto"
      />
      
      {/* Floating particles */}
      <motion.div
        animate={{
          y: [-20, 20, -20],
          x: [-10, 10, -10],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-10 left-10 w-4 h-4 bg-blue-400 rounded-full blur-sm opacity-60"
      />
      <motion.div
        animate={{
          y: [20, -20, 20],
          x: [10, -10, 10],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-10 right-10 w-6 h-6 bg-purple-400 rounded-full blur-sm opacity-60"
      />
      <motion.div
        animate={{
          y: [-15, 15, -15],
          x: [15, -15, 15],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute top-1/2 right-20 w-3 h-3 bg-pink-400 rounded-full blur-sm opacity-60"
      />
    </motion.div>
  );
}

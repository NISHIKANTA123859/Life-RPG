import React, { useEffect, useRef } from 'react';
import { rpgEvents, RPGEventDetail } from './rpgEvents';

interface Props {
  currentPage: string;
}

// Interface for interactive nodes/particles
interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  color: string;
  pulseSpeed: number;
  pulsePhase: number;
  type: 'xp' | 'quest' | 'gold' | 'skill';
}

interface Symbol {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotSpeed: number;
  alpha: number;
  type: 'sword' | 'shield' | 'crown' | 'star' | 'rune' | 'xp';
}

interface EnergyStream {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  amplitude: number;
  frequency: number;
  width: number;
  color: string;
  phase: number;
}

interface EventPulse {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
  lineWidth: number;
  type: 'quest' | 'level' | 'achievement' | 'gold';
}

interface Trail {
  x: number;
  y: number;
  length: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
}

export const RPGCanvas: React.FC<Props> = ({ currentPage }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });
  const scrollRef = useRef(0);
  const themeColorsRef = useRef({ primary: '#8B5CF6', secondary: '#22D3EE', gold: '#F5B92C' });

  // Update theme colors based on page
  useEffect(() => {
    switch (currentPage) {
      case 'quests':
        themeColorsRef.current = { primary: '#8B5CF6', secondary: '#38BDF8', gold: '#F5B92C' };
        break;
      case 'character':
        themeColorsRef.current = { primary: '#EC4899', secondary: '#8B5CF6', gold: '#34D399' };
        break;
      case 'skills':
        themeColorsRef.current = { primary: '#10B981', secondary: '#06B6D4', gold: '#F5B92C' };
        break;
      case 'ai-intel':
        themeColorsRef.current = { primary: '#06B6D4', secondary: '#8B5CF6', gold: '#F43F5E' };
        break;
      case 'achievements':
        themeColorsRef.current = { primary: '#F5B92C', secondary: '#8B5CF6', gold: '#F97316' };
        break;
      case 'shop':
        themeColorsRef.current = { primary: '#F5B92C', secondary: '#EAB308', gold: '#F97316' };
        break;
      case 'inventory':
        themeColorsRef.current = { primary: '#22D3EE', secondary: '#6366F1', gold: '#F5B92C' };
        break;
      case 'activity':
        themeColorsRef.current = { primary: '#6366F1', secondary: '#A855F7', gold: '#34D399' };
        break;
      case 'leaderboard':
        themeColorsRef.current = { primary: '#F97316', secondary: '#F5B92C', gold: '#8B5CF6' };
        break;
      default:
        themeColorsRef.current = { primary: '#8B5CF6', secondary: '#22D3EE', gold: '#F5B92C' };
        break;
    }
  }, [currentPage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = width < 768;

    // Handle resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse listener
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Scroll listener
    const handleScroll = () => {
      scrollRef.current = window.scrollY || document.documentElement.scrollTop || 0;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initialize 9-layer state
    // ----------------------------------------------------
    // Layer 1: Atmospheric light blobs
    const blobs = [
      { x: width * 0.2, y: height * 0.3, radius: 450, color: '#1E1B4B', angle: 0, speed: 0.003 },
      { x: width * 0.8, y: height * 0.2, radius: 500, color: '#132E48', angle: 2, speed: 0.002 },
      { x: width * 0.5, y: height * 0.75, radius: 550, color: '#2E1065', angle: 4, speed: 0.0025 },
      { x: width * 0.15, y: height * 0.8, radius: 400, color: '#042F2E', angle: 1, speed: 0.0018 },
    ];

    // Layer 2: Grid offset
    let gridOffsetZ = 0;

    // Layer 3: Energy streams
    const streamsCount = isMobile ? 3 : 6;
    const energyStreams: EnergyStream[] = Array.from({ length: streamsCount }, (_, i) => ({
      x: (width / streamsCount) * i + Math.random() * 100,
      y: Math.random() * height,
      length: 250 + Math.random() * 300,
      speed: 0.5 + Math.random() * 0.8,
      angle: (Math.PI / 6) + (Math.random() * Math.PI) / 12,
      amplitude: 25 + Math.random() * 35,
      frequency: 0.005 + Math.random() * 0.005,
      width: 1.2 + Math.random() * 1.5,
      color: i % 2 === 0 ? '#8B5CF6' : '#22D3EE',
      phase: Math.random() * Math.PI * 2,
    }));

    // Layer 4: Quest Orbs / Nodes
    const nodeCount = isMobile ? 18 : 45;
    const nodes: Node[] = Array.from({ length: nodeCount }, () => {
      const colors = ['#8B5CF6', '#22D3EE', '#34D399', '#F5B92C'];
      const types: ('xp' | 'quest' | 'gold' | 'skill')[] = ['xp', 'quest', 'gold', 'skill'];
      const idx = Math.floor(Math.random() * colors.length);
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: 1.8 + Math.random() * 2.2,
        baseAlpha: 0.25 + Math.random() * 0.4,
        alpha: 0.3,
        color: colors[idx],
        pulseSpeed: 0.01 + Math.random() * 0.02,
        pulsePhase: Math.random() * Math.PI * 2,
        type: types[idx],
      };
    });

    // Layer 5: RPG Holographic Symbols
    const symbolCount = isMobile ? 4 : 8;
    const symbolTypes: ('sword' | 'shield' | 'crown' | 'star' | 'rune' | 'xp')[] = [
      'sword', 'shield', 'crown', 'star', 'rune', 'xp'
    ];
    const symbols: Symbol[] = Array.from({ length: symbolCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -0.1 - Math.random() * 0.15,
      size: 16 + Math.random() * 14,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.005,
      alpha: 0.04 + Math.random() * 0.05,
      type: symbolTypes[Math.floor(Math.random() * symbolTypes.length)],
    }));

    // Layer 6: XP Particles
    const particleCount = isMobile ? 25 : 60;
    const xpParticles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: -0.2 - Math.random() * 0.4,
      radius: 1 + Math.random() * 1.5,
      alpha: 0.15 + Math.random() * 0.35,
      color: Math.random() > 0.4 ? '#34D399' : '#22D3EE',
    }));

    // Layer 7: XP Flow Trails
    const trails: Trail[] = [];

    // Active Event Pulses
    const pulses: EventPulse[] = [];

    // Subscribe to RPG events
    const unsubscribeEvents = rpgEvents.subscribe((detail: RPGEventDetail) => {
      const px = detail.x || width / 2;
      const py = detail.y || height / 3;

      if (detail.type === 'quest_complete') {
        pulses.push({
          x: px,
          y: py,
          radius: 10,
          maxRadius: Math.max(width, height) * 0.45,
          color: '#34D399',
          alpha: 0.8,
          lineWidth: 3,
          type: 'quest',
        });
        // Generate burst particles
        for (let i = 0; i < 20; i++) {
          const angle = Math.random() * Math.PI * 2;
          const spd = 1.5 + Math.random() * 3;
          xpParticles.push({
            x: px,
            y: py,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd,
            radius: 2 + Math.random() * 2,
            alpha: 0.9,
            color: '#34D399',
          });
        }
      } else if (detail.type === 'level_up') {
        pulses.push({
          x: px,
          y: py,
          radius: 10,
          maxRadius: Math.max(width, height) * 0.65,
          color: '#F5B92C',
          alpha: 1.0,
          lineWidth: 5,
          type: 'level',
        });
        pulses.push({
          x: px,
          y: py,
          radius: 5,
          maxRadius: Math.max(width, height) * 0.5,
          color: '#8B5CF6',
          alpha: 0.8,
          lineWidth: 3,
          type: 'level',
        });
        for (let i = 0; i < 35; i++) {
          const angle = Math.random() * Math.PI * 2;
          const spd = 2 + Math.random() * 4;
          xpParticles.push({
            x: px,
            y: py,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd,
            radius: 2.5 + Math.random() * 2.5,
            alpha: 1.0,
            color: i % 2 === 0 ? '#F5B92C' : '#22D3EE',
          });
        }
      } else if (detail.type === 'achievement_unlock') {
        pulses.push({
          x: px,
          y: py,
          radius: 10,
          maxRadius: Math.max(width, height) * 0.4,
          color: '#F5B92C',
          alpha: 0.85,
          lineWidth: 3,
          type: 'achievement',
        });
      } else if (detail.type === 'gold_gain') {
        for (let i = 0; i < 12; i++) {
          trails.push({
            x: px + (Math.random() - 0.5) * 80,
            y: py + Math.random() * 40,
            length: 20 + Math.random() * 30,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: -2 - Math.random() * 2.5,
            color: '#F5B92C',
            alpha: 0.9,
          });
        }
      }
    });

    // Helper: Draw Holographic Vector Symbols
    const drawSymbol = (ctx: CanvasRenderingContext2D, sym: Symbol) => {
      ctx.save();
      ctx.translate(sym.x, sym.y + scrollRef.current * 0.05);
      ctx.rotate(sym.rotation);
      ctx.strokeStyle = themeColorsRef.current.primary;
      ctx.globalAlpha = sym.alpha;
      ctx.lineWidth = 1.2;

      const s = sym.size;
      ctx.beginPath();
      if (sym.type === 'sword') {
        ctx.moveTo(0, -s);
        ctx.lineTo(0, s * 0.6);
        ctx.moveTo(-s * 0.3, s * 0.2);
        ctx.lineTo(s * 0.3, s * 0.2);
        ctx.arc(0, s * 0.7, s * 0.1, 0, Math.PI * 2);
      } else if (sym.type === 'shield') {
        ctx.moveTo(0, -s * 0.8);
        ctx.lineTo(s * 0.6, -s * 0.5);
        ctx.lineTo(s * 0.5, s * 0.3);
        ctx.lineTo(0, s * 0.8);
        ctx.lineTo(-s * 0.5, s * 0.3);
        ctx.lineTo(-s * 0.6, -s * 0.5);
        ctx.closePath();
      } else if (sym.type === 'crown') {
        ctx.moveTo(-s * 0.6, s * 0.4);
        ctx.lineTo(-s * 0.6, -s * 0.3);
        ctx.lineTo(-s * 0.2, 0);
        ctx.lineTo(0, -s * 0.6);
        ctx.lineTo(s * 0.2, 0);
        ctx.lineTo(s * 0.6, -s * 0.3);
        ctx.lineTo(s * 0.6, s * 0.4);
        ctx.closePath();
      } else if (sym.type === 'star') {
        for (let i = 0; i < 5; i++) {
          const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
          const aInner = a + Math.PI / 5;
          ctx.lineTo(Math.cos(a) * s * 0.6, Math.sin(a) * s * 0.6);
          ctx.lineTo(Math.cos(aInner) * s * 0.25, Math.sin(aInner) * s * 0.25);
        }
        ctx.closePath();
      } else if (sym.type === 'rune') {
        ctx.moveTo(0, -s * 0.7);
        ctx.lineTo(0, s * 0.7);
        ctx.moveTo(-s * 0.4, -s * 0.3);
        ctx.lineTo(s * 0.4, 0);
        ctx.lineTo(-s * 0.4, s * 0.3);
      } else {
        // XP Badge
        ctx.moveTo(0, -s * 0.6);
        ctx.lineTo(s * 0.5, 0);
        ctx.lineTo(0, s * 0.6);
        ctx.lineTo(-s * 0.5, 0);
        ctx.closePath();
      }
      ctx.stroke();
      ctx.restore();
    };

    // Main Render Loop
    // ----------------------------------------------------
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      // --------------------------------------------------
      // LAYER 1: Deep Atmospheric Gradient & Orbiting Lights
      // --------------------------------------------------
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#090B12');
      bgGrad.addColorStop(0.5, '#0B0D16');
      bgGrad.addColorStop(1, '#07090F');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      blobs.forEach((blob) => {
        blob.angle += blob.speed;
        const bx = blob.x + Math.sin(blob.angle) * 40;
        const by = blob.y + Math.cos(blob.angle) * 30;

        const radial = ctx.createRadialGradient(bx, by, 0, bx, by, blob.radius);
        radial.addColorStop(0, blob.color);
        radial.addColorStop(1, 'transparent');

        ctx.fillStyle = radial;
        ctx.globalAlpha = 0.28;
        ctx.beginPath();
        ctx.arc(bx, by, blob.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // --------------------------------------------------
      // LAYER 2: Futuristic 3D Perspective Grid
      // --------------------------------------------------
      ctx.save();
      const horizonY = height * 0.35;
      const perspectiveCenter = width / 2;

      gridOffsetZ = (gridOffsetZ + 0.4) % 40;

      ctx.strokeStyle = themeColorsRef.current.primary;
      ctx.lineWidth = 0.7;
      ctx.globalAlpha = 0.045;

      // Perspective lines extending from horizon to bottom
      const persCount = isMobile ? 12 : 24;
      for (let i = 0; i <= persCount; i++) {
        const xOnBottom = (width / persCount) * i;
        ctx.beginPath();
        ctx.moveTo(perspectiveCenter, horizonY);
        ctx.lineTo(xOnBottom, height);
        ctx.stroke();
      }

      // Horizontal grid lines moving forward
      const numH = 14;
      for (let i = 1; i <= numH; i++) {
        const ratio = (i * 40 + gridOffsetZ) / (numH * 40);
        const y = horizonY + Math.pow(ratio, 2) * (height - horizonY);
        if (y > horizonY && y < height) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }
      ctx.restore();

      // --------------------------------------------------
      // LAYER 3: Energy Flow Streams
      // --------------------------------------------------
      energyStreams.forEach((stream) => {
        stream.phase += 0.015;
        stream.y -= stream.speed * 0.4;
        if (stream.y < -stream.length) {
          stream.y = height + stream.length;
          stream.x = Math.random() * width;
        }

        ctx.save();
        ctx.beginPath();
        const pts = 25;
        for (let j = 0; j < pts; j++) {
          const progress = j / pts;
          const px = stream.x + Math.sin(stream.phase + progress * Math.PI * 2) * stream.amplitude;
          const py = stream.y - progress * stream.length + scrollRef.current * 0.08;
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }

        const streamGrad = ctx.createLinearGradient(stream.x, stream.y, stream.x, stream.y - stream.length);
        streamGrad.addColorStop(0, 'transparent');
        streamGrad.addColorStop(0.5, stream.color);
        streamGrad.addColorStop(1, 'transparent');

        ctx.strokeStyle = streamGrad;
        ctx.lineWidth = stream.width;
        ctx.globalAlpha = 0.12;
        ctx.stroke();
        ctx.restore();
      });

      // --------------------------------------------------
      // LAYER 4: Quest Orbs & Dynamic Constellation Network
      // --------------------------------------------------
      nodes.forEach((n, i) => {
        n.pulsePhase += n.pulseSpeed;
        n.alpha = n.baseAlpha + Math.sin(n.pulsePhase) * 0.15;

        // Move nodes
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Cursor attraction
        if (mouseRef.current.x > 0) {
          const dx = mouseRef.current.x - n.x;
          const dy = mouseRef.current.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = (150 - dist) / 150;
            n.x += (dx / dist) * force * 0.8;
            n.y += (dy / dist) * force * 0.8;
            n.alpha = Math.min(0.85, n.alpha + force * 0.3);
          }
        }

        // Draw connections to nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n.x - n2.x;
          const dy = n.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < (isMobile ? 80 : 120)) {
            const lineAlpha = (1 - dist / (isMobile ? 80 : 120)) * 0.12;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(n.x, n.y + scrollRef.current * 0.05);
            ctx.lineTo(n2.x, n2.y + scrollRef.current * 0.05);
            ctx.strokeStyle = n.color;
            ctx.globalAlpha = lineAlpha;
            ctx.lineWidth = 0.8;
            ctx.stroke();
            ctx.restore();
          }
        }

        // Draw node orb
        ctx.save();
        ctx.beginPath();
        ctx.arc(n.x, n.y + scrollRef.current * 0.05, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.globalAlpha = n.alpha;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      });

      // --------------------------------------------------
      // LAYER 5: Holographic Floating Symbols
      // --------------------------------------------------
      symbols.forEach((sym) => {
        sym.x += sym.vx;
        sym.y += sym.vy;
        sym.rotation += sym.rotSpeed;

        if (sym.y < -50) {
          sym.y = height + 50;
          sym.x = Math.random() * width;
        }
        drawSymbol(ctx, sym);
      });

      // --------------------------------------------------
      // LAYER 6: XP Energy Particles
      // --------------------------------------------------
      xpParticles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -20 || p.alpha <= 0) {
          p.y = height + 20;
          p.x = Math.random() * width;
          p.alpha = 0.15 + Math.random() * 0.35;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y + scrollRef.current * 0.04, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();

        // Remove ephemeral event particles
        if (xpParticles.length > particleCount && idx >= particleCount) {
          p.alpha -= 0.015;
        }
      });

      // --------------------------------------------------
      // LAYER 7: XP Flow Trails
      // --------------------------------------------------
      for (let i = trails.length - 1; i >= 0; i--) {
        const t = trails[i];
        t.x += t.speedX;
        t.y += t.speedY;
        t.alpha -= 0.018;

        if (t.alpha <= 0) {
          trails.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(t.x, t.y);
        ctx.lineTo(t.x - t.speedX * t.length, t.y - t.speedY * t.length);
        ctx.strokeStyle = t.color;
        ctx.globalAlpha = t.alpha;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      // --------------------------------------------------
      // LAYER 8: Interactive Cursor Aura (Non-intrusive)
      // --------------------------------------------------
      if (mouseRef.current.x > 0 && !isMobile) {
        const cursorGlow = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          180
        );
        cursorGlow.addColorStop(0, themeColorsRef.current.secondary);
        cursorGlow.addColorStop(1, 'transparent');

        ctx.save();
        ctx.fillStyle = cursorGlow;
        ctx.globalAlpha = 0.045;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 180, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // --------------------------------------------------
      // REACTION PULSES (Quest Complete, Level Up, Gold)
      // --------------------------------------------------
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        pulse.radius += (pulse.maxRadius - pulse.radius) * 0.06 + 2;
        pulse.alpha -= 0.015;

        if (pulse.alpha <= 0 || pulse.radius >= pulse.maxRadius) {
          pulses.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
        ctx.strokeStyle = pulse.color;
        ctx.lineWidth = pulse.lineWidth;
        ctx.globalAlpha = pulse.alpha;
        ctx.shadowColor = pulse.color;
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.restore();
      }

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      unsubscribeEvents();
    };
  }, []);

  return <canvas ref={canvasRef} className="rpg-bg-canvas" />;
};

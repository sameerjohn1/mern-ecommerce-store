import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Sparkles, ShieldCheck, Zap } from "lucide-react";

const HeroSection = () => {
  const mountRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const cardRef = useRef(null);

  // Three.js 3D Particle Sphere Initialization
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 6.5;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particle Configuration
    const count = 1800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sphereRadius = 3;

    // Sphere coordinates creation with mathematical noise/waves
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      const r = sphereRadius * (0.85 + Math.random() * 0.3);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Emerald Green & Cyan/Aqua color palette
      const colorRatio = Math.random();
      colors[i * 3] = 0.05; // R
      colors[i * 3 + 1] = 0.5 + colorRatio * 0.45; // G (rich emerald ranges)
      colors[i * 3 + 2] = 0.4 + (1 - colorRatio) * 0.45; // B (cyan shades)
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Smooth circular dot texture for particles
    const canvasTexture = document.createElement("canvas");
    canvasTexture.width = 16;
    canvasTexture.height = 16;
    const ctx = canvasTexture.getContext("2d");
    const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 16, 16);
    const texture = new THREE.CanvasTexture(canvasTexture);

    const material = new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      map: texture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
    };

    container.addEventListener("mousemove", onMouseMove);

    // Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId;

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      // Gentle auto-rotation
      particleSystem.rotation.y = elapsedTime * 0.06;
      particleSystem.rotation.x = elapsedTime * 0.03;

      // Parallax mouse damping
      targetX += (mouseX - targetX) * 0.06;
      targetY += (mouseY - targetY) * 0.06;

      particleSystem.rotation.y += targetX * 0.45;
      particleSystem.rotation.x += -targetY * 0.45;

      // Micro-wave distortion on particle depth based on time
      const posArr = geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        const x = posArr[i * 3];
        const y = posArr[i * 3 + 1];
        const z = posArr[i * 3 + 2];
        
        // Push slightly outwards using sine wave formula
        const angle = Math.atan2(y, x);
        const dist = Math.sqrt(x * x + y * y);
        const wave = Math.sin(dist * 2.0 - elapsedTime * 2.5) * 0.01;
        
        posArr[i * 3] += Math.cos(angle) * wave;
        posArr[i * 3 + 1] += Math.sin(angle) * wave;
      }
      geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = window.requestAnimationFrame(tick);
    };

    tick();

    // Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", onMouseMove);
      window.cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, []);

  // GSAP Entry Animations
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, delay: 0.2 }
    )
      .fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        "-=0.9"
      )
      .fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.7"
      )
      .fromTo(
        statsRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.6"
      )
      .fromTo(
        cardRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "back.out(1.6)" },
        "-=1.1"
      );
  }, []);

  const scrollToCollection = () => {
    const element = document.getElementById("collection");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 pb-12 sm:pb-0">
      
      {/* Background visual graphics */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(circle, #34d399 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-8 select-none">
            
            {/* Tagline Badge */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 text-xs font-semibold uppercase tracking-wider w-fit"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '4s' }} />
              Discover the Future of Fashion
            </motion.div>

            {/* Title */}
            <div ref={titleRef} className="space-y-4">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-white">
                Elevate Your Style <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-cyan-400 animate-pulse" style={{ animationDuration: '3s' }}>
                  Sustainably
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p ref={subtitleRef} className="text-base sm:text-lg text-gray-300 max-w-xl leading-relaxed">
              Explore our premium, eco-friendly curation built for the next generation. Blending state-of-the-art designs with absolute organic comfort.
            </p>

            {/* CTAs */}
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={scrollToCollection}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-gray-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
              >
                Shop Collection
                <ShoppingBag className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                whileTap={{ scale: 0.98 }}
                onClick={scrollToCollection}
                className="px-8 py-4 border border-gray-700 hover:border-emerald-500/50 text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                Learn More
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </motion.button>
            </div>

            {/* Value Props & Trust Badges */}
            <div ref={statsRef} className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-800/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">100%</h4>
                  <p className="text-[11px] text-gray-400">Organic Fabric</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">Fast</h4>
                  <p className="text-[11px] text-gray-400">Secure Delivery</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">4.9 ★</h4>
                  <p className="text-[11px] text-gray-400">Customer Rating</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right 3D Visual Column */}
          <div className="lg:col-span-5 flex justify-center items-center relative min-h-[350px] sm:min-h-[450px] w-full">
            
            {/* Glassmorphic border container */}
            <div 
              ref={cardRef}
              className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] rounded-3xl border border-gray-700/60 bg-gray-900/40 backdrop-blur-lg shadow-2xl p-4 flex items-center justify-center overflow-hidden group hover:border-emerald-500/40 transition-all duration-500"
            >
              {/* Corner tech details */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-emerald-500/40" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-emerald-500/40" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-emerald-500/40" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-emerald-500/40" />

              {/* Three.js canvas mount point */}
              <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

              {/* Centered micro overlay label */}
              <div className="absolute bottom-6 bg-gray-950/80 px-4 py-1.5 rounded-full border border-gray-800 text-[10px] uppercase font-bold tracking-widest text-emerald-400 pointer-events-none select-none">
                Interactive 3D Universe
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default HeroSection;

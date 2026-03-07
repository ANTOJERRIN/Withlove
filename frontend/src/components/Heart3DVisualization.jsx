import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const Heart3DVisualization = ({ riskPercentage = 25, className = "" }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const heartModelRef = useRef(null);
  const frameIdRef = useRef(null);
  const controlsRef = useRef({
    isDragging: false,
    prevX: 0,
    prevY: 0,
    theta: Math.PI / 4,
    phi: Math.PI / 2.5,
    autoRotate: true
  });

  // Calculate colors based on risk
  const { color, emissiveColor, beatSpeed } = useMemo(() => {
    if (riskPercentage <= 40) {
      return {
        color: 0x22C55E,
        emissiveColor: 0x4ADE80,
        beatSpeed: 0.8
      };
    } else if (riskPercentage <= 70) {
      return {
        color: 0xEAB308,
        emissiveColor: 0xFACC15,
        beatSpeed: 1.2
      };
    } else {
      return {
        color: 0xEF4444,
        emissiveColor: 0xF87171,
        beatSpeed: 1.8
      };
    }
  }, [riskPercentage]);

  const getStatusText = () => {
    if (riskPercentage <= 40) return { text: "Healthy Heart", color: "text-green-500", bgColor: "bg-green-500" };
    if (riskPercentage <= 70) return { text: "Moderate Risk", color: "text-yellow-500", bgColor: "bg-yellow-500" };
    return { text: "High Risk", color: "text-red-500", bgColor: "bg-red-500" };
  };

  const status = getStatusText();

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 3.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight1.position.set(5, 5, 5);
    directionalLight1.castShadow = true;
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0x94A3B8, 0.6);
    directionalLight2.position.set(-5, 3, -5);
    scene.add(directionalLight2);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 3, 3);
    scene.add(pointLight);

    // Floating particles
    const particlesGroup = new THREE.Group();
    const particleMaterial = new THREE.MeshBasicMaterial({ 
      color: color, 
      transparent: true, 
      opacity: 0.5 
    });
    
    for (let i = 0; i < 40; i++) {
      const geometry = new THREE.SphereGeometry(Math.random() * 0.03 + 0.01, 8, 8);
      const particle = new THREE.Mesh(geometry, particleMaterial.clone());
      particle.position.set(
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5
      );
      particlesGroup.add(particle);
    }
    scene.add(particlesGroup);

    // Pulse rings
    const ringGroup = new THREE.Group();
    ringGroup.position.z = -0.5;
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });

    for (let i = 0; i < 3; i++) {
      const ringGeometry = new THREE.RingGeometry(0.6, 0.65, 64);
      const ring = new THREE.Mesh(ringGeometry, ringMaterial.clone());
      ring.userData.index = i;
      ringGroup.add(ring);
    }
    scene.add(ringGroup);

    // Load GLB model
    const loader = new GLTFLoader();
    loader.load(
      '/Heart.glb',
      (gltf) => {
        const model = gltf.scene;
        
        // Center and scale the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.5 / maxDim; // Scale to fit nicely
        
        model.position.sub(center); // Center the model
        model.scale.set(scale, scale, scale);
        model.userData.baseScale = scale;
        
        // Apply material to all meshes
        model.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: color,
              emissive: emissiveColor,
              emissiveIntensity: 0.4,
              roughness: 0.4,
              metalness: 0.3,
            });
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        scene.add(model);
        heartModelRef.current = model;
        console.log('Heart GLB model loaded successfully');
      },
      undefined,
      (error) => {
        console.error('Error loading heart model:', error);
        // Fallback: create a simple heart shape
        const heartShape = new THREE.Shape();
        heartShape.moveTo(0, 0);
        heartShape.bezierCurveTo(0, -0.3, -0.5, -0.5, -0.5, 0);
        heartShape.bezierCurveTo(-0.5, 0.3, 0, 0.6, 0, 1);
        heartShape.bezierCurveTo(0, 0.6, 0.5, 0.3, 0.5, 0);
        heartShape.bezierCurveTo(0.5, -0.5, 0, -0.3, 0, 0);

        const extrudeSettings = {
          depth: 0.4,
          bevelEnabled: true,
          bevelThickness: 0.1,
          bevelSize: 0.1,
          bevelSegments: 8
        };

        const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
        const material = new THREE.MeshStandardMaterial({
          color: color,
          emissive: emissiveColor,
          emissiveIntensity: 0.4,
          roughness: 0.4,
          metalness: 0.3,
        });
        const fallbackHeart = new THREE.Mesh(geometry, material);
        fallbackHeart.rotation.x = Math.PI;
        fallbackHeart.position.y = 0.5;
        scene.add(fallbackHeart);
        heartModelRef.current = fallbackHeart;
      }
    );

    // Mouse/Touch controls
    const handleMouseDown = (e) => {
      controlsRef.current.isDragging = true;
      controlsRef.current.autoRotate = false;
      controlsRef.current.prevX = e.clientX;
      controlsRef.current.prevY = e.clientY;
    };

    const handleMouseUp = () => {
      controlsRef.current.isDragging = false;
      setTimeout(() => {
        if (!controlsRef.current.isDragging) {
          controlsRef.current.autoRotate = true;
        }
      }, 3000);
    };

    const handleMouseMove = (e) => {
      if (!controlsRef.current.isDragging) return;
      const deltaX = e.clientX - controlsRef.current.prevX;
      const deltaY = e.clientY - controlsRef.current.prevY;
      controlsRef.current.theta -= deltaX * 0.01;
      controlsRef.current.phi = Math.max(0.5, Math.min(Math.PI - 0.5, controlsRef.current.phi + deltaY * 0.01));
      controlsRef.current.prevX = e.clientX;
      controlsRef.current.prevY = e.clientY;
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        controlsRef.current.isDragging = true;
        controlsRef.current.autoRotate = false;
        controlsRef.current.prevX = e.touches[0].clientX;
        controlsRef.current.prevY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (!controlsRef.current.isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - controlsRef.current.prevX;
      const deltaY = e.touches[0].clientY - controlsRef.current.prevY;
      controlsRef.current.theta -= deltaX * 0.01;
      controlsRef.current.phi = Math.max(0.5, Math.min(Math.PI - 0.5, controlsRef.current.phi + deltaY * 0.01));
      controlsRef.current.prevX = e.touches[0].clientX;
      controlsRef.current.prevY = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      controlsRef.current.isDragging = false;
      setTimeout(() => {
        if (!controlsRef.current.isDragging) {
          controlsRef.current.autoRotate = true;
        }
      }, 3000);
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    // Animation loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Camera orbit
      const { theta, phi, autoRotate } = controlsRef.current;
      if (autoRotate) {
        controlsRef.current.theta += 0.003;
      }
      const radius = 3.5;
      camera.position.x = radius * Math.sin(phi) * Math.cos(controlsRef.current.theta);
      camera.position.y = radius * Math.cos(phi);
      camera.position.z = radius * Math.sin(phi) * Math.sin(controlsRef.current.theta);
      camera.lookAt(0, 0, 0);

      // Heart animation
      if (heartModelRef.current) {
        const beat1 = Math.sin(time * beatSpeed * Math.PI * 2);
        const beat2 = Math.sin(time * beatSpeed * Math.PI * 4) * 0.3;
        const scale = 1 + (beat1 * 0.06 + beat2 * 0.03);
        
        const baseScale = heartModelRef.current.userData?.baseScale || 1;
        heartModelRef.current.scale.set(scale * baseScale, scale * baseScale, scale * baseScale);
        heartModelRef.current.position.y = Math.sin(time * 0.5) * 0.05;

        // Update emissive
        heartModelRef.current.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.emissiveIntensity = 0.4 + Math.sin(time * beatSpeed * Math.PI * 2) * 0.2;
          }
        });
      }

      // Particles rotation
      particlesGroup.rotation.y = time * 0.05;
      particlesGroup.rotation.x = time * 0.02;

      // Pulse rings animation
      ringGroup.children.forEach((ring, index) => {
        const offset = index * 0.5;
        const s = 0.8 + ((time * beatSpeed + offset) % 2) * 0.4;
        ring.scale.set(s, s, 1);
        ring.material.opacity = Math.max(0, 0.4 - ((time * beatSpeed + offset) % 2) * 0.2);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(frameIdRef.current);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [color, emissiveColor, beatSpeed]);

  // Update materials when risk changes
  useEffect(() => {
    if (heartModelRef.current) {
      heartModelRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.color.setHex(color);
          child.material.emissive.setHex(emissiveColor);
        }
      });
    }

    // Update particles
    if (sceneRef.current) {
      sceneRef.current.traverse((obj) => {
        if (obj.material && obj.material.opacity === 0.5) {
          obj.material.color.setHex(color);
        }
      });
    }
  }, [color, emissiveColor]);

  return (
    <div className={`relative w-full h-full min-h-[400px] ${className}`} data-testid="heart-3d-container">
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{ background: 'linear-gradient(145deg, #0F172A 0%, #1E293B 100%)' }}
      />
      
      {/* Status Overlay */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10">
        <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Heart Risk Level</p>
        <p className={`text-2xl font-bold ${status.color}`} data-testid="heart-3d-status">{status.text}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className={`w-2 h-2 rounded-full ${status.bgColor} animate-pulse`}></div>
          <p className="text-white/70 text-sm font-medium">{riskPercentage.toFixed(1)}%</p>
        </div>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md rounded-xl px-4 py-3 text-xs text-white/70 border border-white/10">
        <p className="text-white/50 text-[10px] uppercase tracking-wider mb-2">Risk Scale</p>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span>0-40%: Low Risk</span>
        </div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
          <span>41-70%: Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span>71-100%: High Risk</span>
        </div>
      </div>
      
      {/* Controls hint */}
      <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md rounded-xl px-4 py-2 text-xs text-white/60 border border-white/10">
        <p>Drag to rotate • Auto-rotating</p>
      </div>
      
      {/* 3D badge */}
      <div className="absolute top-4 right-4 bg-gradient-to-r from-teal-500/80 to-cyan-500/80 backdrop-blur-md rounded-lg px-3 py-1.5 text-xs text-white font-medium border border-white/20">
        3D Heart Model
      </div>
    </div>
  );
};

export default Heart3DVisualization;

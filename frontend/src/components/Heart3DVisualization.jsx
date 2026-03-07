import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const Heart3DVisualization = ({ riskPercentage = 25, className = "" }) => {
  const containerRef = useRef(null);
  const heartModelRef = useRef(null);
  const mixerRef = useRef(null);
  const frameIdRef = useRef(null);

  // Calculate color based on risk
  const { color, emissiveColor } = useMemo(() => {
    if (riskPercentage <= 40) {
      return {
        color: 0x22C55E,      // Green - low risk
        emissiveColor: 0x4ADE80
      };
    } else if (riskPercentage <= 70) {
      return {
        color: 0xEAB308,      // Yellow - medium risk
        emissiveColor: 0xFACC15
      };
    } else {
      return {
        color: 0xEF4444,      // Red - high risk
        emissiveColor: 0xF87171
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

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera - position at angle to see 3D shape
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(2, 2, 3);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight2.position.set(-5, 3, -5);
    scene.add(directionalLight2);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 3, 3);
    scene.add(pointLight);

    // Load GLB model
    const loader = new GLTFLoader();
    loader.load(
      '/Heart.glb',
      (gltf) => {
        const model = gltf.scene;
        
        // Get bounding box to understand model size
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Scale to fit nicely in view
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = maxDim > 0 ? 1.5 / maxDim : 1;
        
        // Center the model
        model.position.x = -center.x * scale;
        model.position.y = -center.y * scale;
        model.position.z = -center.z * scale;
        model.scale.set(scale, scale, scale);
        
        // Apply color material based on risk
        model.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: color,
              emissive: emissiveColor,
              emissiveIntensity: 0.4,
              roughness: 0.3,
              metalness: 0.2,
              side: THREE.DoubleSide
            });
          }
        });

        scene.add(model);
        heartModelRef.current = model;

        // Setup animation mixer if the model has animations
        if (gltf.animations && gltf.animations.length > 0) {
          mixerRef.current = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            const action = mixerRef.current.clipAction(clip);
            action.play();
          });
        }
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100).toFixed(0) + '%');
      },
      (error) => {
        console.error('Error loading heart model:', error);
      }
    );

    // Animation loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Update animation mixer
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }

      // Slow rotation
      if (heartModelRef.current) {
        heartModelRef.current.rotation.y += 0.005;
      }

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
      window.removeEventListener('resize', handleResize);
      
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [color, emissiveColor]);

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
      
      {/* 3D badge */}
      <div className="absolute top-4 right-4 bg-gradient-to-r from-teal-500/80 to-cyan-500/80 backdrop-blur-md rounded-lg px-3 py-1.5 text-xs text-white font-medium border border-white/20">
        3D Heart Model
      </div>
    </div>
  );
};

export default Heart3DVisualization;

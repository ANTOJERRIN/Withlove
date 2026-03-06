import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Camera controller without drei
const CameraController = () => {
  const { camera, gl } = useThree();
  const controlsRef = useRef({ isDragging: false, prevX: 0, prevY: 0, theta: 0, phi: Math.PI / 3 });
  
  useEffect(() => {
    const handleMouseDown = (e) => {
      controlsRef.current.isDragging = true;
      controlsRef.current.prevX = e.clientX;
      controlsRef.current.prevY = e.clientY;
    };
    
    const handleMouseUp = () => {
      controlsRef.current.isDragging = false;
    };
    
    const handleMouseMove = (e) => {
      if (!controlsRef.current.isDragging) return;
      
      const deltaX = e.clientX - controlsRef.current.prevX;
      const deltaY = e.clientY - controlsRef.current.prevY;
      
      controlsRef.current.theta -= deltaX * 0.005;
      controlsRef.current.phi = Math.max(0.5, Math.min(Math.PI - 0.5, controlsRef.current.phi + deltaY * 0.005));
      
      controlsRef.current.prevX = e.clientX;
      controlsRef.current.prevY = e.clientY;
    };
    
    const canvas = gl.domElement;
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gl]);
  
  useFrame((state) => {
    const { theta, phi } = controlsRef.current;
    const radius = 4;
    
    // Auto rotate slowly
    controlsRef.current.theta += 0.002;
    
    camera.position.x = radius * Math.sin(phi) * Math.cos(theta);
    camera.position.y = radius * Math.cos(phi);
    camera.position.z = radius * Math.sin(phi) * Math.sin(theta);
    camera.lookAt(0, 0, 0);
  });
  
  return null;
};

// Heart shape geometry generator
const createHeartShape = () => {
  const heartShape = new THREE.Shape();
  
  heartShape.moveTo(0, 0);
  heartShape.bezierCurveTo(0, -0.3, -0.5, -0.5, -0.5, 0);
  heartShape.bezierCurveTo(-0.5, 0.3, 0, 0.6, 0, 1);
  heartShape.bezierCurveTo(0, 0.6, 0.5, 0.3, 0.5, 0);
  heartShape.bezierCurveTo(0.5, -0.5, 0, -0.3, 0, 0);
  
  return heartShape;
};

// Animated 3D Heart Component
const AnimatedHeart = ({ riskPercentage = 25 }) => {
  const heartRef = useRef();
  const materialRef = useRef();
  const glowRef = useRef();
  
  const { color, glowColor, beatSpeed, emissiveIntensity } = useMemo(() => {
    let color, glowColor, beatSpeed, emissiveIntensity;
    
    if (riskPercentage <= 40) {
      color = new THREE.Color('#22C55E');
      glowColor = new THREE.Color('#4ADE80');
      beatSpeed = 0.8;
      emissiveIntensity = 0.3;
    } else if (riskPercentage <= 70) {
      color = new THREE.Color('#EAB308');
      glowColor = new THREE.Color('#FACC15');
      beatSpeed = 1.2;
      emissiveIntensity = 0.5;
    } else {
      color = new THREE.Color('#EF4444');
      glowColor = new THREE.Color('#F87171');
      beatSpeed = 1.8;
      emissiveIntensity = 0.7;
    }
    
    return { color, glowColor, beatSpeed, emissiveIntensity };
  }, [riskPercentage]);
  
  useFrame((state) => {
    if (heartRef.current) {
      const time = state.clock.getElapsedTime();
      
      const beat = Math.sin(time * beatSpeed * Math.PI * 2);
      const doubleBeat = Math.sin(time * beatSpeed * Math.PI * 4) * 0.3;
      const scale = 1 + (beat * 0.08 + doubleBeat * 0.04);
      
      heartRef.current.scale.set(scale, scale, scale);
      heartRef.current.rotation.y = Math.sin(time * 0.3) * 0.1;
      
      if (materialRef.current) {
        materialRef.current.emissiveIntensity = emissiveIntensity + Math.sin(time * beatSpeed * Math.PI * 2) * 0.2;
      }
      
      if (glowRef.current) {
        const glowScale = scale * 1.1 + Math.sin(time * beatSpeed * Math.PI) * 0.05;
        glowRef.current.scale.set(glowScale, glowScale, glowScale);
      }
    }
  });
  
  const heartGeometry = useMemo(() => {
    const shape = createHeartShape();
    const extrudeSettings = {
      depth: 0.4,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelOffset: 0,
      bevelSegments: 8
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);
  
  return (
    <group>
      <mesh
        ref={heartRef}
        geometry={heartGeometry}
        rotation={[Math.PI, 0, 0]}
        position={[0, 0.2, 0]}
        scale={1.5}
      >
        <meshStandardMaterial
          ref={materialRef}
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>
      
      <mesh
        ref={glowRef}
        geometry={heartGeometry}
        rotation={[Math.PI, 0, 0]}
        position={[0, 0.2, 0]}
        scale={1.6}
      >
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      
      <Vessel position={[-0.3, 0.8, 0.2]} rotation={[0, 0, 0.3]} color={color} />
      <Vessel position={[0.3, 0.8, 0.2]} rotation={[0, 0, -0.3]} color={color} />
      <Vessel position={[0, 0.9, 0.1]} rotation={[0, 0, 0]} color={color} />
    </group>
  );
};

const Vessel = ({ position, rotation, color }) => {
  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={[0.04, 0.06, 0.4, 16]} />
      <meshStandardMaterial color={color} roughness={0.5} metalness={0.3} />
    </mesh>
  );
};

const PulseRings = ({ riskPercentage = 25 }) => {
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  
  const ringColor = useMemo(() => {
    if (riskPercentage <= 40) return '#22C55E';
    if (riskPercentage <= 70) return '#EAB308';
    return '#EF4444';
  }, [riskPercentage]);
  
  const speed = useMemo(() => {
    if (riskPercentage <= 40) return 0.8;
    if (riskPercentage <= 70) return 1.2;
    return 1.8;
  }, [riskPercentage]);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime() * speed;
    
    [ring1Ref, ring2Ref, ring3Ref].forEach((ref, index) => {
      if (ref.current) {
        const offset = index * 0.66;
        const s = 1 + ((time + offset) % 2) * 0.5;
        ref.current.scale.set(s, s, 1);
        ref.current.material.opacity = Math.max(0, 0.5 - ((time + offset) % 2) * 0.25);
      }
    });
  });
  
  return (
    <group position={[0, 0.3, -0.5]}>
      {[ring1Ref, ring2Ref, ring3Ref].map((ref, i) => (
        <mesh key={i} ref={ref}>
          <ringGeometry args={[0.8, 0.85, 64]} />
          <meshBasicMaterial color={ringColor} transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
};

const FloatingParticles = ({ riskPercentage = 25 }) => {
  const groupRef = useRef();
  
  const particleColor = useMemo(() => {
    if (riskPercentage <= 40) return '#22C55E';
    if (riskPercentage <= 70) return '#EAB308';
    return '#EF4444';
  }, [riskPercentage]);
  
  const particles = useMemo(() => {
    return Array.from({ length: 30 }, () => ({
      position: [(Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6],
      scale: Math.random() * 0.04 + 0.02
    }));
  }, []);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      groupRef.current.rotation.x = state.clock.getElapsedTime() * 0.03;
    }
  });
  
  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position}>
          <sphereGeometry args={[p.scale, 8, 8]} />
          <meshBasicMaterial color={particleColor} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
};

const HeartScene = ({ riskPercentage = 25 }) => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#94A3B8" />
      <pointLight position={[0, 2, 2]} intensity={0.8} color="#ffffff" />
      
      <AnimatedHeart riskPercentage={riskPercentage} />
      <FloatingParticles riskPercentage={riskPercentage} />
      <PulseRings riskPercentage={riskPercentage} />
      <CameraController />
    </>
  );
};

export const ARHeartVisualization = ({ riskPercentage = 25, className = "" }) => {
  const getStatusText = () => {
    if (riskPercentage <= 40) return { text: "Healthy Heart", color: "text-green-500" };
    if (riskPercentage <= 70) return { text: "Moderate Risk", color: "text-yellow-500" };
    return { text: "High Risk", color: "text-red-500" };
  };
  
  const status = getStatusText();
  
  return (
    <div className={`relative w-full h-full min-h-[400px] ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'linear-gradient(145deg, #0F172A 0%, #1E293B 100%)' }}
      >
        <HeartScene riskPercentage={riskPercentage} />
      </Canvas>
      
      <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2">
        <p className="text-white/70 text-sm">Heart Risk Level</p>
        <p className={`text-xl font-bold ${status.color}`}>{status.text}</p>
        <p className="text-white/60 text-sm">{riskPercentage.toFixed(1)}% probability</p>
      </div>
      
      <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 text-xs text-white/70">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span>0-40%: Low Risk</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
          <span>41-70%: Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span>71-100%: High Risk</span>
        </div>
      </div>
      
      <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 text-xs text-white/70">
        <p>Drag to rotate</p>
      </div>
    </div>
  );
};

export default ARHeartVisualization;

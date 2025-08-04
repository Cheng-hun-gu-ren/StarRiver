import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { AITool, aiTools, constellations } from '@/data/ai-tools';

interface UseThreeSceneProps {
  onToolClick: (tool: AITool) => void;
  onLoadingProgress: (progress: number, text: string) => void;
  activeView: string;
}

export function useThreeScene({ 
  onToolClick, 
  onLoadingProgress,
  activeView 
}: UseThreeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    labelRenderer: CSS2DRenderer;
    controls: OrbitControls;
    particleSystem: THREE.Points;
    starMeshes: THREE.Group[];
    constellationGroups: Record<string, THREE.Group>;
    allConstellationsContainer: THREE.Group;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    clock: THREE.Clock;
  } | null>(null);
  
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeScene = async () => {
    if (!containerRef.current) return;

    try {
      onLoadingProgress(10, "初始化3D场景...");
      
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
      );
      camera.position.set(0, 5, 30);

      const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
      });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      
      containerRef.current.appendChild(renderer.domElement);

      const labelRenderer = new CSS2DRenderer();
      labelRenderer.setSize(window.innerWidth, window.innerHeight);
      labelRenderer.domElement.style.position = 'absolute';
      labelRenderer.domElement.style.top = '0px';
      labelRenderer.domElement.style.pointerEvents = 'none';
      labelRenderer.domElement.style.userSelect = 'none';
      containerRef.current.appendChild(labelRenderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.minDistance = 8;
      controls.maxDistance = 60;
      controls.enablePan = false;
      controls.rotateSpeed = 0.5;
      controls.zoomSpeed = 0.8;

      onLoadingProgress(30, "创建粒子系统...");
      const particleSystem = await createParticles(scene);

      onLoadingProgress(50, "构建星座...");
      const { starMeshes, constellationGroups, allConstellationsContainer } = 
        await createConstellations(scene);

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      const clock = new THREE.Clock();

      sceneRef.current = {
        scene,
        camera,
        renderer,
        labelRenderer,
        controls,
        particleSystem,
        starMeshes,
        constellationGroups,
        allConstellationsContainer,
        raycaster,
        mouse,
        clock
      };

      onLoadingProgress(70, "设置交互控制...");
      setupEventListeners();

      onLoadingProgress(95, "完成加载...");
      setIsInitialized(true);

      onLoadingProgress(100, "启动星云...");
      
    } catch (error) {
      console.error('Scene initialization failed:', error);
    }
  };

  const createParticles = async (scene: THREE.Scene): Promise<THREE.Points> => {
    const particlesCount = Math.min(8000, window.innerWidth * 2);
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount);
    const color = new THREE.Color();

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      
      const radius = 40 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      const hue = 0.5 + Math.random() * 0.3;
      const saturation = 0.4 + Math.random() * 0.6;
      const lightness = 0.3 + Math.random() * 0.4;
      
      color.setHSL(hue, saturation, lightness);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      sizes[i] = 0.5 + Math.random() * 1.5;
    }
    
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.PointsMaterial({
      size: 0.8,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    
    const particleSystem = new THREE.Points(particlesGeometry, material);
    scene.add(particleSystem);
    return particleSystem;
  };

  const createConstellations = async (scene: THREE.Scene) => {
    const toolMap = new Map(aiTools.map(tool => [tool.id, tool]));
    const allConstellationsContainer = new THREE.Group();
    const starMeshes: THREE.Group[] = [];
    const constellationGroups: Record<string, THREE.Group> = {};

    constellations.forEach((constellation, cIndex) => {
      const constellationGroup = new THREE.Group();
      constellationGroup.userData = { 
        constellation: constellation,
        isVisible: true
      };
      
      const starPositions: THREE.Vector3[] = [];

      constellation.tools.forEach((toolId, tIndex) => {
        const tool = toolMap.get(toolId);
        if (tool) {
          const star = createStar(tool, constellation.color);
          
          const angle = (tIndex / constellation.tools.length) * Math.PI * 2;
          const radius = 5 + Math.random() * 3;
          const height = (Math.random() - 0.5) * 4;
          
          star.position.set(
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius
          );
          
          constellationGroup.add(star);
          starMeshes.push(star);
          starPositions.push(star.position);
        }
      });

      createConnections(constellationGroup, starPositions, constellation.color);
      
      const constellationRadius = 15;
      const constellationAngle = (cIndex / constellations.length) * Math.PI * 2;
      const constellationHeight = (Math.random() - 0.5) * 10;
      
      constellationGroup.position.set(
        Math.cos(constellationAngle) * constellationRadius,
        constellationHeight,
        Math.sin(constellationAngle) * constellationRadius
      );

      constellationGroups[constellation.name] = constellationGroup;
      allConstellationsContainer.add(constellationGroup);
    });

    scene.add(allConstellationsContainer);
    return { starMeshes, constellationGroups, allConstellationsContainer };
  };

  const createStar = (tool: AITool, constellationColor: number): THREE.Group => {
    const starGroup = new THREE.Group();
    starGroup.userData = { tool: tool, originalScale: 1 };

    const coreGeometry = new THREE.SphereGeometry(0.3, 12, 8);
    const glowGeometry = new THREE.SphereGeometry(0.5, 12, 8);
    
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: constellationColor,
      transparent: true,
      opacity: 0.9
    });
    
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: constellationColor,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });

    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    
    starGroup.add(coreMesh);
    starGroup.add(glowMesh);

    const labelDiv = document.createElement('div');
    labelDiv.innerHTML = `
      <div style="
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 4px 8px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 500;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        white-space: nowrap;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        transform: translateY(-20px);
      ">
        ${tool.icon} ${tool.name}
      </div>
    `;
    
    const label = new CSS2DObject(labelDiv);
    label.position.set(0, 1, 0);
    starGroup.add(label);

    return starGroup;
  };

  const createConnections = (group: THREE.Group, positions: THREE.Vector3[], color: number) => {
    if (positions.length < 2) return;

    for (let i = 0; i < positions.length; i++) {
      const nextIndex = (i + 1) % positions.length;
      const start = positions[i];
      const end = positions[nextIndex];

      const points = [];
      const segments = 20;
      
      for (let j = 0; j <= segments; j++) {
        const t = j / segments;
        const point = new THREE.Vector3().lerpVectors(start, end, t);
        const curvature = Math.sin(t * Math.PI) * 0.5;
        point.y += curvature;
        points.push(point);
      }

      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.4,
        linewidth: 2
      });

      const line = new THREE.Line(lineGeometry, lineMaterial);
      group.add(line);
    }
  };

  const setupEventListeners = () => {
    if (!sceneRef.current || !containerRef.current) return;

    const handleResize = () => {
      if (!sceneRef.current) return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      sceneRef.current.camera.aspect = width / height;
      sceneRef.current.camera.updateProjectionMatrix();
      
      sceneRef.current.renderer.setSize(width, height);
      sceneRef.current.labelRenderer.setSize(width, height);
    };

    const handleClick = (event: MouseEvent | TouchEvent) => {
      if (!sceneRef.current) return;
      
      event.preventDefault();
      
      const rect = sceneRef.current.renderer.domElement.getBoundingClientRect();
      const clientX = 'clientX' in event ? event.clientX : 
        (event.touches && event.touches[0] ? event.touches[0].clientX : 
         event.changedTouches[0].clientX);
      const clientY = 'clientY' in event ? event.clientY : 
        (event.touches && event.touches[0] ? event.touches[0].clientY : 
         event.changedTouches[0].clientY);
      
      sceneRef.current.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      sceneRef.current.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      sceneRef.current.raycaster.setFromCamera(sceneRef.current.mouse, sceneRef.current.camera);
      const intersects = sceneRef.current.raycaster.intersectObjects(sceneRef.current.starMeshes, true);

      if (intersects.length > 0) {
        const starGroup = intersects[0].object.parent;
        if (starGroup && starGroup.userData && starGroup.userData.tool) {
          onToolClick(starGroup.userData.tool);
          
          if (navigator.vibrate) {
            navigator.vibrate(50);
          }
        }
      }
    };

    window.addEventListener('resize', handleResize);
    containerRef.current.addEventListener('click', handleClick);
    containerRef.current.addEventListener('touchend', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeEventListener('click', handleClick);
        containerRef.current.removeEventListener('touchend', handleClick);
      }
    };
  };

  const animate = () => {
    if (!sceneRef.current) return;

    requestAnimationFrame(animate);
    
    const deltaTime = sceneRef.current.clock.getDelta();
    const elapsedTime = sceneRef.current.clock.getElapsedTime();
    
    if (sceneRef.current.particleSystem) {
      sceneRef.current.particleSystem.rotation.y += deltaTime * 0.05;
      sceneRef.current.particleSystem.rotation.x += deltaTime * 0.02;
    }
    
    Object.values(sceneRef.current.constellationGroups).forEach((group, index) => {
      if (group.userData.isVisible) {
        group.rotation.y += deltaTime * (0.1 + index * 0.02);
      }
    });
    
    sceneRef.current.starMeshes.forEach((star, index) => {
      const breathe = 1 + Math.sin(elapsedTime * 2 + index * 0.5) * 0.1;
      star.scale.setScalar(breathe);
    });
    
    sceneRef.current.controls.update();
    sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
    sceneRef.current.labelRenderer.render(sceneRef.current.scene, sceneRef.current.camera);
  };

  const focusGlobal = () => {
    if (!sceneRef.current) return;
    
    Object.values(sceneRef.current.constellationGroups).forEach(group => {
      group.visible = true;
      group.userData.isVisible = true;
    });

    animateCamera(
      new THREE.Vector3(0, 5, 30), 
      new THREE.Vector3(0, 0, 0)
    );
  };

  const focusConstellation = (constellationName: string) => {
    if (!sceneRef.current) return;
    
    const targetGroup = sceneRef.current.constellationGroups[constellationName];
    if (!targetGroup) return;

    Object.entries(sceneRef.current.constellationGroups).forEach(([name, group]) => {
      group.visible = (name === constellationName);
      group.userData.isVisible = (name === constellationName);
    });
    
    const box = new THREE.Box3().setFromObject(targetGroup);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = sceneRef.current.camera.fov * (Math.PI / 180);
    const cameraDistance = Math.abs(maxDim / Math.sin(fov / 2)) * 1.5;
    
    const cameraPosition = center.clone();
    cameraPosition.z += cameraDistance;
    cameraPosition.y += 2;
    
    animateCamera(cameraPosition, center);
  };

  const animateCamera = (targetPosition: THREE.Vector3, targetLookAt: THREE.Vector3, duration = 2000) => {
    if (!sceneRef.current) return;

    const startPosition = sceneRef.current.camera.position.clone();
    const startLookAt = sceneRef.current.controls.target.clone();
    const startTime = Date.now();
    
    const updateCamera = () => {
      if (!sceneRef.current) return;

      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      const easedProgress = easeInOutCubic(progress);
      
      sceneRef.current.camera.position.lerpVectors(startPosition, targetPosition, easedProgress);
      sceneRef.current.controls.target.lerpVectors(startLookAt, targetLookAt, easedProgress);
      sceneRef.current.controls.update();
      
      if (progress < 1) {
        requestAnimationFrame(updateCamera);
      }
    };
    
    updateCamera();
  };

  useEffect(() => {
    initializeScene();

    return () => {
      if (sceneRef.current) {
        sceneRef.current.renderer.dispose();
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
      }
    };
  }, []);

  useEffect(() => {
    if (isInitialized) {
      animate();
    }
  }, [isInitialized]);

  useEffect(() => {
    if (activeView === 'global') {
      focusGlobal();
    } else if (constellations.some(c => c.name === activeView)) {
      focusConstellation(activeView);
    }
  }, [activeView, isInitialized]);

  return { containerRef, isInitialized };
}

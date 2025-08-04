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
    interConnections: THREE.Group;
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
      const { starMeshes, constellationGroups, allConstellationsContainer, interConnections } = 
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
        interConnections,
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
      
      // Add constellation glow effect
      const glowGeometry = new THREE.SphereGeometry(8, 32, 16);
      const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(constellation.color) },
          viewVector: { value: new THREE.Vector3() }
        },
        vertexShader: `
          uniform vec3 viewVector;
          varying float intensity;
          void main() {
            vec3 vNormal = normalize( normalMatrix * normal );
            vec3 vNormel = normalize( normalMatrix * viewVector );
            intensity = pow( dot(vNormal, vNormel), 3.0 );
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          varying float intensity;
          void main() {
            vec3 glow = color * intensity;
            gl_FragColor = vec4( glow, intensity * 0.15 );
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      });
      
      const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
      constellationGroup.add(glowMesh);
      
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

    // Create inter-constellation connections for multi-category tools
    const connectorTools = aiTools.filter(tool => tool.isConnector);
    const interConnections = new THREE.Group();
    
    connectorTools.forEach(tool => {
      if (tool.categories && tool.categories.length > 1) {
        const toolPositions: THREE.Vector3[] = [];
        
        // Find the tool's position in each constellation it belongs to
        tool.categories.forEach(category => {
          const constellation = constellations.find(c => 
            (category === '开发AI工具' && c.name === '开发星座') ||
            (category === '内容创作' && c.name === '内容星座') ||
            (category === '效率工具' && c.name === '效率星座')
          );
          
          if (constellation && constellationGroups[constellation.name]) {
            const group = constellationGroups[constellation.name];
            // Find the star in this constellation
            group.children.forEach(child => {
              if (child.userData && child.userData.tool && child.userData.tool.id === tool.id) {
                const worldPos = new THREE.Vector3();
                child.getWorldPosition(worldPos);
                toolPositions.push(worldPos);
              }
            });
          }
        });
        
        // Create connections between the tool's positions in different constellations
        if (toolPositions.length > 1) {
          for (let i = 0; i < toolPositions.length - 1; i++) {
            for (let j = i + 1; j < toolPositions.length; j++) {
              const points = [];
              const segments = 30;
              
              for (let k = 0; k <= segments; k++) {
                const t = k / segments;
                const point = new THREE.Vector3().lerpVectors(toolPositions[i], toolPositions[j], t);
                // Add some curvature to make the connection more elegant
                const curvature = Math.sin(t * Math.PI) * 2;
                point.y += curvature;
                points.push(point);
              }
              
              const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
              const lineMaterial = new THREE.LineBasicMaterial({
                color: 0x9333EA, // Purple for inter-constellation connections
                transparent: true,
                opacity: 0.3,
                linewidth: 3
              });
              
              const line = new THREE.Line(lineGeometry, lineMaterial);
              interConnections.add(line);
            }
          }
        }
      }
    });
    
    scene.add(interConnections);
    scene.add(allConstellationsContainer);
    return { starMeshes, constellationGroups, allConstellationsContainer, interConnections };
  };

  const createStar = (tool: AITool, constellationColor: number): THREE.Group => {
    const starGroup = new THREE.Group();
    starGroup.userData = { tool: tool, originalScale: 1 };

    // Check if this is a connector tool (belongs to multiple categories)
    const isConnector = tool.isConnector || false;
    const starScale = isConnector ? 1.3 : 1; // Connectors are 30% larger

    // Larger invisible sphere for better click detection
    const clickGeometry = new THREE.SphereGeometry(1.2 * starScale, 8, 8);
    const clickMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false
    });
    const clickMesh = new THREE.Mesh(clickGeometry, clickMaterial);
    starGroup.add(clickMesh);

    // Core star with enhanced visuals
    const coreGeometry = new THREE.SphereGeometry(0.4 * starScale, 16, 12);
    const glowGeometry = new THREE.SphereGeometry(0.7 * starScale, 16, 12);
    const outerGlowGeometry = new THREE.SphereGeometry(1.0 * starScale, 12, 8);
    
    // Use purple color for connector tools
    const starColor = isConnector ? 0x9333EA : constellationColor;
    
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: starColor,
      transparent: true,
      opacity: 1
    });
    
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: starColor,
      transparent: true,
      opacity: isConnector ? 0.6 : 0.4, // Stronger glow for connectors
      blending: THREE.AdditiveBlending
    });

    const outerGlowMaterial = new THREE.MeshBasicMaterial({
      color: starColor,
      transparent: true,
      opacity: isConnector ? 0.3 : 0.2, // Stronger outer glow for connectors
      blending: THREE.AdditiveBlending
    });

    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    const outerGlowMesh = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
    
    starGroup.add(coreMesh);
    starGroup.add(glowMesh);
    starGroup.add(outerGlowMesh);

    // Tool logo import
    const toolLogos: Record<string, string> = {
      'claude-code': 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/claude-ai-icon.svg',
      'claude-web': 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/claude-ai-icon.svg',
      'cursor': 'https://raw.githubusercontent.com/getcursor/cursor/main/resources/app/resources/win32/cursor.ico',
      'bolt': 'https://www.stackblitz.com/favicon.ico',
      'deepseek-api': 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/deepseek-logo-icon.svg',
      'gemini': 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.svg',
      'gamma': 'https://gamma.app/favicon.ico',
      'wispr-flow': 'https://wispr.com/favicon.ico',
      'n8n': 'https://n8n.io/favicon.ico',
      'notebookllm': 'https://notebooklm.google.com/favicon.ico',
      'v0': 'https://v0.dev/favicon.ico',
      'replit': 'https://replit.com/favicon.ico',
      'jimeng': 'https://jimeng.jianying.com/favicon.ico',
      'doubao': 'https://seed.bytedance.com/favicon.ico',
      'perplexity': 'https://www.perplexity.ai/favicon.ico',
      'lovable': 'https://lovable.dev/favicon.ico',
      'roo-code': 'https://marketplace.visualstudio.com/favicon.ico'
    };
    const logoUrl = toolLogos[tool.id];
    const fallbackEmoji = tool.icon;

    const labelDiv = document.createElement('div');
    labelDiv.innerHTML = `
      <div style="
        background: ${isConnector ? 'linear-gradient(135deg, rgba(147, 51, 234, 0.9), rgba(124, 58, 237, 0.9))' : 'rgba(0, 0, 0, 0.85)'};
        color: white;
        padding: 6px 10px;
        border-radius: 10px;
        font-size: 13px;
        font-weight: 500;
        backdrop-filter: blur(15px);
        border: 1px solid ${isConnector ? 'rgba(147, 51, 234, 0.5)' : 'rgba(255, 255, 255, 0.25)'};
        white-space: nowrap;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
        box-shadow: 0 4px 12px ${isConnector ? 'rgba(147, 51, 234, 0.5)' : 'rgba(0, 0, 0, 0.4)'};
        transform: translateY(-20px);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
      ">
        <div style="display: flex; align-items: center; gap: 6px;">
          ${logoUrl ? `<img src="${logoUrl}" style="width: 16px; height: 16px; filter: brightness(0) invert(1);" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';" />` : ''}
          <span style="${logoUrl ? 'display:none;' : ''}">${fallbackEmoji}</span>
          ${tool.name}
        </div>
        ${isConnector ? `<div style="font-size: 10px; background: rgba(255, 255, 255, 0.2); padding: 2px 6px; border-radius: 6px;">连接节点</div>` : ''}
      </div>
    `;
    
    const label = new CSS2DObject(labelDiv);
    label.position.set(0, 1.2, 0);
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
      star.scale.setScalar(breathe * (star.userData.originalScale || 1));
      
      // Animate outer glow opacity
      const outerGlow = star.children.find(child => 
        child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry && 
        (child.geometry as THREE.SphereGeometry).parameters.radius === 1.0
      );
      if (outerGlow && outerGlow instanceof THREE.Mesh) {
        const glowMaterial = outerGlow.material as THREE.MeshBasicMaterial;
        glowMaterial.opacity = 0.2 + Math.sin(elapsedTime * 3 + index) * 0.1;
      }
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
    
    // Show inter-constellation connections in global view
    if (sceneRef.current.interConnections) {
      sceneRef.current.interConnections.visible = true;
    }

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
    
    // Hide inter-constellation connections when focusing on a single constellation
    if (sceneRef.current.interConnections) {
      sceneRef.current.interConnections.visible = false;
    }
    
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

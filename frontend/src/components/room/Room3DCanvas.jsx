"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { get4KImageUrl } from "@/lib/utils";

// Check if WebGL is supported
function isWebGLAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

export default function Room3DCanvas({
  dimensions, // { length, width, height, unit }
  roomType,
  audioSetup,
  selectedEquipment,
  onSelectEquipment,
  cameraPreset,
  onCameraPresetHandled,
  onFallbackTo2D,
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const interactiveObjectsRef = useRef([]);
  const selectionRingRef = useRef(null);
  const targetCamPosRef = useRef(null);
  const targetLookAtRef = useRef(new THREE.Vector3(0, 1.2, 0));
  const currentLookAtRef = useRef(new THREE.Vector3(0, 1.2, 0));
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const sphericalRef = useRef({ radius: 14, theta: 0.8, phi: 1.1 });

  const [hasWebGL, setHasWebGL] = useState(true);

  // Convert dimensions to meters internally for 3D physics / scaling
  const isFeet = dimensions.unit === "FT";
  const lengthM = isFeet ? dimensions.length * 0.3048 : dimensions.length;
  const widthM = isFeet ? dimensions.width * 0.3048 : dimensions.width;
  const heightM = isFeet ? dimensions.height * 0.3048 : dimensions.height;

  // Initialize Three.js Scene
  useEffect(() => {
    if (!isWebGLAvailable()) {
      setHasWebGL(false);
      onFallbackTo2D?.();
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x141312);
    scene.fog = new THREE.FogExp2(0x141312, 0.015);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    cameraRef.current = camera;

    // Selection Ring (gold illuminated indicator)
    const ringGeo = new THREE.RingGeometry(0.35, 0.42, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf2ca50,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const selectionRing = new THREE.Mesh(ringGeo, ringMat);
    selectionRing.rotation.x = -Math.PI / 2;
    selectionRing.position.y = 0.02;
    selectionRing.visible = false;
    scene.add(selectionRing);
    selectionRingRef.current = selectionRing;

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Initial Camera Overview Setup
    const initRadius = Math.max(lengthM, widthM) * 1.6;
    sphericalRef.current = { radius: initRadius, theta: 0.75, phi: 1.05 };
    updateCameraFromSpherical();

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth camera position interpolation
      if (targetCamPosRef.current) {
        camera.position.lerp(targetCamPosRef.current, 0.05);
        currentLookAtRef.current.lerp(targetLookAtRef.current, 0.05);
        camera.lookAt(currentLookAtRef.current);

        if (camera.position.distanceTo(targetCamPosRef.current) < 0.05) {
          targetCamPosRef.current = null;
        }
      }

      // Pulse selection ring if visible
      if (selectionRingRef.current && selectionRingRef.current.visible) {
        const time = Date.now() * 0.003;
        selectionRingRef.current.scale.setScalar(1 + Math.sin(time) * 0.06);
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Camera Spherical Position
  const updateCameraFromSpherical = useCallback(() => {
    const { radius, theta, phi } = sphericalRef.current;
    const camera = cameraRef.current;
    if (!camera) return;

    const x = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.cos(theta);

    camera.position.set(x, Math.max(y, 0.4), z);
    camera.lookAt(currentLookAtRef.current);
  }, []);

  // Handle Camera Presets
  useEffect(() => {
    if (!cameraPreset || !cameraRef.current) return;

    const sofaZ = lengthM * 0.15;
    const frontZ = -lengthM * 0.45;

    switch (cameraPreset) {
      case "overview":
        targetCamPosRef.current = new THREE.Vector3(
          widthM * 0.9,
          heightM * 1.3,
          lengthM * 0.95
        );
        targetLookAtRef.current = new THREE.Vector3(0, 1.0, 0);
        break;

      case "front":
        targetCamPosRef.current = new THREE.Vector3(0, heightM * 0.4, lengthM * 0.3);
        targetLookAtRef.current = new THREE.Vector3(0, 1.2, frontZ);
        break;

      case "listening":
        // Listener sweet spot eye-level sitting on couch
        targetCamPosRef.current = new THREE.Vector3(0, 1.15, sofaZ + 0.3);
        targetLookAtRef.current = new THREE.Vector3(0, 1.2, frontZ);
        break;

      case "system":
        // Close-up on front equipment rack & towers
        targetCamPosRef.current = new THREE.Vector3(
          widthM * 0.28,
          0.9,
          frontZ + 1.8
        );
        targetLookAtRef.current = new THREE.Vector3(0, 0.6, frontZ);
        break;

      case "reset":
      default:
        targetCamPosRef.current = new THREE.Vector3(
          widthM * 0.85,
          heightM * 1.2,
          lengthM * 0.9
        );
        targetLookAtRef.current = new THREE.Vector3(0, 1.0, 0);
        break;
    }

    onCameraPresetHandled?.();
  }, [cameraPreset, lengthM, widthM, heightM, onCameraPresetHandled]);

  // Re-build Room Geometry & Equipment whenever parameters change
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Clear existing room & equipment (except selection ring)
    const toRemove = [];
    scene.children.forEach((child) => {
      if (child !== selectionRingRef.current) {
        toRemove.push(child);
      }
    });
    toRemove.forEach((obj) => scene.remove(obj));
    interactiveObjectsRef.current = [];

    // --- 1. LIGHTING — Premium warm ambient lighting ---

    // Warm ambient fill — provides base visibility across the room
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.55);
    scene.add(ambientLight);

    // Hemisphere light — warm sky/cool ground for natural feel
    const hemiLight = new THREE.HemisphereLight(0xfff0d4, 0x1a1612, 0.45);
    hemiLight.position.set(0, heightM, 0);
    scene.add(hemiLight);

    // Main ceiling down-light — warm white
    const ceilingSpot = new THREE.SpotLight(0xfff5e6, 3.0);
    ceilingSpot.position.set(0, heightM * 0.95, 0);
    ceilingSpot.angle = Math.PI / 2.5;
    ceilingSpot.penumbra = 0.7;
    ceilingSpot.decay = 1.5;
    ceilingSpot.castShadow = true;
    ceilingSpot.shadow.bias = -0.001;
    ceilingSpot.shadow.mapSize.width = 1024;
    ceilingSpot.shadow.mapSize.height = 1024;
    scene.add(ceilingSpot);

    // Gold accent spot on front stage / equipment wall
    const goldAccent = new THREE.SpotLight(0xf2ca50, 2.0);
    goldAccent.position.set(0, heightM * 0.85, -lengthM * 0.15);
    goldAccent.target.position.set(0, 0.5, -lengthM * 0.45);
    goldAccent.angle = Math.PI / 3;
    goldAccent.penumbra = 0.65;
    goldAccent.decay = 1.5;
    scene.add(goldAccent);
    scene.add(goldAccent.target);

    // Side warm fill lights — illuminate walls and make room boundaries visible
    const leftFill = new THREE.PointLight(0xffe8c8, 1.2, widthM * 2.5);
    leftFill.position.set(-widthM * 0.4, heightM * 0.7, 0);
    scene.add(leftFill);

    const rightFill = new THREE.PointLight(0xffe8c8, 1.2, widthM * 2.5);
    rightFill.position.set(widthM * 0.4, heightM * 0.7, 0);
    scene.add(rightFill);

    // Soft warm rear wash — prevents back of room from being pitch black
    const rearFill = new THREE.PointLight(0xfff0d4, 0.7, lengthM * 2);
    rearFill.position.set(0, heightM * 0.6, lengthM * 0.35);
    scene.add(rearFill);

    // Subtle champagne floor bounce near listening position
    const floorBounce = new THREE.PointLight(0xf5e6c8, 0.4, 6);
    floorBounce.position.set(0, 0.15, lengthM * 0.15);
    scene.add(floorBounce);

    // --- 2. ROOM SHELL (FLOOR, WALLS, CEILING) — Charcoal/Graphite Premium ---

    // floor  — dark charcoal with slight warmth, polished feel
    const floorGeo = new THREE.PlaneGeometry(widthM, lengthM);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xFFB58B62,
      roughness: 0.3,
      metalness: 0.08,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Floor Acoustic Grid — made very subtle
    const grid = new THREE.GridHelper(
      Math.max(widthM, lengthM),
      Math.round(Math.max(widthM, lengthM) * 2),
      0x2a2a2a,
      0x1e1e1e
    );
    grid.position.y = 0.005;
    grid.material.opacity = 0.3;
    grid.material.transparent = true;
    scene.add(grid);

    // Wall material — deep graphite, clearly distinguishable from pure black
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xFFB89B7A,
      roughness: 0.82,
      metalness: 0.02,
    });

    // Front Wall (Display & Stage Wall)
    const frontWallGeo = new THREE.PlaneGeometry(widthM, heightM);
    const frontWall = new THREE.Mesh(frontWallGeo, wallMat);
    frontWall.position.set(0, heightM / 2, -lengthM / 2);
    scene.add(frontWall);

    // Back Wall
    const backWall = new THREE.Mesh(frontWallGeo, wallMat);
    backWall.position.set(0, heightM / 2, lengthM / 2);
    backWall.rotation.y = Math.PI;
    scene.add(backWall);

    // Left Wall
    const sideWallGeo = new THREE.PlaneGeometry(lengthM, heightM);
    const leftWall = new THREE.Mesh(sideWallGeo, wallMat);
    leftWall.position.set(-widthM / 2, heightM / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    // Right Wall
    const rightWall = new THREE.Mesh(sideWallGeo, wallMat);
    rightWall.position.set(widthM / 2, heightM / 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);

    // Ceiling — slightly lighter graphite
    const ceilingGeo = new THREE.PlaneGeometry(widthM, lengthM);
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x1a1917,
      roughness: 0.85,
      metalness: 0.02,
    });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.position.set(0, heightM, 0);
    ceiling.rotation.x = Math.PI / 2;
    scene.add(ceiling);

    // Acoustic Slat Panels on Sidewalls — warm walnut tone
    const slatMat = new THREE.MeshStandardMaterial({
      color: 0x3d3228,
      roughness: 0.55,
      metalness: 0.15,
    });
    const slatGeo = new THREE.BoxGeometry(0.06, heightM * 0.65, lengthM * 0.4);

    const leftSlats = new THREE.Mesh(slatGeo, slatMat);
    leftSlats.position.set(-widthM / 2 + 0.04, heightM * 0.5, 0);
    scene.add(leftSlats);

    const rightSlats = new THREE.Mesh(slatGeo, slatMat);
    rightSlats.position.set(widthM / 2 - 0.04, heightM * 0.5, 0);
    scene.add(rightSlats);

    // Subtle gold accent edge strips — thin lines at wall-floor junction
    const edgeStripMat = new THREE.MeshBasicMaterial({
      color: 0xf2ca50,
      transparent: true,
      opacity: 0.12,
    });
    const edgeGeo = new THREE.BoxGeometry(widthM, 0.008, 0.008);
    const frontEdge = new THREE.Mesh(edgeGeo, edgeStripMat);
    frontEdge.position.set(0, 0.004, -lengthM / 2 + 0.004);
    scene.add(frontEdge);

    const backEdge = new THREE.Mesh(edgeGeo, edgeStripMat);
    backEdge.position.set(0, 0.004, lengthM / 2 - 0.004);
    scene.add(backEdge);

    const sideEdgeGeo = new THREE.BoxGeometry(0.008, 0.008, lengthM);
    const leftEdge = new THREE.Mesh(sideEdgeGeo, edgeStripMat);
    leftEdge.position.set(-widthM / 2 + 0.004, 0.004, 0);
    scene.add(leftEdge);

    const rightEdge = new THREE.Mesh(sideEdgeGeo, edgeStripMat);
    rightEdge.position.set(widthM / 2 - 0.004, 0.004, 0);
    scene.add(rightEdge);


    // --- 3. FRONT DISPLAY / MEDIA SCREEN ---
    const screenWidth = Math.min(widthM * 0.55, 3.2);
    const screenHeight = screenWidth * 0.5625; // 16:9
    const screenGeo = new THREE.BoxGeometry(screenWidth, screenHeight, 0.04);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      roughness: 0.08,
      metalness: 0.85,
      emissive: 0x050510,
      emissiveIntensity: 0.3,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, heightM * 0.48, -lengthM / 2 + 0.04);
    scene.add(screenMesh);

    // Gold hairline border on screen
    const screenBorderGeo = new THREE.BoxGeometry(
      screenWidth + 0.02,
      screenHeight + 0.02,
      0.02
    );
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf2ca50,
      metalness: 0.9,
      roughness: 0.2,
    });
    const screenBorder = new THREE.Mesh(screenBorderGeo, goldMat);
    screenBorder.position.set(0, heightM * 0.48, -lengthM / 2 + 0.02);
    scene.add(screenBorder);

    // --- 4. LISTENING SOFA / SEAT AT SWEET SPOT ---
    const sofaZ = lengthM * 0.15; // Placed at ~38% distance from back wall
    const sofaWidth = Math.min(widthM * 0.4, 2.2);

    const sofaBaseGeo = new THREE.BoxGeometry(sofaWidth, 0.45, 0.9);
    const sofaLeatherMat = new THREE.MeshStandardMaterial({
      color: 0x2d2a27,
      roughness: 0.65,
      metalness: 0.08,
    });
    const sofaBase = new THREE.Mesh(sofaBaseGeo, sofaLeatherMat);
    sofaBase.position.set(0, 0.225, sofaZ);
    sofaBase.castShadow = true;
    scene.add(sofaBase);

    // Sofa Backrest
    const sofaBackGeo = new THREE.BoxGeometry(sofaWidth, 0.55, 0.25);
    const sofaBack = new THREE.Mesh(sofaBackGeo, sofaLeatherMat);
    sofaBack.position.set(0, 0.6, sofaZ + 0.35);
    sofaBack.castShadow = true;
    scene.add(sofaBack);

    // Sofa Pillows
    const pillowGeo = new THREE.BoxGeometry(sofaWidth * 0.42, 0.15, 0.45);
    const pillowMat = new THREE.MeshStandardMaterial({ color: 0x38332e, roughness: 0.7 });
    const pillowL = new THREE.Mesh(pillowGeo, pillowMat);
    pillowL.position.set(-sofaWidth * 0.24, 0.48, sofaZ - 0.05);
    scene.add(pillowL);

    const pillowR = new THREE.Mesh(pillowGeo, pillowMat);
    pillowR.position.set(sofaWidth * 0.24, 0.48, sofaZ - 0.05);
    scene.add(pillowR);

    // --- 5. AUDIO HARDWARE MODELS & PLACEMENT ---
    const frontZ = -lengthM / 2 + 0.8;
    const speakerSpread = Math.min(widthM * 0.7, 3.8); // Distance between L and R

    // Helper: Build High-Detail Floorstanding Speaker (Eclipse X1 / Aether Mono S1)
    const createFloorstander = (id, name, x, z, rotationY) => {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      group.rotation.y = rotationY;

      // Cabinet
      const cabinetGeo = new THREE.BoxGeometry(0.34, 1.25, 0.38);
      const cabinetMat = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.22,
        metalness: 0.35,
      });
      const cabinet = new THREE.Mesh(cabinetGeo, cabinetMat);
      cabinet.position.y = 0.625 + 0.04;
      cabinet.castShadow = true;
      group.add(cabinet);

      // Gold Trim Spine / Accents
      const spineGeo = new THREE.BoxGeometry(0.02, 1.25, 0.4);
      const spine = new THREE.Mesh(spineGeo, goldMat);
      spine.position.y = 0.625 + 0.04;
      group.add(spine);

      // Beryllium Tweeter
      const tweeterGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.02, 24);
      const tweeter = new THREE.Mesh(tweeterGeo, goldMat);
      tweeter.rotation.x = Math.PI / 2;
      tweeter.position.set(0, 1.15, 0.19);
      group.add(tweeter);

      // Midrange & Woofers
      const wooferGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.02, 24);
      const coneMat = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        roughness: 0.35,
      });

      [0.95, 0.68, 0.42].forEach((yPos) => {
        const woofer = new THREE.Mesh(wooferGeo, coneMat);
        woofer.rotation.x = Math.PI / 2;
        woofer.position.set(0, yPos, 0.19);
        group.add(woofer);

        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.1, 0.008, 16, 32),
          goldMat
        );
        ring.position.set(0, yPos, 0.2);
        group.add(ring);
      });

      // Gold Spikes / Base
      const baseGeo = new THREE.BoxGeometry(0.4, 0.04, 0.44);
      const baseMesh = new THREE.Mesh(baseGeo, goldMat);
      baseMesh.position.y = 0.02;
      group.add(baseMesh);

      // Metadata for raycasting
      group.userData = {
        id,
        name,
        role: "Main Loudspeaker",
        category: "Loudspeakers",
        price: 12999.0,
        slug: "eclipse-x1",
      };

      scene.add(group);
      interactiveObjectsRef.current.push(group);
      return group;
    };

    // Helper: Build Subwoofer (Monolith Reference)
    const createSubwoofer = (x, z) => {
      const group = new THREE.Group();
      group.position.set(x, 0, z);

      const subGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const subMat = new THREE.MeshStandardMaterial({
        color: 0x141414,
        roughness: 0.3,
        metalness: 0.2,
      });
      const subMesh = new THREE.Mesh(subGeo, subMat);
      subMesh.position.y = 0.27;
      subMesh.castShadow = true;
      group.add(subMesh);

      // 12" Sub Driver
      const driverGeo = new THREE.CylinderGeometry(0.18, 0.16, 0.02, 32);
      const driver = new THREE.Mesh(
        driverGeo,
        new THREE.MeshStandardMaterial({ color: 0x1f1f1f, roughness: 0.5 })
      );
      driver.rotation.x = Math.PI / 2;
      driver.position.set(0, 0.27, 0.25);
      group.add(driver);

      // Gold Beacon Indicator
      const beaconGeo = new THREE.SphereGeometry(0.015, 16, 16);
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0xf2ca50 });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(0, 0.46, 0.26);
      group.add(beacon);

      group.userData = {
        id: "subwoofer",
        name: "Monolith Reference Subwoofer",
        role: "Subwoofer",
        category: "Loudspeakers",
        price: 8900.0,
        slug: "eclipse-x1",
      };

      scene.add(group);
      interactiveObjectsRef.current.push(group);
      return group;
    };

    // Helper: Build Center Channel
    const createCenterChannel = (x, z) => {
      const group = new THREE.Group();
      group.position.set(x, 0.58, z);

      const centerGeo = new THREE.BoxGeometry(0.7, 0.18, 0.25);
      const centerMat = new THREE.MeshStandardMaterial({
        color: 0x121212,
        roughness: 0.3,
      });
      const centerMesh = new THREE.Mesh(centerGeo, centerMat);
      centerMesh.castShadow = true;
      group.add(centerMesh);

      // Tweeter in center + Dual Woofers
      const tweeter = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, 0.01, 16),
        goldMat
      );
      tweeter.rotation.x = Math.PI / 2;
      tweeter.position.set(0, 0, 0.13);
      group.add(tweeter);

      [-0.2, 0.2].forEach((xOff) => {
        const w = new THREE.Mesh(
          new THREE.CylinderGeometry(0.065, 0.06, 0.01, 24),
          new THREE.MeshStandardMaterial({ color: 0x222222 })
        );
        w.rotation.x = Math.PI / 2;
        w.position.set(xOff, 0, 0.13);
        group.add(w);
      });

      group.userData = {
        id: "center-speaker",
        name: "Aura Reference Center",
        role: "Center Channel",
        category: "Loudspeakers",
        price: 5200.0,
        slug: "eclipse-x1",
      };

      scene.add(group);
      interactiveObjectsRef.current.push(group);
      return group;
    };

    // Helper: Build Surround Satellite Speaker
    const createSurround = (id, name, x, z, rotationY) => {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      group.rotation.y = rotationY;

      // Stand
      const standGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.05, 16);
      const stand = new THREE.Mesh(standGeo, goldMat);
      stand.position.y = 0.525;
      stand.castShadow = true;
      group.add(stand);

      // Base
      const standBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.2, 0.02, 24),
        new THREE.MeshStandardMaterial({ color: 0x111111 })
      );
      standBase.position.y = 0.01;
      group.add(standBase);

      // Satellite Box
      const satGeo = new THREE.BoxGeometry(0.18, 0.32, 0.2);
      const satMat = new THREE.MeshStandardMaterial({ color: 0x131313 });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      satMesh.position.y = 1.15;
      group.add(satMesh);

      // Driver
      const driver = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.05, 0.01, 16),
        goldMat
      );
      driver.rotation.x = Math.PI / 2;
      driver.position.set(0, 1.15, 0.1);
      group.add(driver);

      group.userData = {
        id,
        name,
        role: "Surround Satellite",
        category: "Loudspeakers",
        price: 4400.0,
        slug: "pulse-monitor-r4",
      };

      scene.add(group);
      interactiveObjectsRef.current.push(group);
      return group;
    };

    // Helper: Build Credenza with Vacuum Tube Amp & Turntable
    const createConsoleRack = () => {
      const group = new THREE.Group();
      group.position.set(0, 0, frontZ + 0.1);

      // Credenza
      const credenzaGeo = new THREE.BoxGeometry(1.6, 0.45, 0.45);
      const credenzaMat = new THREE.MeshStandardMaterial({
        color: 0x141414,
        roughness: 0.5,
      });
      const credenza = new THREE.Mesh(credenzaGeo, credenzaMat);
      credenza.position.y = 0.225;
      credenza.castShadow = true;
      group.add(credenza);

      // Vacuum Tube Amp (Center Left on credenza)
      const ampGeo = new THREE.BoxGeometry(0.42, 0.12, 0.35);
      const ampMat = new THREE.MeshStandardMaterial({
        color: 0x1f1f1f,
        metalness: 0.8,
        roughness: 0.2,
      });
      const amp = new THREE.Mesh(ampGeo, ampMat);
      amp.position.set(-0.35, 0.51, 0);
      group.add(amp);

      // Glowing Tubes
      const tubeGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.08, 16);
      const tubeMat = new THREE.MeshBasicMaterial({ color: 0xffa040 });
      [-0.1, 0, 0.1].forEach((tX) => {
        const tube = new THREE.Mesh(tubeGeo, tubeMat);
        tube.position.set(-0.35 + tX, 0.61, 0);
        group.add(tube);
      });

      // Turntable (Center Right on credenza)
      const ttGeo = new THREE.BoxGeometry(0.44, 0.06, 0.38);
      const tt = new THREE.Mesh(ttGeo, ampMat);
      tt.position.set(0.35, 0.48, 0);
      group.add(tt);

      // Platter
      const platter = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.14, 0.02, 32),
        goldMat
      );
      platter.position.set(0.35, 0.52, 0);
      group.add(platter);

      group.userData = {
        id: "reference-amp-console",
        name: "Vacuum Master Amp & Orbit V3 Console",
        role: "Amplification & Source",
        category: "Amplifiers",
        price: 14400.0,
        slug: "vacuum-master-amp",
      };

      scene.add(group);
      interactiveObjectsRef.current.push(group);
    };

    // --- EXECUTE HARDWARE PLACEMENT BASED ON AUDIO SETUP ---
    // 1. Front Left and Front Right (Always present in 2.0, 2.1, 5.1, 7.1, 5.1.2)
    const toeInAngle = Math.PI * 0.08;
    createFloorstander(
      "front-left",
      "Eclipse X1 (Left)",
      -speakerSpread / 2,
      frontZ,
      toeInAngle
    );
    createFloorstander(
      "front-right",
      "Eclipse X1 (Right)",
      speakerSpread / 2,
      frontZ,
      -toeInAngle
    );

    // Front credenza & source
    createConsoleRack();

    // 2. Subwoofer (in 2.1, 5.1, 7.1, 5.1.2)
    if (audioSetup !== "2.0") {
      const subX = -speakerSpread / 2 - 0.65;
      createSubwoofer(subX, frontZ + 0.15);
    }

    // 3. Center Speaker (in 5.1, 7.1, 5.1.2)
    if (audioSetup === "5.1" || audioSetup === "7.1" || audioSetup === "5.1.2") {
      createCenterChannel(0, frontZ + 0.05);
    }

    // 4. Surround Left and Right (in 5.1, 7.1, 5.1.2)
    if (audioSetup === "5.1" || audioSetup === "7.1" || audioSetup === "5.1.2") {
      const surroundZ = sofaZ;
      const surroundX = widthM * 0.42;
      createSurround(
        "surround-left",
        "Aura Surround Sat L",
        -surroundX,
        surroundZ,
        Math.PI / 2
      );
      createSurround(
        "surround-right",
        "Aura Surround Sat R",
        surroundX,
        surroundZ,
        -Math.PI / 2
      );
    }

    // 5. Rear Surrounds (for 7.1)
    if (audioSetup === "7.1") {
      const rearZ = lengthM / 2 - 0.4;
      createSurround(
        "rear-surround-left",
        "Aura Rear Sat L",
        -widthM * 0.25,
        rearZ,
        Math.PI
      );
      createSurround(
        "rear-surround-right",
        "Aura Rear Sat R",
        widthM * 0.25,
        rearZ,
        Math.PI
      );
    }

    // 6. Ceiling Atmos Modules (for 5.1.2)
    if (audioSetup === "5.1.2") {
      const atmosGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.03, 24);
      [-widthM * 0.2, widthM * 0.2].forEach((aX, idx) => {
        const atmos = new THREE.Mesh(atmosGeo, goldMat);
        atmos.position.set(aX, heightM - 0.02, sofaZ - 0.5);
        scene.add(atmos);
      });
    }
  }, [lengthM, widthM, heightM, audioSetup, roomType]);

  // Update Selection Ring when selectedEquipment changes
  useEffect(() => {
    if (!selectionRingRef.current) return;

    if (!selectedEquipment) {
      selectionRingRef.current.visible = false;
      return;
    }

    // Find matching object in interactiveObjects
    const match = interactiveObjectsRef.current.find(
      (obj) => obj.userData?.id === selectedEquipment.id
    );

    if (match) {
      selectionRingRef.current.position.set(
        match.position.x,
        0.02,
        match.position.z
      );
      selectionRingRef.current.visible = true;
    } else {
      selectionRingRef.current.visible = false;
    }
  }, [selectedEquipment]);

  // --- MOUSE & TOUCH INTERACTION (ORBIT, PAN, RAYCAST SELECTION) ---
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = {
      x: e.clientX || e.touches?.[0]?.clientX || 0,
      y: e.clientY || e.touches?.[0]?.clientY || 0,
    };
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;

    const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
    const clientY = e.clientY || e.touches?.[0]?.clientY || 0;

    const deltaX = clientX - previousMousePositionRef.current.x;
    const deltaY = clientY - previousMousePositionRef.current.y;

    previousMousePositionRef.current = { x: clientX, y: clientY };

    // Update spherical coordinates
    sphericalRef.current.theta -= deltaX * 0.006;
    sphericalRef.current.phi = Math.max(
      0.15,
      Math.min(Math.PI / 2 - 0.05, sphericalRef.current.phi - deltaY * 0.006)
    );

    targetCamPosRef.current = null; // Break preset animation if dragging
    updateCameraFromSpherical();
  };

  const handlePointerUp = (e) => {
    isDraggingRef.current = false;

    // Check click for raycasting selection if it was a quick click without drag
    const container = mountRef.current;
    if (!container || !cameraRef.current || !sceneRef.current) return;

    const rect = container.getBoundingClientRect();
    const clientX = e.clientX || e.changedTouches?.[0]?.clientX;
    const clientY = e.clientY || e.changedTouches?.[0]?.clientY;
    if (clientX === undefined || clientY === undefined) return;

    const mouse = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const intersects = raycaster.intersectObjects(
      interactiveObjectsRef.current,
      true
    );

    if (intersects.length > 0) {
      // Find top parent group in interactiveObjects
      let targetGroup = intersects[0].object;
      while (
        targetGroup &&
        !interactiveObjectsRef.current.includes(targetGroup) &&
        targetGroup.parent
      ) {
        targetGroup = targetGroup.parent;
      }

      if (targetGroup && targetGroup.userData?.id) {
        onSelectEquipment?.(targetGroup.userData);
      }
    }
  };

  // Zoom via wheel
  const handleWheel = (e) => {
    e.preventDefault();
    sphericalRef.current.radius = Math.max(
      3,
      Math.min(30, sphericalRef.current.radius + e.deltaY * 0.015)
    );
    targetCamPosRef.current = null;
    updateCameraFromSpherical();
  };

  if (!hasWebGL) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center glass-panel rounded-2xl">
        <p className="text-primary font-label-caps text-xs tracking-widest uppercase mb-2">
          WebGL Mode Unavailable
        </p>
        <p className="text-white text-sm max-w-sm mb-4">
          Hardware acceleration is not accessible in your browser environment.
          Rendering the high-precision 2D Architectural Blueprint view instead.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      onWheel={handleWheel}
      className="w-full h-full cursor-grab active:cursor-grabbing relative select-none touch-none"
    >
      {/* Subtle bottom canvas badge */}
      <div className="absolute bottom-4 left-4 pointer-events-none text-[10px] font-mono text-white/30 tracking-wider">
        3D Interactive Canvas · Drag to Orbit · Scroll to Zoom · Click Hardware to Inspect
      </div>
    </div>
  );
}

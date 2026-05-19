"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HomeThreeScene() {
  const host = useRef(null);

  useEffect(() => {
    const container = host.current;
    if (!container) {
      return undefined;
    }

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance"
      });
    } catch (error) {
      return drawCanvasFallback(container);
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.4, 7.5);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.15));
    const warm = new THREE.DirectionalLight(0xefdac7, 2.2);
    warm.position.set(3, 5, 4);
    scene.add(warm);
    const fill = new THREE.DirectionalLight(0xffffff, 0.85);
    fill.position.set(-4, -1, 3);
    scene.add(fill);

    const group = createAdvisoryModel();
    group.position.set(1.45, -0.15, 0);
    scene.add(group);

    const backdrop = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 5.2),
      new THREE.MeshBasicMaterial({ color: 0x51213d, transparent: true, opacity: 0.24 })
    );
    backdrop.position.set(1.5, 0, -2.2);
    scene.add(backdrop);

    const pointer = { x: 0, y: 0 };
    const documents = group.children.filter((child) => child.userData.floatOffset !== undefined);

    function resize() {
      const width = Math.max(container.clientWidth || 300, 300);
      const height = Math.max(container.clientHeight || 500, 300);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    }

    function onPointerMove(event) {
      const rect = container.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 0.35;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 0.18;
    }

    let frame = 0;
    const clock = new THREE.Clock();
    function animate() {
      const time = clock.getElapsedTime();
      group.rotation.y = Math.sin(time * 0.38) * 0.18 + pointer.x;
      group.rotation.x = Math.sin(time * 0.28) * 0.05 - pointer.y;
      group.position.y = -0.15 + Math.sin(time * 0.8) * 0.08;
      documents.forEach((document) => {
        document.position.y = document.userData.baseY + Math.sin(time * 0.9 + document.userData.floatOffset) * 0.08;
      });
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    }

    resize();
    animate();
    window.addEventListener("resize", resize);
    container.addEventListener("pointermove", onPointerMove);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      container.removeEventListener("pointermove", onPointerMove);
      renderer.dispose();
      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={host}
      className="three-hero-canvas absolute right-0 top-0 z-[3] h-[500px] w-full opacity-75 sm:opacity-90 lg:w-[58%]"
      aria-hidden="true"
    />
  );
}

function drawCanvasFallback(container) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  container.appendChild(canvas);

  function resize() {
    const width = Math.max(container.clientWidth || 300, 300);
    const height = Math.max(container.clientHeight || 500, 300);
    canvas.width = width;
    canvas.height = height;
  }

  let frame = 0;
  function animate() {
    const time = performance.now() / 1000;
    resize();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalAlpha = 0.5;
    context.fillStyle = "#51213d";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.globalAlpha = 1;
    context.strokeStyle = "#efdac7";
    context.lineWidth = 8;
    context.beginPath();
    context.arc(canvas.width * 0.62, canvas.height * 0.48 + Math.sin(time) * 12, 74, 0, Math.PI * 2);
    context.stroke();
    context.fillStyle = "#efdac7";
    context.fillRect(canvas.width * 0.25, canvas.height * 0.34, canvas.width * 0.46, 10);
    context.fillRect(canvas.width * 0.48, canvas.height * 0.23, 10, canvas.height * 0.43);
    context.fillStyle = "#fffaf6";
    context.fillRect(canvas.width * 0.69, canvas.height * 0.28 + Math.sin(time * 1.2) * 10, 86, 118);
    context.fillStyle = "#51213d";
    context.fillRect(canvas.width * 0.71, canvas.height * 0.33 + Math.sin(time * 1.2) * 10, 52, 8);
    frame = window.requestAnimationFrame(animate);
  }

  animate();
  window.addEventListener("resize", resize);

  return () => {
    window.cancelAnimationFrame(frame);
    window.removeEventListener("resize", resize);
    canvas.remove();
  };
}

function createAdvisoryModel() {
  const group = new THREE.Group();
  const gold = new THREE.MeshStandardMaterial({ color: 0xefdac7, metalness: 0.78, roughness: 0.22 });
  const white = new THREE.MeshStandardMaterial({ color: 0xfffaf6, metalness: 0.35, roughness: 0.22, transparent: true, opacity: 0.92 });
  const burgundy = new THREE.MeshStandardMaterial({ color: 0x51213d, roughness: 0.35 });

  group.add(mesh(new THREE.CylinderGeometry(1.75, 1.92, 0.22, 64), gold, [0, -1.72, 0]));
  group.add(mesh(new THREE.CylinderGeometry(0.62, 0.78, 0.34, 48), white, [0, -1.4, 0]));
  group.add(mesh(new THREE.CylinderGeometry(0.11, 0.11, 2.45, 32), gold, [0, -0.25, 0]));
  group.add(mesh(new THREE.CylinderGeometry(0.07, 0.07, 3.25, 32), gold, [0, 0.95, 0], [0, 0, Math.PI / 2]));
  group.add(mesh(new THREE.SphereGeometry(0.2, 32, 32), white, [0, 1.05, 0]));
  group.add(createScaleTray([-1.42, 0.42, 0], gold, white));
  group.add(createScaleTray([1.42, 0.42, 0], gold, white));
  group.add(mesh(new THREE.TorusGeometry(0.72, 0.045, 18, 96), gold, [0.15, 1.75, -0.3], [0.55, 0.1, 0.78]));

  [
    { position: [-2.6, 1.2, -1.1], rotation: [0.1, 0.22, -0.12], scale: [0.76, 1.05, 0.05] },
    { position: [2.65, 0.85, -0.95], rotation: [-0.04, -0.25, 0.1], scale: [0.82, 1.12, 0.05] },
    { position: [1.7, -1.1, -0.7], rotation: [0.08, -0.14, -0.04], scale: [0.66, 0.88, 0.05] }
  ].forEach((item, index) => {
    const document = createDocumentPanel(white, burgundy, gold);
    document.position.set(...item.position);
    document.rotation.set(...item.rotation);
    document.scale.set(...item.scale);
    document.userData.baseY = item.position[1];
    document.userData.floatOffset = index;
    group.add(document);
  });

  return group;
}

function createScaleTray(position, gold, white) {
  const tray = new THREE.Group();
  tray.position.set(...position);
  tray.add(mesh(new THREE.CylinderGeometry(0.54, 0.64, 0.08, 48), white, [0, 0, 0], [0, 0, 0.34]));
  tray.add(mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.72, 12), gold, [0, 0.36, 0], [0, 0, 0.34]));
  return tray;
}

function createDocumentPanel(white, burgundy, gold) {
  const panel = new THREE.Group();
  panel.add(mesh(new THREE.BoxGeometry(1, 1.36, 1), white));
  panel.add(mesh(new THREE.BoxGeometry(1, 1, 1), burgundy, [0, 0.35, 0.53], [0, 0, 0], [0.68, 0.045, 0.02]));
  panel.add(mesh(new THREE.BoxGeometry(1, 1, 1), burgundy, [0, 0.12, 0.53], [0, 0, 0], [0.55, 0.035, 0.02]));
  panel.add(mesh(new THREE.BoxGeometry(1, 1, 1), gold, [0, -0.1, 0.53], [0, 0, 0], [0.62, 0.035, 0.02]));
  return panel;
}

function mesh(geometry, material, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]) {
  const item = new THREE.Mesh(geometry, material);
  item.position.set(...position);
  item.rotation.set(...rotation);
  item.scale.set(...scale);
  return item;
}

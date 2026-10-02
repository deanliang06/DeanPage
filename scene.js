import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';

const container = document.querySelector('#scene');
const powerButton = document.querySelector('#power-button');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#d9eaf3');
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
container.appendChild(renderer.domElement);
renderer.domElement.setAttribute('aria-label', 'Realistic 3D Macintosh with a large blank curved glass screen');
renderer.domElement.setAttribute('role', 'img');
renderer.domElement.dataset.testid = 'scene-canvas';
const camera = new THREE.PerspectiveCamera(29, 1, 0.1, 40);
// Denoised ambient occlusion adds contact depth inside the recessed bezel.
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const occlusion = new GTAOPass(scene, camera, 512, 512);
occlusion.blendIntensity = 0.65;
occlusion.updateGtaoMaterial({ radius: 0.24, distanceExponent: 1.5, thickness: 0.12, samples: 16 });
composer.addPass(occlusion);
composer.addPass(new OutputPass());
composer.addPass(new SMAAPass());
const pmrem = new THREE.PMREMGenerator(renderer);
const room = new RoomEnvironment();
// An off-camera softbox creates a broad photographic reflection on the CRT.
const softbox = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 3, 3), side: THREE.DoubleSide }));
softbox.position.set(-4.5, 5.5, 6);
softbox.lookAt(0, 3.4, 0);
room.add(softbox);
const environment = pmrem.fromScene(room, 0.04);
scene.environment = environment.texture;
scene.environmentIntensity = 0.45;
room.dispose();
pmrem.dispose();

// Fine irregular grain catches light like aged injection-molded ABS.
const grainCanvas = document.createElement('canvas');
grainCanvas.width = grainCanvas.height = 512;
const grainContext = grainCanvas.getContext('2d');
const grainPixels = grainContext.createImageData(512, 512);
let seed = 1984;
for (let i = 0; i < grainPixels.data.length; i += 4) {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  const value = 110 + (seed % 60);
  grainPixels.data.set([value, value, value, 255], i);
}
grainContext.putImageData(grainPixels, 0, 0);
const grain = new THREE.CanvasTexture(grainCanvas);
grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
grain.repeat.set(5, 5);
const plastic = new THREE.MeshPhysicalMaterial({ color: '#cdc4a7', roughness: 0.64, bumpMap: grain, bumpScale: 0.004, clearcoat: 0.06, clearcoatRoughness: 0.7 });
const edgePlastic = plastic.clone(); edgePlastic.color.set('#b5ad92');
const dark = new THREE.MeshStandardMaterial({ color: '#292c25', roughness: 0.84 });
const computer = new THREE.Group();
scene.add(computer);

function box(w, h, d, radius, material, x, y, z, parent = computer) {
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 5, radius), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}
// The front is a genuine opening, rather than a screen pasted on a solid box.
function roundedPath(path, x, y, w, h, r) {
  path.moveTo(x+r,y); path.lineTo(x+w-r,y); path.quadraticCurveTo(x+w,y,x+w,y+r);
  path.lineTo(x+w,y+h-r); path.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  path.lineTo(x+r,y+h); path.quadraticCurveTo(x,y+h,x,y+h-r);
  path.lineTo(x,y+r); path.quadraticCurveTo(x,y,x+r,y);
  return path;
}
const frontShape = roundedPath(new THREE.Shape(), -2.65, 0.12, 5.3, 5.6, 0.17);
frontShape.holes.push(roundedPath(new THREE.Path(), -2.19, 1.77, 4.38, 3.38, 0.24));
const bezelGeometry = new THREE.ExtrudeGeometry(frontShape, { depth: 0.22, bevelEnabled: true, bevelThickness: 0.055, bevelSize: 0.055, bevelSegments: 5, curveSegments: 24 });
const bezel = new THREE.Mesh(bezelGeometry, plastic);
bezel.position.z = 0.96; bezel.castShadow = bezel.receiveShadow = true;
computer.add(bezel);
box(5.22, 5.52, 2.25, 0.18, plastic, 0, 2.91, -0.26);
box(4.43, 3.43, 0.14, 0.23, edgePlastic, 0, 3.46, 0.96);
box(4.16, 3.17, 0.12, 0.22, dark, 0, 3.46, 1.055);

// Dense curved CRT surface, with rounded silhouette and a physical glass coat.
const glassGeometry = new THREE.PlaneGeometry(4.03, 3.02, 100, 80);
const positions = glassGeometry.attributes.position;
for (let i = 0; i < positions.count; i++) {
  let x = positions.getX(i), y = positions.getY(i);
  const innerX = 2.015 - 0.19, innerY = 1.51 - 0.19;
  if (Math.abs(x) > innerX && Math.abs(y) > innerY) {
    const dx = Math.abs(x)-innerX, dy = Math.abs(y)-innerY;
    const length = Math.hypot(dx,dy);
    if (length > 0.19) { x = Math.sign(x)*(innerX+dx/length*0.19); y = Math.sign(y)*(innerY+dy/length*0.19); }
  }
  const bulge = 0.15*(1-Math.pow(x/2.015,2))*(1-Math.pow(y/1.51,2));
  positions.setXYZ(i,x,y,bulge);
}
glassGeometry.computeVertexNormals();
const glass = new THREE.Mesh(glassGeometry, new THREE.MeshPhysicalMaterial({ color: '#101c19', roughness: 0.23, metalness: 0, ior: 1.52, clearcoat: 1, clearcoatRoughness: 0.065, envMapIntensity: 0.8 }));
glass.position.set(0,3.46,1.135); computer.add(glass);
let poweredOn = false;
powerButton.addEventListener('click', () => {
  if (poweredOn) return;
  poweredOn = true;
  powerButton.disabled = true;
  powerButton.hidden = true;
  glass.material.emissive.set('#173d24');
  glass.material.emissiveIntensity = 0.45;
  const start = performance.now();
  // Reuse the static desk shadows and skip costly ambient occlusion while moving.
  // This leaves more frame time for the camera animation on integrated GPUs.
  renderer.shadowMap.autoUpdate = false;
  occlusion.enabled = false;
  const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 600;
  function zoom(now) {
    zoomProgress = duration ? Math.min(1, (now-start)/duration) : 1;
    renderCamera();
    if (zoomProgress < 1) requestAnimationFrame(zoom);
    else {
      const portfolio = document.querySelector('#portfolio');
      portfolio.hidden = false;
      container.hidden = true;
      document.body.dataset.state = 'portfolio';
      portfolio.focus({ preventScroll: true });
    }
  }
  requestAnimationFrame(zoom);
});

// Recessed floppy slot, eject pinhole, seam, and molded feet.
box(1.72,0.105,0.06,0.018,edgePlastic,1.13,0.95,1.22);
box(1.59,0.039,0.065,0.009,dark,1.13,0.955,1.255);
const pin = new THREE.Mesh(new THREE.CircleGeometry(0.022,16),dark);
pin.position.set(2.11,0.95,1.26); computer.add(pin);
box(5.1,0.035,0.03,0.007,edgePlastic,0,0.32,1.22);
box(4.92,0.13,1.93,0.045,edgePlastic,0,0.09,-0.17);
for(let i=0;i<12;i++) box(0.016,0.038,1.08,0.005,dark,2.615,4.55-i*0.095,-0.4);

// Small period details remain subordinate to the glass.
const labelCanvas = document.createElement('canvas'); labelCanvas.width=512; labelCanvas.height=128;
const labelContext=labelCanvas.getContext('2d');
labelContext.fillStyle='#5c5b50'; labelContext.font='32px Georgia'; labelContext.fillText('Macintosh',20,72);
const labelTexture=new THREE.CanvasTexture(labelCanvas); labelTexture.colorSpace=THREE.SRGBColorSpace;
const label=new THREE.Mesh(new THREE.PlaneGeometry(0.72,0.18),new THREE.MeshBasicMaterial({map:labelTexture,transparent:true,depthWrite:false}));
label.position.set(-1.66,0.88,1.247); computer.add(label);
const logoColors=['#71a667','#e4cb61','#e3a452','#c66c59','#9a739c','#6996b0'];
logoColors.forEach((color,i)=>box(0.16,0.025,0.008,0.008,new THREE.MeshStandardMaterial({color,roughness:0.6}),-2.15,0.955-i*0.025,1.245));

const woodCanvas=document.createElement('canvas'); woodCanvas.width=2048; woodCanvas.height=1024;
const wc=woodCanvas.getContext('2d');
// Warm oak boards, with flowing grain, pores, and subtle variations in finish.
const woodPixels=wc.createImageData(2048,1024);
const boardTones=[0,5,-3,2,-5,4];
for(let y=0;y<1024;y++) {
  for(let x=0;x<2048;x++) {
    const board=Math.min(5,Math.floor(y/171));
    const flow=y+7*Math.sin(x/280+y/120)+3*Math.sin(x/89+y/90);
    const fibers=Math.sin(flow*2.1+x*0.007)*2.3+Math.sin(flow*0.45)*3.1;
    seed=(seed*1664525+1013904223)>>>0;
    const pore=(seed%1000<9)?-15:((seed%20)-10)*0.17;
    const seam=y%171<2?-18:0;
    const shade=boardTones[board]+fibers+pore+seam;
    const i=(y*2048+x)*4;
    woodPixels.data.set([179+shade,137+shade,94+shade,255],i);
  }
}
wc.putImageData(woodPixels,0,0);
const woodTexture=new THREE.CanvasTexture(woodCanvas); woodTexture.colorSpace=THREE.SRGBColorSpace;
woodTexture.wrapS=woodTexture.wrapT=THREE.RepeatWrapping; woodTexture.repeat.set(1.6,1);
woodTexture.anisotropy=renderer.capabilities.getMaxAnisotropy();
const woodMaterial=new THREE.MeshPhysicalMaterial({map:woodTexture,roughness:0.48,bumpMap:woodTexture,bumpScale:0.016,clearcoat:0.18,clearcoatRoughness:0.42});
box(18,0.28,11,0.07,woodMaterial,0,-0.14,0.5,scene);

// A complete low-profile period keyboard sits directly in front of the Macintosh.
const keyboard=new THREE.Group(); keyboard.position.set(-0.22,0.08,2.65); scene.add(keyboard);
box(4.5,0.2,1.52,0.09,edgePlastic,0,0.02,0,keyboard);
box(4.46,0.17,1.48,0.075,plastic,0,0.105,-0.015,keyboard);
box(4.11,0.018,1.16,0.03,edgePlastic,0,0.198,-0.025,keyboard);
const keyMaterial=plastic.clone(); keyMaterial.color.set('#ddd4bd'); keyMaterial.roughness=0.58;
const letters=['1234567890-=','QWERTYUIOP[]','ASDFGHJKL;\'','ZXCVBNM,./'];
function keycap(x,z,width,legend='') {
  box(width,0.115,0.22,0.024,keyMaterial,x,0.25,z,keyboard);
  if(!legend) return;
  const canvas=document.createElement('canvas'); canvas.width=64; canvas.height=64;
  const ctx=canvas.getContext('2d'); ctx.fillStyle='#68675d'; ctx.font='22px Arial'; ctx.fillText(legend,10,29);
  const texture=new THREE.CanvasTexture(canvas); texture.colorSpace=THREE.SRGBColorSpace;
  const glyph=new THREE.Mesh(new THREE.PlaneGeometry(width*0.8,0.17),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}));
  glyph.rotation.x=-Math.PI/2; glyph.position.set(x,0.309,z); keyboard.add(glyph);
}
letters.forEach((row,r)=>{
  const z=-0.43+r*0.265;
  keycap(-1.85,z,0.32,r===0?'esc':r===1?'tab':r===2?'caps':'shift');
  [...row].forEach((letter,c)=>keycap(-1.47+c*0.258+(r===2?0.045:r===3?0.13:0),z,0.23,letter));
  keycap(1.8,z,0.35,r===2?'return':r===3?'shift':'');
});
keycap(-1.81,0.64,0.34,'ctrl'); keycap(-1.38,0.64,0.4,'alt');
keycap(-0.01,0.64,2.18); keycap(1.39,0.64,0.4,'alt'); keycap(1.84,0.64,0.34);
const keyboardCable=new THREE.CatmullRomCurve3([new THREE.Vector3(-1.9,0.16,1.95),new THREE.Vector3(-2.7,0.06,1.6),new THREE.Vector3(-2.95,0.06,0.3),new THREE.Vector3(-2.55,0.2,-0.65)]);
const keyboardWire=new THREE.Mesh(new THREE.TubeGeometry(keyboardCable,64,0.024,8,false),new THREE.MeshStandardMaterial({color:'#aca48f',roughness:0.65})); keyboardWire.castShadow=true; scene.add(keyboardWire);

const mouse=box(0.72,0.28,1.02,0.12,plastic,3.1,0.16,2.75,scene); mouse.rotation.y=-0.12;
const button=box(0.53,0.04,0.32,0.035,plastic,3.08,0.307,2.47,scene); button.rotation.y=-0.12;
const cableCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(3.04,0.1,2.25),new THREE.Vector3(3.35,0.055,1.4),new THREE.Vector3(3.95,0.055,0.15),new THREE.Vector3(3.4,0.055,-1.3),new THREE.Vector3(2.5,0.2,-1)]);
const cable=new THREE.Mesh(new THREE.TubeGeometry(cableCurve,80,0.025,8,false),new THREE.MeshStandardMaterial({color:'#9b9684',roughness:0.75})); cable.castShadow=true; scene.add(cable);

const keyLight=new THREE.DirectionalLight('#fff3df',3.2); keyLight.position.set(-5,9,7); keyLight.castShadow=true;
keyLight.shadow.mapSize.set(2048,2048); Object.assign(keyLight.shadow.camera,{left:-8,right:8,top:10,bottom:-6,near:0.5,far:30});
keyLight.shadow.normalBias=0.018; keyLight.shadow.bias=-0.0001; keyLight.shadow.radius=5; scene.add(keyLight);
const fill=new THREE.DirectionalLight('#e1efff',1.1); fill.position.set(6,4,3); scene.add(fill);
scene.add(new THREE.HemisphereLight('#e5f3ff','#95836d',0.65));

let zoomProgress = 0;
function renderCamera() {
  const width=container.clientWidth, height=container.clientHeight;
  // Frame the complete desktop setup, keeping the monitor large and central.
  const visibleHeight=Math.max(8.0,8.1/camera.aspect);
  const distance=visibleHeight/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2)));
  const eased = zoomProgress * zoomProgress * (3 - 2 * zoomProgress);
  const endDistance = Math.min(3.02,4.03/camera.aspect) / (2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))) * 0.82;
  // Interpolate distance geometrically so perspective magnification increases
  // evenly, instead of making large apparent jumps near the glass.
  const zoomDistance = distance * Math.pow(endDistance / distance, eased);
  camera.position.set(0.65*(1-eased),THREE.MathUtils.lerp(5.25,3.46,eased),THREE.MathUtils.lerp(1.2,1.30,eased)+zoomDistance);
  camera.lookAt(0.2*(1-eased),THREE.MathUtils.lerp(2.75,3.46,eased),THREE.MathUtils.lerp(1.1,1.3,eased)); camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  // Project the control onto the middle of the CRT at every viewport size.
  const center = new THREE.Vector3(0,3.46,1.30).project(camera);
  const left = new THREE.Vector3(-0.8,3.46,1.30).project(camera);
  const right = new THREE.Vector3(0.8,3.46,1.30).project(camera);
  const projectedWidth = (right.x-left.x)*width/2;
  const angle = Math.atan2(-(right.y-left.y)*height, (right.x-left.x)*width);
  powerButton.style.left = `${(center.x+1)*width/2}px`;
  powerButton.style.top = `${(1-center.y)*height/2}px`;
  powerButton.style.transform = `translate(-50%, -50%) rotate(${angle}rad) scale(${Math.max(1,projectedWidth/170)})`;
  composer.render();
}
function resize() {
  if (container.hidden) return;
  const width=container.clientWidth, height=container.clientHeight;
  renderer.setSize(width,height); camera.aspect=width/height;
  composer.setSize(width,height);
  renderCamera();
}
window.addEventListener('resize',resize);
resize();
document.querySelector('#status').hidden=true;
powerButton.hidden=false;
document.body.dataset.state = 'ready';

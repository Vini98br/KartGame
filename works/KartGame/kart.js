// Receive a initial position with Vector3 format
function Kart(initialPosition = new THREE.Vector3(0, 0, 1.2)) {
  var DISTANCE_BETWEEN_WHEELS = 6;
  var DISTANCE_BETWEEN_AXLES = 6;

  // Mostrar FPS
  var stats = initStats();
  // Criar Cena
  var scene = new THREE.Scene();
  // Inicializar o renderizador
  var renderer = initRenderer();
  // Configurando iluminação
  var light = initDefaultLighting(scene, new THREE.Vector3(0, 10, 15));

  // Configurando do relógio
  var clock = new THREE.Clock();

  // Configuração da velocidade inicial
  var speed = 0;
  // Configuração da aceleração
  var acceleration = 0.01;
  // Velocidade máxima
  var maxSpeed = 3;

  // Add camera de inspeção
  var inspectionCamera = new THREE.PerspectiveCamera(
    10,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  // Modo de camera
  var gameModeCamera = true;
  // Configura o foco da camera de inspeção
  var inspectionCameraFocus = initialPosition;
  // Configura a posição da camera de inspeção
  var inspectionCameraPosition = new THREE.Vector3(3, -70, 20);
  // Configura o up da camera de inspeção
  var inspectionCameraUp = new THREE.Vector3(0, 0, 1);
  // Configura o ângulo da camera de inspeção
  var inspectionCameraAngle = 0;
  // Configura velocidade da camera de inspeção
  var inspectionCameraSpeed = 10;
  // Configura aceleração da camera de inspeção
  var inspectionCameraAcceleration = inspectionCameraSpeed * clock.getDelta();

  // Flag pra quando a seta pra cima é solta
  var upUp = false;

  // Angulo de rotação do kart
  var kartRotationAngle = 0;
  // Angulo de rotação das rodas
  var wheelRotationAngle = 90;

  // Configurando camera
  var camera = new THREE.PerspectiveCamera(
    10,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  scene.add(camera);
  camera.position.set(0, 10, 50);
  camera.up.set(0, 0, 1);

  // Configurando teclado
  var keyboard = new KeyboardState();
  var trackballControls = new THREE.TrackballControls(
    camera,
    renderer.domElement
  );

  // Plano
  var plane = GroundPlane();
  scene.add(plane);
  scene.add(plane.line);

  // Eixo Principal
  var mainAxle = GenerateBar(DISTANCE_BETWEEN_AXLES);
  mainAxle.rotateX(degreesToRadians(90)).rotateZ(degreesToRadians(90));
  mainAxle.position.x = initialPosition.x;
  mainAxle.position.y = initialPosition.y;
  mainAxle.position.z = initialPosition.z;
  scene.add(mainAxle);

  // Eixo Dianteiro
  var frontAxle = Axle(DISTANCE_BETWEEN_WHEELS);
  mainAxle.add(frontAxle);
  frontAxle.translateZ(-(DISTANCE_BETWEEN_WHEELS / 2));

  // Eixo Traseiro
  var rearAxle = Axle(DISTANCE_BETWEEN_WHEELS);
  mainAxle.add(rearAxle);
  rearAxle.translateZ(DISTANCE_BETWEEN_WHEELS / 2);
  camera.lookAt(rearAxle.position);

  // Carenagem
  var mainCareen = Careen(DISTANCE_BETWEEN_WHEELS);
  mainAxle.add(mainCareen);

  // Velocímetro
  var speedometer = new SecondaryBox("Velocidade: " + speed);

  render();

  // Aceleração do Kart
  function accelerate() {
    upUp = false;
    // Limitação de velocidade
    if (speed < maxSpeed) {
      speed += acceleration;
    }
    mainAxle.translateY(speed);
  }

  // Freio do Kart
  function brake() {
    downUp = false;
    if (speed > 0) {
      upUp = false;
      speed -= acceleration * 2;
      mainAxle.translateY(speed);
    }
  }

  function moveGameCamera() {
    var relativeCameraOffset = new THREE.Vector3(8, -120, 0);

    var cameraOffset = relativeCameraOffset.applyMatrix4(mainAxle.matrixWorld);

    camera.position.x = cameraOffset.x;
    camera.position.y = cameraOffset.y;
    camera.position.z = cameraOffset.z;

    camera.lookAt(mainAxle.position);
  }

  var gameModeControls = new InfoBox();
  var inspectionModeControls = new InfoBox();
  configureInfoBox(gameModeControls, true);
  configureInfoBox(inspectionModeControls, false);
  inspectionModeControls.infoBox.style.display = 'none';

  function changeCameraMode() {
    gameModeCamera = !gameModeCamera;
    // mainAxle.position.copy()
    if (gameModeCamera) {
      // Caixa de informações
      showElement(gameModeControls.infoBox);
      hideElement(inspectionModeControls.infoBox);

      showElement(document.getElementById('game-mode'));
      setTimeout(() => {
        hideElement(document.getElementById('game-mode'));
      }, 1000);
      scene.add(plane);
      scene.add(plane.line);
    }
    else {
      // Caixa de informações
      showElement(inspectionModeControls.infoBox);
      hideElement(gameModeControls.infoBox);

      showElement(document.getElementById('inspection-mode'));
      setTimeout(() => {
        hideElement(document.getElementById('inspection-mode'));
      }, 1000);
      
      scene.remove(plane);
      scene.remove(plane.line);
      mainAxle.position.x = initialPosition.x;
      mainAxle.position.y = initialPosition.y;
      mainAxle.position.z = initialPosition.z;
      inspectionCameraFocus = initialPosition;
      inspectionCameraPosition = new THREE.Vector3(3, -70, 20);
      inspectionCameraUp = new THREE.Vector3(0, 0, 1);
      moveInspectionCamera();
    }
  }

  function moveInspectionCamera() {
    camera.position.copy(inspectionCameraPosition);
    camera.lookAt(inspectionCameraFocus);
    camera.up.copy(inspectionCameraUp);
  }

  function moveWheel() {
    frontAxle.rightWheel.rotation.set(
      degreesToRadians(wheelRotationAngle),
      frontAxle.rightWheel.rotation.y,
      0
    );
    frontAxle.leftWheel.rotation.set(
      degreesToRadians(wheelRotationAngle),
      frontAxle.leftWheel.rotation.y,
      0
    );
  }

  function keyboardUpdate() {
    keyboard.update();
    kartRotationAngle = degreesToRadians(speed);
    if (gameModeCamera) {
      speedometer.box.style.display = 'block';
      if (keyboard.pressed("left")) {
        mainAxle.rotateX(kartRotationAngle);
        if (wheelRotationAngle <= 35 + 90) {
          wheelRotationAngle += 6;
        }
      } else if (keyboard.pressed("right")) {
        mainAxle.rotateX(-kartRotationAngle);
        if (wheelRotationAngle >= -35 + 90) {
          wheelRotationAngle -= 6;
        }
      } else {
        if (wheelRotationAngle !== 90 && wheelRotationAngle > 90)
          wheelRotationAngle += 6 * -1;
        else if (wheelRotationAngle !== 90 && wheelRotationAngle < 90)
          wheelRotationAngle += 6 * 1;
      }

      if (keyboard.pressed("up")) accelerate();
      if (keyboard.pressed("down")) brake();
      if (keyboard.up("up")) upUp = true;

      moveGameCamera();
    } else {
      speedometer.box.style.display = 'none';
      // Alterando a posição em x e z
      if (keyboard.pressed("up")) {
        inspectionCameraPosition.z += inspectionCameraAcceleration;
        console.log(inspectionCameraUp.z);
      }
      if (keyboard.pressed("down"))
        inspectionCameraPosition.z -= inspectionCameraAcceleration;
      if (keyboard.pressed("left"))
        inspectionCameraPosition.x -= inspectionCameraAcceleration;
      if (keyboard.pressed("right"))
        inspectionCameraPosition.x += inspectionCameraAcceleration;

      // Modificando para onde a câmera aponta
      if (keyboard.pressed("D"))
        inspectionCameraFocus.x += inspectionCameraAcceleration;
      if (keyboard.pressed("A"))
        inspectionCameraFocus.x -= inspectionCameraAcceleration;
      if (keyboard.pressed("W"))
        inspectionCameraFocus.z += inspectionCameraAcceleration;
      if (keyboard.pressed("S"))
        inspectionCameraFocus.z -= inspectionCameraAcceleration;

      // Modificando o vetor up
      if (keyboard.pressed("Q")) {
        inspectionCameraAngle += 0.01;
        inspectionCameraUp.x = Math.sin(inspectionCameraAngle);
        inspectionCameraUp.z = Math.cos(inspectionCameraAngle);
      }
      if (keyboard.pressed("E")) {
        inspectionCameraAngle -= 0.01;
        inspectionCameraUp.x = Math.sin(inspectionCameraAngle);
        inspectionCameraUp.z = Math.cos(inspectionCameraAngle);
      }
      moveInspectionCamera();
    }
    if (keyboard.down("space")) changeCameraMode();
  }

  function render() {
    stats.update();
    if (speed < 0) speedometer.changeMessage("Velocidade: " + 0.0);
    else speedometer.changeMessage("Velocidade: " + (speed * 30).toFixed(1));
    trackballControls.update();
    lightFollowingCamera(light, camera);
    requestAnimationFrame(render);
    moveWheel();
    keyboardUpdate();

    if (upUp && speed > 0) {
      speed -= acceleration;
      mainAxle.translateY(speed);
    } else {
      upUp = false;
    }
    renderer.render(scene, camera); // Render scene
  }
}

//*========================== Auxiliar Functions ==========================*
function GroundPlane() {
  const planeGeometry = new THREE.PlaneGeometry(700, 700, 40, 40);
  planeGeometry.translate(0.0, 0.0, -0.02);
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: "rgba(20, 30, 110)",
    side: THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  const wireframe = new THREE.WireframeGeometry(planeGeometry);
  const line = new THREE.LineSegments(wireframe);
  line.material.color.setStyle("rgb(180, 180, 180)");
  plane.geometry = planeGeometry;
  plane.line = line;
  return plane;
}

function Careen(distanceBetweenWheels) {
  // Carenagem Principal
  const mainCareen = GenerateBox(0.5, 4, 4, "#FFA500");

  // Carenagem da cabine
  const cabin1 = GenerateBox(0.5, 4, 1, "#1a1a1a");
  const cabin2 = GenerateBox(0.5, 4, 1, "#1a1a1a");

  // Assento
  const seat = GenerateBox(1.5, 0.3, 2, "#1a1a1a");
  mainCareen.add(seat);
  seat.translateY(-2).translateX(1);

  // Painel
  const panel = GenerateBox(1.4, 1, 2, "#1a1a1a");
  mainCareen.add(panel);
  panel.translateX(0.5).translateY(1.5);

  // Barra da direção
  const steeringWheelBar = GenerateBar(1);
  panel.add(steeringWheelBar);
  steeringWheelBar.translateX(0.5).translateY(-1);

  // Volante
  const steeringWheel = SteeringWheel("#1a1a1a");
  steeringWheelBar.add(steeringWheel);
  steeringWheel.translateY(-0.5);

  mainCareen.add(cabin1);
  cabin1.translateX(0.5);
  cabin1.translateZ(1.5);

  mainCareen.add(cabin2);
  cabin2.translateX(0.5);
  cabin2.translateZ(-1.5);

  // Carenagem Dianteira
  const frontCareen = GenerateBox(0.5, 2, 2, "#FFA500");
  mainCareen.add(frontCareen);
  frontCareen.translateY(distanceBetweenWheels / 2);

  // Para-choque Dianteiro
  const frontBumper = GenerateBox(0.5, 1, 4, "#FFA500");
  frontCareen.add(frontBumper);
  frontBumper.translateY(0.5);

  // Carenagem Traseira
  const rearCareen = GenerateBox(1.0, 2, 2, "#FFA500");
  mainCareen.add(rearCareen);
  rearCareen.translateY(-(distanceBetweenWheels / 2)).translateX(0.25);

  // Para-choque Traseiro
  const rearBumper = GenerateBox(1.0, 1, 4, "#FFA500");
  rearCareen.add(rearBumper);
  rearBumper.translateY(-0.5);

  // Aerofólio
  const airfoilSupportBar1 = GenerateBar(1);
  rearBumper.add(airfoilSupportBar1);
  airfoilSupportBar1.rotateZ(degreesToRadians(90)).translateZ(1).translateY(-1);
  const airfoilSupportBar2 = GenerateBar(1);
  rearBumper.add(airfoilSupportBar2);
  airfoilSupportBar2
    .rotateZ(degreesToRadians(90))
    .translateZ(-1)
    .translateY(-1);
  const airfoilPlate = GenerateBox(0.01, 1, 4, "#FFA500");
  airfoilSupportBar1.add(airfoilPlate);
  airfoilPlate.rotateZ(degreesToRadians(90)).translateZ(-1).translateX(-0.5);

  return mainCareen;
}

function SteeringWheel(color) {
  const geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 60);
  const material = new THREE.MeshPhongMaterial({ color: color });
  return new THREE.Mesh(geometry, material);
}

function GenerateBox(width, height, depth, color) {
  const cubeGeometry = new THREE.BoxGeometry(width, height, depth);
  const cubeMaterial = new THREE.MeshPhongMaterial({ color: color });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  return cube;
}

function GenerateBar(length) {
  const axleBarGeometry = new THREE.CylinderGeometry(0.1, 0.1, length, 25);
  const axleBarMaterial = new THREE.MeshPhongMaterial({
    color: "#c0c0c0",
  });
  const axleBar = new THREE.Mesh(axleBarGeometry, axleBarMaterial);
  return axleBar;
}

function Wheel() {
  const wheelGeometry = new THREE.TorusGeometry(0.8, 0.5, 16, 100);
  const wheelMaterial = new THREE.MeshPhongMaterial({
    color: "gray",
  });
  const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  return wheel;
}

function GenerateSphere(color) {
  const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const sphereMaterial = new THREE.MeshPhongMaterial({ color: "black" });
  return new THREE.Mesh(sphereGeometry, sphereMaterial);
}

function Axle(distance) {
  const translation = distance / 2;

  // Calota Esquerda
  const hubcapLeft = GenerateSphere("black");

  // Calota Direita
  const hubcapRight = GenerateSphere("black");

  // Eixo
  const axleBar = GenerateBar(distance);
  axleBar.rotateX(degreesToRadians(90));
  axleBar.add(hubcapLeft);
  axleBar.add(hubcapRight);
  hubcapLeft.translateY(translation);
  hubcapRight.translateY(-translation);

  // Roda esquerda
  const leftWheel = Wheel();
  leftWheel.rotateX(degreesToRadians(90)).translateZ(translation);
  axleBar.add(leftWheel);

  // Roda direita
  const rightWheel = Wheel();
  rightWheel.rotateX(degreesToRadians(90)).translateZ(-translation);
  axleBar.add(rightWheel);

  // Incluir as rodas no retorno para manipulação das mesmas
  axleBar.rightWheel = rightWheel;
  axleBar.leftWheel = leftWheel;

  return axleBar;
}

function configureInfoBox(controls, gameMode) {
  controls.add("Kart Game");
  controls.addParagraph();
  if(gameMode) {
    controls.add("⬆ Para acelerar");
    controls.add("⬇ Para frear");
    controls.add("⬅ Para virar para esquerda");
    controls.add("➡ Para virar para direita");
  } else {
    controls.add("⬆ ⬇ ⬅ ➡ Para movimentar a camera");
  }
  controls.add("space para trocar o modo da câmera");
  controls.show();
}

function showElement(elm) {
  elm.style.display = 'block';
}

function hideElement(elm) {
  elm.style.display = 'none';
}
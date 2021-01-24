function main() {
  // Mostrar FPS
  var stats = initStats();
  // Criar Cena
  var scene = new THREE.Scene();
  // Inicializar o renderizador
  var renderer = initRenderer();
  // Configurando iluminação
  var light = initDefaultLighting(scene, new THREE.Vector3(0, 10, 15));

  // Posição inicial do kart
  var kartInitialPosition = new THREE.Vector3(1.2, 0, 2);
  // Angulo inicial de rotação do kart
  var kartRotationAngle = 0;
  // Angulo inicial de rotação das rodas
  var wheelRotationAngle = 90;
  // Velocidade máxima
  var maxSpeed = 4;
  // Configuração da aceleração
  var acceleration = 0.01;
  // Configuração da velocidade inicial
  var speed = 0;
  // Velocímetro
  var speedometer = new SecondaryBox("Velocidade: " + speed);

  // Modo de camera
  var gameModeCamera = true;
  // Caixa de informações modo Jogo
  var gameModeControls = configureInfoBox(new InfoBox(), true);
  // Caixa de informações modo inspeção
  var inspectionModeControls = configureInfoBox(new InfoBox(), false);

  // Instância do teclado
  var keyboard = new KeyboardState();
  // Flag pra quando a seta pra cima é solta
  var upUp = false;
  // Flag pra quando a seta pra baixo é solta
  var downUp = false;

  // Configurando câmera
  var camera = new THREE.PerspectiveCamera(
    10,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  scene.add(camera);
  camera.position.set(0, 10, 50);
  camera.up.set(0, 0, 1);

  var trackballControls = new THREE.TrackballControls(
    camera,
    renderer.domElement
  );

  // Plano
  var plane = GroundPlane();
  scene.add(plane);
  scene.add(plane.line);

  // Kart
  var kart = Kart(kartInitialPosition, camera, gameModeCamera);
  scene.add(kart);
  // Fazendo a camera "olhar" para o eixo traseiro do kart
  camera.lookAt(kart.rearAxle.position);

  // Ouvindo mudanças no tamanho da tela
  window.addEventListener(
    "resize",
    function () {
      onWindowResize(camera, renderer);
    },
    false
  );

  render();

  // Função que altera o modo da câmera
  function changeCameraMode() {
    if (speed > 0) {
      message("error-changing-mode");
      return;
    }
    gameModeCamera = !gameModeCamera;
    // mainAxle.position.copy()
    resetKart();
    if (gameModeCamera) {
      message("game-mode");
      showElement(gameModeControls.infoBox);
      hideElement(inspectionModeControls.infoBox);

      scene.add(plane);
      scene.add(plane.line);
      moveGameCamera();
    } else {
      message("inspection-mode");
      showElement(inspectionModeControls.infoBox);
      hideElement(gameModeControls.infoBox);

      scene.remove(plane);
      scene.remove(plane.line);
      moveInspectionCamera();
    }
  }

  // Função que lida com movimentação da camera no modo Jogo
  function moveGameCamera() {
    camera.up.set(0, 0, 1);
    var relativeCameraOffset = new THREE.Vector3(8, -120, 0);

    var cameraOffset = relativeCameraOffset.applyMatrix4(kart.matrixWorld);

    camera.position.x = cameraOffset.x;
    camera.position.y = cameraOffset.y;
    camera.position.z = cameraOffset.z;

    camera.lookAt(kart.position);
  }

  // Função que lida com movimentação da camera no modo Inspeção
  function moveInspectionCamera() {
    var distanceX = 8;
    var distanceY = -80;
    var distanceZ = 40;
    camera.position.x = kartInitialPosition.x - distanceX;
    camera.position.y = kartInitialPosition.y - distanceY;
    camera.position.z = kartInitialPosition.z + distanceZ;
    camera.lookAt(kart.position);
    camera.up.set(0, 0, 1);
  }

  // Resetar kart para posição inicial
  function resetKart() {
    kart.position.copy(kartInitialPosition);
    kart.rotation.set(degreesToRadians(90), 0, degreesToRadians(90));
    speed = 0;
  }

  // Função que lida com movimentação das rodas
  function moveWheel() {
    kart.frontAxle.rightWheel.rotation.set(
      degreesToRadians(wheelRotationAngle),
      kart.frontAxle.rightWheel.rotation.y,
      0
    );
    kart.frontAxle.leftWheel.rotation.set(
      degreesToRadians(wheelRotationAngle),
      kart.frontAxle.leftWheel.rotation.y,
      0
    );
  }

  // Aceleração do Kart
  function accelerate() {
    upUp = false;
    downUp = false;
    // Limitação de velocidade
    if (speed < maxSpeed) {
      speed += acceleration;
    }
    kart.translateY(speed);
  }

  // Freio do Kart
  function brake() {
    downUp = false;
    if (speed > 0) {
      upUp = false;
      speed -= acceleration * 2;
      kart.translateY(speed);
    }
  }

  // Função para lidar com atualizações no teclado
  function keyboardUpdate() {
    keyboard.update();
    kartRotationAngle = degreesToRadians(speed);
    if (gameModeCamera) {
      // Mostrar velocímetro
      showElement(speedometer.box);

      if (keyboard.pressed("up")) accelerate();
      if (keyboard.pressed("down")) brake();
      if (keyboard.up("down")) downUp = true;
      if (keyboard.up("up")) upUp = true;
    } else {
      // Esconder velocímetro
      hideElement(speedometer.box);
    }

    if (keyboard.pressed("left")) {
      kart.rotateX(kartRotationAngle);
      if (wheelRotationAngle <= 125) {
        wheelRotationAngle += 6;
      }
    } else if (keyboard.pressed("right")) {
      kart.rotateX(-kartRotationAngle);
      if (wheelRotationAngle >= 55) {
        wheelRotationAngle -= 6;
      }
    } else {
      if (wheelRotationAngle !== 90 && wheelRotationAngle > 90)
        wheelRotationAngle -= 6;
      else if (wheelRotationAngle !== 90 && wheelRotationAngle < 90)
        wheelRotationAngle += 6;
    }

    if (keyboard.down("space")) changeCameraMode();
  }

  function render() {
    trackballControls.update();
    if (speed < 0) speedometer.changeMessage("Velocidade: " + 0.0);
    else speedometer.changeMessage("Velocidade: " + (speed * 30).toFixed(1));
    stats.update();
    trackballControls.update();
    lightFollowingCamera(light, camera);
    requestAnimationFrame(render);
    keyboardUpdate();
    moveWheel();
    if (gameModeCamera) moveGameCamera();

    if ((upUp || downUp) && speed > 0) {
      speed -= acceleration;
      kart.translateY(speed);
    } else {
      upUp = false;
      downUp = false;
    }
    renderer.render(scene, camera); // Render scene
  }
}

// Componente Kart
function Kart(initialPosition = new THREE.Vector3(0, 0, 1.2)) {
  var DISTANCE_BETWEEN_WHEELS = 6;
  var DISTANCE_BETWEEN_AXLES = 6;

  // Eixo Principal
  var mainAxle = GenerateBar(DISTANCE_BETWEEN_AXLES);
  mainAxle.rotateX(degreesToRadians(90)).rotateZ(degreesToRadians(90));
  mainAxle.position.x = initialPosition.x;
  mainAxle.position.y = initialPosition.y;
  mainAxle.position.z = initialPosition.z;

  // Eixo Dianteiro
  var frontAxle = Axle(DISTANCE_BETWEEN_WHEELS);
  mainAxle.add(frontAxle);
  frontAxle.translateZ(-(DISTANCE_BETWEEN_WHEELS / 2));

  // Eixo Traseiro
  var rearAxle = Axle(DISTANCE_BETWEEN_WHEELS);
  mainAxle.add(rearAxle);
  rearAxle.translateZ(DISTANCE_BETWEEN_WHEELS / 2);

  // Carenagem
  var mainCareen = Careen(DISTANCE_BETWEEN_WHEELS);
  mainAxle.add(mainCareen);

  render();
  function render() {
    requestAnimationFrame(render);

    mainAxle.frontAxle = frontAxle;
    mainAxle.rearAxle = rearAxle;
  }
  return mainAxle;
}

//*========================== Componentes do Kart ==========================*
// Componente do plano
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

// Componente da carenagem
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
  const geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 60);
  const material = new THREE.MeshPhongMaterial({ color: "#1a1a1a" });
  const steeringWheel = new THREE.Mesh(geometry, material);
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

// Componente da roda do Kart
function Wheel() {
  const wheelGeometry = new THREE.TorusGeometry(0.8, 0.5, 16, 100);
  const wheelMaterial = new THREE.MeshPhongMaterial({
    color: "black",
  });
  const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  return wheel;
}

// Componente do eixo do Kart
function Axle(length) {
  const translation = length / 2;

  // Calota Esquerda
  const hubcapLeft = GenerateSphere("white");

  // Calota Direita
  const hubcapRight = GenerateSphere("white");

  // Eixo
  const axleBar = GenerateBar(length);
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

//*========================== Funções auxiliares ==========================*
// Gerador do elemento box
function GenerateBox(width, height, depth, color) {
  const cubeGeometry = new THREE.BoxGeometry(width, height, depth);
  const cubeMaterial = new THREE.MeshPhongMaterial({ color: color });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  return cube;
}

// Gerador do elemento cilindro
function GenerateBar(length) {
  const axleBarGeometry = new THREE.CylinderGeometry(0.1, 0.1, length, 25);
  const axleBarMaterial = new THREE.MeshPhongMaterial({
    color: "#c0c0c0",
  });
  const axleBar = new THREE.Mesh(axleBarGeometry, axleBarMaterial);
  return axleBar;
}

// Gerador do elemento esfera
function GenerateSphere(color) {
  const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const sphereMaterial = new THREE.MeshPhongMaterial({ color: color });
  return new THREE.Mesh(sphereGeometry, sphereMaterial);
}

// Configuração da caixa de mensagem
function configureInfoBox(controls, gameMode) {
  controls.add("Kart Game");
  controls.addParagraph();
  if (gameMode) {
    controls.add("⬆ Para acelerar");
    controls.add("⬇ Para frear");
    controls.add("⬅ Para virar para esquerda");
    controls.add("➡ Para virar para direita");
  } else {
    hideElement(controls.infoBox);
    controls.add("⬆ ⬇ ⬅ ➡ Para movimentar a camera");
  }
  controls.add("space para trocar o modo da câmera");
  controls.show();

  return controls;
}

// Mostra um elemento da tela pelo seu id
function showElement(elm) {
  elm.style.display = "block";
}

// Esconde um elemento da tela pelo seu id
function hideElement(elm) {
  elm.style.display = "none";
}

// Notificação de troca de câmera
function message(elm) {
  showElement(document.getElementById(elm));
  setTimeout(() => {
    hideElement(document.getElementById(elm));
  }, 1000);
}

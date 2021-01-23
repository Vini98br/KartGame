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

  var speed = 0;
  var acceleration = 0.01;
  var upUp = false;
  var downUp = false;

  // Configurando camera
  var camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 1000);
  scene.add(camera);
  camera.position.set(0,10,50);
  camera.up.set(0,0,1);
	// camera.lookAt(scene.position);

  var clock = new THREE.Clock();

  // Configurando teclado
  var keyboard = new KeyboardState();
  var trackballControls = new THREE.TrackballControls(
    camera,
    renderer.domElement
  );

  // Matriz auxiliar
  var mat4 = new THREE.Matrix4();
  // var angle = 1;

  // Show world axes
  var axesHelper = new THREE.AxesHelper(12);
  scene.add(axesHelper);

  // Plano
  var planeGeometry = new THREE.PlaneGeometry(700, 700, 40, 40);
  planeGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
  var planeMaterial = new THREE.MeshBasicMaterial({
    color: "rgba(20, 30, 110)",
    side: THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: 1, // positive value pushes polygon further away
    polygonOffsetUnits: 1,
  });
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  scene.add(plane);
  var wireframe = new THREE.WireframeGeometry(planeGeometry);
  var line = new THREE.LineSegments(wireframe);
  line.material.color.setStyle("rgb(180, 180, 180)");
  scene.add(line);

  // Eixo Principal
  var mainAxle = GenerateBar(DISTANCE_BETWEEN_AXLES);
  // mainAxle.matrixAutoUpdate = false;
  // mainAxle.matrix.identity();
  // mainAxle.matrix.multiply(mat4.makeRotationX(degreesToRadians(90)));
  // mainAxle.matrix.multiply(mat4.makeRotationZ(degreesToRadians(90)));
  // mainAxle.matrix.multiply(
  //   mat4.makeTranslation(
  //     initialPosition.x,
  //     initialPosition.y,
  //     initialPosition.z
  //   )
  // );
  scene.add(mainAxle);

  mainAxle.rotateX(degreesToRadians(90)).rotateZ(degreesToRadians(90));
  mainAxle.position.x = initialPosition.x;
  mainAxle.position.y = initialPosition.y;
  mainAxle.position.z = initialPosition.z;

  // Eixo Dianteiro
  var frontAxle = GenerateAxle(DISTANCE_BETWEEN_WHEELS, true);
  mainAxle.add(frontAxle);
  frontAxle.translateZ(-(DISTANCE_BETWEEN_WHEELS / 2));

  // Eixo Traseiro
  var rearAxle = GenerateAxle(DISTANCE_BETWEEN_WHEELS, false);
  mainAxle.add(rearAxle);
  rearAxle.translateZ(DISTANCE_BETWEEN_WHEELS / 2);

  camera.lookAt(rearAxle.position);

  // Carenagem
  var mainCareen = GenerateCareen(DISTANCE_BETWEEN_WHEELS);
  mainAxle.add(mainCareen);

  render();

  function accelerate() {
    // Limitação de velocidade
    upUp = false;
    if (speed < 2) {
      speed += acceleration;
      console.log(speed);
    }
    // mainAxle.matrix.multiply(mat4.makeTranslation(0, speed, initialPosition.z));
    mainAxle.translateY(speed);
  }

  function moveCamera() {
    var relativeCameraOffset = new THREE.Vector3(8,-120,0);
    
    console.log(mainAxle.position);
    
    var cameraOffset = relativeCameraOffset.applyMatrix4( mainAxle.matrixWorld);
    
    camera.position.x = cameraOffset.x;
    camera.position.y = cameraOffset.y;
    camera.position.z = cameraOffset.z;
    
     console.log("camera - " , camera.position);
    camera.lookAt( mainAxle.position);
  }

  function brake() {
    downUp = false;
    if (speed > 0) {
      upUp = false;
      speed -= acceleration * 2;
      mainAxle.translateY(speed);
      // mainAxle.matrix.multiply(
      //   mat4.makeTranslation(0, speed, initialPosition.z)
      // );
    }
  }
  var angle;
  var wheelAngle = degreesToRadians(1);
  var contRight = 0;
  var contLeft = 0;
  function keyboardUpdate() {
    keyboard.update();
    angle = degreesToRadians(speed * 2);
    if (keyboard.pressed("left")) {
      if (speed > 0) {
        // mainAxle.matrix.multiply(mat4.makeRotationX(angle));
        mainAxle.rotateX(angle);
        if (contLeft <= 30) {
          contLeft++;
          contRight--;
          frontAxle.rightWheel.matrix.multiply(mat4.makeRotationX(wheelAngle));
          frontAxle.leftWheel.matrix.multiply(mat4.makeRotationX(wheelAngle));
        }
      }
    }
    if (keyboard.pressed("right")) {
      if (speed > 0) {
        // mainAxle.matrix.multiply(mat4.makeRotationX(-angle));
        mainAxle.rotateX(-angle);
        if (contRight <= 30) {
          contRight++;
          contLeft--;
          frontAxle.rightWheel.matrix.multiply(mat4.makeRotationX(-wheelAngle));
          frontAxle.leftWheel.matrix.multiply(mat4.makeRotationX(-wheelAngle));
        }
      }
    }
    if (keyboard.pressed("up")) accelerate();
    if (keyboard.pressed("down")) brake();
    if (keyboard.up("up")) upUp = true;
    if (keyboard.up("down")) downUp = true;

    if (keyboard.pressed("space")) cube.position.set(0.0, 0.0, 2.0);

    moveCamera();
  }

  function render() {
    stats.update(); // Update FPS
    trackballControls.update(); // Enable mouse movements
    lightFollowingCamera(light, camera);
    requestAnimationFrame(render);
    keyboardUpdate();

    // if (downUp && speed > 0) {
    //   speed -= acceleration;
    //   mainAxle.matrix.multiply(
    //     mat4.makeTranslation(0, speed, initialPosition.z)
    //   );
    // }

    if (upUp && speed > 0) {
      speed -= acceleration;
      // mainAxle.matrix.multiply(
      //   mat4.makeTranslation(0, speed, initialPosition.z)
      // );
      mainAxle.translateY(speed);
    } else {
      upUp = false;
    }
    renderer.render(scene, camera); // Render scene
  }
}

//*========================== Auxiliar Functions ==========================*
function GenerateCareen(distanceBetweenWheels) {
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
  const steeringWheel = GenerateSteeringWheel("#1a1a1a");
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

function GenerateBox(width, height, depth, color) {
  const cubeGeometry = new THREE.BoxGeometry(width, height, depth);
  const cubeMaterial = new THREE.MeshPhongMaterial({ color: color });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  return cube;
}

function GenerateSteeringWheel(color) {
  const geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 60);
  const material = new THREE.MeshPhongMaterial({ color: color });
  return new THREE.Mesh(geometry, material);
}

function GenerateBar(length) {
  const axleBarGeometry = new THREE.CylinderGeometry(0.1, 0.1, length, 25);
  const axleBarMaterial = new THREE.MeshPhongMaterial({
    color: "#c0c0c0",
  });
  const axleBar = new THREE.Mesh(axleBarGeometry, axleBarMaterial);
  return axleBar;
}

function GenerateWheel() {
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

function GenerateAxle(distance, isFront) {
  const mat4 = new THREE.Matrix4();
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
  const leftWheel = GenerateWheel();
  if (isFront) {
    leftWheel.matrixAutoUpdate = false;
    leftWheel.matrix.identity();
    leftWheel.matrix.multiply(mat4.makeRotationX(degreesToRadians(90)));
    leftWheel.matrix.multiply(
      mat4.makeTranslation(
        leftWheel.position.x,
        leftWheel.position.y,
        translation
      )
    );
  } else {
    leftWheel.rotateX(degreesToRadians(90)).translateZ(translation);
  }
  axleBar.add(leftWheel);

  // Roda direita
  const rightWheel = GenerateWheel();
  if (isFront) {
    rightWheel.matrixAutoUpdate = false;
    rightWheel.matrix.identity();
    rightWheel.matrix.multiply(mat4.makeRotationX(degreesToRadians(90)));
    rightWheel.matrix.multiply(
      mat4.makeTranslation(
        rightWheel.position.x,
        rightWheel.position.y,
        -translation
      )
    );
  } else {
    rightWheel.rotateX(degreesToRadians(90)).translateZ(-translation);
  }
  axleBar.add(rightWheel);

  // Incluir as rodas no retorno para manipulação das mesmas
  axleBar.rightWheel = rightWheel;
  axleBar.leftWheel = leftWheel;

  return axleBar;
}

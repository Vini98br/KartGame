// Receive a initial position with Vector3 format
function Kart(initialPosition) {
  var DISTANCE_BETWEEN_WHEELS = 6;
  var DISTANCE_BETWEEN_AXLES = 6;

  var stats = initStats(); // To show FPS information
  var scene = new THREE.Scene(); // Create main scene
  var renderer = initRenderer(); // View function in util/utils
  var camera = initCamera(new THREE.Vector3(10, 5, 10)); // Init camera in this position
  var light = initDefaultLighting(scene, new THREE.Vector3(0, 0, 15));
  var clock = new THREE.Clock();
  var keyboard = new KeyboardState(); // To use the keyboard
  var trackballControls = new THREE.TrackballControls(
    camera,
    renderer.domElement
  );
  var mat4 = new THREE.Matrix4();
  var angle = 1;

  // Show world axes
  var axesHelper = new THREE.AxesHelper(12);
  scene.add(axesHelper);

  // Eixo Principal
  var mainAxle = GenerateBar(DISTANCE_BETWEEN_AXLES);
  scene.add(mainAxle);
  mainAxle.rotateZ(degreesToRadians(90));

  // Eixo Dianteiro
  var frontAxle = GenerateAxle(DISTANCE_BETWEEN_WHEELS, true);
  mainAxle.add(frontAxle);
  frontAxle.translateZ(-(DISTANCE_BETWEEN_WHEELS / 2));

  // Eixo Traseiro
  var rearAxle = GenerateAxle(DISTANCE_BETWEEN_WHEELS, false);
  mainAxle.add(rearAxle);
  rearAxle.translateZ(DISTANCE_BETWEEN_WHEELS / 2);

  // Carenagem
  var mainCareen = GenerateCareen(DISTANCE_BETWEEN_WHEELS);
  mainAxle.add(mainCareen);

  render();

  var contRight = 0;
  var contLeft = 0;
  function keyboardUpdate() {
    keyboard.update();

    if (keyboard.pressed("left") && contLeft < 30) {
      contLeft++;
      contRight--;
      frontAxle.rightWheel.matrix.multiply(
        mat4.makeRotationX(degreesToRadians(angle))
      );
      frontAxle.leftWheel.matrix.multiply(
        mat4.makeRotationX(degreesToRadians(angle))
      );
    }
    if (keyboard.pressed("right") && contRight < 30) {
      contRight++;
      contLeft--;
      frontAxle.rightWheel.matrix.multiply(
        mat4.makeRotationX(degreesToRadians(-angle))
      );
      frontAxle.leftWheel.matrix.multiply(
        mat4.makeRotationX(degreesToRadians(-angle))
      );
    }
    if (keyboard.pressed("W")) cube.translateY(moveDistance);
    if (keyboard.pressed("S")) cube.translateY(-moveDistance);

    if (keyboard.pressed("space")) cube.position.set(0.0, 0.0, 2.0);
  }

  function render() {
    stats.update(); // Update FPS
    trackballControls.update(); // Enable mouse movements
    requestAnimationFrame(render);
    keyboardUpdate();
    renderer.render(scene, camera); // Render scene
  }
}

//*========================== Auxiliar Functions ==========================*
function GenerateCareen(distanceBetweenWheels) {
  // Carenagem Principal
  const mainCareen = GenerateBox(0.5, 4, 4);

  const cabin1 = GenerateBox(0.5, 4, 1);
  const cabin2 = GenerateBox(0.5, 4, 1);

  const seat = GenerateBox(1.5, 0.3, 2);
  mainCareen.add(seat);
  seat.translateY(-2).translateX(1);


  // const geometryCy = new THREE.CylinderGeometry( 5, 1, 20, 3, 1, true, 0, 3.8 );
  // const materialCy = new THREE.MeshBasicMaterial( {color: 'white'} );
  // const cylinder = new THREE.Mesh( geometryCy, materialCy );

  const panel = GenerateBox(1.4, 1, 2);
  mainCareen.add(panel);
  panel.translateX(0.5).translateY(1.5);

  // panel.add(cylinder);
  // cylinder.rotateX(degreesToRadians(180));

  const steeringWheelBar = GenerateBar(1);
  panel.add(steeringWheelBar);
  steeringWheelBar.translateX(0.5).translateY(-1);

  const geometry = new THREE.CylinderGeometry( 0.5, 0.5, 0.1, 60 );
  const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
  const steeringWheel = new THREE.Mesh( geometry, material );
  steeringWheelBar.add(steeringWheel);
  steeringWheel.translateY(-0.5)

  mainCareen.add(cabin1);
  cabin1.translateX(0.5);
  cabin1.translateZ(1.5);

  mainCareen.add(cabin2);
  cabin2.translateX(0.5);
  cabin2.translateZ(-1.5);

  // Carenagem Dianteira
  const frontCareen = GenerateBox(0.5, 2, 2);
  mainCareen.add(frontCareen);
  frontCareen.translateY(distanceBetweenWheels / 2);

  // Para-choque Dianteiro
  const frontBumper = GenerateBox(0.5, 1, 4);
  frontCareen.add(frontBumper);
  frontBumper.translateY(0.5);

  // Carenagem Traseira
  const rearCareen = GenerateBox(1.0, 2, 2);
  mainCareen.add(rearCareen);
  rearCareen.translateY(-(distanceBetweenWheels / 2)).translateX(0.25);

  // Para-choque Traseiro
  const rearBumper = GenerateBox(1.0, 1, 4);
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
  const airfoilPlate = GenerateBox(0.01, 1, 4);
  airfoilSupportBar1.add(airfoilPlate);
  airfoilPlate.rotateZ(degreesToRadians(90)).translateZ(-1).translateX(-0.5);

  return mainCareen;
}

function GenerateBox(width, height, depth) {
  const cubeGeometry = new THREE.BoxGeometry(width, height, depth);
  const cubeMaterial = new THREE.MeshNormalMaterial();
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  return cube;
}

function GenerateBar(length) {
  const axleBarGeometry = new THREE.CylinderGeometry(0.1, 0.1, length, 25);
  const axleBarMaterial = new THREE.MeshPhongMaterial({
    color: "rgb(100,255,100)",
  });
  const axleBar = new THREE.Mesh(axleBarGeometry, axleBarMaterial);
  return axleBar;
}

function GenerateWheel() {
  const wheelGeometry = new THREE.TorusGeometry(0.8, 0.5, 16, 100);
  const wheelMaterial = new THREE.MeshBasicMaterial({
    color: "gray",
  });
  const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  return wheel;
}

function GenerateSphere(color) {
  const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const sphereMaterial = new THREE.MeshPhongMaterial({ color: 'black' });
  return new THREE.Mesh(sphereGeometry, sphereMaterial);
}

function GenerateAxle(distance, isFront) {
  const mat4 = new THREE.Matrix4();
  const translation = distance / 2;

  // Calota Esquerda
  const hubcapLeft = GenerateSphere('black'); 

  // Calota Direita
  const hubcapRight = GenerateSphere('black');

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

  // Incluir as rodas no retorno para manipulação
  axleBar.rightWheel = rightWheel;
  axleBar.leftWheel = leftWheel;

  return axleBar;
}

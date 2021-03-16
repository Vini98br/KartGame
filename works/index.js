function main() {
  // Mostrar FPS
  var stats = initStats();
  // Criar Cena
  var scene = new THREE.Scene();
  // Inicializar o renderizador
  var renderer = initRenderer();

  // Posição inicial do kart
  var kartInitialPosition = new THREE.Vector3(0, -400, 1.2);
  // Posição do kart no centro
  var centerKartPosition = new THREE.Vector3(0, 0, 1.2);
  // Guarda posição do kart
  var saveKartPosition = new THREE.Vector3(1.2, 0, 1.2);
  // Guarda rotation do kart
  var saveKartRotation = new THREE.Vector3(0, 0, 0);
  // Angulo inicial de rotação do kart
  var kartRotationAngle = 10;
  // Angulo inicial de rotação das rodas
  var wheelRotationAngle = 90;
  // Velocidade máxima
  var maxSpeed = 4;
  // Configuração da aceleração
  var acceleration = 0.03;
  // Fator da força do freio do kart
  var breakFactor = 3;
  // Fator da força da fricção do kart
  var frictionFactor = 2;
  // Configuração da velocidade inicial
  var speed = 0;
  // Velocímetro
  var speedometer = new SecondaryBox("Velocidade: " + speed);

  // Modos de camera disponíveis
  var cameraModes = ["game", "cockpit", "inspection"];
  // Index de modo de camera atual
  var cameraModeIndex = 0;
  // Modo de camera
  var gameModeCamera = 0;
  // Caixa de informações modo Jogo
  var gameModeControls = configureInfoBox(new InfoBox(), true);
  // Caixa de informações modo inspeção
  var inspectionModeControls = configureInfoBox(new InfoBox(), false);

  const geometryCamera = new THREE.BoxGeometry(1, 1, 1);
  const materialCamera = new THREE.MeshPhongMaterial({ color: 0xdcdcdc });
  const cubeCamera = new THREE.Mesh(geometryCamera, materialCamera);

  function changeCamera(initialPosition) {
    var position = initialPosition;
    var camera = new THREE.PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    camera.position.copy(position);
    camera.up.set(0, 0, 1);
    return camera;
  }

  // Instância do teclado
  var keyboard = new KeyboardState();
  // Flag pra quando a seta pra cima é solta
  var upUp = false;
  // Flag pra quando a seta pra baixo é solta
  var downUp = false;

  // Configurando câmera
  var camera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );
  camera.position.set(0, 10, 50);
  camera.up.set(0, 0, 1);
  
  var trackballControls = new THREE.TrackballControls(
    camera,
    renderer.domElement
  );
    
  scene.add(camera);

  // Cor da luz
  var lightColor = "rgb(255,255,255)";

  // Configurando iluminação direcional
  var sunLight = new THREE.DirectionalLight(lightColor);
  setDirectionalLighting(sunLight, scene, new THREE.Vector3(1, 3, 200));

  // Configurando iluminação de spot
  var spotLight = new THREE.SpotLight(lightColor);
  setSpotLight(spotLight, camera, new THREE.Vector3(0, 10, 15));
  spotLight.position.set(0, 0, 50);
  spotLight.target = camera;

  // Plano Principal
  var plane = GroundPlane();
  scene.add(plane);
  var textureLoader = new THREE.TextureLoader();
  var track = textureLoader.load('./assets/pista.jpg');
  setTexture(plane, track, 1, 1);

  // Plano Secundário
  var secondaryPlane = SecondaryPlane();
  secondaryPlane.translateZ(-0.1);
  scene.add(secondaryPlane);
  var sand = textureLoader.load('./assets/sand.jpg');
  setTexture(secondaryPlane, sand, 4, 4);

  var skybox = SkyBox();
  skybox.rotation.x = degreesToRadians(90);
  scene.add(skybox);

  var pole1 = LightPole(new THREE.Vector3(200, -455, 6.5), lightColor);
  scene.add(pole1.light);
  scene.add(pole1);

  var pole2 = LightPole(new THREE.Vector3(0, -455, 6.5), lightColor);
  scene.add(pole2.light);
  scene.add(pole2);

  var pole3 = LightPole(new THREE.Vector3(-200, -455, 6.5), lightColor);
  scene.add(pole3.light);
  scene.add(pole3);

  var pole4 = LightPole(new THREE.Vector3(-350, -455, 6.5), lightColor);
  scene.add(pole4.light);
  scene.add(pole4);

  var pole5 = LightPole(new THREE.Vector3(216, 220, 6.5), lightColor);
  scene.add(pole5.light);
  scene.add(pole5);

  var pole6 = LightPole(new THREE.Vector3(500, 510, 6.5), lightColor);
  scene.add(pole6.light);
  scene.add(pole6);

  var pole7 = LightPole(new THREE.Vector3(-300, -10, 6.5), lightColor);
  scene.add(pole7.light);
  scene.add(pole7);

  var pole8 = LightPole(new THREE.Vector3(-470, 550, 6.5), lightColor);
  scene.add(pole8.light);
  scene.add(pole8);

  var pole9 = LightPole(new THREE.Vector3(-540, -385, 6.5), lightColor);
  scene.add(pole9.light);
  scene.add(pole9);

  // Kart
  var kart = Kart(kartInitialPosition);
  scene.add(kart);

  // Montanhas
  var mountainColor = "rgb(100, 70, 20)";
  var objectMaterial = new THREE.MeshLambertMaterial({
    color: mountainColor,
    opacity: 1,
  });

  // Configurando montanha baixa
  var { mountainLowObject1, mountainLowObject2 } = setLowMountain(
    480,
    200,
    objectMaterial
  );
  scene.add(mountainLowObject1);
  scene.add(mountainLowObject2);

  // Configurando montanha alta
  var {
    mountainHighObject1,
    mountainHighObject2,
    mountainHighObject3,
  } = setHighMountain(-70, 100, objectMaterial);
  scene.add(mountainHighObject1);
  scene.add(mountainHighObject2);
  scene.add(mountainHighObject3);

  // Array que salva todos os objetos externos adicionados
  var objectArray = new Array();
  //Estatua
  loadOBJFile(
    scene,
    objectArray,
    "assets/",
    "sm_statue_lion_lod0",
    true,
    45,
    -250,
    180
  );

  // Podio
  loadOBJFile (
    scene,
    objectArray,
    "assets/",
    "Cart_Rigged",
    true,
    10,
    110,
    -445
  );

  // Cones
  loadOBJFile(
    scene,
    objectArray,
    "assets/",
    "lwpltrfccon1",
    true,
    5,
    50,
    -320
  );

  loadOBJFile(
    scene,
    objectArray,
    "assets/",
    "lwpltrfccon1",
    true,
    5,
    40,
    -320
  );

  loadOBJFile(
    scene,
    objectArray,
    "assets/",
    "lwpltrfccon1",
    true,
    5,
    60,
    -320
  );

  loadOBJFile(
    scene,
    objectArray,
    "assets/",
    "lwpltrfccon1",
    true,
    5,
    70,
    -320
  );

  loadOBJFile(
    scene,
    objectArray,
    "assets/",
    "lwpltrfccon1",
    true,
    5,
    40,
    -420
  );

  loadOBJFile(
    scene,
    objectArray,
    "assets/",
    "lwpltrfccon1",
    true,
    5,
    50,
    -420
  );

  loadOBJFile(
    scene,
    objectArray,
    "assets/",
    "lwpltrfccon1",
    true,
    5,
    60,
    -420
  );

  loadOBJFile(
    scene,
    objectArray,
    "assets/",
    "lwpltrfccon1",
    true,
    5,
    70,
    -420
  );

  // Ouvindo mudanças no tamanho da tela
  window.addEventListener(
    "resize",
    function () {
      onWindowResize(camera, renderer);
    },
    false
  );

  buildInterface();
  render();

  // Função que altera o modo da câmera
  function changeCameraMode() {

    // Seta o novo modo de camera
    if(cameraModeIndex < 2){
      cameraModeIndex++;
    } else {
      cameraModeIndex = 0;
    };

    if (cameraModeIndex == 0) {  // Camera modo jogo
      cubeCamera.remove(camera);
      kart.mainCareen.remove(cubeCamera);
      returnKartPositionInGame();
      message("game-mode");
      showElement(gameModeControls.infoBox);
      hideElement(inspectionModeControls.infoBox);

      // Adiciona na cena
      addIntoScene();

      trackballControls.enabled = true;
      moveGameCamera();
    } 
    else if (cameraModeIndex == 1) {
      //returnKartPositionInGame();
      message("cockpit-mode");
      showElement(gameModeControls.infoBox);
      hideElement(inspectionModeControls.infoBox);

      // Adiciona na cena
      addIntoScene();

      trackballControls.enabled = false;
      camera = changeCamera(new THREE.Vector3(2, -1.5, 0))
      
      camera.rotateX(degreesToRadians(90));
      camera.rotateZ(degreesToRadians(-90));

      cubeCamera.add(camera);
      kart.mainCareen.add(cubeCamera);
    }
    else {  // Camera modo inspecao
      cubeCamera.remove(camera);
      kart.mainCareen.remove(cubeCamera);
      saveKartPosition.copy(kart.position);
      saveKartRotation.copy(kart.rotation);
      resetKart();
      message("inspection-mode");
      showElement(inspectionModeControls.infoBox);
      hideElement(gameModeControls.infoBox);

      // Removes da cena
      removeFromScene();
 
      trackballControls.enabled = true;
      moveInspectionCamera();
    }
  }

  // Função que lida com movimentação da camera no modo Jogo
  function moveGameCamera() {
    camera.up.set(0, 0, 1);
    var relativeCameraOffset = new THREE.Vector3(15, -35, 0);

    // Cálculo da distância entre a câmera e o kart utilizando a posição do
    // kart como matriz de transformação do Vector3 para Matrix4
    var cameraOffset = relativeCameraOffset.applyMatrix4(kart.matrixWorld);

    // Posiciona a câmera de acordo com distância calculada
    camera.position.x = cameraOffset.x;
    camera.position.y = cameraOffset.y;
    camera.position.z = cameraOffset.z;
    camera.lookAt(kart.position);
  }

  // Função que lida com movimentação da camera no modo Inspeção
  function moveInspectionCamera() {
    trackballControls = initTrackballControls(camera, renderer);
    var distanceX = 5;
    var distanceY = -10;
    var distanceZ = 10;
    camera.position.x = centerKartPosition.x - distanceX;
    camera.position.y = centerKartPosition.y - distanceY;
    camera.position.z = centerKartPosition.z + distanceZ;
    camera.lookAt(kart.position);
  }

  // Resetar kart para posição, rotação e velocidade inicial
  function resetKart() {
    kart.position.copy(centerKartPosition);
    kart.rotation.set(degreesToRadians(90), 0, degreesToRadians(90));
    speed = 0;
  }

  // Função que retorna a posição do Kart no modo de jogo
  function returnKartPositionInGame() {
    kart.position.copy(saveKartPosition);
    kart.rotation.set(
      saveKartRotation.x,
      saveKartRotation.y,
      saveKartRotation.z
    );
  }

  // Adiciona elementos na cena
  function addIntoScene() {
    scene.add(plane);
    scene.add(secondaryPlane);
    scene.add(skybox);
    scene.add(mountainLowObject2);
    scene.add(mountainLowObject1);
    scene.add(mountainHighObject1);
    scene.add(mountainHighObject2);
    scene.add(mountainHighObject3);
    scene.add(pole1);
    scene.add(pole2);
    scene.add(pole3);
    scene.add(pole4);
    scene.add(pole5);
    scene.add(pole6);
    scene.add(pole7);
    scene.add(pole8);
    scene.add(pole9);
    objectArray.forEach((obj) => {
      obj.visible = true;
    });
  }

  // Remove elementos da cena
  function removeFromScene() {
    scene.remove(plane);
    scene.remove(secondaryPlane);
    scene.remove(skybox);
    scene.remove(mountainLowObject2);
    scene.remove(mountainLowObject1);
    scene.remove(mountainHighObject1);
    scene.remove(mountainHighObject2);
    scene.remove(mountainHighObject3);
    scene.remove(pole1);
    scene.remove(pole2);
    scene.remove(pole3);
    scene.remove(pole4);
    scene.remove(pole5);
    scene.remove(pole6);
    scene.remove(pole7);
    scene.remove(pole8);
    scene.remove(pole9);
    objectArray.forEach((obj) => {
      obj.visible = false;
    });
  }

  function onMouseWheel(event) {
    if (cameraModeIndex === 0) {
      event.preventDefault();
      if(camera.fov >= 30 && camera.fov <= 150 ){
        camera.fov += event.deltaY / 100;
      } else {
        camera.fov = 30;
      }
      if( camera.fov > 150) {
        camera.fov = 150;
      }
      camera.updateProjectionMatrix();
    }
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
      // Freio para o Kart mais rápido que a apenas a fricção do mesmo
      speed -= breakFactor * acceleration;
      kart.translateY(speed);
    } else {
      if ((speed * -1) < maxSpeed/2) {
        speed -= acceleration;
      }
      kart.translateY(speed);
    }
  }

  // Função para lidar com atualizações no teclado
  function keyboardUpdate() {
    keyboard.update();

    kartRotationAngle = degreesToRadians(speed / 2);
    if(cameraModeIndex === 0) {
      window.addEventListener("wheel", onMouseWheel, true);
    }
    if (cameraModeIndex == 0 || cameraModeIndex == 1) {
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
      // Voltar a roda a rotação inicial se não estiver apertando seta pra esquerda nem a direita
      if (wheelRotationAngle !== 90 && wheelRotationAngle > 90)
        wheelRotationAngle -= 6;
      else if (wheelRotationAngle !== 90 && wheelRotationAngle < 90)
        wheelRotationAngle += 6;
    }

    if (keyboard.down("space")) changeCameraMode();
  }

  // Constrói a interface (instruções, luzes, velocímetro)
  function buildInterface() {
    // Interface
    var controls = new (function () {
      this.sunLight = true;
      this.spotLight = true;
      this.poles = true;

      this.onEnableSunLight = function () {
        sunLight.visible = this.sunLight;
        skybox.visible = this.sunLight;
      };

      this.onEnableSpotLight = function () {
        spotLight.visible = this.spotLight;
      };

      this.onEnablePoles = function () {
        pole1.light.visible = this.poles;
        pole2.light.visible = this.poles;
        pole3.light.visible = this.poles;
        pole4.light.visible = this.poles;
        pole5.light.visible = this.poles;
        pole6.light.visible = this.poles;
        pole7.light.visible = this.poles;
        pole8.light.visible = this.poles;
        pole9.light.visible = this.poles;
      };
    })();
    var gui = new dat.GUI();
    gui
      .add(controls, "sunLight", true)
      .name("Luz solar")
      .onChange(function (e) {
        controls.onEnableSunLight();
      });
    gui
      .add(controls, "spotLight", true)
      .name("Luz do Kart")
      .onChange(function (e) {
        controls.onEnableSpotLight();
      });
    gui
      .add(controls, "poles", true)
      .name("Postes de Luz")
      .onChange(function (e) {
        controls.onEnablePoles();
      });
  }

  function render() {
    trackballControls.update();
    if (speed < 0) speedometer.changeMessage("Velocidade: " + (speed * -30).toFixed(1));
    else speedometer.changeMessage("Velocidade: " + (speed * 30).toFixed(1));
    stats.update();
    
    keyboardUpdate();
    moveWheel();
        
    if ((upUp || downUp) && speed > 0) {
      speed -= frictionFactor * acceleration;
      
      // Margem de erro para zerar a velocidade
      if(speed> -0.04 && speed < 0.04) speed = 0;
      kart.translateY(speed);
    } else if ((upUp || downUp) && speed < 0) {
      speed += frictionFactor * acceleration;
      kart.translateY(speed);
    } else {
      upUp = false;
      downUp = false;
    }

    if (cameraModeIndex == 0) {
      window.addEventListener("wheel", onMouseWheel, true);
      trackballControls.enabled = true;
      trackballControls.update();
      moveGameCamera();
    } 

    requestAnimationFrame(render);
    renderer.render(scene, camera); // Render scene
  }
}

//*========================== Componentes do Kart ==========================*
// Componente Kart
function Kart(initialPosition = new THREE.Vector3(0, -200, 1.2)) {
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
  mainCareen.castShadow = true;
  mainAxle.add(mainCareen);

  render();
  function render() {
    requestAnimationFrame(render);
    mainAxle.mainCareen = mainCareen;
    mainAxle.frontAxle = frontAxle;
    mainAxle.rearAxle = rearAxle;
    mainAxle.mainCareen.steeringWheel = mainCareen.steeringWheel;
  }
  return mainAxle.rotateX(degreesToRadians(180));
}

// Componente da carenagem
function Careen(distanceBetweenWheels) {
  const textureLoader = new THREE.TextureLoader();
  // Carenagem Principal
  const mainCareen = GenerateBox(0.5, 4, 4, "#FFA500");

  // Carenagem da cabine
  const cabin1 = GenerateBox(0.5, 4, 1, "#000");
  const cabin2 = GenerateBox(0.5, 4, 1, "#000");

  // Adesivos 1
  const tribalGeo = new THREE.PlaneGeometry(1, 4, 40, 40);
  const tribalMaterial = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
  });
  const tribal = new THREE.Mesh(tribalGeo, tribalMaterial);
  const tribalTexture = textureLoader.load('./assets/tribal.png');
  setTexture(tribal, tribalTexture, 1, 1);
  tribal.rotateY(degreesToRadians(90));
  tribal.position.x = 0.26;
  cabin1.add(tribal);

  // Adesivos 2
  const tribal2Geo = new THREE.PlaneGeometry(1, 4, 40, 40);
  const tribal2Material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
  });
  const tribal2 = new THREE.Mesh(tribal2Geo, tribal2Material);
  setTexture(tribal2, tribalTexture, 1, 1);
  tribal2.rotateY(degreesToRadians(90));
  tribal2.position.x = 0.26;
  tribal2.rotateY(degreesToRadians(180));
  cabin2.add(tribal2);

  // Assento
  const seat = GenerateBox(1.5, 0.3, 2, "#000");
  mainCareen.add(seat);
  seat.translateY(-2).translateX(1);

  // Painel
  const panel = GenerateBox(1.4, 1, 2, "#000");
  mainCareen.add(panel);
  panel.translateX(0.5).translateY(1.5);


  const rbGeo = new THREE.PlaneGeometry(2, 1, 40, 40);
  const rbMaterial = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
  });
  const rb = new THREE.Mesh(rbGeo, rbMaterial);
  const rbTexture = textureLoader.load('./assets/rb.png');
  setTexture(rb, rbTexture, 1, 1);
  rb.rotateY(degreesToRadians(90));
  rb.rotateZ(degreesToRadians(180));
  rb.position.x = 0.71;
  panel.add(rb);


  // Barra da direção
  const steeringWheelBar = GenerateBar(1);
  panel.add(steeringWheelBar);
  steeringWheelBar.translateX(0.5).translateY(-1);

  // Volante
  const geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 60);
  const material = new THREE.MeshPhongMaterial({ color: "#000" });
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

  // Adesivos 3
  const skullGeo = new THREE.PlaneGeometry(4, 1, 40, 40);
  const skullMaterial = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    color: '#FFA500'
  });
  const skull = new THREE.Mesh(skullGeo, skullMaterial);
  skull.rotateY(11);
  const skullTexture = textureLoader.load('./assets/caveira.jpg');
  setTexture(skull, skullTexture, 1, 1);
  frontBumper.add(skull);
  skull.position.x = 0.26;
  skull.rotateZ(degreesToRadians(180));

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

  mainCareen.steeringWheel = steeringWheel;
  return mainCareen;
}

// Componente da roda do Kart
function Wheel() {
  const wheelGeometry = new THREE.TorusGeometry(0.8, 0.5, 16, 100);
  const wheelMaterial = new THREE.MeshPhongMaterial({
    color: "black",
  });
  const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  wheel.castShadow = true;
  return wheel;
}

// Componente do eixo do Kart
function Axle(length) {
  const translation = length / 2;

  // Calota Esquerda
  const hubcapLeft = GenerateSphere(0.5, "white");

  // Calota Direita
  const hubcapRight = GenerateSphere(0.5, "white");

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

//*========================== Componentes do Mundo ==========================*
// Componente do plano
function GroundPlane() {
  const planeGeometry = new THREE.PlaneGeometry(1200, 1200, 40, 40);
  planeGeometry.translate(0.0, 0.0, -0.02);
  const planeMaterial = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  return plane;
}

// Componente do plano secundário
function SecondaryPlane() {
  const planeGeometry = new THREE.PlaneGeometry(2400, 2400, 40, 40);
  planeGeometry.translate(0.0, 0.0, -0.02);
  const planeMaterial = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  return plane;
}

// Configura e retorna componente do SkyBox
function SkyBox() {
  const materialArray = [];
  const texture_ft = new THREE.TextureLoader().load('./assets/skybox/arid2_ft.jpg');
  const texture_bk = new THREE.TextureLoader().load('./assets/skybox/arid2_bk.jpg');
  const texture_up = new THREE.TextureLoader().load('./assets/skybox/arid2_up.jpg');
  const texture_dn = new THREE.TextureLoader().load('./assets/skybox/arid2_dn.jpg');
  const texture_rt = new THREE.TextureLoader().load('./assets/skybox/arid2_rt.jpg');
  const texture_lf = new THREE.TextureLoader().load('./assets/skybox/arid2_lf.jpg');
    
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
  materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));

  for (let i = 0; i < 6; i++)
    materialArray[i].side = THREE.BackSide;

  const skyboxGeo = new THREE.BoxGeometry(2400, 2400, 2400);
  const skybox = new THREE.Mesh(skyboxGeo, materialArray);

  return skybox;
}

// Poste de iluminação
function LightPole(position, lightColor) {
  const spotLight = new THREE.SpotLight(lightColor, 2, 0, degreesToRadians(45), 0.05, 2);

  const pole = GenerateBar(15, 'black');
  pole.castShadow = true;

  pole.rotateX(degreesToRadians(90));
  pole.position.copy(position);

  const light = GenerateSphere(1, "yellow");
  pole.add(light);
  light.translateY(8);

  spotLight.position.copy(new THREE.Vector3(position.x, position.y, position.z + 8))

  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  
  spotLight.shadow.camera.near = 5;
  spotLight.shadow.camera.far = 600;
  spotLight.shadow.camera.fov = 30;

  spotLight.castShadow = true;
  spotLight.name = "Spot Light";
  spotLight.visible = true;

  pole.light = spotLight;
  return pole;
}

// Montanha baixa
function setLowMountain(centerPointX, centerPointY, material) {
  //Objeto 1
  var pointsObject1 = [];

  //Pontos da base
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 80, centerPointY + 30, 0)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 120, centerPointY + 10, 0)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX - 20, centerPointY - 30, 0)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 165, centerPointY - 30, 0)
  );
  pointsObject1.push(new THREE.Vector3(centerPointX + 5, centerPointY + 30, 0));
  pointsObject1.push(new THREE.Vector3(centerPointX + 5, centerPointY - 80, 0));
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 120, centerPointY - 80, 0)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 80, centerPointY - 100, 0)
  );

  //Pontos intermediarios
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 130, centerPointY - 30, 40)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 90, centerPointY - 70, 40)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 30, centerPointY - 60, 40)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 10, centerPointY - 30, 40)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 45, centerPointY - 10, 40)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 90, centerPointY - 15, 40)
  );

  // Pontos do pico
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 20, centerPointY - 40, 70)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 30, centerPointY - 60, 70)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 75, centerPointY - 50, 70)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 72, centerPointY - 30, 70)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 45, centerPointY - 30, 90)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 55, centerPointY - 48, 100)
  );

  var convexGeometryObject1 = new THREE.ConvexBufferGeometry(pointsObject1);
  var smallMountainObject1 = new THREE.Mesh(convexGeometryObject1, material);

  //Objeto 2
  var pointsObject2 = [];

  //Pontos da base
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 80, centerPointY - 100, 0)
  );
  pointsObject2.push(new THREE.Vector3(centerPointX + 5, centerPointY - 80, 0));
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 120, centerPointY - 80, 0)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 80, centerPointY - 155, 0)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 125, centerPointY - 115, 0)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 132, centerPointY - 95, 0)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 25, centerPointY - 120, 0)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 48, centerPointY - 143, 0)
  );

  //Pontos intermediarios
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 25, centerPointY - 75, 28)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 90, centerPointY - 75, 28)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 95, centerPointY - 120, 28)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 75, centerPointY - 130, 28)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 45, centerPointY - 115, 28)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 103, centerPointY - 85, 28)
  );

  // Pontos do pico
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 55, centerPointY - 110, 55)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 42, centerPointY - 100, 55)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 49, centerPointY - 90, 55)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 62, centerPointY - 103, 55)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 58, centerPointY - 94, 55)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 52, centerPointY - 97, 58)
  );

  var convexGeometryObject2 = new THREE.ConvexBufferGeometry(pointsObject2);
  var smallMountainObject2 = new THREE.Mesh(convexGeometryObject2, material);
  return {
    mountainLowObject1: smallMountainObject1,
    mountainLowObject2: smallMountainObject2,
  };
}

// Montanha alta
function setHighMountain(centerPointX, centerPointY, material) {
  //Objeto 1
  var pointsObject1 = [];

  //Pontos da base
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 130, centerPointY + 60, 0)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 170, centerPointY + 40, 0)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX - 80, centerPointY - 70, 0)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 215, centerPointY - 70, 0)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 55, centerPointY + 70, 0)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 55, centerPointY - 110, 0)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 170, centerPointY - 110, 0)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 130, centerPointY - 130, 0)
  );

  //Pontos intermediarios
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 170, centerPointY - 60, 100)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 120, centerPointY - 100, 100)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 60, centerPointY - 90, 100)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 40, centerPointY - 60, 100)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 75, centerPointY - 40, 100)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 120, centerPointY - 45, 100)
  );

  // Pontos do pico
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 50, centerPointY - 40, 140)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 80, centerPointY - 60, 140)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 105, centerPointY - 50, 140)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 102, centerPointY - 30, 140)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 75, centerPointY - 30, 160)
  );
  pointsObject1.push(
    new THREE.Vector3(centerPointX + 85, centerPointY - 48, 170)
  );

  var convexGeometryObject1 = new THREE.ConvexBufferGeometry(pointsObject1);
  var highMountainObject1 = new THREE.Mesh(convexGeometryObject1, material);

  //Objeto 2
  var pointsObject2 = [];

  //Pontos da base
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 120, centerPointY - 130, 0)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 45, centerPointY - 110, 0)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 160, centerPointY - 110, 0)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 120, centerPointY - 215, 0)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 195, centerPointY - 145, 0)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 202, centerPointY - 80, 0)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 65, centerPointY - 150, 0)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 88, centerPointY - 203, 0)
  );

  //Pontos intermediarios
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 65, centerPointY - 80, 78)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 130, centerPointY - 80, 78)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 135, centerPointY - 150, 78)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 115, centerPointY - 160, 78)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 85, centerPointY - 145, 78)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 143, centerPointY - 115, 78)
  );

  // Pontos do pico
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 85, centerPointY - 140, 105)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 72, centerPointY - 130, 105)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 79, centerPointY - 120, 105)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 92, centerPointY - 133, 105)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 88, centerPointY - 124, 105)
  );
  pointsObject2.push(
    new THREE.Vector3(centerPointX + 82, centerPointY - 127, 108)
  );

  var convexGeometryObject2 = new THREE.ConvexBufferGeometry(pointsObject2);
  var highMountainObject2 = new THREE.Mesh(convexGeometryObject2, material);

  //Objeto 3
  var pointsObject3 = [];

  //Pontos da base
  pointsObject3.push(
    new THREE.Vector3(centerPointX + 50, centerPointY - 110, 0)
  );
  pointsObject3.push(
    new THREE.Vector3(centerPointX - 20, centerPointY - 110, 0)
  );
  pointsObject3.push(new THREE.Vector3(centerPointX, centerPointY - 140, 0));
  pointsObject3.push(
    new THREE.Vector3(centerPointX + 70, centerPointY - 160, 0)
  );
  pointsObject3.push(
    new THREE.Vector3(centerPointX + 195, centerPointY - 145, 0)
  );
  pointsObject3.push(
    new THREE.Vector3(centerPointX - 10, centerPointY - 100, 0)
  );
  pointsObject3.push(
    new THREE.Vector3(centerPointX + 10, centerPointY - 80, 0)
  );
  pointsObject3.push(
    new THREE.Vector3(centerPointX + 20, centerPointY - 65, 0)
  );

  //Pontos intermediarios
  pointsObject3.push(
    new THREE.Vector3(centerPointX + 40, centerPointY - 70, 35)
  );
  pointsObject3.push(
    new THREE.Vector3(centerPointX - 10, centerPointY - 70, 35)
  );
  pointsObject3.push(
    new THREE.Vector3(centerPointX + 125, centerPointY - 140, 35)
  );
  pointsObject3.push(
    new THREE.Vector3(centerPointX + 105, centerPointY - 150, 35)
  );
  pointsObject3.push(
    new THREE.Vector3(centerPointX + 75, centerPointY - 135, 35)
  );
  pointsObject3.push(
    new THREE.Vector3(centerPointX + 133, centerPointY - 105, 35)
  );

  // Pontos do pico
  pointsObject3.push(
    new THREE.Vector3(centerPointX + 25, centerPointY - 50, 50)
  );
  pointsObject3.push(
    new THREE.Vector3(centerPointX + 10, centerPointY - 50, 50)
  );
  pointsObject3.push(
    new THREE.Vector3(centerPointX + 105, centerPointY - 120, 50)
  );
  pointsObject3.push(
    new THREE.Vector3(centerPointX + 85, centerPointY - 130, 50)
  );
  pointsObject3.push(
    new THREE.Vector3(centerPointX + 55, centerPointY - 115, 55)
  );
  pointsObject3.push(
    new THREE.Vector3(centerPointX + 113, centerPointY - 85, 60)
  );

  var convexGeometryObject3 = new THREE.ConvexBufferGeometry(pointsObject3);
  var highMountainObject3 = new THREE.Mesh(convexGeometryObject3, material);

  return {
    mountainHighObject1: highMountainObject1,
    mountainHighObject2: highMountainObject2,
    mountainHighObject3: highMountainObject3,
  };
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
function GenerateBar(length, color = '#c0c0c0') {
  const axleBarGeometry = new THREE.CylinderGeometry(0.1, 0.1, length, 25);
  const axleBarMaterial = new THREE.MeshPhongMaterial({
    color: color,
  });
  const axleBar = new THREE.Mesh(axleBarGeometry, axleBarMaterial);
  return axleBar;
}

// Gerador do elemento esfera
function GenerateSphere(radius, color) {
  const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
  const sphereMaterial = new THREE.MeshPhongMaterial({ color: color });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  return sphere;
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
    controls.add("[mouse click] Para movimentar a camera");
    controls.add("[scroll up] Para dar zoom");
    controls.add("[scroll down] Para remover zoom");
  }
  controls.add("[space] para trocar o modo da câmera");
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

// Configura luz direcional
function setDirectionalLighting(light, scene, position) {
  light.position.copy(position);
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  light.castShadow = true;

  light.shadow.camera.left = -200;
  light.shadow.camera.right = 200;
  light.shadow.camera.top = 200;
  light.shadow.camera.bottom = -200;
  light.name = "Direction Light";
  light.visible = true;

  scene.add(light);
}

// Configura luz de spot
function setSpotLight(light, scene, position) {
  light.position.copy(position);
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  light.shadow.camera.fov = degreesToRadians(15);
  light.castShadow = true;
  light.decay = 2;
  light.penumbra = 0.05;
  light.name = "Spot Light";
  light.visible = true;

  scene.add(light);
}

// Configura luz pontual
function setPointLight(light, position) {
  light.position.copy(position);
  light.name = "Point Light";
  light.castShadow = true;
  light.visible = true;

  return light;
}

// Adicionar um array a scene
function addArrayToScene(scene, objects) {
  objects.forEach((obj) => {
    scene.add(obj);
  });
}

// Fixa o objeto sobre o plano do chão
function fixStatuePosition(obj, positionX, positionY, rotationZ, rotationX) {
  var box = new THREE.Box3().setFromObject(obj);
  obj.position.x = positionX;
  obj.position.y = positionY;
  obj.rotateZ(degreesToRadians(rotationZ));
  obj.rotateX(degreesToRadians(rotationX));
  return obj;
}

// Manipulando estátua
function normalizeAndRescaleStatue(obj, newScale) {
  var scale = getMaxSize(obj); // Available in 'utils.js'
  obj.scale.set(
    newScale * (1.0 / scale),
    newScale * (1.0 / scale),
    newScale * (1.0 / scale)
  );
  return obj;
}

// Colocar textura em um componente
function setTexture(component, texture, x, y) {
  component.material.map = texture;
  component.material.map.repeat.set(x, y);
  component.material.map.wrapS = THREE.RepeatWrapping;
  component.material.map.wrapT = THREE.RepeatWrapping;
  component.material.map.minFilter = THREE.LinearFilter;
  component.material.map.magFilter = THREE.LinearFilter;
}

function loadOBJFile(scene, objectArray, modelPath, modelName, visibility, desiredScale, positionX, positionY)
{
    currentModel = modelName;

    var manager = new THREE.LoadingManager( );

    var mtlLoader = new THREE.MTLLoader( manager );
    mtlLoader.setPath( modelPath );
    mtlLoader.load( modelName + '.mtl', function ( materials ) {
         materials.preload();

         var objLoader = new THREE.OBJLoader( manager );
         objLoader.setMaterials(materials);
         objLoader.setPath(modelPath);
         objLoader.load( modelName + ".obj", function ( obj ) {
           obj.name = modelName;
           obj.visible = visibility;
           // Set 'castShadow' property for each children of the group
           obj.traverse( function (child)
           {
             child.castShadow = true;
           });

           obj.traverse( function( node )
           {
             if( node.material ) node.material.side = THREE.DoubleSide;
           });

           var obj = normalizeAndRescaleStatue(obj, desiredScale);
           var obj = fixStatuePosition(obj, positionX, positionY, 360, 90);

           scene.add(obj);
           objectArray.push(obj);

         }, onProgress, onError );
    });
}

// Callback de erro
function onError() {}

// Callback de progresso
function onProgress(xhr, model) {
  if (xhr.lengthComputable) {
    var percentComplete = (xhr.loaded / xhr.total) * 100;
  }
}

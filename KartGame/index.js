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

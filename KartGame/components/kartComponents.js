
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

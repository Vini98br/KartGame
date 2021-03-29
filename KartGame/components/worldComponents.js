
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

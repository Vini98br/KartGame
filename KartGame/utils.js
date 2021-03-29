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

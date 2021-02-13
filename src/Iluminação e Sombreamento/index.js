function main() {
  var scene = new THREE.Scene(); // Create main scene
  var stats = initStats(); // To show FPS information

  var renderer = initRenderer(); // View function in util/utils
  renderer.setClearColor("rgb(30, 30, 42)");
  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.lookAt(0, 0, 0);
  camera.position.set(4.5, 2, 0);
  camera.up.set(0, 1, 0);
  var objColor = "rgb(255,255,255)";
  var objShininess = 200;

  var rotateOn = false;
  var redLightOn = true;
  var greenLightOn = true;
  var blueLightOn = true;
  var angle = 0.5;
  var mat4 = new THREE.Matrix4();

  // To use the keyboard
  var keyboard = new KeyboardState();

  // Enable mouse rotation, pan, zoom etc.
  var trackballControls = new THREE.TrackballControls(
    camera,
    renderer.domElement
  );

  // Listen window size changes
  window.addEventListener(
    "resize",
    function () {
      onWindowResize(camera, renderer);
    },
    false
  );

  var groundPlane = createGroundPlane(4.0, 2.5, "#964B00"); // width and height
  groundPlane.rotateX(degreesToRadians(-90));
  scene.add(groundPlane);

  var bar = createCylinder(0.03, 0.03, 1.3, 20, 20, false, 1);
  bar.position.set(1.9, 0.65, 1.15);

  scene.add(bar);

  var bar2 = createCylinder(0.03, 0.03, 1.3, 20, 20, false, 1);
  bar2.position.set(-1.9, 0.65, 1.15);
  scene.add(bar2);

  var bar3 = createCylinder(0.03, 0.03, 1.3, 20, 20, false, 1);
  bar3.position.set(1.9, 0.65, -1.15);
  scene.add(bar3);

  var bar4 = createCylinder(0.03, 0.03, 1.3, 20, 20, false, 1);
  bar4.position.set(-1.9, 0.65, -1.15);
  scene.add(bar4);

  var greenLightBar = createCylinder(0.03, 0.03, 2.3, 20, 20, false, 1);
  greenLightBar.rotateX(degreesToRadians(90));
  greenLightBar.position.set(1.9, 1.3, 0);
  scene.add(greenLightBar);

  var redLightBar = createCylinder(0.03, 0.03, 3.75, 20, 20, false, 1);
  redLightBar.rotateZ(degreesToRadians(90));
  redLightBar.position.set(0, 1.3, -1.15);
  scene.add(redLightBar);

  var blueLightBar = createCylinder(0.03, 0.03, 3.75, 20, 20, false, 1);
  blueLightBar.rotateZ(degreesToRadians(90));
  blueLightBar.position.set(0, 1.3, 1.15);
  scene.add(blueLightBar);

  // Show axes (parameter is size of each axis)
  var axesHelper = new THREE.AxesHelper(1.5);
  axesHelper.visible = false;
  scene.add(axesHelper);

  // Show text information onscreen
  showInformation();

  var infoBox = new SecondaryBox("");

  // Teapot
  var geometry = new THREE.TeapotBufferGeometry(0.5);
  var material = new THREE.MeshPhongMaterial({
    color: objColor,
    shininess: "200",
  });
  material.side = THREE.DoubleSide;
  var obj = new THREE.Mesh(geometry, material);
  obj.castShadow = true;
  obj.position.set(0.0, 0.5, 0.0);

  scene.add(obj);

  //----------------------------------------------------------------------------
  //----------------------------------------------------------------------------
  // Control available light and set the active light
  var activeLight = 0; // View first Light
  var lightIntensity = 1.0;

  //---------------------------------------------------------
  // Default light position, color, ambient color and intensity
  var redSpotLightPosition = new THREE.Vector3(0, 1.3, -1.15);
  var redSpotLightColor = "rgb(255,0,0)";

  var greenSpotLightPosition = new THREE.Vector3(1.9, 1.3, 0);
  var greenSpotLightColor = "rgb(0,255,0)";

  var blueSpotLightPosition = new THREE.Vector3(0, 1.3, 1.15);
  var blueSpotLightColor = "rgb(0,0,255)";

  var ambientColor = "rgb(50,50,50)";

  // Sphere to represent the light
  var redLightSphere = createLightSphere(
    scene,
    0.05,
    10,
    10,
    redSpotLightPosition,
    redSpotLightColor
  );
  var greenLightSphere = createLightSphere(
    scene,
    0.05,
    10,
    10,
    greenSpotLightPosition,
    greenSpotLightColor
  );
  var blueLightSphere = createLightSphere(
    scene,
    0.05,
    10,
    10,
    blueSpotLightPosition,
    blueSpotLightColor
  );

  //---------------------------------------------------------
  // Create and set all lights. Only Spot and ambient will be visible at first
  var redSpotLight = new THREE.SpotLight(redSpotLightColor);
  setSpotLight(redSpotLight, redSpotLightPosition);

  var greenSpotLight = new THREE.SpotLight(greenSpotLightColor);
  setSpotLight(greenSpotLight, greenSpotLightPosition);

  var blueSpotLight = new THREE.SpotLight(blueSpotLightColor);
  setSpotLight(blueSpotLight, blueSpotLightPosition);

  // More info here: https://threejs.org/docs/#api/en/lights/AmbientLight
  var ambientLight = new THREE.AmbientLight(ambientColor);
  scene.add(ambientLight);

  buildInterface();
  render();

  // Set Spotlight
  // More info here: https://threejs.org/docs/#api/en/lights/SpotLight
  function setSpotLight(spotLight, position) {
    spotLight.position.copy(position);
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    spotLight.shadow.camera.fov = degreesToRadians(20);
    spotLight.castShadow = true;
    spotLight.decay = 2;
    spotLight.penumbra = 0.05;
    spotLight.name = "Spot Light";

    scene.add(spotLight);
  }

  // Update light position of the current light
  function updateLightPosition(spotLight, position, sphere) {
    spotLight.position.copy(position);
    sphere.position.copy(position);
  }

  // Update light intensity of the current light
  function updateLightIntensity() {
    lightArray[activeLight].intensity = lightIntensity;
  }

  function buildInterface() {
    //------------------------------------------------------------
    // Interface
    var controls = new (function () {
      this.viewAxes = false;
      this.color = objColor;
      this.shininess = objShininess;
      this.lightIntensity = lightIntensity;
      this.lightType = "Spot";
      this.ambientLight = true;
      this.redLight = true;
      this.greenLight = true;
      this.blueLight = true;

      this.onViewAxes = function () {
        axesHelper.visible = this.viewAxes;
      };
      this.onEnableRedLight = function () {
        redSpotLight.visible = this.redLight;
      };
      this.onEnableGreenLight = function () {
        greenSpotLight.visible = this.greenLight;
      };
      this.onEnableBlueLight = function () {
        blueSpotLight.visible = this.blueLight;
      };
      this.onChangeAnimation = function () {
        rotateOn = !rotateOn;
      };
      this.onEnableAmbientLight = function () {
        ambientLight.visible = this.ambientLight;
      };
      this.updateColor = function () {
        material.color.set(this.color);
      };
      this.onUpdateShininess = function () {
        material.shininess = this.shininess;
      };
      this.onUpdateLightIntensity = function () {
        lightIntensity = this.lightIntensity;
        updateLightIntensity();
      };
      this.onChangeLight = function () {
        lightArray[activeLight].visible = false;
        switch (this.lightType) {
          case "Spot":
            activeLight = 0;
            break;
          case "Point":
            activeLight = 1;
            break;
          case "Direction":
            activeLight = 2;
            break;
        }
        lightArray[activeLight].visible = true;
        updateLightPosition();
        updateLightIntensity();
      };
    })();
    var gui = new dat.GUI();
    gui.add(controls, "onChangeAnimation", true).name("Animation On/Off");
    gui
      .add(controls, "ambientLight", true)
      .name("Ambient Light")
      .onChange(function (e) {
        controls.onEnableAmbientLight();
      });
    gui
      .add(controls, "redLight", true)
      .name("Red Light")
      .onChange(function (e) {
        controls.onEnableRedLight();
      });
    gui
      .add(controls, "greenLight", true)
      .name("Green Light")
      .onChange(function (e) {
        controls.onEnableGreenLight();
      });
    gui
      .add(controls, "blueLight", true)
      .name("Blue Light")
      .onChange(function (e) {
        controls.onEnableBlueLight();
      });
  }

  function keyboardUpdate() {
    keyboard.update();
    if (keyboard.pressed("W")) {
      if(blueSpotLightPosition.x >= -1.80)
        blueSpotLightPosition.x -= 0.05;
      updateLightPosition(blueSpotLight, blueSpotLightPosition, blueLightSphere);
    }
    if (keyboard.pressed("S")) {
      if(blueSpotLightPosition.x <= 1.80)
        blueSpotLightPosition.x += 0.05;
      updateLightPosition(blueSpotLight, blueSpotLightPosition, blueLightSphere);
    }
    if (keyboard.pressed("up")) {
      if(redSpotLightPosition.x >= -1.80)
        redSpotLightPosition.x -= 0.05;
      updateLightPosition(redSpotLight, redSpotLightPosition, redLightSphere);
    }
    if (keyboard.pressed("down")) {
      if(redSpotLightPosition.x <= 1.80)
        redSpotLightPosition.x += 0.05;
      updateLightPosition(redSpotLight, redSpotLightPosition, redLightSphere);
    }
    if (keyboard.pressed("right")) {
      if(greenSpotLightPosition.z >= -1.05)
        greenSpotLightPosition.z -= 0.05;
      updateLightPosition(greenSpotLight, greenSpotLightPosition, greenLightSphere);
    }
    if (keyboard.pressed("left")) {
      if(greenSpotLightPosition.z <= 1.05)
        greenSpotLightPosition.z += 0.05;
      updateLightPosition(greenSpotLight, greenSpotLightPosition, greenLightSphere);
    }
  }

  function createCylinder(
    radiusTop,
    radiusBottom,
    height,
    radialSegments,
    heightSegments,
    openEnded,
    color
  ) {
    var geometry = new THREE.CylinderGeometry(
      radiusTop,
      radiusBottom,
      height,
      radialSegments,
      heightSegments,
      openEnded
    );
    var material;
    if (!color)
      material = new THREE.MeshPhongMaterial({ color: "rgb(255,0,0)" });
    else material = new THREE.MeshPhongMaterial({ color: "gray" });
    var object = new THREE.Mesh(geometry, material);
    object.castShadow = true;
    return object;
  }

  function showInformation() {
    // Use this to show information onscreen
    controls = new InfoBox();
    controls.add("Lighting - Types of Lights");
    controls.addParagraph();
    controls.add("Use the up-down arrow keys to move the red light");
    controls.add("Use the right-left arrow keys to move the green light");
    controls.add("Use the W-S keys to move the blue light");
    controls.show();
  }

  function rotateTeaPot() {

    if (rotateOn) {
      obj.rotateY(degreesToRadians(angle));
    }
  }

  function render() {
    stats.update();
    trackballControls.update();
    keyboardUpdate();
    rotateTeaPot();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}

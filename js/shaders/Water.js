/**
 *
 * @param {XYPoint} size
 */
Water = function(map) {
  this.map = map;
	this.uniforms = null;
}
Water.prototype = {
  addWater : function(scene) {

    var geometry = new THREE.PlaneGeometry(this.map.size.x * 2, this.map.size.y * 2);

/*
    var path = "rsc/textures/sky_ENV/surreal_";
    var format = '.jpg';
    var urls = [path + 'px' + format, path + 'nx' + format, path + 'py' + format, path + 'ny' + format, path + 'pz' + format, path + 'nz' + format];
    var reflectionCube = THREE.ImageUtils.loadTextureCube(urls);


    var material = new THREE.MeshPhongMaterial({
      color : 0x00ead7,
      specular : 0xffffff,
      ambient : 0x00887d,
      shininess : 8,
      normalMap : THREE.ImageUtils.loadTexture("rsc/textures/water_NRM.png"),

      envMap : reflectionCube,
      //combine : THREE.MixOperation,
      reflectivity : 1
    });
    
    */
   var bmp =THREE.ImageUtils.loadTexture("cloud.png");
   var dif = THREE.ImageUtils.loadTexture("water_DIF.jpg");
   
     this.uniforms = {

    fogDensity : {
      type : "f",
      value : 0.45
    },
    fogColor : {
      type : "v3",
      value : new THREE.Vector3(0, 0, 0)
    },
    time : {
      type : "f",
      value : 1.0
    },
    resolution : {
      type : "v2",
      value : new THREE.Vector2()
    },
    uvScale : {
      type : "v2",
      value : new THREE.Vector2(3.0, 1.0)
    },
    texture_DIF : {
      type : "t",
      value : bmp
    },
    texture_NRM : {
      type : "t",
      value : dif
    },
    texture_NRM2 : {
      type : "t",
      value : dif
    }

  };

  this.uniforms.texture1.value.wrapS = this.uniforms.texture1.value.wrapT = THREE.RepeatWrapping;
  this.uniforms.texture2.value.wrapS = this.uniforms.texture2.value.wrapT = THREE.RepeatWrapping;

  var size = 0.65;

  material = new THREE.ShaderMaterial({

    uniforms : this.uniforms,
    vertexShader : document.getElementById('vertexShader').textContent,
    fragmentShader : document.getElementById('fragmentShader').textContent

  });

  mesh = new THREE.Mesh(new THREE.PlaneGeometry(100,100), material);
  mesh.rotation.x = -Math.PI/2;
  world.scene.add(mesh);
  /*
  
   
				this.uniforms = {
					//fogDensity: { type: "f", value: 0.0 },
					//fogColor: { type: "v3", value: new THREE.Vector3( 0,0,0 ) },
					time: { type: "f", value: 1.0 },
					resolution: { type: "v2", value: new THREE.Vector2() },
					uvScale: { type: "v2", value: new THREE.Vector2( 3.0, 1.0 ) },
					texture1: { type: "t", value: THREE.ImageUtils.loadTexture( "water_BMP.png" ) },
					texture2: { type: "t", value: THREE.ImageUtils.loadTexture( "water_DIF.jpg" ) },

				};

				this.uniforms.texture1.value.wrapS = this.uniforms.texture1.value.wrapT = THREE.RepeatWrapping;
			  this.uniforms.texture2.value.wrapS = this.uniforms.texture2.value.wrapT = THREE.RepeatWrapping;

				var size = 0.65;

				material = new THREE.ShaderMaterial( {
					uniforms: this.uniforms,
					vertexShader: document.getElementById( 'vertexShader' ).textContent,
					fragmentShader: document.getElementById( 'fragmentShader' ).textContent

				} );
    var plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    plane.position = new THREE.Vector3(this.map.center.x, -2, this.map.center.y);
    scene.add(plane);
    */

  },
  
  update : function(delta){
  	this.uniforms.time.value += delta;
  }
}

world.water = new Water(world.scene.map);
world.water.addWater(world.scene);



Robot = function(x, y, z) {
  this.meshes = []

  var geometry = new THREE.SphereGeometry( 15, 32, 16 );
  var bodytex = new THREE.TextureLoader().load('board.jpg');
  var material = new THREE.MeshBasicMaterial( { color: "orange", map: bodytex } );
  var sphere = new THREE.Mesh( geometry, material );
  sphere.position.set(x, y + 10, z)
  sphere.scale.set(2, 2, 2)
  this.meshes.push(sphere)
  
  /* upper body */
  var helper = HELPER.cylinderSkeletonMesh(3, 5, 'blue')
  var geometry = helper[0]
  var material = helper[1] 
  var bones = helper[2]

  //assign body texture 
  var mesh = new THREE.SkinnedMesh( geometry, material )
  var skeleton = new THREE.Skeleton( bones )
  mesh.add(bones[0])
  mesh.bind(skeleton)
  /* root bone for controlling whole rig */
  this.root = bones[0]
  this.root.position.set(x, y, z)
  this.root.scale.set(3, 3, 3)

  this.head = bones[1]

  this.neck = bones[2];
  this.neck.position.y = -10;

  this.torso = bones[3];
  this.torso.position.y = -30;

  this.meshes.push(mesh)

  /* add arm to neck, leg to torso */
  /* left arm */
  var helper = HELPER.cylinderSkeletonMesh(3, 5, 'blue')
  var geometry = helper[0]
  var material = helper[1] 
  var bones = helper[2]
  
  var mesh = new THREE.SkinnedMesh( geometry, material )
  var skeleton = new THREE.Skeleton( bones )
  mesh.add(bones[0])
  mesh.bind(skeleton)
  
  this.neck.add(bones[0])

  this.left_upperarm = bones[1];
  this.left_upperarm.position.y = -5;
  this.left_upperarm.position.x = 5;

  this.left_lowerarm = bones[2];
  this.left_lowerarm.position.y = -15;
  this.left_lowerarm.position.x = 5;

  this.left_hand = bones[3];
  this.left_hand.position.x = 5;
  this.left_hand.position.y = -5;

  this.meshes.push(mesh)

  /* left leg */
  var helper = HELPER.cylinderSkeletonMesh(3, 5, 'blue')
  var geometry = helper[0]
  var material = helper[1] 
  var bones = helper[2]
  
  var mesh = new THREE.SkinnedMesh( geometry, material )
  var skeleton = new THREE.Skeleton( bones )
  mesh.add(bones[0])
  mesh.bind(skeleton)

  this.torso.add(bones[0]);

  this.left_upperleg = bones[1];
  this.left_upperleg.position.x = 5;
  this.left_upperleg.position.y = -5;

  this.left_lowerleg = bones[2];
  this.left_lowerleg.position.x = 5;
  this.left_lowerleg.position.y = -15;

  this.left_foot = bones[3];
  this.left_foot.position.x = 5;
  this.left_foot.position.y = -5;

  this.meshes.push(mesh)

  /* right arm */
  var helper = HELPER.cylinderSkeletonMesh(3, 5, 'blue')
  var geometry = helper[0]
  var material = helper[1] 
  var bones = helper[2]

  var mesh = new THREE.SkinnedMesh( geometry, material )
  var skeleton = new THREE.Skeleton( bones )
  mesh.add(bones[0])
  mesh.bind(skeleton)

  this.neck.add(bones[0])

  this.right_upperarm = bones[1];
  this.right_upperarm.position.y = -5;
  this.right_upperarm.position.x = -5;

  this.right_lowerarm = bones[2];
  this.right_lowerarm.position.y = -15;
  this.right_lowerarm.position.x = -5;

  this.right_hand = bones[3];
  this.right_hand.position.x = -5;
  this.right_hand.position.y = -5;

  this.meshes.push(mesh)

  /* right leg */
  var helper = HELPER.cylinderSkeletonMesh(3, 5, 'blue')
  var geometry = helper[0]
  var material = helper[1] 
  var bones = helper[2]

  var mesh = new THREE.SkinnedMesh( geometry, material )
  var skeleton = new THREE.Skeleton( bones )
  mesh.add(bones[0])
  mesh.bind(skeleton)

  this.torso.add(bones[0]);

  this.right_upperleg = bones[1];
  this.right_upperleg.position.x = -5;
  this.right_upperleg.position.y = -5;

  this.right_lowerleg =bones[2];
  this.right_lowerleg.position.x = -5;
  this.right_lowerleg.position.y = -15;

  this.right_foot = bones[3];
  this.right_foot.position.x = -5;
  this.right_foot.position.y = -5;

  this.meshes.push(mesh)

  this.movement = null;

};


Robot.prototype.show = function(scene) {

  var rGroup = new THREE.Group();
  rGroup.add( this.root );

  // var helper = new THREE.SkeletonHelper( rGroup );
  // helper.material.linewidth = 3;

  scene.add(rGroup);
  // scene.add(helper);

  for(mesh in this.meshes)
    scene.add(this.meshes[mesh])
};

Robot.prototype.raise_left_arm = function() {

  this.movement = 'raise left arm';

};

Robot.prototype.lower_left_arm = function() {

  this.movement = 'lower left arm';

};

Robot.prototype.kick = function() {

  this.movement = 'kick';

};

Robot.prototype.dance = function() {
  
  this.movement = 'dance';

};

Robot.prototype.onAnimate = function() {

  if (this.movement == 'raise left arm') {

    var T = Math.PI;
    this.left_upperarm.quaternion.slerp( new THREE.Quaternion(Math.sin(-T/2),  // w
                                                              0,               // x
                                                              0,               // y
                                                              Math.cos(-T/2)), // z
                                        0.1 );

  } else  if (this.movement == 'lower left arm') {

    this.left_upperarm.quaternion.slerp( new THREE.Quaternion(0, 0, 0, 1),
                                        0.1 );

  } else if (this.movement == 'kick') {
  
    // check if slerp reached almost the end
    if (this.right_upperleg.quaternion.w < 0.72) {
  
      // signal that the kick is done and the leg should move back
      this.movement = 'kick done';
  
    } else {
  
      var T = -Math.PI/2;
      this.right_upperleg.quaternion.slerp( new THREE.Quaternion( Math.sin( T / 2 ),   // x
                                                                  0,                   // y
                                                                  0,                   // z
                                                                  Math.cos( T / 2 ) ), // w
                                            0.1 );
  
    }
  
  } else if (this.movement == 'kick done') {
  
    // reset leg back to identity
    this.right_upperleg.quaternion.slerp( new THREE.Quaternion(0,0,0,1), 0.1 );
  
  } else if (this.movement == 'dance') {

    if (typeof this.dancer === 'undefined') {

      this.dancer = setInterval(function() {

        // 
        // some random translation
        //
        var shakehead = 3*Math.random();
        if (Math.random() < .5) {
          shakehead *= -1;
        }

        var shakeneck = 3*Math.random();
        if (Math.random() < .5) {
          shakeneck *= -1;
        }

        var shaketorso = 3*Math.random();
        if (Math.random() < .5) {
          shaketorso *= -1;
        }

        this.head.position.x += shakehead;

        this.neck.position.x += shakeneck;

        this.torso.position.x += shaketorso;


        //
        // use actions
        //
        if (Math.random() < .3) {
          this.raise_left_arm();
        }

        if (Math.random() < .3) {
          this.lower_left_arm();
        }

        if (Math.random() < .3) {
          this.kick();
        }

        if (Math.random() < .3) {
          this.movement = 'kick done';
        }

      }.bind(this), 500);

    }

  }

};
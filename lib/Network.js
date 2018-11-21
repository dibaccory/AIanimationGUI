class Network
{
  constructor(type, model)
  {
    this.type = type;   //Name of architecture.
    this.model = model; //TensorFlow Model
  }

  /*GOAL: Convert the model into the Layer classes

  FOR NOW: Loop through an array and add to this network.
  */
  reconfigure(model)
  {
    //G
  }


  //Loops through the layers
  play()
  {

  }

}

//fall-back

let mnistNetwork =
    [
        new Layer("input", new THREE.Vector3(10,10,1), []/*DATA*/, 0),
        new Convolution(new THREE.Vector3(3,3,6), []/*WEIGHTS*/,  /*previous layer last node.position.z + */ LAYER_GAP, 1, 1, 1, "tanh"),
        0, // this will be created as the animation goes
        new Pool(new THREE.Vector3(2,2,6), /*previous layer last node.position.z + */ LAYER_GAP, 2, "max"),
        new Dense("Fully Connected", new THREE.Vector3(1,5,1), []/*WEIGHTS*/,  /*previous layer last node.position.z + */ LAYER_GAP, "tanh"),
        new Dense("output", new THREE.Vector3(1,3,1), []/*WEIGHTS*/,  /*previous layer last node.position.z + */ LAYER_GAP, "tanh")
    ];

class Network
{
  constructor(type, model, input)
  {
    this.type = type;   //Name of architecture.
    this.reconfigure(model, input); //TensorFlow Model
  }

  /*GOAL: Convert the model into the Layer classes

  FOR NOW: Loop through an array and add to this network.
  */
  //reconfigure(model)
  reconfigure(model, input)
  { //
      //let data = model.getWeights();
      //convert data.1dArray to 3darray
      let weightsForLayers = [];
      //w = input depth
      let volumes = [
          {w: 1, x: 5, y: 5, z: 8},
          {w: 8, x: 5, y: 5, z: 16},
          {w: 1, x: 256, y: 10, z: 1},
      ];

      // let input = new Layer("input", new THREE.Vector3(28,28,1), []/*DATA*/, 0); //  784
      console.log(model[1]);
      let conv1 = new Convolution(vec4(1,5,5,6), model[1], LAYER_GAP, 1, 0, 1, "relu");

      let res1 = conv1.forward(input);  //1, 24, 24, 8          //model[2]
      let pool1 = new Pool(vec4(6,2,2,6),
          /*previous layer last node.position.z + */ LAYER_GAP*3, 2, "max");

      let res2 = pool1.forward(res1);   //1, 12, 12, 8          //model[3]
      let conv2 = new Convolution(vec4(6,5,5,8), model[4],
          /*previous layer last node.position.z + */  LAYER_GAP*5, 1, 0, 1, "relu");

      let res3 = conv2.forward(res2);   //8 8 8 16              //model[4]
      let pool2 =  new Pool(vec4(8,2,2,8),
          /*previous layer last node.position.z + */ LAYER_GAP*7, 2, "max");

      let res4 = pool2.forward(res3); //8 4 4 16                //model[5]
      //convert res4.weights to flattened volume
      // let res4Flattened = new Layer("Flattened Layer", vec4(1,1,16*256,1), converted.weights ,
      //     /*previous layer last node.position.z + */ LAYER_GAP*9);

      //flattened 1 1 1 2048
      let res5 = flatten(res4);
      let dense1 = new Dense(vec4(128,1,50,1), model[7],
          /*previous layer last node.position.z + */ LAYER_GAP*10, "softmax");
      let res6 = dense1.forward(res5);                          //model[7]

      let dense2 = new Dense(vec4(1,1,10,1), model[9],
          /*previous layer last node.position.z + */ LAYER_GAP*10, "softmax");
      let out = dense2.forward(res6);                           //model[9]


      this.layers = [input, conv1, res1, pool1, res2, conv2, res3, pool2, dense1, dense2, out];
          

  }


  //Loops through the layers
  play()
  {

  }

}
// if(mnistNetwork.layers[i].type == "hidden")
//     let outputted_layer =mnistNetwork.layers[i].forward(mnistNetwork.layers[i-1])
//


//fall-back

/*scene.add(mnistNetwork[0].nodes[k][j][i])


PATH:



Tensor flow conv weights:
[row][column][input_depth][this.depth]

*/


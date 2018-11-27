const NODE_GAP = 1.2;

class Node
{
    constructor(weight)
    {
      this.weight = weight; //set weight for node
      this.init();
    }

    init()
    {
        let geometry = new THREE.BoxGeometry(1,1,1);
        let material = new THREE.MeshBasicMaterial();
        this.obj = new THREE.Mesh( geometry, material );
        this.paths = {from: [], to: this.obj.position};
    }

    //pos = [ Vector3 ]
    addPaths(pos)
    {
        this.paths.from.push(pos);
    }

}


const LAYER_GAP = 10;

class Layer
{
  constructor(name, volume, weights, offset)
  {
    this.name = name;
    this.volume = volume;  //{x,y,z}
    this.weights = weights;
    this.nodes = [];
    this.offset = offset; //Float to add to the Z value (XY plane is AREA, Z is depth, so pipeline lines on Z axis)
    //this.generate();
  }

  //creates a single node (paths optional)
  addNode(weight, h, i, j, k, paths)
  {
    let node = new Node(weight);
    let color = this.inputToRGB(node.weight);
    let weightVolumeOffset = NODE_GAP * this.volume.x + LAYER_GAP/2;
    node.obj.material.color = color;
    node.obj.position
      .set( NODE_GAP*i + h*weightVolumeOffset,
            NODE_GAP*j,
            NODE_GAP*k + this.offset);

    //if paths is not null
    if(paths)
    {
      node.addPaths(paths);
    }

    return node;
  }

  //Creates a box for each node in this layer.
  //Takes in an Array data, Vector3 offset
  /*
    data = weights
  */
  generate()
  {// reminder: used x,y,z to keep it easier to translate to node[k][j][i].position (since i,j,k are vector things).
    // w is used for the h'th kernel volume
    //generally, only convolutional layers need the w, but I keep it because lol don't have time :):) kill me please
    for(let h=0; h < this.volume.w; h++)
    {
      this.nodes[h] = [];
      for (let k = 0; k < this.volume.z; k++)
      {
        this.nodes[h][k] = [];
        for (let j = 0; j < this.volume.y; j++)
        {
          this.nodes[h][k][j] = [];
          for(let i = 0; i < this.volume.x; i++)
          {
            this.nodes[h][k][j].push(this.addNode(this.weights[h][k][j][i], h, i, j, k));
          }
        }
      }
    }

  }

  //Not sure if needed, but just in case
  getMidpoint(){}

  //If layer dragged to another position in the pipeline, translate the nodes
  translate(offset)
  {
    this.offset = Math.abs(this.offset - offset);

    //translates each node by setting new position
    // v3loop(volume, (i,j,k) =>
    // {
    //   this.nodes[k][j][i].obj.position.setZ(NODE_GAP * k + this.offset);
    // });
  }

  inputToRGB(data)
  {
    let R,G,B;
    switch (true)
    {

        case (this instanceof Convolution):
        R = G = B = data; //images are black and white in MNIST, so all of these are equal (for now)
        break;

      case (this.name=="output"):
        /*ALL WHITE or Different color for each node*/
        break;

      default:
          if(data <= .5)
          {
            R = 0;
            B = 1 - 2*data;
            G = 2*data;
          }
          else
          {
            B = 0;
            R = 2*data - 1;
            G = 2 - 2*data;
          }
        break;
    }

    return new THREE.Color(R, G, B);
  }

}

  /*
  FOR PATHS:
    Finds out which nodes recieve which path ends
    returns Array(Vector3) of positions of nodes recieving a line path in the animation


    IDEA: for Convolution, instead of lines, have a spotlight that filter different colors for each kernel
  */


class Convolution extends Layer
{
  //volume in this case is (N, N, numFilters). We need to get this volume from TensorFlow model
  constructor(volume, weights, offset, stride, padding, dilate, reLU)
  {
    super( "hidden", volume, weights, offset);
    this.size = volume.x;
    this.padding = padding;
    this.stride = stride;
    this.dilate = (dilate) ? dilate : 1;
    this.reLU = reLU;     //function
    this.generate();
  }

  //returns volume of output
  forward(input)
  {
    //output dimensions
    let vout =
    {
      w: this.volume.w,
      x: (input.volume.x - this.size + 2*this.padding) / this.stride + 1,
      y: (input.volume.y - this.size + 2*this.padding) / this.stride + 1,
      z: this.volume.z
    };

    let outputLayer;

    //ASSUME channel = 1. DEAL WITH THIS LATER lol ok
      let outputWeights = [];
    for(let h=0; h< vout.w; h++)
    {
      let a = [];
      for(let k=0; k<vout.z; k++)
      {
        //Organizing nodes per filter
        //let filter_nodes = this.nodes[k].flat();
        let b = [];
        for(let j=0; j<vout.y; j++)
        {
          let c = [];
          for(let i=0; i<vout.x; i++)
          {
            let gemmAggregator = [];
            //Organizing by each iteration of the gemm
            //input nodes used in gemm instance
            //Filter node at fj'th column, fi'th row
            for(let fj=0; fj<this.size; fj++)
            for(let fi=0; fi<this.size; fi++)
            {
              let gemmInstanceNodes = [];
              let addedNode;
              //Dilation factor  ASSUME DILATION = 1.  DEAL WITH THIS LATER
              for(let dj=0; dj<1/*this.dilate*/; dj++)
              for(let di=0; di<1/*this.dilate*/; di++)
              {
                //if the filter is recieving input data..
                let jBnd =j*this.stride - this.padding + (fj+dj);
                let iBnd =i*this.stride - this.padding + (fi+di);
                if(inBounds( ( jBnd ), 0, j )
                && inBounds( ( iBnd ), 0, i ) )
                {
                  addedNode = input.nodes[h][h][jBnd][iBnd];
                }
                //if the filter is recieving padding, push zeroed node to array a
                else
                {
                  addedNode = new Node(0); //weight 0 cause it's padding
                  addedNode.obj.material.color = new THREE.Color(0, 0, 0);

                }

                gemmAggregator.push(addedNode.weight * this.nodes[h][k][fj][fi].weight);

                //store input nodes used in this instance of gemm
                gemmInstanceNodes.push(addedNode);
              }

              //create paths for gemm into  super.nodes[k][fj][fi]
              this.nodes[h][k][fj][fi].addPaths(gemmInstanceNodes);
            } //end of this instance of gemm on kth slice
            //Now every node.paths may uniformly iterate through each GEMM instance result is new color. When you add this node, make a path from the (fi, fj, k) node in the kernel to the (i,j,k) node in the feature map
            let result = gemmAggregator.reduce((sum, w) => {return sum + w});
            c.push(result);
          }
          b.push(c);

        } // end of all every instance of gemm on kth slice
        a.push(b);
      }
        //i hate javascript so much but bim bam boom here's the vec4
        outputWeights.push(a);
        //TODO: Need to incorporate the activation function (commonly reLU or leakyReLU) in this calculation if it is declared
    }
    //create the output layer
    outputLayer = new Layer("feature map layer", vout, outputWeights, this.offset + LAYER_GAP);
    //returns resulting layer so Network can use this as the input for the next hidden layer
    return outputLayer;
  }

/*
  //General Matrix to Matrix Multiplication = GEMM
//a = input node ; b = filter node
  gemm(a, b)
  {

    // return new THREE.Color(
    //   a.R * b.R,
    //   a.G * b.G,
    //   a.B * b.B);
  }


  summate(a)
  {
    let red   = a.reduce((sum, x) => {sum + x.R;});
    let green = a.reduce((sum, x) => {sum + x.G;});
    let blue  = a.reduce((sum, x) => {sum + x.B;});
    return new THREE.Color(red, green, blue);
  }
  */


  //returns a single node of the output volume
}


class Pool extends Layer
{
  //volume is {x: P, y: P, z: input.volume.z} where P is partition size
  constructor(volume, offset, stride, f)
  {
    super("hidden", volume, [], offset);
    this.size = volume.x;
    this.stride = stride;
    this.activation = f; //set max-pooling as default
  }

  //uses pooling method f on array a
  pool(a)
  {
    let result;
    switch (this.activation)
    {
      //dear god let's hope this works LOL
        default: //max-pool
            result = Math.max(...a);
            break;
    }
    return result;
  }

  //returns volume of output
  /*
  forward pass:

  */
  forward(input)
  {
    //Represent the volume as an object
    let vout =
    {
      x: (input.volume.x - this.size) / this.stride + 1,
      y: (input.volume.y - this.size) / this.stride + 1,
      z: this.volume.z,
    };
    let outputLayer = new Layer("downsampled layer", vout, this.offset + LAYER_GAP);

    //Represent stride bounds as object
    let vstride =
    {
      x: (input.volume.x - this.size) / this.stride + 1,
      y: (input.volume.y - this.size) / this.stride + 1,
      z: this.volume.z,
    };

    v3loop(vstride, (i,j,k) =>
    {
      let a = [];
      //Filter node at fj'th column, fi'th row
      for(let fj=0; fj<this.size; fj++)
      for(let fi=0; fi<this.size; fi++)
      {
        a.push(input.nodes[k][j*this.stride + fj][i*this.stride + fi].weight);
      }
      //Do the pooling computation and add result to new node in resulting layer
      let result = this.pool(a);
      outputLayer.addNode(result, i, j, k);
      //path(input.nodes[k][j*stride + fj][i*stride + fi].position, super.nodes[k][j][i].position)
    });

    /*
    I think it'll be easier (for now) to just make a path from all the corners of the input volume to the
    corners of the output volume
    */
    outputLayer.nodes[0][0][0]            .addPaths([input.nodes[0][0][0]            .obj.position]);
    outputLayer.nodes[0][0].last()        .addPaths([input.nodes[0][0].last()        .obj.position]);
    outputLayer.nodes[0].last()[0]        .addPaths([input.nodes[0].last()[0]        .obj.position]);
    outputLayer.nodes[0].last().last()    .addPaths([input.nodes[0].last().last()    .obj.position]);
    outputLayer.nodes.last()[0][0]        .addPaths([input.nodes.last()[0][0]        .obj.position]);
    outputLayer.nodes.last()[0].last()    .addPaths([input.nodes.last()[0].last()    .obj.position]);
    outputLayer.nodes.last().last()[0]    .addPaths([input.nodes.last().last()[0]    .obj.position]);
    outputLayer.nodes.last().last().last().addPaths([input.nodes.last().last().last().obj.position]);

    //returns resulting layer so Network can use this as the input for the next hidden layer
    return outputLayer;
  }
}

class Dense extends Layer
{
  //dense layer volume should be {x: 1, y: N, z: 1} where N is # nodes
  //weights = array of size N... [].concat(...kernel.nodes) where kernel = tf.dense.kernel or wherever you get it.
  constructor(name, volume, weights, offset, f)
  {
    super("hidden", volume, weights, offset);
    //this.weights = weights;
    this.activation = f;
  }


  activationFunction(a)
  {
    let result;
    switch(this.activation)
    {
        case "tanh":
          result = Math.tanh();
          break;
    }
    return result;
  }

  //returns array of propogated values
  forward(input)
  {
    let propogatedValues = [];
    for(let n=0; n<super.volume.y; n++)
    {
      let a = [];
      v3loop(input.volume, (i, j, k) =>
      {
        a.push(input.nodes[k][j][i].weight * super.nodes[0][n][0].weight);
      });
      //summation of weights
      a.reduce( (sum, x) => {sum + x;} );
      propogatedValues.push(a);//push(this.activationFunction(a));

    }
    return propogatedValues;
  }
}

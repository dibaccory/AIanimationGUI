const NODE_GAP = 1.2;

class Node
{
    constructor(weight)
    {
      this.weight = weight; //set weight for node
      init();
    }

    init()
    {
        let geometry = new THREE.BoxGeometry(1,1,1);
        let material = new THREE.MeshBasicMaterial();
        this.obj = new THREE.Mesh( geometry, material );
        this.paths = {from: [[]], to: this.obj.position};
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
    this.volume = volume  //{x,y,z}
    this.weights = weights;
    this.nodes = [[[]]];
    this.offset = offset; //Float to add to the Z value (XY plane is AREA, Z is depth, so pipeline lines on Z axis)
  }

  //creates a single node (paths optional)
  addNode(weight, i, j, k, paths)
  {
    let node = new Node(weight);
    let color = this.inputToRGB(node.weight);
    node.obj.material.color = color;
    node.obj.position
      .set( NODE_GAP*i,
            NODE_GAP*(this.volume.y - j),
            NODE_GAP*k + this.offset);

    //if paths is not null
    if(paths)
    {
      node.addPaths(paths);
    }
    this.nodes[k][j][i].push(node);

  }

  //Creates a box for each node in this layer.
  //Takes in an Array data, Vector3 offset
  /*
    data = weights
  */
  generate()
  {
    let feed;
    v3loop(this.volume, (i,j,k) =>
    {
      //color =  // Get color values from input type
      this.addNode(this.weights[k][j][i], i, j, k);
      feed++;
    });
  }

  //Not sure if needed, but just in case
  getMidpoint(){}

  //If layer dragged to another position in the pipeline, translate the nodes
  translate(offset)
  {
    this.offset = Math.abs(this.offset - offset);

    //translates each node by setting new position
    v3loop(volume, (i,j,k) =>
    {
      this.nodes[k][j][i].obj.position.setZ(NODE_GAP * k + this.offset);
    });
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
    super( "(hidden) Convolutional Layer", volume, weights, offset);
    this.size = volume.x;
    this.padding = padding;
    this.dilate = (dilate) ? dilate : 1;
    this.reLU = reLU;     //function
  }

  //returns volume of output
  forward(input)
  {
    //output dimensions
    let vout =
    {
      x: (input.volume.x - this.size + 2*this.padding) / this.size + 1,
      y: (input.volume.y - this.size + 2*this.padding) / this.size + 1,
      z: super.volume.z
    };

    let outputLayer = new Layer("feature map layer", vout, super.offset + LAYER_GAP);

    //Represent stride bounds as object
    let vstride =
    {
      x: (input.volume.x - this.size) / this.size + 1,
      y: (input.volume.y - this.size) / this.size + 1,
      z: super.volume.z,
    };
    //ASSUME channel = 1. DEAL WITH THIS LATER
    for(let channel=0; channel<1/*input.volume.z*/; channel++)

    {
      for(let k=0; k<vstride.z; k++)
      {
        //Organizing nodes per filter
        let filter_nodes = super.nodes[k].flat();
        //let a = [[[]]], b = [[[]]];
        for(let j=0; j<vstride.y; j++)
        for(let i=0; i<vstride.x; i++)
        {
          let gemmAggregator = [];
          //Organizing by each iteration of the gemm
          //input nodes used in gemm instance
          let a = [];
          //Filter node at fj'th column, fi'th row
          for(let fj=0; fj<this.size; fj++)
          for(let fi=0; fi<this.size; fi++)
          {
            let addedNode;
            //Dilation factor  ASSUME DILATION = 1.  DEAL WITH THIS LATER
            for(let dj=0; dj<1/*this.dilate*/; dj++)
            for(let di=0; di<1/*this.dilate*/; di++)
            {
              //if the filter is recieving input data...
              if(inBounds( ( j*this.stride - this.padding + (fj+dj) ), 0, j )
              && inBounds( ( i*this.stride - this.padding + (fi+di) ), 0, i ) )
              {
                addedNode = input.nodes[k][j*this.stride - this.padding + (fj+dj)][i*this.stride - this.padding + (fi+di)];
              }
              //if the filter is recieving padding, push zeroed node to array a
              else
              {
                addedNode = new Node(0); //weight 0 cause it's padding
                addedNode.obj.material.color = new THREE.Color(0, 0, 0);

              }

              gemmAggregator.push(addedNode.weight * super.nodes[k][fj][fi].weight);

              //store input nodes used in this instance of gemm
              a.push(addedNode);
            }
          } //end of this instance of gemm on kth slice

          //create paths for gemm into  super.nodes[k][fj][fi]
          super.nodes[k][fj][fi].addPaths(a.map( (x) => x.obj.position));

          //Now every node.paths may uniformly iterate through each GEMM instance result is new color. When you add this node, make a path from the (fi, fj, k) node in the kernel to the (i,j,k) node in the feature map
          let result = gemmAggregator.reduce((sum, w) => {return sum + w});

          //adds a node that has a path for each node in the k'th filter
          outputLayer.addNode(result, i, j, k, filter_nodes);
        } // end of all every instance of gemm on kth slice
        //TODO: Need to incorporate the activation function (commonly reLU or leakyReLU) in this calculation if it is declared
      }
    }
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
  constructor(volume, weights, offset, stride, f)
  {
    super("(hidden) Pooling layer", volume, weights, offset);
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
            //Find max of the magnitudes of colors in array a
            result = Math.max(...a.map((color) =>
                color.reduce((sum, d) =>
                {
                  return sum + d*d;
                })
            ));
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
      x: (input.volume.x - this.size) / this.size + 1,
      y: (input.volume.y - this.size) / this.size + 1,
      z: super.volume.z,
    };
    let outputLayer = new Layer("downsampled layer", vout, super.offset + LAYER_GAP);

    //Represent stride bounds as object
    let vstride =
    {
      x: (input.volume.x - this.size) / this.size + 1,
      y: (input.volume.y - this.size) / this.size + 1,
      z: super.volume.z,
    };

    v3loop(vstride, (i,j,k) =>
    {
      let a = [];
      //Filter node at fj'th column, fi'th row
      for(let fj=0; fj<this.size; fj++)
      for(let fi=0; fi<this.size; fi++)
      {
        a.push(input.nodes[k][j*this.stride + fj][i*this.stride + fi]);
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
        //pushes color*weight[current_dense_node] for every node in the input volume
        a.push( input.nodes[k][j][i].obj.material.color.clone().addScalar(weights[n]) );
      });
      //summation of colors
      a.reduce( (sum, x) => {sum.add(x);} );
      propogatedValues.push(this.activationFunction(a));

    }
    return propogatedValues;
  }
}

const NODE_GAP = 1.2;
const LAYER_GAP = 10;

class Layer
{
  constructor(name, volume, offset)
  {
    this.name = name;
    this.volume = volume  //{x,y,z}
    this.nodes = [[[]]];
    this.offset = offset; //Float to add to the Z value (XY plane is AREA, Z is depth, so pipeline lines on Z axis)
  }

  //creates a single node
  addNode(color, i, j, k)
  {
    let node = creatNode();
    node.material.color = color;
    node.position
      .set( NODE_GAP_SIZE*i,
            NODE_GAP_SIZE*(this.volume.y - j),
            NODE_GAP_SIZE*k + this.offset);
    this.nodes[k][j][i].push(node);
  }

  //Creates a box for each node in this layer.
  //Takes in an Array data, Vector3 offset
  /*
  data will be either input data, or Layer.nodes flattened (i.e: data = [].concat(...Layer.nodes) )
  */
  generate(data)
  {
    let color, node, feed;
    v3loop(volume, (i,j,k) =>
    {
      colors = this.inputToRGB(data, feed); // Get color values from input type
      addNode(color, i, j, k);
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
      this.nodes[k][j][i].position.setZ(NODE_GAP * k + this.offset);
    });
  }

  inputToRGB(data,feed)
  {
    let R,G,B;
    switch (true)
    {
      case (this.name=="input"):
        //img1 is the img
        if(data[feed] <= .5)
        {
          R = 0;
          B = 1 - 2*data[feed];
          G = 2*data[feed];
        }
        else
        {
          B = 0;
          R = 2*data[feed] - 1;
          G = 2 - 2*data[feed];
        }
        break;

      case (this instanceof Convolution):
        /*TODO:Get weights of filter*/
        break;

      case this.name == "output":
        /*ALL WHITE or Different color for each node*/
        break;

      default:
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
  constructor(filter, offset, stride, padding, dilate, reLU)
  {
    super( "(hidden) Convolutional Layer", filter, offset);
    this.size = filter.x;
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
      x: (input.volume.x − this.size + 2*this.padding) / this.size + 1,
      y: (input.volume.y − this.size + 2*this.padding) / this.size + 1,
      z: super.volume.z;
    };

    let outputLayer = new Layer("convolved layer", vout, super.offset + LAYER_GAP);

    //Represent stride bounds as object
    let vstride =
    {
      x: (input.volume.x - this.size) / this.size + 1,
      y: (input.volume.y - this.size) / this.size + 1,
      z: super.volume.z,
    };

    for(let channel=0; channel<input.volume.z; channel++)
      v3loop(vstride, (i, j, k) =>
      {
        let a = [], b =[];
        let addedNode;
        //Filter node at fj'th column, fi'th row
        for(let fj=0; fj<this.size; fj++)
        for(let fi=0; fi<this.size; fi++)
        {
        //Dilation factor
          for(let dj=0; dj<this.dilate; dj++)
          for(let di=0; di<this.dilate; di++)
          {
            //if the filter is recieving input data...
            if(inBounds( ( j*this.stride - this.padding + (fj+dj) ), 0, j )
            && inBounds( ( i*this.stride - this.padding + (fi+di) ), 0, i ) )
            {
              a.push(input.nodes[channel][j*this.stride - this.padding + (fj+dj)][i*this.stride - this.padding + (fi+di)]);
              b.push(super.nodes[k][fj][fi]);

            }
            //if the filter is recieving padding, push zeroed node to array a
            else
            {
              addedNode = createNode();
              addedNode.material.color = new THREE.Color(0, 0, 0);
              a.push(addedNode);
              b.push(super.nodes[k][fj][fi]);
            }

            //path(a.last().position, b.last().position);
          }
        }
        //TODO: Need to incorporate the activation function (commonly reLU or leakyReLU) in this calculation if it is declared
        a = a.map(x => x.material.color);
        b = b.map(x => x.material.color);
        let result = this.gemm(a, b);
        outputLayer.addNode(result, i, j, k);
      });
      //returns resulting layer so Network can use this as the input for the next hidden layer
      return outputLayer;
  }

  //This is in 3-channel to out 3-channel.
  /*
  What if I want to do 3-channel to out 2-channel?
  Separate Illuminesce and Chromium (look this up lol)
  */
  //group element matrix multiplication
  gemm(a, b)
  {
    let c = a.map( x =>
    {
      let y = b.shift();
      return new THREE.Color(x.R * y.R, x.G * y.G, x.B * y.B); //got a bad feeling about this one, cap'n
    });
    let red   = c.reduce((sum, x) => {sum + x.R;});
    let green = c.reduce((sum, x) => {sum + x.G;});
    let blue  = c.reduce((sum, x) => {sum + x.B;});
    return new THREE.Color(red, green, blue);
  }

  //returns a single node of the output volume
}


class Pool extends Layer
{
  //volume is {x: P, y: P, z: input.volume.z} where P is partition size
  constructor(volume, offset, stride, f)
  {
    super("(hidden) Pooling layer", volume, offset);
    this.size = volume.x;
    this.stride = stride;
    this.pool = f; //set max-pooling as default
  }

  //uses pooling method f on array a

  //returns volume of output
  /*
  forward pass:

  */
  forward(input)
  {
    //Represent the volume as an object
    let vout =
    {
      x: (input.volume.x − this.size) / this.size + 1,
      y: (input.volume.y − this.size) / this.size + 1,
      z: super.volume.z;
    };
    let outputLayer = new Layer("pooled layer", vout, super.offset + LAYER_GAP);

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
    super("hidden", volume, offset);
    this.weights = weights;
    this.activation = f;
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
        a.push(input.nodes[k][j][i].material.color.clone().addScalar(weights[n]));
      });
      //summation of colors
      a.reduce( (sum, x) => {sum.add(x);} );
      propogatedValues.push(this.activation(a));

    }
    return propogatedValues;
  }
}

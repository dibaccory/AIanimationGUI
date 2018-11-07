const NODE_GAP_SIZE = 1.2;

class Layer
{

  constructor(type, volume)
  {
    this.type = type;
    this.width = volume.x;   //x
    this.height = volume.y; //y
    this.depth = volume.z;   //z
    this.nodes = [];
    create();
  }

  //Creates a box for each node in this layer.
  create()
  {
    let color, material, node, feed;
    let geometry = new THREE.BoxGeometry(1,1,1);
    for(let i=0; i<this.width; i++)
    {
      for(let j=0; j<this.height; j++)
      {
        for(let k=0; k<this.depth; k++, feed++)
        {
          /*
            inputToRGB(type, feed) for Color info
          */
          color = inputToRGB(type, feed); // Get color values from input type
          material = new THREE.MeshBasicMaterial( { color: colors } );
          node = new THREE.Mesh( geometry, material );
          node.position.set(NODE_GAP_SIZE*i, NODE_GAP_SIZE*j, NODE_GAP_SIZE*k); //setting local position. Will change on layer's position
          this.nodes.push(node);
        }
      }
    }
  }

  //If layer dragged to another position in the pipeline, translate the nodes
  translate(){}

  inputToRGB(type, feed)
  {
    let R,G,B;
    switch (type)
    {
      case "input":
        if(img1[k] <= .5)
        {
          R = 0;
          B = 1 - 2*img1[k];
          G = 2*img1[k];
        }
        else
        {
          B = 0;
          R = 2*img1[k] - 1;
          G = 2 - 2*img1[k];
        }
        break;

      case "conv":
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
  constructor(volume, stride, padding, dilate)
  {
    super("hidden", volume);
    this.size = size;
    this.padding = padding;
    this.dilate = dilate;
  }

  //returns volume of output
  forward()
  {

  }
}


class Pool extends Layer
{
  constructor(volume, type)
  {
    super("hidden", volume);
    this.type = (type) ? type : "max"; //set max-pooling as default
  }

  //returns volume of output
  forward()
  {

  }
}

class Dense extends Layer
{
  constructor(type, volume)
  {
    super("hidden", volume)
  }

  //returns volume of output
  forward()
  {

  }
}

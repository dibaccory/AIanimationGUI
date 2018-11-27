const IMAGE_H = 28;
const IMAGE_W = 28;
const IMAGE_SIZE = IMAGE_H * IMAGE_W;
const NUM_CLASSES = 10;
const NUM_DATASET_ELEMENTS = 65000;

const NUM_TRAIN_ELEMENTS = 55000;
const NUM_TEST_ELEMENTS = NUM_DATASET_ELEMENTS - NUM_TRAIN_ELEMENTS;

const MNIST_IMAGES_SPRITE_PATH = 'https://storage.googleapis.com/learnjs-data/model-builder/mnist_images.png';
const MNIST_LABELS_PATH = 'https://storage.googleapis.com/learnjs-data/model-builder/mnist_labels_uint8';

const img = new Image();
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

Array.prototype.last = () => this[this.length - 1];

const vec4 = (w,x,y,z) => {return {w: w, x: x, y: y, z: z}};

let boxGeometry = new THREE.BoxGeometry(1,1,1);

//I kept using 3D loops so I made a function to clean up the code
function v3loop(v, f)
{
  for(let k=0; k<v.z; k++)
    for(let j=0; j<v.y; j++)
      for(let i=0; i<v.x; i++)
        f(i,j,k);
}

//Check if x is within [a,b]
const inBounds = (x, a, b) => { return (x >= a && x <= b)};


const sigmoid = t => 1/(1+Math.pow(Math.E, -t));

function dataToVolume(v, data)
{
  let weights=[], a, b, c, feed = 0;
  for(let h = 0; h < v.w; h++)
  {
    a = [];
    for (let i = 0; i < v.z; i++)
    {
      b = [];
      for (let j = 0; j < v.y; j++)
      {
        c = [];
        for (let k = 0; k < v.x; k++)
        {
          c.push(data[feed]);
          feed++;
        }
        b.push(c);
      }
    a.push(b);
    }
    weights.push(a);
  }
  return weights;
}

// Draws a line that connects the point p1 to point p2
function draw(p1, p2) {
    var mat = new THREE.LineBasicMaterial({color:0x888888});
    var geo = new THREE.Geometry();
    geo.vertices.push( new THREE.Vertex(p1) );
    geo.vertices.push( new THREE.Vertex(p2) );
    var line = new THREE.Line(geo);
    scene.add(line);
    return line
}

var mnistModel = [];
var mnistNetwork;

function generateNetwork( net )
{
  console.log(mnistNetwork);
    for (let layer = 0; layer < net.layers.length; layer++ ) {
      if( !(net.layers[layer] instanceof Pool))
      {
        let v = net.layers[layer].volume;
        for(let h = 0; h < v.w; h++)
        {
            for (let k = 0; k < v.z; k++)
            {
                for (let j = 0; j < v.y; j++)
                {
                    for (let i = 0; i < v.x; i++)
                    {
                        scene.add( net.layers[layer].nodes[h][k][j][i].obj );
                    }
                }
            }
        }
      }
    }
}

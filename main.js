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



//I kept using 3D loops so I made a function to clean up the code
function v3loop(v, f)
{
  for(let k=0; k<v.z; k++)
    for(let j=0; j<v.y; j++)
      for(let i=0; i<v.x; i++)
        f(i,j,k);
}

//Check if x is within [a,b]
var inBounds = (x, a, b) => { return (x >= a && x <= b)};

function createNode()
{
  let geometry = new THREE.BoxGeometry(1,1,1);
  let material = new THREE.MeshBasicMaterial();
  return new THREE.Mesh( geometry, material );
}

function createPath()
{
  
}

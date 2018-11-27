

export class MnistData
{
    constructor()
    {
        this.shuffledTrainIndex = 0;
        this.shuffledTestIndex = 0;
    }

    async load()
    {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const imgRequest = new Promise((resolve, reject) => {
            img.crossOrigin = '';
            img.onload = () => {
                img.width = img.naturalWidth;
                img.height = img.naturalHeight;

                const datasetBytesBuffer =
                    new ArrayBuffer(NUM_DATASET_ELEMENTS * IMAGE_SIZE * 4);

                const chunkSize = 5000;
                canvas.width = img.width;
                canvas.height = chunkSize;

                for (let i = 0; i < NUM_DATASET_ELEMENTS / chunkSize; i++)
                {
                    const datasetBytesView = new Float32Array(
                        datasetBytesBuffer, i * IMAGE_SIZE * chunkSize * 4,
                        IMAGE_SIZE * chunkSize);
                    ctx.drawImage(
                        img, 0, i * chunkSize, img.width, chunkSize, 0, 0, img.width,
                        chunkSize);

                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                    for (let j = 0; j < imageData.data.length / 4; j++) {
                        // All channels hold an equal value since the image is grayscale, so
                        // just read the red channel.
                        datasetBytesView[j] = imageData.data[j * 4] / 255;
                    }
                }
                this.datasetImages = new Float32Array(datasetBytesBuffer);

                resolve();
            };
            img.src = MNIST_IMAGES_SPRITE_PATH;
        });

        const labelsRequest = fetch(MNIST_LABELS_PATH);
        const [imgResponse, labelsResponse] =
            await Promise.all([imgRequest, labelsRequest]);

        this.datasetLabels = new Uint8Array(await labelsResponse.arrayBuffer());

        // Create shuffled indices into the train/test set for when we select a
        // random dataset element for training / validation.
        this.trainIndices = tf.util.createShuffledIndices(NUM_TRAIN_ELEMENTS);
        this.testIndices = tf.util.createShuffledIndices(NUM_TEST_ELEMENTS);

        // Slice the the images and labels into train and test sets.
        this.trainImages =
            this.datasetImages.slice(0, IMAGE_SIZE * NUM_TRAIN_ELEMENTS);
        this.testImages = this.datasetImages.slice(IMAGE_SIZE * NUM_TRAIN_ELEMENTS);
        this.trainLabels =
            this.datasetLabels.slice(0, NUM_CLASSES * NUM_TRAIN_ELEMENTS);
        this.testLabels =
            this.datasetLabels.slice(NUM_CLASSES * NUM_TRAIN_ELEMENTS);
    }

    nextTrainBatch(batchSize)
    {
        return this.nextBatch(
            batchSize, [this.trainImages, this.trainLabels], () => {
                this.shuffledTrainIndex =
                    (this.shuffledTrainIndex + 1) % this.trainIndices.length;
                return this.trainIndices[this.shuffledTrainIndex];
            });
    }

    nextTestBatch(batchSize)
    {
        return this.nextBatch(batchSize, [this.testImages, this.testLabels], () => {
            this.shuffledTestIndex =
                (this.shuffledTestIndex + 1) % this.testIndices.length;
            return this.testIndices[this.shuffledTestIndex];
        });
    }

    nextBatch(batchSize, data, index)
    {
        const batchImagesArray = new Float32Array(batchSize * IMAGE_SIZE);
        const batchLabelsArray = new Uint8Array(batchSize * NUM_CLASSES);

        for (let i = 0; i < batchSize; i++)
        {
            const idx = index();

            const image =
                data[0].slice(idx * IMAGE_SIZE, idx * IMAGE_SIZE + IMAGE_SIZE);
            batchImagesArray.set(image, i * IMAGE_SIZE);

            const label =
                data[1].slice(idx * NUM_CLASSES, idx * NUM_CLASSES + NUM_CLASSES);
            batchLabelsArray.set(label, i * NUM_CLASSES);
        }

        const xs = tf.tensor2d(batchImagesArray, [batchSize, IMAGE_SIZE]);
        const labels = tf.tensor2d(batchLabelsArray, [batchSize, NUM_CLASSES]);

        return {xs, labels};
    }
}

var model;

function createModel()
{
    console.log('Create model ...');
    model = tf.sequential();
    console.log('Model created');

    console.log('Add layers ...');
    model.add(tf.layers.conv2d({
        inputShape: [28, 28, 1],
        kernelSize: 5,
        filters: 8,
        strides: 1,
        activation: 'relu',
        kernelInitializer: 'VarianceScaling'
    }));

    model.add(tf.layers.maxPooling2d({
        poolSize: [2,2],
        strides: [2,2]
    }));

    model.add(tf.layers.conv2d({
        kernelSize: 5,
        filters: 16,
        strides: 1,
        activation: 'relu',
        kernelInitializer: 'VarianceScaling'
    }));

    model.add(tf.layers.maxPooling2d({
        poolSize: [2,2],
        strides: [2,2]
    }));

    model.add(tf.layers.flatten());

    model.add(tf.layers.dense({
        units: 10,
        kernelInitializer: 'VarianceScaling',
        activation: 'softmax'
    }));

    console.log('Layers created');
    mnistModel = model;
    console.log('Start compiling ...');
    model.compile({
        optimizer: tf.train.sgd(0.15),
        loss: 'categoricalCrossentropy'
    });
    console.log('Compiled');
}

let data;
async function load()
{
    console.log('Loading MNIST data ...');
    data = new MnistData();
    await data.load();
    console.log('Data loaded successfully');
}

const BATCH_SIZE = 64;
const TRAIN_BATCHES = 150;

async function train(m)
{
    console.log('Start training ...');
    for (let i = 0; i < TRAIN_BATCHES; i++)
    {
        const batch = tf.tidy(() => {
            const batch = data.nextTrainBatch(BATCH_SIZE);
            batch.xs = batch.xs.reshape([BATCH_SIZE, 28, 28, 1]);
            return batch;
        });

        await model.fit(
            batch.xs, batch.labels, {batchSize: BATCH_SIZE, epochs: 1}
        );

        tf.dispose(batch);

        await tf.nextFrame();

        if(i % 10 == 0)
        {
            console.log('Training...');
        }

    }
    console.log('Training complete');
    console.log(await model.getLayer('', 0).getWeights()[0].as1D().data());
    console.log(await model.getLayer('', 2).getWeights()[0].as1D().data());
    console.log(await model.getLayer('', 5).getWeights()[0].as1D().data());
    m.push(await model.getLayer('', 0).getWeights()[0].as1D().data());
    m.push(await model.getLayer('', 2).getWeights()[0].as1D().data());
    m.push(await model.getLayer('', 5).getWeights()[0].as1D().data());


    await model.save('localstorage://my-model-1');
}

async function init()
{
    var mnistModel = [];
    createModel();
    await load();
    await train(mnistModel);
    console.log(mnistModel);
    await predict(data.nextTestBatch(BATCH_SIZE), mnistModel);
}

async function predict(batch, m)
{
    tf.tidy(() =>
    {
        const expected_value = Array.from(batch.labels.argMax(1).dataSync());

        const div = document.createElement('div');
        div.className = 'prediction-div';

        const output = model.predict(batch.xs.reshape([-1, 28, 28, 1]));

        const prediction_value = Array.from(output.argMax(1).dataSync());
        const image = batch.xs.slice([0, 0], [1, batch.xs.shape[1]]);

        console.log(expected_value);
        console.log(prediction_value);

    });

    const imgRequest = new Promise(async (resolve, reject) =>
    {
        img.crossOrigin = '';
        img.onload = () =>
        {
            img.width = img.naturalWidth;
            img.height = img.naturalHeight;

            const datasetBytesBuffer = new ArrayBuffer(NUM_DATASET_ELEMENTS * IMAGE_SIZE * 4);
            const chunkSize = 5000;

            canvas.width = img.width;
            canvas.height = chunkSize;

            for (let i = 0; i < NUM_DATASET_ELEMENTS / chunkSize; i++)
            {
                const datasetBytesView = new Float32Array(datasetBytesBuffer, i * IMAGE_SIZE * chunkSize * 4, IMAGE_SIZE * chunkSize);
                ctx.drawImage(img, 0, i * chunkSize, img.width, chunkSize, 0, 0, img.width, chunkSize);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                for (let j = 0; j < imageData.data.length / 4; j++)
                {
                    // All channels hold an equal value since the image is grayscale, so
                    // just read the red channel.
                    datasetBytesView[j] = imageData.data[j * 4] / 255;
                }
            }
            console.log(m);
            img.datasetImages = new Float32Array(datasetBytesBuffer);
            const img1 = img.datasetImages.slice(IMAGE_SIZE * 1, IMAGE_SIZE * 2);
            let imgDataVolume = dataToVolume(vec4(1,28,28,1),img1);
            console.log(imgDataVolume);
            let inputLayer = new Layer("input",vec4(1,28,28,1), imgDataVolume, 0);
            inputLayer.generate();
            mnistNetwork = new Network("CNN", m, inputLayer);
            console.log(mnistNetwork);
            generateNetwork(mnistNetwork);

        };
        img.src = MNIST_IMAGES_SPRITE_PATH;
    });
}

init();
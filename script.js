document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('fractalCanvas');
    const ctx = canvas.getContext('2d');
    const drawButton = document.getElementById('drawButton');
    const iterationsInput = document.getElementById('iterations');
    const width = canvas.width;
    const height = canvas.height;
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;

    // Creazione del Web Worker
    const worker = new Worker('mandelbrotWorker.js');

    // Event listener per i messaggi dal Web Worker
    worker.addEventListener('message', (event) => {
        const imageData = new Uint8ClampedArray(event.data);
        const imageDataObj = new ImageData(imageData, width, height);
        ctx.putImageData(imageDataObj, 0, 0);
    });

    const drawFractal = () => {
        const maxIterations = parseInt(iterationsInput.value);
        console.log('Drawing fractal with:', { maxIterations, width, height, scale, offsetX, offsetY });
        worker.postMessage({ maxIterations, width, height, scale, offsetX, offsetY });
    };

    // Event listener per il pulsante di disegno
    drawButton.addEventListener('click', () => {
        ctx.clearRect(0, 0, width, height);
        drawFractal();
    });

    // Event listener per lo zoom
    canvas.addEventListener('wheel', (event) => {
        event.preventDefault(); // Assicuro che lo scrolling non interferisca con lo zoom

        const zoomSpeed = 0.1;
        const zoom = event.deltaY < 0 ? (1 + zoomSpeed) : (1 - zoomSpeed);
        scale *= zoom;

        // Calcola il nuovo offset per mantenere il punto di zoom sotto il cursore del mouse
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        offsetX = (offsetX - mouseX) * zoom + mouseX;
        offsetY = (offsetY - mouseY) * zoom + mouseY;

        console.log('Zoom:', scale, 'Offset:', offsetX, offsetY);
        drawFractal();
    });

    // Event listener per il trascinamento del mouse (pan)
    let isDragging = false;
    let lastX;
    let lastY;

    canvas.addEventListener('mousedown', (event) => {
        isDragging = true;
        lastX = event.clientX;
        lastY = event.clientY;
    });

    canvas.addEventListener('mouseup', () => {
        isDragging = false;
    });

    canvas.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const deltaX = event.clientX - lastX;
            const deltaY = event.clientY - lastY;

            offsetX -= deltaX / scale;
            offsetY -= deltaY / scale;

            lastX = event.clientX;
            lastY = event.clientY;

            console.log('Pan - Offset:', offsetX, offsetY);
            drawFractal();
        }
    });

    // Disegna il frattale inizialmente
    drawFractal();
});

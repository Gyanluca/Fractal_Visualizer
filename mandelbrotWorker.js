function calculateMandelbrot(maxIterations, width, height, scale, offsetX, offsetY) {
    const result = new Uint8ClampedArray(width * height * 4); // Creare un array di lunghezza corretta

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const c_re = (x - width / 2.0 + offsetX) * 4.0 / (scale * width);
            const c_im = (y - height / 2.0 + offsetY) * 4.0 / (scale * height);

            let X = 0;
            let Y = 0;
            let iteration = 0;

            while (X * X + Y * Y <= 4 && iteration < maxIterations) {
                const x_new = X * X - Y * Y + c_re;
                Y = 2 * X * Y + c_im;
                X = x_new;
                iteration++;
            }

            const color = iteration === maxIterations ? 0 : (iteration * 255 / maxIterations);
            const index = (y * width + x) * 4;

            result[index] = color; // R
            result[index + 1] = color; // G
            result[index + 2] = color; // B
            result[index + 3] = 255; // A
        }
    }

    return result;
}

self.addEventListener('message', (event) => {
    const { maxIterations, width, height, scale, offsetX, offsetY } = event.data;
    const result = calculateMandelbrot(maxIterations, width, height, scale, offsetX, offsetY);
    self.postMessage(result);
});

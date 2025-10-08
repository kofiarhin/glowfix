export const applyStackBlur = (imageData, radius) => {
  if (!imageData || typeof imageData.width !== 'number' || typeof imageData.height !== 'number') {
    throw new Error('Invalid image data');
  }
  if (radius <= 0) {
    return new ImageData(new Uint8ClampedArray(imageData.data), imageData.width, imageData.height);
  }

  const { data, width, height } = imageData;
  const horizontal = new Uint8ClampedArray(data.length);
  const output = new Uint8ClampedArray(data.length);
  const channels = 4;
  const kernelRadius = Math.min(radius, 50);

  const applyHorizontal = () => {
    for (let y = 0; y < height; y += 1) {
      const rowOffset = y * width * channels;
      const prefix = new Float32Array((width + 1) * channels);
      for (let x = 0; x < width; x += 1) {
        const index = rowOffset + x * channels;
        for (let c = 0; c < channels; c += 1) {
          const prefixIndex = (x + 1) * channels + c;
          prefix[prefixIndex] = prefix[prefixIndex - channels] + data[index + c];
        }
      }
      for (let x = 0; x < width; x += 1) {
        const left = Math.max(0, x - kernelRadius);
        const right = Math.min(width - 1, x + kernelRadius);
        const count = right - left + 1;
        const baseIndex = rowOffset + x * channels;
        for (let c = 0; c < channels; c += 1) {
          const total = prefix[(right + 1) * channels + c] - prefix[left * channels + c];
          horizontal[baseIndex + c] = total / count;
        }
      }
    }
  };

  const applyVertical = () => {
    for (let x = 0; x < width; x += 1) {
      const prefix = new Float32Array((height + 1) * channels);
      for (let y = 0; y < height; y += 1) {
        const index = (y * width + x) * channels;
        for (let c = 0; c < channels; c += 1) {
          const prefixIndex = (y + 1) * channels + c;
          prefix[prefixIndex] = prefix[prefixIndex - channels] + horizontal[index + c];
        }
      }
      for (let y = 0; y < height; y += 1) {
        const top = Math.max(0, y - kernelRadius);
        const bottom = Math.min(height - 1, y + kernelRadius);
        const count = bottom - top + 1;
        const baseIndex = (y * width + x) * channels;
        for (let c = 0; c < channels; c += 1) {
          const total = prefix[(bottom + 1) * channels + c] - prefix[top * channels + c];
          output[baseIndex + c] = total / count;
        }
      }
    }
  };

  applyHorizontal();
  applyVertical();

  return new ImageData(output, width, height);
};

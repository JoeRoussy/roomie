import readChunk from 'read-chunk';
import imageType from 'image-type';

export default (async(path) => {
    // Only need to read the first 12 bytes to see if this is a real image
    const buffer = await readChunk(path, 0, 12);

    return imageType(buffer) !== null;
});

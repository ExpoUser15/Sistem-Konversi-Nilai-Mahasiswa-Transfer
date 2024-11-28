import imageCompression from 'browser-image-compression';

const useCompressedImage = async (event) => {
    let imageFile = event.target.files[0];

    if (imageFile.size < 1048576) {
        return imageFile;
    }

    const options = {
        maxSizeMB: 1,         
        maxWidthOrHeight: 800, 
        useWebWorker: true,    
    };

    try {
        const compressedBlob = await imageCompression(imageFile, options);

        const compressedFile = new File([compressedBlob], imageFile.name, {
            type: compressedBlob.type,
        });

        return compressedFile;
    } catch (error) {
        console.error('Compression error:', error);
        return imageFile;
    }
};


export default useCompressedImage
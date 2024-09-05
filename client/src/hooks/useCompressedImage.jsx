import imageCompression from 'browser-image-compression';

const useCompressedImage = async (event) => {
        const imageFile = event.target.files[0];
        const options = {
            maxSizeMB: 1,          // Ukuran maksimum file dalam MB
            maxWidthOrHeight: 800, // Dimensi maksimum
            useWebWorker: true,    // Untuk mempercepat proses kompresi
        };

        try {
            const compressedBlob = await imageCompression(imageFile, options);

            const compressedFile = new File([compressedBlob], imageFile.name, {
                type: compressedBlob.type,
            });

            return compressedFile;
        } catch (error) {
            return imageFile;
        }
}

export default useCompressedImage
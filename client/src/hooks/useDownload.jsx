import { useCallback } from 'react';

const useDownload = () => {
  const downloadFile = useCallback((url) => {
    // Ambil file dari URL dengan fetch
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob(); // Ambil file sebagai blob
      })
      .then(blob => {
        const anchor = document.createElement('a');
        let filename = url.split('/').pop(); // Ambil nama file dari URL
        const blobUrl = window.URL.createObjectURL(blob); // Buat URL blob

        // Set href ke URL blob dan download attribute untuk nama file
        anchor.href = blobUrl;
        anchor.download = filename;

        // Append dan klik anchor untuk memulai download
        document.body.appendChild(anchor);
        anchor.click();

        // Bersihkan
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(blobUrl); // Hapus URL blob setelah unduhan
      })
      .catch(error => {
        console.error('Error downloading the file:', error);
      });
  }, []);

  return downloadFile;
};

export default useDownload;

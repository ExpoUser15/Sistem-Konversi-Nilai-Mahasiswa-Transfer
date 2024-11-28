import { useCallback } from 'react';

const useDownload = () => {
  const downloadFile = useCallback((url, filename) => {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
  }, []);

  return downloadFile;
};

export default useDownload;

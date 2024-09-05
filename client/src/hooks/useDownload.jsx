import { useCallback } from 'react';

const useDownload = () => {
  const downloadFile = useCallback((url) => {
    const anchor = document.createElement('a');
    let filename = url.split('/');
    filename = filename[filename.length - 1];
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }, []);

  return downloadFile;
};

export default useDownload;

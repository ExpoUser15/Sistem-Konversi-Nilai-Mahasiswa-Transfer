const fs = require('fs');
const path = require('path');

exports.deleteFile = async (berkas, fileArr) => {
    if (berkas) {

        const folderMap = {
            ijazah: 'ijazah',
            kk: 'kk',
            ktp: 'ktp',
            surat_pindah: 'surat_pindah',
            transkrip_nilai: 'transkrip' 
        };

        for (const field of fileArr) {
            if (berkas[field]) {
                const fileUrl = new URL(berkas[field]);
                const filePathName = folderMap[field]; 
                const fileName = fileUrl.pathname.split('/').pop();

                const filePath = path.join(__dirname, '..', `tmp/${filePathName}`, fileName);
                try {
                    await fs.promises.unlink(filePath); 
                } catch (err) {
                    console.error(`Gagal menghapus file ${fileName}:`, err);
                    return false; 
                }
            }
        }
    }
}
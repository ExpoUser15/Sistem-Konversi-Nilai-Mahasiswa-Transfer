const fs = require('fs');
const path = require('path');

exports.deleteFile = async (berkas, fileArr) => {
    if (berkas) {

        const folderMap = {
            ijazah: 'ijazah',
            kk: 'kk',
            ktp: 'ktp',
            surat_pindah: 'surat_pindah',
            transkrip_nilai: 'transkrip' // Mapped to 'transkrip' folder
        };

        for (const field of fileArr) {
            if (berkas[field]) {
                // Ambil URL dan pisahkan untuk mendapatkan path dan nama file
                const fileUrl = new URL(berkas[field]);
                const filePathName = folderMap[field]; // Mengambil nama folder dari mapping
                const fileName = fileUrl.pathname.split('/').pop(); // 'nama_file.png'

                const filePath = path.join(__dirname, '..', `tmp/${filePathName}`, fileName);
                try {
                    await fs.promises.unlink(filePath); // Menggunakan fs.promises.unlink untuk operasi asinkron
                } catch (err) {
                    console.error(`Gagal menghapus file ${fileName}:`, err);
                    return false; // Menghentikan loop dan mengembalikan false jika ada kesalahan
                }
            }
        }
    }
}

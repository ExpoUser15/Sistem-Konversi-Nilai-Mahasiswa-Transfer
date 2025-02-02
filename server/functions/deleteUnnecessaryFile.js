const fs = require("fs");
const path = require("path");

const folderPath = path.resolve(__dirname, "../tmp");
const filePath = path.resolve(__dirname, "../tmp");

const deleteUnnecessaryFile = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    console.error("Folder tidak ditemukan:", folderPath);
    return;
  }

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("Gagal membaca folder:", err);
      return;
    }
    console.log("Daftar file:", files);
  });

};
deleteUnnecessaryFile(folderPath);

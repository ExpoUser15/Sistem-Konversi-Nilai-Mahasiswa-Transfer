const path = require('path');

const fileController =  (req, res) => {
    const filename = req.params.filename;
    const split = filename.split('-')[0];
    const filePath = path.join(process.cwd(), `tmp/${split}`, filename);

    console.log(filePath);

    res.sendFile(filePath, (err) => {
        if (err) {
            console.log('File not found:', err);
            res.status(404).send('File not found');
        }
    });
};

module.exports = fileController;
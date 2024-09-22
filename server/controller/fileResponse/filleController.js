const path = require('path');

const fileController =  (req, res) => {
    const filename = req.params.filename;
    const split = filename.split('-')[0];
    if(req.path.includes('report')){
        const filePath = path.join(process.cwd(), `tmp/laporan`, filename);
        return res.sendFile(filePath, (err) => {
            if (err) {
                console.log('File not found:', err);
                res.status(404).send('File not found');
            }
        });
    }
    if(req.path.includes('doc')){
        const filePath = path.join(process.cwd(), `tmp/test`, filename);
        return res.sendFile(filePath, (err) => {
            if (err) {
                console.log('File not found:', err);
                res.status(404).send('File not found');
            }
        });
    }
    const filePath = path.join(process.cwd(), `tmp/${split}`, filename);

    res.sendFile(filePath, (err) => {
        if (err) {
            console.log('File not found:', err);
            res.status(404).send('File not found');
        }
    });
};

module.exports = fileController;
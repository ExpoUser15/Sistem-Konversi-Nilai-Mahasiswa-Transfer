const path = require('path');

const fileController =  (req, res) => {
    const filename = req.params.filename;
    const split = filename.split('-')[0];
    const filePath = path.join(process.cwd(), `tmp/${split}`, filename);

    if(req.path.includes('upload')){
        const filePath = path.join(process.cwd(), `tmp/form`, filename);
        return res.sendFile(filePath, (err) => {
            if (err) {
                console.log('File not found:', err);
                res.status(404).send('File not found');
            }
        });
    }

    res.sendFile(filePath, (err) => {
        if (err) {
            console.log('File not found:', err);
            res.status(404).send('File not found');
        }
    });
};

module.exports = fileController;
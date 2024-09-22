const handleDuplicateData = async (req, res, next) => {
    const dataArray = req.body.data;
    const ids = new Set();
    let exist;

    for (const item of dataArray) {
        if (!ids.has(item.mata_kuliah_asal) && !ids.has(item.mata_kuliah_tujuan)) {
            ids.add(item.mata_kuliah_asal);
            ids.add(item.mata_kuliah_tujuan);
        }else{
            exist = true;
            break;
        }
    }

    if(exist){
        req.error = true;
    }

    next();
}


module.exports = handleDuplicateData;
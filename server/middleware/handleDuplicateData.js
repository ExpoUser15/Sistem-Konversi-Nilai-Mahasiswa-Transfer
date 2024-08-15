const handleDuplicateData = async (req, res, next) => {
    const dataArray = req.body.hasil;
    const ids = new Set();
    let exist;

    for (const item of dataArray) {
        if (!ids.has(item.id_mk) && !ids.has(item.mk_asal)) {
            ids.add(item.id_mk);
            ids.add(item.mk_asal);
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
const notFound = (req, res) => {
    res.status(404).json({
        status: 'Error',
        message: "URL Not Found!"
    })
}

module.exports = {
    notFound,
}
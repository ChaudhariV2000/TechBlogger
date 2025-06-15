const path = require('path');
const authRoutes = async (req, res) => {

    res.sendFile("")
}

const blogRoutes = async (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
}

module.exports = { authRoutes, blogRoutes }
const express = require('express');
const path = require('path');
require('dotenv').config();
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

// Initialize Express app
const app = express();

// Configure AWS
AWS.config.update({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_KEY
    }
});

// Initialize S3 client
const s3 = new AWS.S3();

// Initialize DynamoDB client
const docClient = new AWS.DynamoDB.DocumentClient();

// Configure Multer with S3 storage
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'my-blog-images-vedant',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            const ext = path.extname(file.originalname);
            const name = path.basename(file.originalname, ext);
            cb(null, `uploads/${name}-${Date.now()}${ext}`);
        }
    })
});

// Middleware setup
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);

// Routes
app.get('/', (req, res) => {
    res.render('index.html');
});

app.get('/authRoutes', (req, res) => {
    const params = {
        TableName: 'blog'
    };

    docClient.scan(params, (err, data) => {
        if (err) {
            console.error('DynamoDB Error:', JSON.stringify(err, null, 2));
            res.render('home', { blogs: [] });
        } else {
            res.render('home', { blogs: data.Items || [] });
        }
    });
});

app.get('/test-s3', async (req, res) => {
    try {
        const result = await s3.listObjectsV2({ Bucket: 'my-blog-images-vedant' }).promise();
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            stack: error.stack
        });
    }
});

app.post('/createblog', upload.single('blogImage'), (req, res) => {
    const { blogTitle, blogContent } = req.body;

    if (!req.file) {
        return res.status(400).send('Image upload failed');
    }

    const input = {
        sr_no: Math.floor(Math.random() * 100000),
        title: blogTitle,
        content: blogContent,
        imagePath: req.file.location
    };

    const params = {
        TableName: 'blog',
        Item: input
    };

    docClient.put(params, (err) => {
        if (err) {
            console.error('Error saving blog:', JSON.stringify(err, null, 2));
            return res.status(500).send('Error saving the blog');
        }
        res.redirect(`${req.baseUrl}/authRoutes`);
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

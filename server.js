// Load dependencies
import { S3Client } from "@aws-sdk/client-s3"
import express from 'express'
import multer from 'multer'
import multerS3 from 'multer-s3'
import ShortUniqueId from "short-unique-id"
import dotenv from 'dotenv'
dotenv.config();
const uid = new ShortUniqueId({ length: 10 });


const app = express();

// Set S3 endpoint to DigitalOcean Spaces

const s3 = new S3Client({
    endpoint: process.env.DO_SPACES_ENDPOINT,
    region: process.env.DO_SPACES_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY
    }
});

// Change bucket property to your Space name
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.DO_SPACES_NAME,
        acl: 'public-read',
        key: function (request, file, cb) {
            const id = uid.rnd()
            console.log(`FILE: ${id}`, file);
            cb(null, `bathroom-graffiti/${id}.png`);
        }
    })
}).array('upload', 1);

// Views in public directory
app.use(express.static('dist'));

// Main, error and success views
app.get('/', function (request, response) {
    response.sendFile(__dirname + '/public/index.html');
});

app.post('/upload', function (request, response, next) {
    upload(request, response, function (error) {
        if (error) {
            console.log(error);
            return response.send("Oops! Something went wrong.");
        }
        console.log('File uploaded successfully!!!!!!!');
        response.send("Success! File uploaded.")
    });
});

app.listen(3001, function () {
    console.log('Server listening on port 3001.');
});
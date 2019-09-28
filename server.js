/* eslint-disable @typescript-eslint/no-var-requires */
const appinfo = require('./package.json');
const express = require('express')
const app = express()
const multer = require('multer')
const time = new Date().getTime()
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, `${file.originalname.substr(0, file.originalname.indexOf('.'))}_${time}.json`)
    }
})
const upload = multer({ storage: storage }).single('datafile')

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const fs = require('fs')
const path = require('path')
const port = process.env.PORT || '3000';
const JSONStream = require('JSONStream');

app.set('port', port);

app.use(express.static(path.join(__dirname, `dist/${appinfo.name}`)))

app.get('*', (req, res) => res.sendFile(path.join(__dirname, `dist/${appinfo.name}/index.html`)))

mongoose.connect(`mongodb://localhost:27017/${appinfo.name}`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(`connection to mongodb is open for ${appinfo.name}`))
    .catch((err) => console.log(`Can't connect to mongodb due to ${err} error`));

mongoose.set('useFindAndModify', false);

const DataSchema = new Schema({ ts: Number, value: Number })

app.post('/upload', async (req, res) => {
    upload(req, res, function (err) {

        const stream = fs.readFileSync(req.file.path, 'utf-8');
        const jsonData = JSON.parse(stream);

        const Data = mongoose.model('Data', DataSchema,
            `${req.file.originalname.substr(0, req.file.originalname.indexOf('.'))}_${time}`);

        for (let i = 0; i < jsonData.length; i += 10000) {
            Data.collection.insertMany(jsonData.slice(i, i + 10000));
        }

        if (err instanceof multer.MulterError) {
            console.log('A Multer error occurred when uploading');
            process.exit(0);
        } else if (err) {
            console.log('An unknown error occurred when uploading');
            process.exit(0);
        } else {
            Data.find({}).select({ "_id": 0 })
                .cursor()
                .pipe(JSONStream.stringify())
                .pipe(res.type('json'));
        }
    });
});

app.listen(port, () => console.log(`ThermometerApp running on port ${port}`));
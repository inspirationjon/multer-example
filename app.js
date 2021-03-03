const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const sha1 = require('sha1')
const multer = require('multer')

app.engine('html', ejs.renderFile)
app.set('view engine', 'html')

const print = console.log
const upload = multer({
    storage: multer.diskStorage({
        destination: './src/images',
        filename: (req, file, cb) => {
            const { username } = req.body

            const filename = sha1(username)
            const extension = 'jpeg'
            const filepath = filename + '.' + extension

            cb(null, filepath)
        },
    }),
})

const PORT = process.env.PORT || 8000

app.get('/', (req, res) => {
    res.render('index.html')
})

app.post('/', upload.single('avatar'), (req, res) => {
    res.redirect('/')
})

app.get('/profile/:username', (req, res, next) => {
    const { username } = req.params
    const imgLink = `/src/images/${sha1(username)}.jpeg`

    res.sendFile(path.join(__dirname, imgLink))
})

app.listen(8000, print(`http://127.0.0.1:${PORT}`))

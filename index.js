const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const sha1 = require('sha1')
const multer = require('multer')

const PORT = process.env.PORT || 4000

app.engine('html', ejs.renderFile)
app.set('view engine', 'html')

const upload = multer({
    storage: multer.diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
            const { username } = req.body
            const filename = sha1(username)
            const extension = file.mimetype.split('/')[1]
            const filepath = filename + '.' + extension

            cb(null, filepath)
        },
    }),
})

app.get('/', (_, res) => {
    res.render('index.html')
})

app.post('/', upload.single('avatar'), (req, res, next) => {
    res.redirect(`/profile/${req.body.username}`)
})

app.get('/profile/:username', (req, res, next) => {
    const { username } = req.params
    const imgPath = `/uploads/${sha1(username)}.jpeg`

    res.sendFile(path.join(__dirname, imgPath))
})

app.listen(PORT, console.log.bind(null, `http://localhost:${PORT}`))

const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

const PORT = 5000
const app = express()

app.use(cors())
app.use(express.static(path.join(__dirname,"..","frontend")))
app.get('/', (req, res) => {

    const file_path = path.join(
        __dirname,
        '..',
        'frontend/pages',
        'index.html'
    )
        fs.readFile(file_path, 'utf8', (err, data) => {
        if (err) {
            console.log('ERROR:', err)
            return res.status(500).send('error loading page')
        }res.send(data)
    })
})
app.get('/about', (req, res) => {

    const file_path = path.join(
        __dirname,
        '..',
        'frontend/pages',
        'about.html'
    )
        fs.readFile(file_path, 'utf8', (err, data) => {
        if (err) {
            console.log('ERROR:', err)
            return res.status(500).send('error loading page')
        }res.send(data)
    })
})
app.get('/blogs', (req, res) => {

    const file_path = path.join(
        __dirname,
        '..',
        'frontend/pages',
        'courses-Blogs.html'
    )
        fs.readFile(file_path, 'utf8', (err, data) => {
        if (err) {
            console.log('ERROR:', err)
            return res.status(500).send('error loading page')
        }res.send(data)
    })
})
app.get('/analysis', (req, res) => {

    const file_path = path.join(
        __dirname,
        '..',
        'frontend/pages',
        'analysis.html'
    )
        fs.readFile(file_path, 'utf8', (err, data) => {
        if (err) {
            console.log('ERROR:', err)
            return res.status(500).send('error loading page')
        }res.send(data)
    })
})
app.get('/services', (req, res) => {

    const file_path = path.join(
        __dirname,
        '..',
        'frontend/pages',
        'services.html'
    )
        fs.readFile(file_path, 'utf8', (err, data) => {
        if (err) {
            console.log('ERROR:', err)
            return res.status(500).send('error loading page')
        }res.send(data)
    })
})
app.get('/signup', (req, res) => {

    const file_path = path.join(
        __dirname,
        '..',
        'frontend/pages',
        'signup.html'
    )
        fs.readFile(file_path, 'utf8', (err, data) => {
        if (err) {
            console.log('ERROR:', err)
            return res.status(500).send('error loading page')
        }res.send(data)
    })
})
app.get('/login', (req, res) => {

    const file_path = path.join(
        __dirname,
        '..',
        'frontend/pages',
        'login.html'
    )
        fs.readFile(file_path, 'utf8', (err, data) => {
        if (err) {
            console.log('ERROR:', err)
            return res.status(500).send('error loading page')
        }res.send(data)
    })
})
app.get('/profile', (req, res) => {

    const file_path = path.join(
        __dirname,
        '..',
        'frontend/pages',
        'profile.html'
    )
        fs.readFile(file_path, 'utf8', (err, data) => {
        if (err) {
            console.log('ERROR:', err)
            return res.status(500).send('error loading page')
        }res.send(data)
    })
})

app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`)
})
//load lib
const path = require('path');
const express = require('express');

const resources = ['images', 'public'];
const images = ['cat.jpg', 'dog.jpg', 'rabbit.jpg']

const randImage = (array) => {
    const rand = Math.random();
    const index = Math.floor(rand * array.length)
    return (array[index]);
}

//create an instance of express
const app = express();

//Define routes
// GET /image -> text/html
app.get('/image', (req, resp) => {
    const imageFile = randImage(images);    

    resp.status(200);

    resp.format({
        'text/html': () => {
            resp.send(`<img src='/${imageFile}'>`);
        },

        'application/json': () => {
            resp.json({ imageURL: `/$(imageFile)`})
        },

        'image.jpg': () => {
            resp.sendFile(path.join(__dirname, 'images', imageFile));
        },
        
        'default': () => {
            resp.status(406).end();
        }
    })
});


for (let res of resources) {
    console.info(`Adding ${res} to static`)
    app.use(express.static(path.join(__dirname, res)));
}

app.use((req, resp) => {
    resp.status(404);
    resp.end();
});

//Start web server
const PORT = parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000;
app.listen(PORT, () => {
    console.info(`Application started on ${PORT} at ${new Date()}`);
})


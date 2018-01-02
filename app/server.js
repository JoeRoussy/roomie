import express from 'express';


const app = express();

// TODO(Joe): DB setup(including driver), logging setup, app and api routes

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.listen(3000, () => console.log('App listening on port 3000'));

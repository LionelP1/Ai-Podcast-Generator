require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

const podcastRoutes = require('./routes/podcastRoute');

app.get('/', (req, res) => {
    res.render('index', { script: [] });
});


app.use('/api/podcast', podcastRoutes);


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

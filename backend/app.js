// require('dotenv').config(); For deployment
const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, '/frontend/dist')));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const podcastRoutes = require('./routes/podcastRoute');

app.use('/api/podcast', podcastRoutes);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

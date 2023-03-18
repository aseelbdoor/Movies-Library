
const express = require('express');
const app = express();
const port = 3001;



function Constractor(title, posterPath, overview) {
  this.title = title;
  this.posterPath = posterPath;
  this.overview = overview;
}

function homePageHandler(req, res) {
  try {
    let array = new Array();
    let newFilm = new Constractor(movieData.title, movieData.poster_path, movieData.overview);
    array.push(newFilm);
    res.json(array);
  } catch (error) {
    res.status(500).json({ status: 500, responseText: "Sorry, something went wrong" });
  }

}

function welcom(req, res) {
  try {
    res.send("Welcome to Favorite Page");
  } catch (err) {
    res.status(500).json({ status: 500, responseText: "Sorry, something went wrong" });
  }
}


const movieData = require('./Movie Data/data.json');
app.get('/', homePageHandler);
app.get('/favorite', welcom);

app.get('*', (req, res) => {
  res.status(404).json({ status: 404, responseText: "page not found error" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
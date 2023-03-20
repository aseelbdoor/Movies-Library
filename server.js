
const express = require('express');
const app = express();
const port = 3002;



function Constractor(title, posterPath, overview) {
  this.title = title;
  this.posterPath = posterPath;
  this.overview = overview;
}

function error500(res){
  return res.status(500).json({ status: 500, responseText: "Sorry, something went wrong" });
}

function error404(res){
  return res.status(404).json({ status: 404, responseText: "page not found error" });
}

function homePageHandler(req, res) {
  try {
    let array = new Array();
    let newFilm = new Constractor(movieData.title, movieData.poster_path, movieData.overview);
    array.push(newFilm);
    res.json(array);
  } catch (error) {
    error500(res);
  }

}

function welcom(req, res) {
  try {
    res.send("Welcome to Favorite Page");
  } catch (err) {
    error500(res);
  }
}


const movieData = require('./Movie Data/data.json');
app.get('/', homePageHandler);
app.get('/favorite', welcom);

app.get('*', (req, res) => {
  error404(res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
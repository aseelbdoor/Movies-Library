
const express = require('express');
const app = express();
const movieData = require('./Movie Data/data.json');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
app.use(cors());
const PORT = process.env.PORT;
const apikey=process.env.API_KEY;


// Functions
function homePageHandler(req, res) {
  let array = new Array();
  let newFilm = new Constractor(movieData.title, movieData.poster_path, movieData.overview);
  array.push(newFilm);
  res.json(array);
}

function welcom(req, res) {
  res.send("Welcome to Favorite Page");
}

function trendingMovieData(req,res){
  let URL= `https://api.themoviedb.org/3/search/movie?api_key=${apikey}&language=en-US&query=The&page=2`;
  axios.get(URL)
  .then((result)=>{
    // console.log(result.data.results);
    let move=result.data.results.map((element)=>{
      return new MovieFilter(element.id,element.original_title,element.release_date,element.poster_path,element.overview)
    })
    res.json(move);
  })
  .catch((err)=>{
    console.log(err.message);
    res.send(err.message);
  })
}

function searchMovie(req,res){
  let request=req.query.name;
  let URL =`https://api.themoviedb.org/3/search/movie?api_key=${apikey}&language=en-US&query=${request}&page=2`;
  axios.get(URL)
  .then((result)=>{
    // console.log(result.data.results);
    let allRelatedMovies=result.data.results.map((element)=>{
      return new MovieFilter(element.id,element.original_title,element.release_date,element.poster_path,element.overview)
    });
    res.json(allRelatedMovies);
  })
  .catch((err)=>{
    console.log(err.message);
    res.send(err.message);
  })
}

function tvSeason(req,res){
  let id=req.query.id;
  let seasonNumber=req.query.number;
  let URL= `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${apikey}&language=en-US`;
  axios.get(URL)
  .then((result)=>{
    // console.log(result.data.episodes);
    let seasons= result.data.episodes.map((element)=>{
      return new SeasonFilter(element.name,element.episode_number,element.air_date)
    })
    res.json(seasons)
  })
  .catch((err)=>{
    console.log(err.message);
    res.send(err.message);
  })
}

function customerReview(req,res){
  let id=req.query.id;
  let URL= `https://api.themoviedb.org/3/review/${id}?api_key=${apikey}`;
  axios.get(URL)
  .then((result)=>{
    console.log(result.data);
    let element=result.data;
    let allReview=[];
    allReview.push(new Review(element.author,element.media_title,element.media_id,element.author_details.rating,element.content)) ;
    res.json(allReview);
  })
  .catch((err)=>{
    console.log(err.message);
    res.send(err.message);
  })
  
}


// Calling and her method
app.get('/', homePageHandler);
app.get('/favorite', welcom);
app.get('/trending',trendingMovieData);
app.get('/search',searchMovie);
app.get('/season',tvSeason); //Get the TV season details by id examle: http://localhost:3000/season?id=1&number=1
app.get('/review',customerReview);//Retrieve TV show review example: http://localhost:3000/review?id=58aa82f09251416f92006a3a
app.get('*', error404);


// Constractor
function Constractor(title, posterPath, overview) {
  this.title = title;
  this.posterPath = posterPath;
  this.overview = overview;
}

function MovieFilter(id,title,date,path,overview){
  this.id=id;
  this.title=title;
  this.release_date=date;
  this.poster_path=path;
  this.overview=overview;
}

function SeasonFilter(name,episodes,time){
  this.name=name;
  this.episode_number=episodes;
  this.air_date=time;
}

function Review(name,movie,movieID,movieRate,review){
  this.name=name;
  this.media=movie;
  this.media_ID=movieID;
  this.rate=movieRate;
  this.review=review;
}


// handiling error

function error500(err,req,res,next){
  return res.status(500).json({ status: 500, responseText: "Sorry, something went wrong" });
}

function error404(req,res){
  return res.status(404).json({ status: 404, responseText: "page not found error" });
}
app.use(error500);
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
})
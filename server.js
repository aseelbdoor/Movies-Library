
const express = require('express');
const app = express();
const movieData = require('./Movie Data/data.json');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
app.use(cors());
const PORT = process.env.PORT;
const apikey=process.env.API_KEY;


// SQL CONNECTION
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
const {Client} = require('pg');
const url=process.env.URL;
const client=new Client(url);



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
    error500(err,req,res);
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
    error500(err,req,res);
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
    error500(err,req,res);
  })
}

function customerReview(req,res){
  let id=req.query.id;
  let URL= `https://api.themoviedb.org/3/review/${id}?api_key=${apikey}`;
  axios.get(URL)
  .then((result)=>{
    // console.log(result.data);
    let element=result.data;
    let allReview=[];
    allReview.push(new Review(element.author,element.media_title,element.media_id,element.author_details.rating,element.content)) ;
    res.json(allReview);
  })
  .catch((err)=>{
    error500(err,req,res);
  })
  
}

function addMovie(req,res){
  let {name,myComment}=req.body;
  res.send("DONE");
  let sql = `INSERT INTO myMovies(movieName,comment) VALUES ($1,$2)`;
  let values=[name,myComment];
  client.query(sql,values).then((result)=>{
    res.json('The data saved');
  }).catch((err)=>{
    error500(err);
  })
}

function getMovies(req,res){
  let sql=`SELECT * FROM myMovies`;
  client.query(sql).then((result)=>{
    res.json(result.rows);
  }).catch((err)=>{
    error500(err);
  })
}


// Calling and her method
app.get('/', homePageHandler);
app.get('/favorite', welcom);
app.get('/trending',trendingMovieData);
app.get('/search',searchMovie);
app.get('/season',tvSeason); //Get the TV season details by id examle: http://localhost:3000/season?id=1&number=1
app.get('/review',customerReview);//Retrieve TV show review example: http://localhost:3000/review?id=58aa82f09251416f92006a3a
// DATADASE PART 
app.post('/addMovie',addMovie);
app.get('/getMovies',getMovies);
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


// connection promice
client.connect()
.then((result)=>{
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  })
})
.catch((err)=>{
  console.log(err);
  res.json(err);
})
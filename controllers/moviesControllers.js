class MoviesController{

  showMovies = (req, res) =>{
    res.render("movies");
  };

  showAddMovie = (req, res)=> {
    res.render("formNewMovie");
  };
 
  showEditMovie = (req, res)=> {
    res.render("formEditMovie");
  };

};

module.exports = new MoviesController();
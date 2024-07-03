import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";

function App() {
  const [movies, setMovies] = useState([]);
  const [filterMovies, setFilterMovies] = useState([]);
  const [addMovieModal, setAddMovieModal] = useState(false);

  const [moviesData, setMoviesData] = useState({
    title: "",
    year: "",
    director: "",
    actors: "",
    runtime: "",
  });

  const getAllMovies = async () => {
    await axios.get("http://localhost:5000/movie").then((res) => {
      setMovies(res.data);
      setFilterMovies(res.data);
      console.log(res.data);
    });
  };
  useEffect(() => {
    getAllMovies();
  }, []);

  //search functions
  const handleSearch = (e) => {
    const searchText = e.target.value.toLowerCase();

    const filteredMovies = movies.filter((movie) => {
        const title = movie.title ? movie.title.toLowerCase() : '';
        const director = movie.director ? movie.director.toLowerCase() : '';
        const year = movie.year ? movie.year.toString() : '';
        const runtime = movie.runtime ? movie.runtime.toString() : '';
        const actors = movie.actors ? movie.actors.toString().toLowerCase() : '';

        return (
            title.includes(searchText) ||
            director.includes(searchText) ||
            year.includes(searchText) ||
            runtime.includes(searchText) ||
            actors.includes(searchText)
        );
    });

    setFilterMovies(filteredMovies);
};


  //delete functions
  const handleDelete = async (movieId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this movie?");
    
    if (isConfirmed) {
      try {
        const response = await axios.delete(`http://localhost:5000/movie/${movieId}`);
        setMovies(response.data);
        setFilterMovies(response.data);
        window.location.reload();
      } catch (error) {
        console.error("Error deleting movie:", error);
      }
    }
  }

  const handleAdd = () => {
    setMoviesData({
      title: "",
      year: "",
      director: "",
      actors: "",
      runtime: "",
    });
    setAddMovieModal(true);
  };

  const closeModal = () => {
    setAddMovieModal(false);
  };

  const handleData = (e) => {
    setMoviesData({ ...moviesData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (moviesData._id) {
      await axios
        .put(`http://localhost:5000/movie/${moviesData._id}`, moviesData)
        .then((res) => console.log(res));
    } else {
      await axios
        .post("http://localhost:5000/movie", moviesData)
        .then((res) => console.log(res));
    }
    setMoviesData({
      title: "",
      year: "",
      director: "",
      actors: "",
      runtime: "",
    });
    setAddMovieModal(false);
    getAllMovies();
  };

  const handleUpdate = (movie) => {
    setMoviesData(movie);
    setAddMovieModal(true);
  };

  return (
    <div className="container">
      <h3>CRUD Application with React.js Frontend and Node.js Backend</h3>
      <div className="input-search">
        <input
          type="search"
          placeholder="Text Here...."
          onChange={handleSearch}
        />
        <button className="btn green" onClick={handleAdd}>
          Add Record
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Title</th>
            <th>Release Year</th>
            <th>Director</th>
            <th>Actors</th>
            <th>Run Time</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filterMovies &&
            filterMovies.map((movie, index) => {
              return (
                <tr key={movie.id}>
                  <td>{index + 1}</td>
                  <td>{movie.title}</td>
                  <td>{movie.year}</td>
                  <td>{movie.director}</td>
                  <td>{movie.actors}</td>
                  <td>{movie.runtime}</td>
                  <td>
                    <button
                      className="btn green"
                      onClick={() => handleUpdate(movie)}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn red"
                      onClick={() => handleDelete(movie._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      {addMovieModal && (
        <div className="modal">
          <div className="modal-content">
            <div>
              <span className="close" onClick={closeModal}>
                &times;
              </span>
              <h2>{moviesData.id ? "Update Record" : "Add Record"}</h2>
            </div>
            <div className="input-group">
              <label htmlFor="title" className="title">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={moviesData.title}
                onChange={handleData}
              />
            </div>
            <div className="input-group">
              <label htmlFor="year" className="year">
                Year
              </label>
              <input
                type="number"
                name="year"
                id="year"
                value={moviesData.year}
                onChange={handleData}
              />
            </div>
            <div className="input-group">
              <label htmlFor="director" className="director">
                Director
              </label>
              <input
                type="text"
                name="director"
                id="director"
                value={moviesData.director}
                onChange={handleData}
              />
            </div>
            <div className="input-group">
              <label htmlFor="actors" className="actors">
                Actors
              </label>
              <input
                type="text"
                name="actors"
                id="actors"
                value={moviesData.actors}
                onChange={handleData}
              />
            </div>
            <div className="input-group">
              <label htmlFor="runtime" className="runtime">
                Run Time
              </label>
              <input
                type="number"
                name="runtime"
                id="runtime"
                value={moviesData.runtime}
                onChange={handleData}
              />
            </div>
            <div className="addbtns">
              <button className="btn green" onClick={handleSubmit}>
                {moviesData.id ? "Update Movie" : "Add Movie"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

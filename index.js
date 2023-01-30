// Middleware: funciones que se ejecutan antes de que lleguen a las rutas
// CORS: Cross Origin Resource Sharing, compartir recursos entre distintos origenes
// const http = require('http');
// CommonJS - forma de cargar modulos desde hace años
// Para deployar en heroku hay que instalar el heroku cli

const express = require('express')
const cors = require('cors')
const logger = require('./middleware')

const app = express()

app.use(cors()) // --> para que el front pueda hacer peticiones al back
app.use(express.json()) // --> para que express entienda los objetos json
app.use(logger)

let movies = [
  {
    id: 1,
    title: 'The Shawshank Redemption',
    year: 1994,
    director: 'Frank Darabont'
  },
  {
    id: 2,
    title: 'The Godfather',
    year: 1972,
    director: 'Francis Ford Coppola'
  },
  {
    id: 3,
    title: 'The Godfather: Part II',
    year: 1974,
    director: 'Francis Ford Coppola'
  }
]

/* const app = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(movies));
}); */

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/api/movies', (req, res) => {
  res.json(movies)
})

app.get('/api/movies/:id', (req, res) => {
  const id = Number(req.params.id) // --> req.params.id es un string
  const movie = movies.find(movie => movie.id === id)
  console.log(movie)
  if (movie) {
    res.json(movie)
  } else {
    /* res.send(404); */
    res.status(404).json({
      status: 404,
      error: 'Not found'
    })
  }
})

app.delete('/api/movies/:id', (req, res) => {
  const id = Number(req.params.id)
  movies = movies.filter(movie => movie.id !== id)
  /* res.json({"message": "Movie deleted"}); */
  res.sendStatus(204).end()
})

app.post('/api/movies', (req, res) => {
  const movie = req.body
  if (!movie.title || !movie.year || !movie.director) {
    return res.status(400).json({
      status: 400,
      error: 'content missing'
    })
  }
  const ids = movies.map(movie => movie.id)
  const maxId = Math.max(...ids)
  const newMovie = {
    id: maxId + 1,
    title: movie.title,
    year: movie.year,
    director: movie.director
  }
  movies = [...movies, newMovie]
  res.status(201).json(newMovie)
})

app.use((req, res) => {
  res.status(404).json({
    status: 404,
    error: 'Not found'
  })
})

// process.env.PORT --> para que heroku asigne el puerto automaticamente
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

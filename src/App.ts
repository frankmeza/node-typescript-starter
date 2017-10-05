import * as express from 'express'
import * as bodyParser from 'body-parser'
import Persistence from './Persistence'

class App {
  public express
  persistence

  constructor () {
    this.express = express()
    this.express.use(bodyParser.urlencoded({ extended: false }))
    this.express.use(bodyParser.json())
    this.persistence = new Persistence()
    this.mountRoutes()
  }

  private mountRoutes (): void {
    const router = express.Router()

    router.get('/', (req, res) => {
      res.json({true: true})
    })

    // PEOPLE
    // index people
    router.get('/persons', (req, res) => {
      res.json(this.persistence.getPeople())
    })

    // show person
    router.get('/persons/:id', (req, res) => {
      const id = req.params.id
      res.json(this.persistence.getPerson(id))
    })

    // create person
    router.post('/persons', (req, res) => {
      const person = req.body
      const people = this.persistence.addPerson(person)
      res.sendStatus(201)
    })
    
    // update person
    router.put('/persons', (req, res) => {
      const person = req.body
      this.persistence.updatePerson(person)
      res.sendStatus(204)
    })
    
    // delete person
    router.delete('/persons/:id', (req, res) => {
      const id = req.params.id
      this.persistence.deletePerson(id)
      res.sendStatus(204)
    })
    
    // PETS
    // index pets
    router.get('/pets', (req, res) => {
      res.json(this.persistence.getPets())
    })
    
    // index pets per person
    router.get('/persons/:id/pets', (req, res) => {
      const id = req.params.id
      res.json(this.persistence.getPetsByPersonId(id))
    })

    // show pet
    router.get('/pets/:id', (req, res) => {
      const id = req.params.id
      res.json(this.persistence.getPet(id))
    })
    
    // create pet
    router.post('/pets', (req, res) => {
      const pet = req.body
      this.persistence.addPet(pet) 
      res.sendStatus(201)
    })
    
    // update pet
    router.put('/pets', (req, res) => {
      const pet = req.body
      this.persistence.updatePet(pet)
      res.sendStatus(204)
    })
    
    // delete pet
    router.delete('/pets/:id', (req, res) => {
      const id = req.params.id
      this.persistence.deletePet(id)
      res.sendStatus(204)
    })

    this.express.use('/', router)
  }
}

export default new App().express

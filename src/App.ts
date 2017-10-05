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
    router.get('/people', (req, res) => {
      res.json(this.persistence.getPeople())
    })

    // show person
    router.get('/person/:id', (req, res) => {
      const id = req.params.id
      res.json(this.persistence.getPerson(id))
    })

    // create person
    router.post('/person', (req, res) => {
      const person = req.body
      const people = this.persistence.addPerson(person)
      res.json({good: true})
    })
    
    // put person
    router.put('/person', (req, res) => {
      const updatedAttributes = req.body
      const updatedPerson = this.persistence.updatePerson(updatedAttributes)
      res.json({good: true})
    })
    
    // delete person
    router.delete('/person/:id', (req, res) => {
      const id = req.params.id
      const updatedPeopleList = this.persistence.deletePerson(id)
      res.json(updatedPeopleList)
    })
    
    // PETS

    // index pets
    router.get('/pets', (req, res) => {
      res.json(this.persistence.getPets())
    })
    
    // index pets per person
    router.get('/person/:id/pets', (req, res) => {
      const id = req.params.id
      res.json(this.persistence.getPetsByPersonId(id))
    })

    // show pet
    router.get('/pets/:id', (req, res) => {
      const id = req.params.id
      const pet = this.persistence.getPet(id)
      res.json(pet)
    })
    
    // create pet
    router.post('/pets', (req, res) => {
      const pet = req.body
      const obj = this.persistence.addPet(pet)
      res.json(obj)
    })
    
    // put pet
    router.put('/pets', (req, res) => {
      const updatedAttributes = req.body
      this.persistence.updatePet(updatedAttributes)
      res.json({good: true})
    })
    
    // delete pet
    router.delete('/pets/:id', (req, res) => {
      const id = req.params.id
      const pet = this.persistence.deletePet(id)
      res.json(pet)
    })

    this.express.use('/', router)
  }
}

export default new App().express

import * as express from 'express'
import * as bodyParser from 'body-parser'
import Persistence from './Persistence'
import { Person, Pet } from './Persistence'

class App {
  public express: express
  persistence: Persistence

  constructor () {
    this.express = express()
    this.express.use(bodyParser.urlencoded({ extended: false }))
    this.express.use(bodyParser.json())
    this.persistence = new Persistence()
    this.mountRoutes()
  }

  private mountRoutes (): void {
    const router = express.Router()

    router.get('/', (req: express.Request, res: express.Response) => {
      res.json({ true: true })
    })

    // PEOPLE
    // index people
    router.get('/persons', (req: express.Request, res: express.Response) => {
      const people: Person[] = this.persistence.getPeople()
      res.json(people)
    })

    // show person
    router.get('/persons/:id', (req: express.Request, res: express.Response) => {
      const id: string = req.params.id
      const person: Person = this.persistence.getPerson(id)
      res.json(person)
    })

    // create person
    router.post('/persons', (req: express.Request, res: express.Response) => {
      const person: Person = req.body
      this.persistence.addPerson(person)
      res.sendStatus(201)
    })

    // update person
    router.put('/persons', (req: express.Request, res: express.Response) => {
      const person: Person = req.body
      this.persistence.updatePerson(person)
      res.sendStatus(204)
    })

    // delete person
    router.delete('/persons/:id', (req: express.Request, res: express.Response) => {
      const id: string = req.params.id
      this.persistence.deletePerson(id)
      res.sendStatus(204)
    })

    // PETS
    // index pets
    router.get('/pets', (req: express.Request, res: express.Response) => {
      const pets: Pet[] = this.persistence.getPets()
      res.json(pets)
    })

    // index pets per person
    router.get('/persons/:id/pets', (req: express.Request, res: express.Response) => {
      const id: string = req.params.id
      const pets: Pet[] = this.persistence.getPetsByPersonId(id)
      res.json(pets)
    })

    // show pet
    router.get('/pets/:id', (req: express.Request, res: express.Response) => {
      const id: string = req.params.id
      const pet: Pet = this.persistence.getPet(id)
      res.json(pet)
    })

    // create pet
    router.post('/pets', (req: express.Request, res: express.Response) => {
      const pet: Pet = req.body
      this.persistence.addPet(pet)
      res.sendStatus(201)
    })

    // update pet
    router.put('/pets', (req: express.Request, res: express.Response) => {
      const pet: Pet = req.body
      this.persistence.updatePet(pet)
      res.sendStatus(204)
    })

    // delete pet
    router.delete('/pets/:id', (req: express.Request, res: express.Response) => {
      const id: string = req.params.id
      this.persistence.deletePet(id)
      res.sendStatus(204)
    })

    this.express.use('/', router)
  }
}

export default new App().express

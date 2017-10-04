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

    router.get('/people', (req, res) => {
      res.json(this.persistence.getPeople())
    })

    router.post('/person', (req, res) => {
      const person = req.body
      const people = this.persistence.addPerson(person)
      res.json(people)
    })

    this.express.use('/', router)
  }
}

export default new App().express

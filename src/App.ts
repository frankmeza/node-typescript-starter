import * as express from 'express'
import Persistence from './Persistence'

class App {
  public express
  persistence
  constructor () {
    this.express = express()
    this.persistence = new Persistence()
    
    this.mountRoutes()
  }

  private mountRoutes (): void {
    const router = express.Router()
    router.get('/people', (req, res) => {
      res.json( this.persistence.getPeople())
    })

    this.express.use('/', router)
  }
}

export default new App().express

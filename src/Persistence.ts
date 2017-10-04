class Persistence {
  people
  pets

  constructor() {
    this.getPeople = this.getPeople.bind(this)
    this.addPerson = this.addPerson.bind(this)

    this.people = {
      items: {},
      sort: [],
    }
    this.pets = {
      items: {},
      sort: [],
    }
  }

  getPeople() {
    return this.people
  }

  getPerson(id) {
    return this.people.items[id]
  }

  addPerson(person) {
    const people = this.people
    const peopleObject = { ...people }

    peopleObject.items[person.id] = person
    peopleObject.sort.push(person)
    peopleObject.sort.sort((a, b) => a.id > b.id)
    
    return peopleObject
  }

}

export default Persistence
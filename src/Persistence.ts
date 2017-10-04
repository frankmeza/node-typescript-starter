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

  // return all people
  getPeople() {
    return this.people
  }

  // get person by id
  getPerson(id) {
    return this.people.items[id]
  }

  // add new person
  addPerson(person) {
    // create a new items object
    //  using spread operator to suck in the previous items
    //  and use computed property
    //    to set the new person in by his id
    const peopleItems = { ...this.people.items, [person.id]: person }
    
    // given the new items object
    //  flatten into array of persons
    //  use sort function to sort the array of persons by name
    //  use map to convert sorted array of person into array of id
    //    use this as new sort array
    const peopleArray = Object.keys(peopleItems)
      .map(p => peopleItems[p])
      .sort((a, b) => a.name - b.name)
    
    // given new items object and new sort array
    // construct a new people object
    // set this.people = this new object
    this.people = { items: peopleItems, sort: peopleArray }
    

    // const people = this.people
    // const peopleObject = { ...people }
    
    // peopleObject.items[person.id] = person
    // peopleObject.sort.push(person)
    // peopleObject.sort.sort((a, b) => a.id > b.id)
    
    // return peopleObject
    
    // const people = this.people.sort.reduce((accumulator, p) => (
    //   { ...accumulator, [p.id]: person }
    // ), this.people.items)
    // return people
  }
  
  // delete person by id
  deletePerson(id) {
    const people = this.people
    const peopleObject = { ...people }

    delete peopleObject.items[id]
    peopleObject.sort.filter(person => person.id !== id)
    return peopleObject
  }

}

export default Persistence
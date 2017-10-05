class Persistence {
  people
  pets

  constructor() {
    this.getPeople = this.getPeople.bind(this)
    this.addPerson = this.addPerson.bind(this)
    this.getPerson = this.getPerson.bind(this)
    this.addPet = this.addPet.bind(this)

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
    const people = { ...this.people.items, [person.id]: person }
    const newArray = Object.keys(people)
      .sort()
      .map(p => people[p]['id'])

    this.people = { items: people, sort: newArray }
  }

  // delete existing person
  deletePerson(id) {
    const people = { ...this.people.items }
    const newArray = Object.keys(people)
      .sort()
      .map(person => people[person])
      .filter(person => person.id !== id)
    
    const newItems = newArray.reduce((accumulator, person) => {
      if (person.id !== id) {
        return { ...accumulator, [person.id]: person }
      }
      return accumulator
    }, {})

    const newSort = newArray.map(user => user.id)

    this.people = { items: newItems, sort: newSort }
  }

  // // PETS
  
  getPetsByPersonId(personId) {
    const pets = { ...this.pets.items }
    const petsArray = Object.keys(pets)
      .sort()
      .map(pet => pets[pet])
      .filter(pet => pet.ownerId !== personId)

    return petsArray
  }
  
  addPet(pet) {
    // dealing with this.people stuff

    // instantiate a new person
    const person = this.getPerson(pet['ownerId'])
    
    // update the person with the new pet information
    const updatedPerson = { ...person, pets: [...person.pets, pet.id] }
    
    // instantiate a new people items, and add in the new updated person
    const peopleItems = { ...this.people.items, [person.id]: updatedPerson }
    
    // reassign this.people
    this.people = { items: peopleItems, sort: this.people.sort }

    // dealing with this.pets stuff
    const petItems = { ...this.pets.items, [pet.id]: pet }
    const petArray = Object.keys(petItems)
      .sort()
      .map(p => petItems[p]['id'])

    this.pets = { items: petItems, sort: petArray }
  }
}

export default Persistence
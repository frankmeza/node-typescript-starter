class Persistence {
  people
  pets

  constructor() {
    this.getPeople = this.getPeople.bind(this)
    this.addPerson = this.addPerson.bind(this)
    this.getPerson = this.getPerson.bind(this)
    this.updatePerson = this.updatePerson.bind(this)
    this.deletePerson = this.deletePerson.bind(this)
    
    this.addPet = this.addPet.bind(this)
    this.getPet = this.getPet.bind(this)
    this.getPetsByPersonId = this.getPetsByPersonId.bind(this)
    this.updatePet = this.updatePet.bind(this)
    this.deletePet = this.deletePet.bind(this)

    this.people = {
      items: {},
      sort: [],
    }
    this.pets = {
      items: {},
      sort: [],
    }
  }

  // PEOPLE
  // index
  getPeople() {
    return this.people
  }

  // show
  getPerson(id) {
    return this.people.items[id]
  }

  // create
  addPerson(person) {
    const people = { ...this.people.items, [person.id]: person }
    const newArray = Object.keys(people)
      .sort()
      .map(p => people[p]['id'])

    this.people = { items: people, sort: newArray }
  }

  // update
  updatePerson(id, updatedAttributes) {
    // fetch a copy of the person to be updated
    const person = this.getPerson(id)
    // merge them like nic cage and john travolta in FaceOff
    const updatedPerson = Object.assign({}, person, updatedAttributes)
    // const updatedPerson = Object.assign(person, updatedAttributes) // mutating?
    this.addPerson(updatedPerson)
  }
  
  // delete
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
  
  // PETS

  // index per person
  getPetsByPersonId(personId) {
    const pets = { ...this.pets.items }
    const petsArray = Object.keys(pets)
      .sort()
      .map(pet => pets[pet])
      .filter(pet => pet.ownerId === personId)
    
    return petsArray
  }
  
  // show pet
  getPet(id) {
    return this.pets.items[id]
  }

  // create
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
  
  // update pet
  updatePet(id, updatedAttributes) {
    const pet = this.getPet(id)
    // const updatedPet = Object.assign(pet, updatedAttributes)
    // if owner already has pet with this name 
    //   update it else add it
    const updatedPet = { ...pet, updatedAttributes } // perhaps?
    this.addPet(updatedPet)
  }

  // delete pet
  deletePet(id) {
    const pets = { ...this.pets.items }
    const newArray = Object.keys(pets)
      .sort()
      .map(pet => pets[pet])
      .filter(pet => pet.id !== id)

    const newSort = newArray.map(pet => pet.id)
    const newItems = newArray.reduce((accumulator, pet) => {
      if (pet.id !== id) {
        return { ...accumulator, [pet.id]: pet }
      }
      return accumulator
    }, {})

    this.pets = { items: newItems, sort: newSort }
  }
}

export default Persistence
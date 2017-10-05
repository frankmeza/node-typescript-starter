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
    this.getPets = this.getPets.bind(this)
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
    return this.people.sort.map(id => this.getPerson(id))
  }

  // show person
  getPerson(id) {
    return this.people.items[id]
  }

  // create person
  addPerson(person) {
    const newItems = { ...this.people.items, [person.id]: person }
    const newSort = Object.keys(newItems)
      .sort()
      .map(p => newItems[p]['id'])

    this.people = { items: newItems, sort: newSort }
  }

  // update person
  updatePerson(person) {
    const existingPerson = this.getPerson(person['id'])
    const updatedPerson = { ...existingPerson, ...person }
    this.addPerson(updatedPerson)
  }
  
  // delete person
  deletePerson(id) {
    const newSort = this.people.sort.filter(existingId => existingId !== id)
    const newItems = newSort.map(id => this.people.items[id])
    this.people = { items: newItems, sort: newSort }
  }
  
  // PETS

  // index
  getPets() {
    return this.pets.sort.map(id => this.getPet(id))
  }

  // index per person
  getPetsByPersonId(personId) {
    const person = this.getPerson(personId)
    return person['pets'].map(petId => this.getPet(petId))
  }
  
  // show pet
  getPet(id) {
    return this.pets.items[id]
  }

  // create pet
  addPet(pet) {
    // dealing with this.people stuff
    const person = this.getPerson(pet['ownerId'])
    const updatedPerson = { ...person, pets: [...person.pets, pet.id] }
    const newItems = { ...this.people.items, [person.id]: updatedPerson }
    this.people = { items: newItems, sort: this.people.sort }
    
    // dealing with this.pets stuff
    const petItems = { ...this.pets.items, [pet.id]: pet }
    const petArray = Object.keys(petItems)
      .sort()
      .map(p => petItems[p]['id'])
    
    this.pets = { items: petItems, sort: petArray }
  }
  
  // update pet
  updatePet(pet) {
    const currentPet = this.getPet(pet['id'])
    const updatedPet = { ...currentPet, ...pet }
    this.addPet(updatedPet)
  }
  
  // delete pet
  deletePet(id) {
    // dealing with this.people stuff
    const pet = this.getPet(id)
    const person = this.getPerson(pet['ownerId'])
    const updatedPersonPets = person.pets.filter(pet => pet.id !== id)
    const newPerson = { ...person, pets: updatedPersonPets }
    this.updatePerson(newPerson)

    // dealing with this.pets stuff
    const newSort = this.pets.sort.map(existingId => existingId !== id)
    const newItems = newSort.map(id => this.getPet(id))
    this.pets = { items: newItems, sort: newSort }
  }
}

export default Persistence
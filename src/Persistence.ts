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
    // todo - return an array of [ {person}, {person}, {person} .... ] sorted by people.sort
    return this.people
  }

  // show
  getPerson(id) {
    return this.people.items[id]
  }

  // create
  addPerson(person) {
    const newItems = { ...this.people.items, [person.id]: person }
    const newSort = Object.keys(newItems)
      .sort()
      .map(p => newItems[p]['id'])

    this.people = { items: newItems, sort: newSort }
  }

  // update
  // todo - rename updatedAttributes -> person
  updatePerson(updatedAttributes) {
    const person = this.getPerson(updatedAttributes['id'])
    const updatedPerson = { ...person, ...updatedAttributes }
    this.addPerson(updatedPerson)
  }
  
  // delete
  deletePerson(id) {
    // todo - rename people -> newItems
    const people = { ...this.people.items }
    // todo - rename newArray -> newSort
    const newArray = Object.keys(people)
      .sort()
      // todo - rename this to personId or something
      .map(person => people[person])
      .filter(person => person.id !== id)

    const newItems = newArray.reduce((accumulator, person) => {
      if (person.id !== id) {
        return { ...accumulator, [person.id]: person }
      }
      return accumulator
    }, {})
    

    const newSort = newArray.map(user => user.id)
    
    // alternative:
    // const newSort = this.people.sort.filter( existingId => existingId != id )
    // const newItems = newSort.map( id => this.people.items[id] )

    this.people = { items: newItems, sort: newSort }
  }
  
  // PETS

  // index
  getPets() {
    // todo - return [ {pet}, {pet}, ...]
    return this.pets.items
  }

  // index per person
  getPetsByPersonId(personId) {
    const pets = { ...this.pets.items }
    const petsArray = Object.keys(pets)
      .sort()
      .map(pet => pets[pet])
      .filter(pet => pet.ownerId === personId)
    
    // get the person using getPerson(personId)
    // map over person.pets -> turn into real pets

    return petsArray
  }
  
  // show pet
  getPet(id) {
    return this.pets.items[id]
  }

  // create
  addPet(pet) {
    // dealing with this.people stuff
    const person = this.getPerson(pet['ownerId'])
    const updatedPerson = { ...person, pets: [...person.pets, pet.id] }
    const peopleItems = { ...this.people.items, [person.id]: updatedPerson }
    this.people = { items: peopleItems, sort: this.people.sort }
    
    // dealing with this.pets stuff
    const petItems = { ...this.pets.items, [pet.id]: pet }
    const petArray = Object.keys(petItems)
    .sort()
    .map(p => petItems[p]['id'])
    
    this.pets = { items: petItems, sort: petArray }
  }
  
  // update pet
  // todo - rename
  updatePet(updatedAttributes) {
    const pet = this.getPet(updatedAttributes['id'])
    const updatedPet = { ...pet, ...updatedAttributes }
    this.addPet(updatedPet)
  }
  
  // delete pet
  deletePet(id) {
    // dealing with this.people stuff
    const pet = this.getPet(id)
    // find the id of the associated person
    // get the person object using existing function by person id
    const person = this.getPerson(pet['ownerId'])
    // get a reference to the array of pets from the person
    // use filter to create shortened list of pet ids, 
    //  where the function returns false on the deleted pet's id
    const updatedPersonPets = person.pets.filter(pet => pet.id === id)
    // create updated person object using spread operator, but
    //   inject the shortened list of pet ids
    const newPerson = { ...person, pets: updatedPersonPets }
    // call existing updatePerson function with the newly created updated person
    this.updatePerson(newPerson)

    // dealing with this.pets stuff
    // todo - see person delete for simplification
    const pets = { ...this.pets.items }
    const newArray = Object.keys(pets)
    .sort()
    .map(pet => pets[pet])
    .filter(pet => pet.id === id)
    
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
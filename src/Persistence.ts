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
      .sort()
      .map(p => peopleItems[p]['id'])
    
    // given new items object and new sort array
    // construct a new people object
    // set this.people = this new object
    this.people = { items: peopleItems, sort: peopleArray }
  }

  // // PETS
  
  getPetsByPersonId(id) {
    return this.people.items[id]['pets']
  }
  
  addPet(pet) {
    // instantiate a new person
    const person = this.getPerson(pet['ownerId'])
    // update the person with the new pet information
    const updatedPerson = { ...person, pets: [ ...person.pets, pet.id ] }
    // instantiate a new people items, and add in the new updated person
    const peopleItems = { ...this.people.items, [person.id]: updatedPerson }
    // reassign this.people
    this.people = { items: peopleItems, sort: this.people.sort }
  }

  // delete person by id
  // deletePerson(id) {
  //   const people = this.people
  //   const peopleObject = { ...people }

  //   delete peopleObject.items[id]
  //   peopleObject.sort.filter(person => person.id !== id)
  //   return peopleObject
  // }

}

export default Persistence
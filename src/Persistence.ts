interface CollectionItems<T> {
  [key: string]: T
}

interface Collection<T> {
  items: CollectionItems<T>
  sort: string[]
}

export interface Person {
  id: string
  name: string
  pets: string[]
}

interface PeopleItems extends CollectionItems<Person> {}
export interface People extends Collection<Person> {}

export interface Pet {
  id: string
  name: string
  ownerId: string
}

interface PetItems extends CollectionItems<Pet> {}
export interface Pets extends Collection<Pet> {}

class Persistence {
  people: People
  pets: Pets

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

    // generic functions
    this.get = this.get.bind(this)
    this.getIndex = this.getIndex.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)

    this.people = {
      items: {},
      sort: [],
    }

    this.pets = {
      items: {},
      sort: [],
    }
  }

  // GENERIC FUNCTIONS
  // show
  get<T>(key: string, id: string): T {
    return this[key].items[id]
  }

  // index
  getIndex<T>(key: string): T[] {
    return this[key].sort.map(id => this.get<T>(key, id))
  }

  // create
  add<T>(key: string, type: T): void {
    const id: string = type['id']
    const newItems: CollectionItems<T> = { ...this[key].items, [id]: type }
    const newSort: string[] = Object.keys(newItems)
      .sort()
      .map(type => newItems[type]['id'])

    this[key] = { items: newItems, sort: newSort }
  }

  // update
  update<T>(key: string, type: T){
    const id: string = type['id']
    const instance: T = this.get<T>(key, id)
    const updatedInstance: T = { ...instance, ...type }

    this.add<T>(key, updatedInstance)
  }

  delete<T>(key: string, id: string): void {
    const newSort: string[] = this[key].sort.filter(existingId => existingId !== id)

    const newItems: CollectionItems<T> = newSort
      .map(id => this[key].items[id])
      .reduce((acc, type) => ({ ...acc, [type.id]: type }), {})

    this[key] = { items: newItems, sort: newSort }
  }

  // PEOPLE
  // index
  getPeople(): Person[] {
    return this.getIndex<Person>('people')
  }

  // show person
  getPerson(id: string): Person {
    return this.get<Person>('people', id)
  }

  // create person
  addPerson(person: Person): void {
    this.add<Person>('people', person)
  }

  // update person
  updatePerson(person: Person): void {
    this.update<Person>('people', person)
  }

  // delete person
  deletePerson(id: string): void {
    this.delete<Person>('people', id)
  }

  // PETS

  // index
  getPets(): Pet[] {
    return this.getIndex<Pet>('pets')
  }

  // index per person
  getPetsByPersonId(personId: string): Pet[] {
    const person: Person = this.getPerson(personId)
    return person['pets'].map(petId => this.getPet(petId))
  }

  // show pet
  getPet(id: string): Pet {
    return this.get<Pet>('pets', id)
  }

  // create pet
  addPet(pet: Pet): void {
    // dealing with this.people stuff
    const person: Person = this.getPerson(pet['ownerId'])
    // check if pet id is already in person.pets to avoid duplicates
    const existingPet = person.pets.find(p => p === pet.id)
    const petIds: string[] = existingPet ? [...person.pets] : [...person.pets, pet.id]
    
    const updatedPerson: Person = { ...person, pets: petIds }
    const newItems: PeopleItems = { ...this.people.items, [person.id]: updatedPerson }
    
    this.people = { items: newItems, sort: this.people.sort }
    
    // dealing with this.pets stuff
    this.add<Pet>('pets', pet)
  }

  // update pet
  updatePet(pet: Pet): void {
    this.update<Pet>('pets', pet)
  }

  // delete pet
  deletePet(id: string): void {
    // dealing with this.people stuff
    const pet: Pet = this.getPet(id)
    const person: Person = this.getPerson(pet['ownerId'])
    const updatedPetIds: string[] = person.pets.filter(petId => petId !== id)
    const newPerson: Person = { ...person, pets: updatedPetIds }
    this.updatePerson(newPerson)
    
    // dealing with this.pets stuff
    this.delete<Pet>('pets', id)
  }
}

export default Persistence
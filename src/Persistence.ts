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
    this.add<T>(key, instance)
  }

  // PEOPLE
  // index
  getPeople(): Person[] {
    return this.people.sort.map(id => this.getPerson(id))
  }

  // show person
  getPerson(id: string): Person {
    return this.people.items[id]
  }

  // create person
  addPerson(person: Person): void {
    const newItems: PeopleItems = { ...this.people.items, [person.id]: person }
    const newSort: string[] = Object.keys(newItems)
      .sort()
      .map(p => newItems[p]['id'])

    this.people = { items: newItems, sort: newSort }
  }

  // update person
  updatePerson(person: Person): void {
    const existingPerson: Person = this.getPerson(person['id'])
    const updatedPerson: Person = { ...existingPerson, ...person }

    this.addPerson(updatedPerson)
  }

  // delete person
  deletePerson(id: string): void {
    const newSort: string[] = this.people.sort.filter(existingId => existingId !== id)

    const newItems: PeopleItems = newSort
      .map(id => this.people.items[id])
      .reduce((acc, person) => ({ ...acc, [person.id]: person }), {})

    this.people = { items: newItems, sort: newSort }
  }

  // PETS

  // index
  getPets(): Pet[] {
    return this.pets.sort.map(id => this.getPet(id))
  }

  // index per person
  getPetsByPersonId(personId: string): Pet[] {
    const person: Person = this.getPerson(personId)
    return person['pets'].map(petId => this.getPet(petId))
  }

  // show pet
  getPet(id: string): Pet {
    return this.pets.items[id]
  }

  // create pet
  addPet(pet: Pet): string[] {
    // dealing with this.people stuff
    const person: Person = this.getPerson(pet['ownerId'])
    // check if pet id is already in person.pets to avoid duplicates
    const existingPet = person.pets.find(p => p === pet.id)
    const petIds: string[] = existingPet ? [...person.pets] : [...person.pets, pet.id]

    const updatedPerson: Person = { ...person, pets: petIds }
    const newItems: PeopleItems = { ...this.people.items, [person.id]: updatedPerson }

    this.people = { items: newItems, sort: this.people.sort }

    // dealing with this.pets stuff
    const newPetItems: PetItems = { ...this.pets.items, [pet.id]: pet }
    const newPetSort: string[] = Object.keys(newPetItems)
      .sort()
      .map(p => newPetItems[p]['id'])

    this.pets = { items: newPetItems, sort: newPetSort }
    return petIds
  }

  // update pet
  updatePet(pet: Pet): void {
    const currentPet: Pet = this.getPet(pet['id'])
    const updatedPet: Pet = { ...currentPet, ...pet }
    this.addPet(updatedPet)
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
    const newSort: string[] = this.pets.sort.filter(existingId => existingId !== id)
    const newItems: PetItems = newSort
      .map(id => this.getPet(id))
      .reduce((acc, pet) => ({ ...acc, [pet.id]: pet}), {})
    this.pets = { items: newItems, sort: newSort }
  }
}

export default Persistence
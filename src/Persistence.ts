interface CollectionItems<T> {
  [key: string]: T
}

interface Collection<T> {
  items: CollectionItems<T>
  sort: string[]
}

interface Entity {
  id: string
  name: string
}

export interface Person extends Entity {
  pets: string[]
}

interface PeopleItems extends CollectionItems<Person> {}
export interface People extends Collection<Person> {}

export interface Pet extends Entity {
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

  // index
  getIndex<T extends Entity, C extends Collection<T>>(collection: C): T[] {
    return collection.sort.map(id => collection.items[id])
  }

  // create
  add<T extends Entity, C extends Collection<T>>(collection: C, entity: T): Collection<T> {
    const id: string = entity.id
    const newItems: CollectionItems<T> = { ...collection.items, [id]: entity }
    const newSort: string[] = Object.keys(newItems)
      .sort()
      .map(type => newItems[type]['id'])

    return { items: newItems, sort: newSort }
  }

  // update
  update<T extends Entity, C extends Collection<T>>(collection: C, entity: T): Collection<T> {
    const id: string = entity.id
    const existingEntity: T = collection.items[id]
    // const updatedInstance: T = { ...existingEntity, ...entity }
    const updatedInstance: T = Object.assign({}, existingEntity, entity)

    return this.add<T, C>(collection, updatedInstance)
  }

  delete<T extends Entity, C extends Collection<T>>(collection: C, id: string): Collection<T> {
    const newSort: string[] = collection.sort.filter(existingId => existingId !== id)

    const newItems: CollectionItems<T> = newSort
      .map(id => collection.items[id])
      .reduce((acc, type) => ({ ...acc, [type.id]: type }), {})

    return { items: newItems, sort: newSort }
  }

  // PEOPLE
  // index
  getPeople(): Person[] {
    return this.getIndex<Person, Collection<Person>>(this.people)
  }

  // show person
  getPerson(id: string): Person {
    return this.people.items[id]
  }

  // create person
  addPerson(person: Person): void {
    this.people = this.add<Person, Collection<Person>>(this.people, person)
  }

  // update person
  updatePerson(person: Person): void {
    this.people = this.update<Person, Collection<Person>>(this.people, person)
  }

  // delete person
  deletePerson(id: string): void {
    this.people = this.delete<Person, Collection<Person>>(this.people, id)
  }

  // PETS

  // index
  getPets(): Pet[] {
    return this.getIndex<Pet, Collection<Pet>>(this.pets)
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
    this.pets = this.add<Pet, Collection<Pet>>(this.pets, pet)
  }

  // update pet
  updatePet(pet: Pet): void {
    this.update<Pet, Collection<Pet>>(this.pets, pet)
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
    this.pets = this.delete<Pet, Collection<Pet>>(this.pets, id)
  }
}

export default Persistence
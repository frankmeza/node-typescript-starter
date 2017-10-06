## Adventures in functional programming

### Easy test path

I use Postman to make this easier, and faster.

#### initial people index is empty
```
GET http://localhost:3000/persons

// returns response with status 200:
[]
```

#### create a person
```
POST http://localhost:3000/persons

// with params:
{
  "id": "1",
  "name": "Frank",
  "pets": []   
}

// returns status 201.
```

#### now the index is an array of person objects
```
GET http://localhost:3000/persons

// returns response with status 200:
[
  {
    "id": "1",
    "name": "Frank",
    "pets": []
  }
]
```

#### update a person
```
PUT http://localhost:3000/persons

// with params:
{
  "id": "1",
  "name": "Fraaaaank"
}

// returns status 204.
```

#### show a person
```
GET http://localhost:3000/persons/1

// returns response with status 200:
{
  "id": "1",
  "name": "Fraaaaank",
  "pets": []
}
```

You will also see the changes from the update above.
The index path can be hit again at this point to check for the changes, as well.

#### create a pet
```
POST http://localhost:3000/pets

// with params:
{
	"id": "1",
	"name": "bonobo",
	"ownerId": "1"
}

// returns status 201.
```

#### show a pet
```
GET http:localhost:3000/pets/1

// returns response with status 200:
{
  "id": "1",
  "name": "bonobo",
  "ownerId": "1"
}
```

#### see the pet id on a person show route, as well
```
GET http://localhost:3000/persons/1

// returns response with status 200:
{
  "id": "1",
  "name": "Fraaaaank",
  "pets": [
    "1"      // <- this is bonobo's id
  ]
}
```

#### update a pet
```
PUT http://localhost:3000/pets
// with params:
{
	"id": "1",
	"name": "zonobo",
	"ownerId": "1"
}

// returns status 204.
```

You can also hit the person show route to check that there is no change to the person's pet id array.

#### delete a pet ;(
```
DELETE http://localhost:3000/pets/1

// returns status 204.
```

#### finally, delete a person
```
DELETE http:localhost:3000/persons/1

// returns status 204.
```

#### and once again, the person index is empty 
```
GET http://localhost:3000/persons

// returns response with status 200:
[]
```

![the circle of life](http://www.cornel1801.com/disney/Lion-King-Circle-of-Life/on-the-path-unwinding-in-the-circle-of-life.jpg "The Circle of Life")

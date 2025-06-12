import { useState } from 'react'
import { Filter, Numbers, PersonForm } from './components'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [newPersons, setNewPersons] = useState(persons)

  const addPerson = (event) => {
    event.preventDefault()
    console.log(event.target.value);
    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    }
    console.log(personObject);
    
    // Checking if the person is already in the system
    const exists = persons.some(person => person.name === personObject.name || person.number === personObject.number)
    console.log(persons);
    
    if (exists) {
      window.alert('Some of your input information is already in the system. Try again');
    } else {
      setPersons(persons.concat(personObject))
      setNewPersons(persons.concat(personObject))
      setNewName('')
      setNewNumber('')
    }
    console.log(persons)
  } 

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    const filterValue = event.target.value
    setNewFilter(filterValue)
    const newList = persons.filter(person => person.name.toLowerCase().includes(filterValue.toLowerCase()))
    setNewPersons(newList)
    
  }

  return (
    <div>
      <h2>Numberbook</h2>
      <Filter value={newFilter} onChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm onSubmit={addPerson} newName={newName} handleNameChange={handlePersonChange}
      newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Numbers newPersons={newPersons} />
    </div>
  )
}

export default App
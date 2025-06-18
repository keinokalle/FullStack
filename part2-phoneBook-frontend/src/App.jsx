import { useState, useEffect } from 'react'
import axios from 'axios'
import { Filter, Numbers, PersonForm, Notification } from './components'
import serverService from './services/calls'
import { v4 as uuidv4 } from 'uuid'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notification, newNotification] =useState(null)

  // Fetching data from the server
  useEffect(() => {
    console.log('effect')
    serverService
      .getAll()
      .then(data => {
        console.log('promise fulfilled')
        console.log(data);
        setPersons(data)
      })
  }, [])


  console.log('this is persons');
  console.log(persons);
  
  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  )

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
      id: uuidv4(),
    }
    
    // Checking if the person is already in the system
    const existingPerson = persons.find(p => p.name === newName)
    const exists = Boolean(existingPerson)

    console.log('here comes the existing one');
    console.log(existingPerson);
    
    
    
    if (exists) {
      if(window.confirm(`${personObject.name} is already added to phoneBook, replace the old number with a new one?`)){
        serverService
        .update(existingPerson.id, personObject).then(newOne => {
          setPersons(persons.map(p => p.id === existingPerson.id ? newOne : p))
        })
        .catch(error => {
          console.log("Catched but what now")
          newNotification({message: `The person '${personObject.name}' was already deleted from server`, good: false})
          setPersons(persons.filter(p => p.id !== existingPerson.id))
        })
        setTimeout(() => {
          newNotification(null) },
        4000)
      }
    } else {
      setPersons(persons.concat(personObject))
      
      // Adding them to server (ex. 2.12.)new
      serverService
        .create(personObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson))
      })
      // Setting the text fields back to empty
      setNewName('')
      setNewNumber('')
    }
    // Notification for the successfull addition
    newNotification({message: `Added ${personObject.name}`, good: true})
    setTimeout(() => {
      newNotification(null)
    }, 4000)
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
  }

  const deletePerson = (id) => {
    // event.preventDefault()
    const person = persons.find(p => p.id === id)
    
    if(window.confirm(`Delete ${person.name}?`)) {
      serverService
      .deletePerson(id).then((response) => {
        setPersons(persons.filter(p => p.id !== id))
      })
    }
  }

  return (
    <div>
      <h2>Numberbook</h2>
      <Notification message={notification?.message} good={notification?.good} />
      <Filter value={newFilter} onChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm onSubmit={addPerson} newName={newName} handleNameChange={handlePersonChange}
      newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Numbers newPersons={filteredPersons} deletePerson={deletePerson} />
    </div>
  )
}

export default App
export const Numbers = ({newPersons, deletePerson}) => {
  return(
    <div>
      {newPersons.map(person =>
      <p key={person.id}>{person.name} {person.number}
      <button onClick={() => deletePerson(person.id)}>delete</button>
      </p> 
      )}
    </div>
  )
}
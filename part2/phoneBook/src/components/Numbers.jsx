export const Numbers = ({newPersons}) => {
  return(
    <div>
      {newPersons.map(person =>
      <p key={person.name}>{person.name} {person.number}</p>
      )}
    </div>
  )
}
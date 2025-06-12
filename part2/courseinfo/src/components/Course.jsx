const Header = ({course}) => <h3>{course.name}</h3>

const Content = ({parts}) => {
  return(
    <div>
      {parts.map(part => 
        <Part name={part.name} exercises={part.exercises} key={part.id}/>
      )}
    </div>
  )
}

const Part = ({name, exercises, id}) => {  
  return(
    <p>
      {name} {exercises}
    </p>
  )
}

const Sum = ({course}) => {
  const total = course.parts.reduce((sum, part) => sum + part.exercises, 0)
  
  return(
    <p><b>
      total of {total} exercises
    </b></p>
  )
}

const Course = ({course}) => {
  return(
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Sum course={course} />
    </div>
  )
}

export default Course
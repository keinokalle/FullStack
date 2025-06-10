import { useState } from 'react'

const App = () => {
  const [ counter, setCounter ] = useState(0)
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  setTimeout(() => {
    () => setCounter(counter + 1)
  }, 1000);

  return (
    <div>
      <h1>Counter {counter}</h1>
      <Header course={course} />
      <Content parts={course} />
      <Total parts={course} />
    </div>
  )
}

export default App

const Header = ({ course }) => <h1>{course.name}</h1>


const Content = ({ parts }) => {
  console.log(parts);
  return (
    <div>
      <Part part={parts.parts[0].name} exercises={parts.parts[0].exercises} />
      <Part part={parts.parts[1].name} exercises={parts.parts[1].exercises} />
      <Part part={parts.parts[2].name} exercises={parts.parts[2].exercises} />
    </div>
  )
}

const Total = ({ parts }) => {
  console.log(parts);
  <p>
    Number of exercises {parts.parts[0].exercises + parts.parts[1].exercises + parts.parts[2].exercises}
  </p>
}

const Part = ({ part, exercises }) => {
  console.log(part, exercises);
  return (
    <p>
      {part} {exercises}
    </p>
  )
}

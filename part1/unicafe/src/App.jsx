import { useState } from 'react'

const Button = ({ onClick, text}) => {
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}

const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td> {text} </td>
      <td> {value} </td> 
    </tr>
  )
}
const Statistics = ({ good, neutral, bad, all, average, positive }) => {
  if (all === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }

  return (
    <div>
      <table>
      <StatisticLine text='good' value={good} />
      <StatisticLine text='neutral' value={neutral} />
      <StatisticLine text='bad' value={bad} />
      <StatisticLine text='all' value={all} />
      <StatisticLine text='average' value={average.toFixed(2)} />
      <StatisticLine text='positive' value={`${positive.toFixed(2)} %`} />
      </table>
    </div>
  )
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)


  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)

  const onGoodClick = () => {
    setGood(good + 1)
    onCliks()
  }
  const onNeutralClick = () => {
    setNeutral(neutral + 1)
    onCliks()
  }
  const onBadClick = () => {
    setBad(bad + 1)
    onCliks()
  }

  const onCliks = () => {
    setAll(all + 1)
    setAverage((good + 1 - bad) / (all + 1))
    setPositive(((good + 1) / (all + 1)) * 100)
  }

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button onClick={onGoodClick} text='good' />
      <Button onClick={onNeutralClick} text='neutral' />
      <Button onClick={onBadClick} text='bad' />
      <h2>Statistics</h2>
      <Statistics 
        good={good} 
        neutral={neutral} 
        bad={bad} 
        all={all} 
        average={average} 
        positive={positive}
      />
    </div>
  )
}

export default App
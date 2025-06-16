import { useState, useEffect } from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const Form = ({newInput, handleChange}) => {
  return(
    <div>
      find countries <input value={newInput} onChange={handleChange}/>
    </div>
  
  ) 
}

const CountryField = ({countries, query, handleShow, weather}) => {
  const len = countries.length
  console.log(countries);

  if(!query){
    return(
      <div></div>
    )
  } else if(len > 10){
    return(
      <div>
        Too many matches, specify another filter
      </div>
    )
  } else if(len !== 1) {
    return(
      <div>
        {countries.map(c => 
        <div key={c.name.official}>
          <p>{c.name.common}<button onClick={() => handleShow(c)}type="button">Show</button></p> 
        </div>
        )}
      </div>
    )
  } else if(len === 1){
    const country = countries[0]
    
    return(
      <div>
        <h1>{country.name.common}</h1>
        <p>Capital {country.capital}</p>
        <p>Area {country.area}</p>
        <h2>Languages</h2>
        <ul>
          {Object.values(country.languages).map((l, idx) => (
            <li key={idx}>{l}</li>
          ))}
        </ul>
        <img src={country.flags.png} alt={country.flags.alt} />
        <h2>Weather in {country.capital}</h2>
        {weather ? (
        <div>
          <p>Temperature: {Math.round(weather.main.temp -273.15)} °C</p>
          <img 
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
            alt={weather.weather[0].description} 
          />
          <p>Wind: {Math.round(weather.wind.speed)} m/s</p>
        </div>
        ) : (
          <p>Loading weather...</p>
        )}
      </div>
    )
  }
  return(<div></div>)
}


const App = () => {
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [filtered, setFiltered] = useState([])
  const [query, setQuery] = useState('')
  const [weather, setWeather] = useState(null)

  useEffect(()=> {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  useEffect(() => {
    const result = countries.filter(c => 
      c.name.common.toLowerCase().includes(query.toLowerCase())
    )
    setFiltered(result)
    if(result.length === 1){
      if (!selectedCountry || selectedCountry.name.common !== result[0].name.common) {
        setSelectedCountry(result[0]);
      }
    } else {
      setSelectedCountry(null)
    }
  }, [countries, query])

  useEffect(() => {
    if(!selectedCountry) return;
    console.log('get weather data');
    console.log(selectedCountry)
    const apiKey = import.meta.env.VITE_SOME_KEY
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${selectedCountry.capitalInfo.latlng[0]}&lon=${selectedCountry.capitalInfo.latlng[1]}&appid=${apiKey}`)
      .then(response => setWeather(response.data));
    console.log(weather);
  }, [selectedCountry])

  const handleChange = (event) => {
    setQuery(event.target.value)
  }

  const handleShow = (c) => {
    setFiltered([c])
  }

  return (
    <div>
      <Form newInput={query} handleChange={handleChange}/>
      <CountryField countries={filtered} query={query} 
      handleShow={handleShow} weather={weather}/>
    </div>
  )
}

export default App
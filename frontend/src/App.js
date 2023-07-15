import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import React from 'react'
import { URL } from './utils/config';

function App() {

  const [city, getcity] = React.useState([])
  const [landmark, setlandmark] = React.useState([])

  const [cityname, setcityname] = React.useState("")

  const [fullData, setfullData] = React.useState([])


  const getCity = async () => {
    const { data } = await axios.get(`${URL}/city`)
    console.log(data)
    getcity(data.data)
  }


  const changeDW = async (name) => {
    setcityname(name)
    const { data } = await axios.get(`${URL}/city/${name}`)
    setlandmark(data.data)
    console.log("landmark", data.data)
  }

  const getFullDetail = async (landmark) => {
    const { data } = await axios.post(`${URL}/city`, {
      "city_name": cityname,
      "land_mark": landmark
    })
    setfullData(data.data)
    console.log("landmark", data.data)
  }

  React.useEffect(() => {
    getCity()
  }, [])


  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h1>Find stores in your city </h1>

        <select class="classic" onChange={(e) => changeDW(e.target.value)}>
          {city.map((d, i) => {
            return (
              <option value={d.name}>{d.name}</option>
            )
          })}

        </select>

        <br /><br />
        {landmark.length != 0 && <> <h1>Select your store</h1>
          <select class="round" onChange={(e) => getFullDetail(e.target.value)}>
            {landmark[0].location.length != 0 && landmark[0].location.map((d, i) => {
              return (
                <option value={d.address}>{d.address}</option>
              )
            })}
          </select>
        </>}


        {
          fullData.length != 0 &&
          <div style={{ marginTop: 20 }}>
            <p style={{ marginTop: 10 }}>landmark: {fullData[0].address.landmark}</p>
            <p style={{ marginTop: 10 }}>address: {fullData[0].address.address}</p>
            <p style={{ marginTop: 10 }}>timing: {fullData[0].address.time}</p>

          </div>
        }


      </header>
    </div>
  );
}

export default App;

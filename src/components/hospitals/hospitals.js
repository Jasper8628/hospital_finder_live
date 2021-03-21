import React, { useEffect, useState } from 'react'
import axios from 'axios';
import WaitTime from '../waittime/waitTime'
import { useAppContext } from '../../utils/global';
import './styles.css';

function Hospitals() {
  const url = process.env.REACT_APP_HOSPITALS_URL;
  const [hospitals, setHospitals] = useState([]);
  const [global, dispatch] = useAppContext();

  useEffect(() => {
    axios.get(url)
      .then(res => {
        const waitList = res.data._embedded.hospitals
        axios.get(url + '&page=1')
          .then(result => {
            const sortedHospitals = waitList.concat(result.data._embedded.hospitals)
              // sorting by calculated wait time based on the painLevel value in the global state
              .sort((a, b) => {
                return a.waitingList[global.painLevel].patientCount * a.waitingList[global.painLevel].averageProcessTime
                  - b.waitingList[global.painLevel].patientCount * b.waitingList[global.painLevel].averageProcessTime
              });
            setHospitals(sortedHospitals)
          })
      });
  }, [global.painLevel]);

  const handleClick = (e) => {
    const windowSize = window.innerWidth;
    const direction = {
      lat: parseFloat(e.target.getAttribute('data-lat')),
      lng: parseFloat(e.target.getAttribute('data-lng')),
    };
    console.log('logging desination:', direction)
    console.log('clicked: ', e.target.classList)
    dispatch({
      type: 'direction',
      destination: direction,
      mobileMap: windowSize <= 1000 ? true : false,
    });
  };

  const handleTab = (e) => {
    const name = e.target.getAttribute('name');
    dispatch({
      type: 'switchTab',
      tabName: global.openTab === name ? 'illness' : name
    });
  }

  const calDistance = (a, b) => {
    const x = (a.lat - b.lat) * 111263.0566;
    const y = (a.lng - b.lng) * 111263.0566;
    const distance = Math.round(Math.sqrt(x * x + y * y) / 100) / 10;
    return distance;

  }

  return (
    <div
      className={global.openTab === 'hospital' ? 'accordian-container active' : 'accordian-container'}>
      <div className='accordian-header' onClick={handleTab} name='hospital'>
        <h1>Suggested Hospitals</h1>
        {/* <h3>{`pain level: ${global.painLevel}`}</h3> */}

      </div>
      <div className='accordian-body' >
        {hospitals.map((hospital, index) =>
          <button className='list-button' key={index} data-lat={hospital.location.lat} data-lng={hospital.location.lng} onClick={handleClick} >
            <h3>{hospital.name}</h3>
            <div className='note-container'>
              <span>Distance: {calDistance(hospital.location, global.location)} kms</span>
              <WaitTime painLevel={global.painLevel} hospital={hospital} />
            </div>
          </button>
        )}

      </div>

    </div>

  )
}

export default Hospitals

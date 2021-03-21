import React, { useEffect, useState } from 'react'
import Ills from '../../components/illnesses'
import Hospitals from '../../components/hospitals'
import GoogleMaps from '../../components/googleMap';
import Slider from '../../components/slider';
import { useAppContext } from '../../utils/global';
import './home.css';

function Home() {

  useEffect(() => { loadGeo(); }, []);
  const [global, dispatch] = useAppContext();

  const loadGeo = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        dispatch({ type: 'location', location: { lat, lng } });
      }, function error(msg) { alert('Please enable your GPS position feature.'); },
        { maximumAge: 10000, timeout: 5000, enableHighAccuracy: true });
    } else {
      console.log("Geolocation privilege denied");
    }
  };

  return (
    <div className='home-container'>
      <div className={global.mobileMap ? 'left-container-mobile' : 'left-container'} >
        <Ills />
        <Hospitals />
        <Slider />

      </div>
      <GoogleMaps />

    </div>

  )
}

export default Home

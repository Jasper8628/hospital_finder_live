/* global google */
import React, { useState, useEffect, useMemo, memo } from 'react'
import { useAppContext } from '../../utils/global';
import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker, Circle, DirectionsRenderer } from "react-google-maps";
import Geocode from "react-geocode";
import WaitTime from '../waittime/waitTime';
// import mapStyle from "../assets/mapStyle";
// import { useCountContext } from "../utils/GlobalState";
import axios from 'axios';
const api = process.env.REACT_APP_GOOGLEMAP_API_KEY;
Geocode.setApiKey(api);
Geocode.enableDebug();

const GoogleMaps = () => {

  // const [state, dispatch] = useCountContext();
  const [hospitals, setHospitals] = useState([])
  const [global, dispatch] = useAppContext();
  const [directions, setDirection] = useState({})
  const [mapPosition, setMapPosition] = useState({
    lat: "",
    lng: ""
  });
  const directionsService = new google.maps.DirectionsService();
  useEffect(() => {
    loadGeo();
  }, [])
  useEffect(() => {
    loadHospitals();
  }, [global.painLevel])
  useEffect(() => {
    const destination = global.destination;
    const origin = global.location;
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          console.log('logging direction result: ', result)
          setDirection(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  }, [global.destination]);



  const loadHospitals = () => {
    const url = process.env.REACT_APP_HOSPITALS_URL;
    axios.get(url)
      .then(res => setHospitals(res.data._embedded.hospitals))
  }
  const loadGeo = () => {
    let lat = '';
    let lng = '';
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        setMapPosition({ lat: lat, lng: lng });
        Geocode.fromLatLng(lat, lng)
          .then(res => { })
      }, function error(msg) { alert('Please enable your GPS position feature.'); },
        { maximumAge: 10000, timeout: 5000, enableHighAccuracy: true });
    } else {
      console.log("Geolocation privilege denied");
    }
  }
  const onMarkerDragEnd = (event) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    setMapPosition({
      lat: newLat,
      lng: newLng
    });
    console.log(newLat, newLng);
    Geocode.fromLatLng(newLat, newLng)
      .then(res => {
        dispatch({ type: 'location', location: { lat: newLat, lng: newLng } });
        // const postcode = res.results[0].address_components[6].long_name;
      })
  }
  const handleClose = (e) => {
    dispatch({ type: 'closeMap' });
    console.log(e.target)
  }
  const Map = memo(() => {
    const [selectedHospital, setSelectedHospital] = useState({});
    return (
      <div>
        <GoogleMap
          defaultZoom={11}
          defaultCenter={{
            lat: mapPosition.lat,
            lng: mapPosition.lng
          }}
          defaultOptions={{
            disableDefaultUI: true,
            controlSize: 21,
          }}

        >
          <DirectionsRenderer directions={directions} />
          <Marker
            name={"You're here"}
            draggable={true}
            onDragEnd={onMarkerDragEnd}
            position={{
              lat: mapPosition.lat,
              lng: mapPosition.lng
            }
            }
            options={{ strokeColor: "#FFD300" }}
          />
          {hospitals ?
            (hospitals.map(hospital => (
              <Marker
                key={hospital.id}
                position={{ lat: hospital.location.lat, lng: hospital.location.lng }}
                onClick={() => {
                  setSelectedHospital(hospital);
                }}
              >
                {selectedHospital && selectedHospital.id === hospital.id && (
                  <InfoWindow
                    onCloseClick={() => {
                      setSelectedHospital(null)
                    }}>
                    <div className="infoWindow">
                      <p>{selectedHospital.name}</p>
                      <p>Position in queue: {selectedHospital.waitingList[global.painLevel].patientCount} </p>
                      <WaitTime painLevel={global.painLevel} hospital={hospital} />
                    </div>
                  </InfoWindow>
                )} </Marker>
            ))) : ("")}

          <Circle
            defaultCenter={{
              lat: mapPosition.lat,
              lng: mapPosition.lng
            }}
          // options={{ strokeColor: state.circleColor }}

          // radius={state.radius}
          />
        </GoogleMap>
      </div>
    )
  })
  const WrappedMap = withScriptjs(withGoogleMap(Map));


  return (
    <div className={global.mobileMap ? 'map-container-mobile' : 'map-container'}>
      <button className='close-map-button' onClick={handleClose} ><span className='fas fa-arrow-left' /> Back</button>
      <WrappedMap
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${api}`}
        loadingElement={<div style={{ 'height': `100%` }} />}
        containerElement={<div style={{ 'height': `93%` }} />}
        mapElement={<div style={{ 'height': `100%` }} />}
      />
      {/* <button onClick={() => { console.log('global: ', global.location, global.destination) }}>check global</button> */}
    </div>
  )

}

export default GoogleMaps

import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../utils/global';
import axios from 'axios';
import API from '../../utils/API'

function Illnesses() {
  const url = process.env.REACT_APP_ILLNESSES_URL;
  const [ills, setIlls] = useState([]);
  const [page, setPage] = useState(0);
  const [formData, setFormdata] = useState({});
  const [global, dispatch] = useAppContext();

  useEffect(() => {
    // allowing "next" button to navigate to Form without querying non-existent pages
    axios.get(`${url}&page=${page > 1 ? 1 : page}`)
      .then(res => {
        setIlls(res.data._embedded.illnesses)
      })
  }, [page]);

  const handlePage = (e) => {
    const name = e.target.getAttribute('name');
    setPage(name === 'back' ? page - 1 : page + 1)
  }
  const handleTab = (e) => {
    const name = e.target.getAttribute('name');
    dispatch({
      type: 'switchTab',
      tabName: global.openTab === name ? 'hospital' : name
    });
  }
  const handleSubmit = () => {
    const illnesses = [];
    const keys = Object.keys(formData);
    keys.forEach(key => {
      if (formData[key] === true) illnesses.push(key);
    });
    const data = formData;
    // collecting all selected illnesses in an array without having to worry about deleting any when unselected
    data.illnesses = JSON.stringify(illnesses)
    console.log('logging data: ', data);
    API.postUser({ body: data })
      .then(res => { console.log(res) })
      .catch(err => console.log(err));
    setTimeout(() => {
      dispatch({ type: 'switchTab', tabName: 'hospital' });
    }, 800);
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value)
    setFormdata({
      ...formData,
      [name]: value
    })
  }
  const selectIllness = (e) => {
    const name = e.target.getAttribute('name');
    setFormdata({
      ...formData,
      [name]: formData[name] ? false : true,
    })
  }
  return (
    <div className={global.openTab === 'illness' ? 'accordian-container active' : 'accordian-container'} >
      <div className='accordian-header' name='illness' onClick={handleTab}>
        <h1>Record Symptoms</h1>
      </div>
      <div id='illnesses' className='accordian-body'>
        <div className={page >= 2 ? 'illness-list-hide' : 'illness-list'}>
          {ills.map((ill, index) =>
            <button className='illness-button' key={index} name={ill.illness.name} onClick={selectIllness} >
              {ill.illness.name}
              <span className={formData[ill.illness.name] ? 'fas fa-circle' : 'far fa-circle'} />
              {/* <input onChange={handleChange} type='range' name={ill.illness.name} value={formData[ill.illness.name]} min='1' max='5' /> */}
            </button>
          )}
        </div>
        <div className={page >= 2 ? 'illness-list' : 'illness-list-hide'}>
          <input className='patient-input' placeholder='Full Name...' name='name' value={formData.name} onChange={handleChange} />
          <input className='patient-input' placeholder='Age...' name='age' value={formData.age} onChange={handleChange} />
          <select className='patient-input' name='gender' onChange={handleChange} >
            <option name='n/a' value='n/a'>Gender...</option>
            <option name='Female' value='Female'>Female</option>
            <option name='Male' value='Male'>Male</option>
            <option name='Other' value='Other'>Other</option>
          </select>
        </div>
      </div>
      <div className='button-container'>
        <button className={page > 0 ? 'page-button' : 'page-button-hide'} onClick={handlePage} name='back'>Back</button>
        <button className={page >= 2 ? 'page-button-hide' : 'page-button'} onClick={handlePage} name='next'>Next</button>
        <button className={page >= 2 ? 'page-button' : 'page-button-hide'} onClick={handleSubmit} name='next'>Submit</button>
      </div>

    </div>


  )
}

export default Illnesses

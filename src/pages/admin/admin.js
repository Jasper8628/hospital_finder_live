import React, { useState, useEffect } from "react";
import API from "../../utils/API";
import './admin.css'
function Admin() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    API.getUsers()
      .then(res => {
        const users = res.data.data
        // console.log('logging res: ', res.data.data)
        users.forEach(element => {
          console.log(element._ref._path.segments[1])

        });

        setUsers(users);
      })
      .catch(err => console.log(err));
  }

  const deleteUser = (event) => {
    const data = {
      id: event.target.name
    };
    // console.log(id)
    API.deleteUser({ data })
      .then(res => {
        console.log(res)
        getUsers();
      })
      .catch(err => console.log(err));
  }
  return (

    <div className='admin-container' >
      {users.length ? (
        <div className='patient-container' >
          {users.map((user, index) => (
            <div className='patient-card' key={index}>
              <div className='patient-header'>
                <h2>{user._fieldsProto.name ? user._fieldsProto.name.stringValue : 'name: n/a'}</h2>
                <p>{user._fieldsProto.age ? user._fieldsProto.age.stringValue : 'age: n/a'}</p>
                <p>{user._fieldsProto.gender ? user._fieldsProto.gender.stringValue : 'gender: n/a'}</p>
              </div>
              <div className='patient-body'>
                <ul>
                  <h4>Symptoms</h4>
                  {JSON.parse(user._fieldsProto.illnesses.stringValue).length ?
                    JSON.parse(user._fieldsProto.illnesses.stringValue).map((symptom, index) => (
                      <li key={index} >{symptom}</li>
                    )) : 'no symptoms reported'}
                </ul>
                <div className='bottom-container'>
                  <button
                    name={user._ref._path.segments[1]}
                    onClick={deleteUser}>
                    <span className='fas fa-trash-alt' />
                  </button>

                </div>

              </div>
            </div>
          ))}

        </div>
      ) : (
        <div>No users in the database</div>
      )}

    </div>

  )
}

export default Admin

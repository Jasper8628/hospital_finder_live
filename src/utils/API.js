import axios from 'axios';
const url = 'https://australia-southeast1-hospital-finder-4a002.cloudfunctions.net/';
const url2 = 'http://localhost:5001/hospital-finder-4a002/australia-southeast1/deletePatient'
let config = {
  headers: {
    header1: 'Access-Control-Allow-Origin',
  }
}
const API = {
  getUsers: function () {
    return axios.get(url + 'getPatients', config);
  },
  deleteUser: function (data) {
    // return axios.delete(url2, data, config);
    return axios.delete(url + 'deletePatient', data, config);
  },
  postUser: function (data) {
    console.log(data);
    return axios.post(url + 'addPatient', data, config);
  },
}
export default API
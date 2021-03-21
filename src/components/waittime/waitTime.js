import React from 'react'
function WaitTime({ painLevel, hospital }) {
  const { patientCount, averageProcessTime } = hospital.waitingList[painLevel];
  const waitTime = patientCount * averageProcessTime;
  return (
    <span className='wait-time'>
      { waitTime === 0 ?
        `Wait time: ${waitTime}min` :
        waitTime <= 60 ?
          `Wait time: ${waitTime}mins` :
          `Wait time: ${Math.round(waitTime / 6) / 10}hrs`}
    </span>
  )
}
export default WaitTime
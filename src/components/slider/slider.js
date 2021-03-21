import React from 'react'
import { useAppContext } from '../../utils/global';
import './slider.css';

function Slider() {
  const [global, dispatch] = useAppContext();
  const colorArray = ['170', '115', '57', '22', '10'];
  const classArray = ['noPain', 'mildPain', 'mediumPain', 'badPain', 'severePain']

  const handleSlider = (e) => {
    const value = parseInt(e.target.value);
    dispatch({ type: 'pain', pain: value })
  }

  return (
    <div className="sliderContainer">
      <input
        className={classArray[global.painLevel]}
        id="slider"
        type="range"
        name="slider"
        min="0"
        value={global.painLevel}
        max="4"
        // style={{ "background": `${slider.color}` }}
        onChange={handleSlider}
        style={{ 'background': `hsla(${colorArray[global.painLevel]},100%,50%,1)` }}
      />
      <label>Pain Level</label>
    </div>
  )
}

export default Slider

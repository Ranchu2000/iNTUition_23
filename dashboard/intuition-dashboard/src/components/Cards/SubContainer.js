import { FaTablets, FaWater } from 'react-icons/fa'
import { useState } from 'react'

var taken = 90
export {taken}

const SubContainer = ({ medicine }) => {
  const [taken, setTaken] = useState(90)

  const onClick = () => {
    setTaken(medicine.score)
    console.log(`Selected score of ${taken}`)
  }

  return (
    <div className='card-subcontainer' onClick={onClick}>
        <p className='medicine-name'>{medicine.name}</p>
        <div className='line-break'></div>
        <p>Type: {medicine.isLiquid ? 'Liquid' : 'Pill'}</p>
        <div className='line-break'></div>
        <div className='card-subicon'>
            {medicine.isLiquid ? <FaWater size={30}/> : <FaTablets size={30}/>}
        </div>
        <p className='medicine-qty'>{medicine.qty}{medicine.isLiquid ? 'ml' : ''}</p>
        <p className='medicine-time'>{medicine.timesperday} times daily</p>
        <p className='medicine-meal'>{medicine.beforeMeal ? 'Before Meal' : 'After Meal'}</p>
    </div>
  )
}

export default SubContainer
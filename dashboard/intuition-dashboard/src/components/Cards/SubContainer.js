import { FaTablets, FaWater } from 'react-icons/fa'

const SubContainer = ({ type, isLiquid, name, qty, timesperday }) => {
  return (
    <div className='card-subcontainer'>
        <p>Type: {type}</p>
        <div className='line-break'></div>
        <div className='card-subicon'>
            {isLiquid ? <FaWater size={30}/> : <FaTablets size={30}/>}
        </div>
    </div>
  )
}

export default SubContainer
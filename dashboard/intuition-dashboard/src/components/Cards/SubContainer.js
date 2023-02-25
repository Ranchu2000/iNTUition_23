import { FaTablets, FaWater } from 'react-icons/fa'

const SubContainer = ({ isLiquid, name, qty, timesperday }) => {
  return (
    <div className='card-subcontainer'>
        <p className='medicine-name'>{name}</p>
        <div className='line-break'></div>
        <p>Type: {isLiquid ? 'Liquid' : 'Pill'}</p>
        <div className='line-break'></div>
        <div className='card-subicon'>
            {isLiquid ? <FaWater size={30}/> : <FaTablets size={30}/>}
        </div>
        <p className='medicine-qty'>{qty}{isLiquid ? 'ml' : ''}</p>
        <p className='medicine-time'>{timesperday} times daily</p>
    </div>
  )
}

export default SubContainer
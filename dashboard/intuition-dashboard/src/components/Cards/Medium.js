import { FaPills } from 'react-icons/fa'
import SubContainer from './SubContainer'

const Medium = () => {
  return (
    <div className='medium-container'>
        <span className='card-icon'>
            <FaPills size={40}/>
        </span>
        <h3 className='card-title'>
            Medicine
        </h3>
        <div className='card-container'>
            <SubContainer type='Solid' isLiquid={false}/>
            <SubContainer type='Solid' isLiquid={false}/>
            <SubContainer type='Solid' isLiquid={false}/>
            <SubContainer type='Liquid' isLiquid={true}/>
        </div>
    </div>
  )
}

export default Medium
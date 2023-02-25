import { FaPills, FaPlusSquare } from 'react-icons/fa'
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
        <div className='add-medicine'>
            <FaPlusSquare size={25} color='#50C878'/>
            <span className='add-medicine-text'>Add Medicine</span>
        </div>
        <div className='card-container'>
            <SubContainer isLiquid={false} name='Panadol' qty={2} timesperday={2}/>
            <SubContainer isLiquid={false} name='Zyrtec' qty={1} timesperday={3}/>
            <SubContainer isLiquid={false} name='Aspirin' qty={3} timesperday={2}/>
            <SubContainer isLiquid={true} name='Cough Syrup' qty={10} timesperday={3}/>
        </div>
    </div>
  )
}

export default Medium
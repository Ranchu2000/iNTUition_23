import { FaPills, FaPlusSquare } from 'react-icons/fa'
import SubContainer from './SubContainer'
import AddMedButton from '../AddMedButton'

const Medium = () => {
  return (
    <div className='medium-container'>
        <div className='card-header'>
            <span className='card-icon'>
                <FaPills size={30}/>
            </span>
            <h3 className='card-title'>
                Medicine
            </h3>
            <span className='card-header-btn'><AddMedButton text='Add Medicine' link='/medicine/add' /></span>
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
import SensorDataChart from '../SensorDataChart.js'
import { FaUserClock, FaClipboardList } from 'react-icons/fa'
import ButtonDispense from '../ButtonDispense'

const Large = () => {
  return (
    <div className='large-container'>
        <div className='card-header'>
            <span className='card-icon'><FaUserClock size={30}/></span>
            <span className='card-title'>Real-time Data</span>
            <div className='update-header'>
                <span className='card-icon'><FaClipboardList size={30}/></span>
                <span className='card-title'>Medicine Details</span>
            </div>
        </div>
        <SensorDataChart />
        <div className='dispense-body'>
            <ButtonDispense text='Dispense Now' payload={{type: 'demo'}} successMsg='Medicine successfully dispensed.' />
            <ButtonDispense text='Refill' color='steelblue' payload={{type: 'refill', name: 'B', refill:10}} successMsg='Medicine successfully refilled.' />
        </div>
    </div>
  )
}

export default Large
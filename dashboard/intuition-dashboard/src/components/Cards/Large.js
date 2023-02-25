import SensorDataChart from '../SensorDataChart.js'
import { FaUserClock } from 'react-icons/fa'

const Large = () => {
  return (
    <div className='large-container'>
        <div className='card-header'>
            <span className='card-icon'><FaUserClock size={30}/></span>
            <span className='card-title'>Real-time Data</span>
        </div>
        <SensorDataChart />
    </div>
  )
}

export default Large
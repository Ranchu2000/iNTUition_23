import DonutChartSVG from "./DonutChartSVG"
import { FaChartBar } from 'react-icons/fa'
import { taken } from './SubContainer.js'

const Small = () => {

  return (
    <div className='small-container'>
        <span className='card-icon'>
            <FaChartBar size={30}/>
        </span>
        <h3 className='card-title'>
            Analytics
        </h3>
        <div className='donutchart-container'>
            <DonutChartSVG val={taken} />
        </div>
    </div>
  )
}

export default Small
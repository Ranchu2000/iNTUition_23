import DonutChart from 'react-donut-chart'
import { useState, useEffect } from 'react'

const DonutChartSVG = ({ val }) => {
  const [value, setValue] = useState(0)
  
  useEffect(() => {
    setValue(val)
  }, [val])

  const data = [
      {
          label: 'Taken on time',
          value: value,
      },
      {
          label: 'Late/Missed',
          value: 100-value,
          isEmpty: true,
      }
    ]

  return (
    <div>
        <DonutChart 
          className='donutchart'
          data={data} 
          interactive={true} 
          innerRadius={0.8} 
          outerRadius={0.9} 
          height={220} 
          width={220}
          legend={false}
          strokeColor='white'
          colors={['steelblue']}
          formatValues={
            (values, total) => `${(values / total * 100).toFixed(0)}%`
          }
        />
    </div>
  )
}

export default DonutChartSVG
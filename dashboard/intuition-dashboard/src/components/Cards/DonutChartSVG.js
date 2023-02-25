import DonutChart from 'react-donut-chart'

const DonutChartSVG = () => {
  const data = [
      {
          label: 'Taken on time',
          value: 90,
      },
      {
          label: 'Late/Missed',
          value: 10,
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
          height={300} 
          width={300}
          legend={false}
          strokeColor='white'
          colors={['steelblue']}
        />
    </div>
  )
}

export default DonutChartSVG
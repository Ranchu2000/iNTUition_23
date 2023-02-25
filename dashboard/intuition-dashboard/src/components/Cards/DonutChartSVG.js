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
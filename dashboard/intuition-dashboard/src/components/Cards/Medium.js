import { FaPills, FaPlusSquare } from 'react-icons/fa'
import SubContainer from './SubContainer'
import AddMedButton from '../AddMedButton'
import { useEffect, useState } from 'react'
import { newMedicine } from '../../pages/AddMedicine'

const Medium = () => {
  const [medicines, setMedicines] = useState([
      {
          id: 1,
          name: 'Panadol',
          isLiquid: false,
          qty: 2,
          timesperday: 2,
          score: 90,
          beforeMeal: false
      },
      {
        id: 2,
        name: 'Zyrtec',
        isLiquid: false,
        qty: 1,
        timesperday: 3,
        score: 100,
        beforeMeal: true
    },
    {
        id: 3,
        name: 'Cough Syrup',
        isLiquid: true,
        qty: 10,
        timesperday: 3,
        score: 80,
        beforeMeal: true
    },
  ])

  useEffect(() => {
    if (newMedicine) {
        console.log(newMedicine)
        setMedicines([...medicines, newMedicine])
        console.log(medicines)
    }
  }, [])

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
            {/* <SubContainer isLiquid={false} name='Panadol' qty={2} timesperday={2}/>
            <SubContainer isLiquid={false} name='Zyrtec' qty={1} timesperday={3}/>
            <SubContainer isLiquid={false} name='Aspirin' qty={3} timesperday={2}/>
            <SubContainer isLiquid={true} name='Cough Syrup' qty={10} timesperday={3}/> */}
            {
                medicines.map(
                    (medicine) => (<SubContainer key={medicine.name} medicine={medicine} />)
                )
            }
        </div>
    </div>
  )
}

export default Medium
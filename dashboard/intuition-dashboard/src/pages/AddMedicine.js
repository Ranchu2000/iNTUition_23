import AddMedHeader from "../components/AddMedHeader"
import Button from "../components/Button"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

var newMedicine = ''
export {newMedicine}

const AddMedicine = () => {
  const [name, setName] = useState('')
  const [isLiquid, setIsLiquid] = useState(false)
  const [dose, setDose] = useState(0)
  const [freq, setFreq] = useState(0)
  const [beforeMeal, setBeforeMeal] = useState(true)
  const navigate = useNavigate()

  const onSubmit = (e) => {
      e.preventDefault()

      if (!name) {
          alert('Please add a name')
          return
      }
      if (!dose) {
          alert('Please add a dose')
          return
      }
      if (!freq) {
        alert('Please add a frequency')
        return
      }
      if (freq > 3 || freq < 0) {
          alert('Frequency should betwen 0-3 only')
          return
      }
      if (dose <= 0) {
          alert('Dose should be at least 1')
          return
      }

      const id = Math.floor(Math.random() * 10000) + 1
      console.log(id, name, isLiquid, dose, freq, beforeMeal)
      newMedicine = {
          id: id,
          name: name,
          isLiquid: isLiquid,
          qty: dose,
          timerperday: freq,
          score: -1,
          beforeMeal: beforeMeal
      }

      setName('')
      setIsLiquid(false)
      setDose(0)
      setFreq(0)
      setBeforeMeal(true)
      navigate('/home')
  }

  return (
    <div className='add-medicine-page-container'>
        <AddMedHeader title='Add New Medicine'/>

        <form className='add-medicine-form' onSubmit={onSubmit}>

            <div className='form-control'>
                <label>Medicine Name</label>
                <input 
                    type='text' 
                    placeholder='Add Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className='form-control'>
                <label>Liquid Medication?</label>
                <label className='switch'>
                    <input type='checkbox' value={isLiquid} onChange={(e) => setIsLiquid(e.currentTarget.checked)} checked={isLiquid}/>
                    <span className='slider round'></span>
                </label>
                <span id='is-liquid'>{isLiquid ? 'Liquid' : 'Tablet'}</span>
            </div>

            <div className='form-control-dose'>
                <label>Set Dose</label>
                <input 
                    type='text' 
                    placeholder='Add Dose'
                    value={dose}
                    onChange={(e) => setDose(e.target.value)}
                />
                <span id='dosage-unit'>{isLiquid ? 'ml' : 'tabs'}</span>
            </div>

            <div className='form-control-freq'>
                <label>Set Frequency</label>
                <input 
                    type='text' 
                    placeholder='Add Frequency'
                    value={freq}
                    onChange={(e) => setFreq(e.target.value)}
                />
                <span id='freq-tag'>times daily</span>
            </div>

            <div className='form-control form-control-check'>
                <label>Taken Before Meals?</label>
                <input 
                    type='checkbox'
                    value={beforeMeal}
                    onChange={(e) => setBeforeMeal(e.currentTarget.checked)}
                    checked={beforeMeal}
                />
            </div>

            <input type='submit' value='Save Medicine' className='btn btn-block'></input>

        </form>
    </div>
  )
}

export default AddMedicine
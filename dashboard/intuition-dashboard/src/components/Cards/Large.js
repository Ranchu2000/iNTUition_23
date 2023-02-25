import SensorDataChart from '../SensorDataChart.js'
import { FaUserClock, FaClipboardList } from 'react-icons/fa'
import ButtonDispense from '../ButtonDispense'
import { useState, useEffect, useRef } from 'react'

const Large = () => {
  const [morning, setMorning] = useState('')
  const [afternoon, setAfternoon] = useState('')
  const [night, setNight] = useState('')
  const ws = useRef()
  const timings = [morning, afternoon, night]
  const payload = {type: "setting", timings: timings}

  const onSubmit = (e) => {
      e.preventDefault()

      
      ws.current.send(JSON.stringify(payload))
      console.log('clicked')
      console.log(payload)

      alert('Successfully saved')
      setMorning('')
      setAfternoon('')
      setNight('')
  }

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080/request");

    return () => {
        console.log("Cleaning up! ");
        ws.current.close();
      };
  }, [])

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
            <div className='timing-body'>
                <span className='timing-title'>Space</span>
            </div>
        </div>
        <div className='setting-body'>
            <span className='setting-title'>Configure dosage timings</span>
            <form className='setting-form' onSubmit={onSubmit}>
                <label className='setting-label'>Morning</label>
                <input 
                    className='setting-input'
                    type='text'
                    placeholder='HHMM'
                    value={morning}
                    onChange={(e) => setMorning(e.target.value)}
                />
                <label className='setting-label'>Afternoon</label>
                <input 
                    className='setting-input'
                    type='text'
                    placeholder='HHMM'
                    value={afternoon}
                    onChange={(e) => setAfternoon(e.target.value)}
                />
                <label className='setting-label'>Night</label>
                <input 
                    className='setting-input'
                    type='text'
                    placeholder='HHMM'
                    value={night}
                    onChange={(e) => setNight(e.target.value)}
                />

                <input type='submit' value='Save' className='setting-save'></input>
            </form>
        </div>
    </div>
  )
}

export default Large
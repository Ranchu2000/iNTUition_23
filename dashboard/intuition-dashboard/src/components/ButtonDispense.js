import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react'

const ButtonDispense = ({ color, text, payload, successMsg }) => {
  const ws = useRef()

  const onClick = () => {
    ws.current.send(JSON.stringify(payload))
    console.log('clicked')
    console.log(payload)
    alert(successMsg)
  }

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080/request");

    return () => {
        console.log("Cleaning up! ");
        ws.current.close();
      };
  }, [])

  return (
    <div 
        className='btn-dispense'
        style={{ backgroundColor: color }}
        onClick={onClick}
    >
        {text}
    </div>
  )
}

ButtonDispense.defaultProps = {
    backgroundColor: 'steelblue',
}

ButtonDispense.propTypes = {
    text: PropTypes.string,
    color: PropTypes.string,
}

export default ButtonDispense
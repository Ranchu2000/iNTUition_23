import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react'

const ButtonDispense = ({ color, text }) => {
  const successMsg = 'Medicine successfully dispensed.'
  const ws = useRef()
//   ws.current = new WebSocket("ws://localhost:8080/request");
  const demo = {type: "demo",}

  const onClick = () => {
    ws.current.send(JSON.stringify(demo))
    console.log('clicked')
    console.log(demo)
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
        className='btn'
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
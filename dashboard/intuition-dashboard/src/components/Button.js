import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom'

const Button = ({ color, text, link }) => {
  const navigate = useNavigate()
  const onClick = () => {
    navigate(link)
  }

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

Button.defaultProps = {
    backgroundColor: 'steelblue',
}

Button.propTypes = {
    text: PropTypes.string,
    color: PropTypes.string,
}

export default Button
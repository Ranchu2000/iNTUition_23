import PropTypes from 'prop-types';
import { FaPlusSquare } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const AddMedButton = ({ color, text, link }) => {
  const navigate = useNavigate()
  const onClick = () => {
    navigate(link)
  }

  return (
    <div 
        className='btn-addmed'
        style={{ backgroundColor: color }}
        onClick={onClick}
    >
        <FaPlusSquare />
        {text}
    </div>
  )
}

AddMedButton.defaultProps = {
    backgroundColor: 'steelblue',
}

AddMedButton.propTypes = {
    text: PropTypes.string,
    color: PropTypes.string,
}

export default AddMedButton
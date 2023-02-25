import PropTypes from 'prop-types';

const Button = ({ color, text }) => {
  const onClick = () => {
    console.log('clicked')
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
import PropTypes from 'prop-types';
import Button from './Button';

const AddMedHeader = ({ title }) => {
  return (
    <div className='add-medicine-page-header'>
        <h1>{title}</h1>
    </div>
  )
}

AddMedHeader.defaultProps = {
    title: 'Header',
}

AddMedHeader.propTypes = {
    title: PropTypes.string.isRequired,
}

export default AddMedHeader
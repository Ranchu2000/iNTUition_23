import { FaBars } from 'react-icons/fa'

const Header = ({ title }) => {
  return (
    <div className='header'>
        <FaBars className='hamburger'/>
        {title}
    </div>
  )
}

export default Header
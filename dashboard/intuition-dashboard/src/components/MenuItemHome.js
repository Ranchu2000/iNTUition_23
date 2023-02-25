import { FaHome } from 'react-icons/fa'

const MenuItemHome = ({ title }) => {
  return (
    <div className='item'>
        <span className='icon-wrapper'>
          <FaHome size={20}/>
        </span>
        <span className='item-title'>
            {title}
        </span>
    </div>
  )
}

export default MenuItemHome
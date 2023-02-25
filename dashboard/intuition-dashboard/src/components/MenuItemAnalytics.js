import { FaDatabase } from 'react-icons/fa'

const MenuItemAnalytics = ({ title }) => {
  return (
    <div className='item'>
        <span className='icon-wrapper'>
          <FaDatabase size={20}/>
        </span>
        <span className='item-title'>
            {title}
        </span>
    </div>
  )
}

export default MenuItemAnalytics
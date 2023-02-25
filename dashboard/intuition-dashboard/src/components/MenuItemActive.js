

const MenuItemActive = ({ src, title }) => {
  return (
    <div className='item-active'>
        <span className='item-icon-active'>
            <img src={src} className='item-icon'/>
        </span>
        <span className='item-title-active'>
            {title}
        </span>
    </div>
  )
}

export default MenuItemActive
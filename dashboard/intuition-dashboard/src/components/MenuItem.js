

const MenuItem = ({ src, title }) => {
  return (
    <div className='item'>
        <span className='icon-wrapper'>
            <img src={src} className='item-icon'/>
        </span>
        <span className='item-title'>
            {title}
        </span>
    </div>
  )
}

export default MenuItem
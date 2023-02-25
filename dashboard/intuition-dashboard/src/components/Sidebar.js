import Profile from "./Profile"
import MenuItem from "./MenuItem"
import MenuItemActive from "./MenuItemActive"

const Sidebar = () => {
  return (
    <div className='sidebar'>
        <Profile name='Adam Leech' tag='Software Engineer'/>
        <MenuItemActive src='/images/home.png' title='Home'/>
        <MenuItem src='/images/user.png' title='Account'/>
    </div>
  )
}

export default Sidebar
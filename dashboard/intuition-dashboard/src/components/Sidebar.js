import Profile from "./Profile"
import MenuItemHome from "./MenuItemHome"
import MenuItemAnalytics from "./MenuItemAnalytics"

const Sidebar = () => {
  return (
    <div className='sidebar'>
        <Profile name='Adam Leech' tag='Software Engineer'/>
        <MenuItemHome title='Home'/>
        <MenuItemAnalytics title='Analytics'/>
    </div>
  )
}

export default Sidebar
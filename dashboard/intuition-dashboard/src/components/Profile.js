

const Profile = ({ name, tag }) => {
  return (
    <div className='profile'>
        <img src='/images/profile_photo.png' className='profile-img'/>
        <h3>{name}</h3>
        <p>{tag}</p>
    </div>
  )
}

export default Profile
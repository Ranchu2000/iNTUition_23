import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function Landing() {
  return (
    <div className='wrapper'>
        <Sidebar />
        <Header title='Welcome, Adam!'/>
    </div>
  )
}

export default Landing
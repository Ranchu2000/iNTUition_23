import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import MediumContainer from "../components/Cards/Medium";

function Landing() {
  return (
    <div className='wrapper'>
        <Sidebar />
        <Header title='Welcome, Adam!'/>
        <MediumContainer />
    </div>
  )
}

export default Landing
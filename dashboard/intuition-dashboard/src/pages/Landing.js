import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import MediumContainer from "../components/Cards/Medium";
import SmallContainer from "../components/Cards/Small"

function Landing() {
  return (
      <>
            <Sidebar />
            <Header title='Welcome, Adam!'/>
            <div className='wrapper'>
                <MediumContainer />
                <SmallContainer />
            </div>
      </>
  )
}

export default Landing
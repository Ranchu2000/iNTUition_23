import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import MediumContainer from "../components/Cards/Medium";
import SmallContainer from "../components/Cards/Small"
import LargeContainer from "../components/Cards/Large"

function Landing() {
  return (
      <>
            <Sidebar />
            <Header title='Welcome, Adam!'/>
            <div className='wrapper'>
                <MediumContainer />
                <SmallContainer />
                <LargeContainer />
            </div>
      </>
  )
}

export default Landing
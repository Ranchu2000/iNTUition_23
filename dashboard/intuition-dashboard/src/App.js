import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import P from './constants/paths'
import Landing from './pages/Landing'
import Test from './pages/Test'
import AddMedicine from './pages/AddMedicine'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={P.LANDING} element={<Landing />} />
        <Route path={P.TEST} element={<Test />} />
        <Route path={P.ADDMEDICINE} element={<AddMedicine />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

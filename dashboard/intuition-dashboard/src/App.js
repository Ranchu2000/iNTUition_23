import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import P from './constants/paths'
import Landing from './pages/Landing'
import Test from './pages/Test'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={P.LANDING} element={<Landing />} />
        <Route path={P.TEST} element={<Test />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

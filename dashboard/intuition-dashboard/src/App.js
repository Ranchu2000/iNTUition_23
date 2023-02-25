import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import P from './constants/paths'
import Landing from './pages/Landing'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={P.LANDING} element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

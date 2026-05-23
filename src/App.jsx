import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ChessBlog from './components/pages/ChessBlog'
import TheBattlefield from './components/pages/TheBattlefield'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChessBlog />} />
        <Route path="/projects/chess" element={<ChessBlog />} />
        <Route path="/thebattlefield" element={<TheBattlefield />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
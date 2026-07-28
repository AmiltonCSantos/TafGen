import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Lista from './paginas/Lista'
import CadastrarTarefa from './paginas/CadastrarTarefa'
 

function App() {

  return (
    <>
          <div className="app" >
            <Router>
              <Routes>
                  <Route path='/' element={<Lista />} />
                  <Route path='/Cadastrar' element={<CadastrarTarefa />} />
                </Routes>
            </Router>
          </div>  
    </>
  )
}

export default App

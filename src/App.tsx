import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.tsx'
import SmoothScroll from './components/SmoothScroll.tsx'
import AboutUs from './pages/AboutUs.tsx'
import Clients from './pages/Clients.tsx'
import ContactUs from './pages/ContactUs.tsx'
import Home from './pages/Home.tsx'
import Products from './pages/Products.tsx'
import Projects from './pages/Projects.tsx'
import Services from './pages/Services.tsx'

function App() {
  return (
    <SmoothScroll>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/services" element={<Services />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/contact-us" element={<ContactUs />} />
        </Routes>
      </Router>
    </SmoothScroll>
  )
}

export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "@newjersey/njwds/dist/css/styles.css";
import "./globals.css"

import { NjHeader } from "./components/NjHeader";
import { LandingPage } from "./LandingPage";
import { NjFooter } from "./components/NjFooter";
import { StatusPage } from './StatusPage';

const App = () => (
  <Router>
    <NjHeader />
    <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/status" element={<StatusPage />}/>
    </Routes>
    <NjFooter />
  </Router>
);

export default App;

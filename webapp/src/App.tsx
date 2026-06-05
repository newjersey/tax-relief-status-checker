import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@newjersey/njwds/dist/css/styles.css";
import "./globals.css";

import { NjHeader } from "./components/NjHeader";
import { LandingPage } from "./LandingPage";
import { NjFooter } from "./components/NjFooter";
import { StatusPage } from "./StatusPage";
import { Alert } from "@trussworks/react-uswds";

const App = () => (
  <Router>
    <NjHeader />
    <Alert className="margin-0" type="info" noIcon={true} headingLevel="h1">
      <strong>This tool is in beta.</strong> This means it is actively being worked on with new
      features coming soon.
    </Alert>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/status" element={<StatusPage />} />
    </Routes>
    <NjFooter />
  </Router>
);

export default App;

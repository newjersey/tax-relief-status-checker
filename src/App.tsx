import "@newjersey/njwds/dist/css/styles.css";

import { LandingPage } from "./LandingPage";

/**
 * Root application component. Composes top-level layout and routes.
 * All global CSS is imported here so that it is loaded exactly once.
 */
const App = () => <LandingPage />;

export default App;

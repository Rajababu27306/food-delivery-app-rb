import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./assets/pages/Profile";

function App() {
  return (
    <>
      <Navbar />
      <Home />
      <Profile />
    </>
  );
}

export default App;
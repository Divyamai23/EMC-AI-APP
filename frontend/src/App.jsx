import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import UploadSection from "./components/UploadSection.jsx";
import HowItWorks from "./components/HowItWorks.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <UploadSection />
        <HowItWorks />
      </main>
      <footer>
        <div className="container">0 → Shipped resume parser · mock build, React + Vite</div>
      </footer>
    </>
  );
}

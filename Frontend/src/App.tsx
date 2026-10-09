import { useState, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { ComingSoonModal } from "./components/common/ComingSoonModal";
import { GeneratorPage } from "./pages/GeneratorPage";
import { StaticPageSeo } from "./components/seo/StaticPageSeo";

const History = lazy(() => import("./components/history/History").then((m) => ({ default: m.History })));
const Terms = lazy(() => import("./pages/Terms").then((m) => ({ default: m.Terms })));
const Privacy = lazy(() => import("./pages/Privacy").then((m) => ({ default: m.Privacy })));
const Cookies = lazy(() => import("./pages/Cookies").then((m) => ({ default: m.Cookies })));
const FAQ = lazy(() => import("./pages/FAQ").then((m) => ({ default: m.FAQ })));
const About = lazy(() => import("./pages/About").then((m) => ({ default: m.About })));
const Donations = lazy(() => import("./pages/Donations").then((m) => ({ default: m.Donations })));

function App() {
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  const handleLoginClick = () => {
    setShowComingSoonModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <StaticPageSeo />
      <Header onLoginClick={handleLoginClick} />
      <main id="main-content">
        <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-gray-500 dark:text-gray-400" aria-live="polite">Cargando…</div>}>
          <Routes>
            <Route path="/" element={<GeneratorPage variant="home" />} />
            <Route path="/generador-qr/:type" element={<GeneratorPage />} />
            <Route path="/history" element={<History />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/about" element={<About />} />
            <Route path="/donaciones" element={<Donations />} />
          </Routes>
        </Suspense>
      </main>

      <ComingSoonModal isOpen={showComingSoonModal} onClose={() => setShowComingSoonModal(false)} />
    </div>
  );
}

export default App;

// import { useState } from "react";
// import { AuthProvider, useAuth } from "./components/AuthContext";
// import { LoginForm } from "./components/LoginForm";
// import { AdminDashboard } from "./components/AdminDashboard";
// import { TeamSubmissionForm } from "./components/TeamSubmissionForm";
// import { PublicDisplay } from "./components/PublicDisplay";
// import { ProjectSubmissionForm } from "./components/ProjectSubmissionForm";
// import { NotificationBell } from "./components/NotificationBell";
// import Sidebar from "./components/Sidebar";
// import { LayoutDashboard, Users, Eye, Menu, X, FileUp } from "lucide-react";
// import WhatsAppPhoneWidget from "./components/WhatsAppPhoneWidget";
// import Chatbot from "./components/Chatbot";
// import SuggestionPopup from "./components/SuggestionPopup";
// import { TutorialPopup } from "./components/TutorialPopup";
// import ProjectExpo from "./components/ProjectExpo";
// import RotaractClub from "./components/RotaractClub";
// import CSquareClub from "./components/CSquareClub";
// import YoungOratorClub from "./components/YoungOratorClub";
// import About from "./components/about";

// function AppContent() {
//   const { user, isAdmin, loading } = useAuth();
//   const [view, setView] = useState<
//     | "public"
//     | "submit"
//     | "admin"
//     | "upload"
//     | "projectexpo"
//     | "rotaract"
//     | "CSquareClub"
//     | "YoungOratorClub"
//     | "about"
//   >("public");
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [showTutorial, setShowTutorial] = useState(true);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   const handleCloseTutorial = () => {
//     setShowTutorial(false);
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//     // Update CSS variable
//     document.documentElement.style.setProperty(
//       "--sidebar-width",
//       !isSidebarOpen ? "256px" : "0px",
//     );
//     // Dispatch custom event to sync with Sidebar
//     window.dispatchEvent(new CustomEvent("toggleSidebar"));
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-900">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto"></div>
//           <p className="mt-4 text-white text-lg">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   // Admin view - Complete separate render without navbar/sidebar
//   if (view === "admin") {
//     // Reset sidebar width for admin view
//     document.documentElement.style.setProperty("--sidebar-width", "0px");

//     if (!user) {
//       return (
//         <>
//           <div className="min-h-screen bg-slate-900">
//             <LoginForm />
//             <div className="relative z-50">
//               <WhatsAppPhoneWidget />
//               <Chatbot />
//               <SuggestionPopup />
//             </div>
//           </div>
//         </>
//       );
//     }
//     if (!isAdmin) {
//       return (
//         <>
//           <div className="min-h-screen bg-slate-900">
//             <div className="min-h-screen flex items-center justify-center">
//               <div className="bg-white rounded-xl p-8 max-w-md text-center">
//                 <h2 className="text-2xl font-bold text-slate-900 mb-4">
//                   Access Denied
//                 </h2>
//                 <p className="text-slate-600 mb-6">
//                   You do not have admin privileges.
//                 </p>
//                 <button
//                   onClick={() => setView("public")}
//                   className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//                 >
//                   Go to Public View
//                 </button>
//               </div>
//             </div>
//             <div className="relative z-50">
//               <WhatsAppPhoneWidget />
//               <Chatbot />
//               <SuggestionPopup />
//             </div>
//           </div>
//         </>
//       );
//     }
//     return (
//       <>
//         <div className="min-h-screen bg-slate-900">
//           <AdminDashboard />
//           <div className="relative z-50">
//             <WhatsAppPhoneWidget />
//             <Chatbot />
//             <SuggestionPopup />
//           </div>
//         </div>
//       </>
//     );
//   }

//   // All other views with navbar and sidebar
//   return (
//     <>
//       {/* Navbar */}
//       <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             {/* Logo / Title with Sidebar Toggle */}
//             <div className="flex items-center gap-3">
//               {/* Sidebar Toggle Button */}
//               <button
//                 onClick={toggleSidebar}
//                 className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
//                 aria-label="Toggle menu"
//               >
//                 {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
//               </button>

//               <div className="bg-blue-600 p-2 rounded-lg">
//                 <LayoutDashboard className="w-6 h-6 text-white" />
//               </div>
//               <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
//                 CuSphere
//               </h1>
//             </div>

//             {/* Desktop Buttons */}
//             <div className="hidden md:flex gap-2 items-center">
//               <button
//                 onClick={() => setView("public")}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
//                   view === "public"
//                     ? "bg-blue-600 text-white shadow-lg"
//                     : "bg-slate-100 text-slate-700 hover:bg-slate-200"
//                 }`}
//               >
//                 <Eye className="w-4 h-4" />
//                 Public View
//               </button>
//               <button
//                 onClick={() => setView("submit")}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
//                   view === "submit"
//                     ? "bg-blue-600 text-white shadow-lg"
//                     : "bg-slate-100 text-slate-700 hover:bg-slate-200"
//                 }`}
//               >
//                 <Users className="w-4 h-4" />
//                 Submit Team
//               </button>
//               <button
//                 onClick={() => setView("upload")}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
//                   view === "upload"
//                     ? "bg-blue-600 text-white shadow-lg"
//                     : "bg-slate-100 text-slate-700 hover:bg-slate-200"
//                 }`}
//               >
//                 <FileUp className="w-4 h-4" />
//                 Submit Project
//               </button>
//               <button
//                 onClick={() => setView("admin")}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
//                   view === "admin"
//                     ? "bg-blue-600 text-white shadow-lg"
//                     : "bg-slate-100 text-slate-700 hover:bg-slate-200"
//                 }`}
//               >
//                 <LayoutDashboard className="w-4 h-4" />
//                 Admin
//               </button>
//               <button
//                 onClick={() => setView("about")}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
//                   view === "about"
//                     ? "bg-blue-600 text-white shadow-lg"
//                     : "bg-slate-100 text-slate-700 hover:bg-slate-200"
//                 }`}
//               >
//                 <Users className="w-4 h-4" />
//                 About
//               </button>

//               {/* Notification Bell */}
//               <NotificationBell />
//             </div>

//             {/* Mobile Menu Button and Notification */}
//             <div className="md:hidden flex items-center gap-2">
//               {/* Notification Bell for Mobile */}
//               <NotificationBell />

//               <button
//                 onClick={() => setMenuOpen(!menuOpen)}
//                 className="p-2 rounded-md text-slate-700 hover:bg-slate-100 transition"
//               >
//                 {menuOpen ? (
//                   <X className="w-6 h-6" />
//                 ) : (
//                   <Menu className="w-6 h-6" />
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Mobile Menu */}
//           {menuOpen && (
//             <div className="md:hidden mt-2 flex flex-col gap-2 pb-4">
//               <button
//                 onClick={() => {
//                   setView("public");
//                   setMenuOpen(false);
//                 }}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition w-full text-left ${
//                   view === "public"
//                     ? "bg-blue-600 text-white shadow-lg"
//                     : "bg-slate-100 text-slate-700 hover:bg-slate-200"
//                 }`}
//               >
//                 <Eye className="w-4 h-4" />
//                 Public View
//               </button>
//               <button
//                 onClick={() => {
//                   setView("submit");
//                   setMenuOpen(false);
//                 }}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition w-full text-left ${
//                   view === "submit"
//                     ? "bg-blue-600 text-white shadow-lg"
//                     : "bg-slate-100 text-slate-700 hover:bg-slate-200"
//                 }`}
//               >
//                 <Users className="w-4 h-4" />
//                 Submit Team
//               </button>
//               <button
//                 onClick={() => {
//                   setView("upload");
//                   setMenuOpen(false);
//                 }}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition w-full text-left ${
//                   view === "upload"
//                     ? "bg-blue-600 text-white shadow-lg"
//                     : "bg-slate-100 text-slate-700 hover:bg-slate-200"
//                 }`}
//               >
//                 <FileUp className="w-4 h-4" />
//                 Submit Project
//               </button>
//               <button
//                 onClick={() => {
//                   setView("admin");
//                   setMenuOpen(false);
//                 }}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition w-full text-left ${
//                   view === "admin"
//                     ? "bg-blue-600 text-white shadow-lg"
//                     : "bg-slate-100 text-slate-700 hover:bg-slate-200"
//                 }`}
//               >
//                 <LayoutDashboard className="w-4 h-4" />
//                 Admin
//               </button>
//               <button
//                 onClick={() => {
//                   setView("about");
//                   setMenuOpen(false);
//                 }}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition w-full text-left ${
//                   view === "about"
//                     ? "bg-blue-600 text-white shadow-lg"
//                     : "bg-slate-100 text-slate-700 hover:bg-slate-200"
//                 }`}
//               >
//                 <Users className="w-4 h-4" />
//                 About
//               </button>
//             </div>
//           )}
//         </div>
//       </nav>

//       {/* Sidebar - Only rendered for non-admin views */}
//       {view !== "admin" && <Sidebar onNavigate={setView} currentView={view} />}

//       {/* Main Content */}
//       {view === "public" ? (
//         <PublicDisplay />
//       ) : view === "submit" ? (
//         <TeamSubmissionForm />
//       ) : view === "upload" ? (
//         <ProjectSubmissionForm />
//       ) : view === "projectexpo" ? (
//         <ProjectExpo />
//       ) : view === "rotaract" ? (
//         <RotaractClub />
//       ) : view === "CSquareClub" ? (
//         <CSquareClub />
//       ) : view === "YoungOratorClub" ? (
//         <YoungOratorClub />
//       ) : view === "about" ? (
//         <About />
//       ) : null}

//       {/* WhatsApp and Phone Widget */}
//       <div className="relative z-50">
//         <WhatsAppPhoneWidget />
//         <Chatbot />
//         <SuggestionPopup />
//         {showTutorial && <TutorialPopup onClose={handleCloseTutorial} />}
//       </div>
//     </>
//   );
// }

// function App() {
//   return (
//     <AuthProvider>
//       <AppContent />
//     </AuthProvider>
//   );
// }

// export default App;
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { LoginForm } from "./components/LoginForm";
import { AdminDashboard } from "./components/AdminDashboard";
import { TeamSubmissionForm } from "./components/TeamSubmissionForm";
import { PublicDisplay } from "./components/PublicDisplay";
import { ProjectSubmissionForm } from "./components/ProjectSubmissionForm";
import { NotificationBell } from "./components/NotificationBell";
import Sidebar from "./components/Sidebar";
import { LayoutDashboard, Users, Eye, Menu, X, FileUp, Shield } from "lucide-react";
import WhatsAppPhoneWidget from "./components/WhatsAppPhoneWidget";
import Chatbot from "./components/Chatbot";
import SuggestionPopup from "./components/SuggestionPopup";
import { TutorialPopup } from "./components/TutorialPopup";
import ProjectExpo from "./components/ProjectExpo";
import RotaractClub from "./components/RotaractClub";
import CSquareClub from "./components/CSquareClub";
import YoungOratorClub from "./components/YoungOratorClub";
import About from "./components/about";

// ---------------------------------------------------------------------------
// Global styles injected once into <head>
// ---------------------------------------------------------------------------
const ADMIN_CSS = `
  @keyframes fabPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.45), 0 8px 28px rgba(0,0,0,0.5); }
    55%       { box-shadow: 0 0 0 9px rgba(59,130,246,0),  0 8px 28px rgba(0,0,0,0.5); }
  }
  @keyframes popupOverlayIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes popupCardIn {
    0%   { opacity: 0; transform: scale(0.82) translateY(30px); }
    65%  { opacity: 1; transform: scale(1.03) translateY(-5px); }
    100% { opacity: 1; transform: scale(1)    translateY(0);    }
  }
  @keyframes shieldBob {
    0%,100% { transform: translateY(0);   }
    50%     { transform: translateY(-3px);}
  }

  /* ── FAB pill ── */
  .adm-fab {
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 40;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    padding: 20px 11px;
    background: linear-gradient(175deg, #1e293b 0%, #0f172a 100%);
    border: 1px solid rgba(59,130,246,0.3);
    border-right: none;
    border-radius: 16px 0 0 16px;
    cursor: pointer;
    animation: fabPulse 2.6s ease-in-out infinite;
    transition: padding 0.2s ease, background 0.2s ease, border-color 0.2s ease;
    outline: none;
    user-select: none;
  }
  .adm-fab:hover {
    background: linear-gradient(175deg, #1d4ed8 0%, #1e3a8a 100%);
    border-color: rgba(96,165,250,0.55);
    padding: 20px 15px;
  }
  .adm-fab:hover .adm-fab-icon {
    animation: shieldBob 0.5s ease-in-out;
  }
  .adm-fab-icon {
    color: #60a5fa;
    margin-bottom: 10px;
    flex-shrink: 0;
  }
  .adm-fab-divider {
    width: 1px;
    height: 8px;
    background: rgba(96,165,250,0.25);
    margin: 2px 0;
  }
  .adm-fab-letter {
    display: block;
    font-size: 8.5px;
    font-weight: 900;
    letter-spacing: 0.1em;
    color: #93c5fd;
    text-transform: uppercase;
    line-height: 1.55;
    text-align: center;
  }
  .adm-fab-letter.space {
    height: 7px;
  }

  /* ── Popup overlay ── */
  .adm-overlay {
    position: fixed;
    inset: 0;
    background: rgba(2,6,23,0.78);
    backdrop-filter: blur(7px);
    -webkit-backdrop-filter: blur(7px);
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    animation: popupOverlayIn 0.22s ease forwards;
  }

  /* ── Popup card ── */
  .adm-card {
    position: relative;
    width: 100%;
    max-width: 430px;
    background: linear-gradient(150deg, #0f172a 0%, #1e293b 100%);
    border: 1px solid rgba(59,130,246,0.22);
    border-radius: 22px;
    overflow: hidden;
    animation: popupCardIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards;
    box-shadow:
      0 40px 90px rgba(0,0,0,0.65),
      0 0 0 1px rgba(255,255,255,0.04) inset,
      0 1px 0 rgba(96,165,250,0.15) inset;
  }

  /* Top accent bar */
  .adm-card::before {
    content: '';
    display: block;
    height: 3px;
    background: linear-gradient(90deg, #1d4ed8, #3b82f6, #60a5fa, #3b82f6, #1d4ed8);
    background-size: 200% 100%;
    animation: shimmer 2.5s linear infinite;
  }
  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── Popup header ── */
  .adm-header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px 22px 16px;
    border-bottom: 1px solid rgba(59,130,246,0.12);
    background: linear-gradient(90deg, rgba(29,78,216,0.22) 0%, transparent 80%);
  }
  .adm-header-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: linear-gradient(135deg, #1d4ed8, #1e40af);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 14px rgba(29,78,216,0.45);
  }
  .adm-title {
    font-size: 1.08rem;
    font-weight: 700;
    color: #f1f5f9;
    letter-spacing: 0.01em;
    margin: 0;
  }
  .adm-subtitle {
    font-size: 0.7rem;
    color: #475569;
    margin: 3px 0 0;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .adm-close {
    margin-left: auto;
    width: 34px;
    height: 34px;
    border-radius: 9px;
    border: 1px solid rgba(100,116,139,0.28);
    background: rgba(15,23,42,0.6);
    color: #64748b;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }
  .adm-close:hover {
    background: rgba(239,68,68,0.14);
    color: #f87171;
    border-color: rgba(239,68,68,0.38);
  }

  /* ── Body: strip LoginForm's own shell ── */
  .adm-body > * {
    background: transparent !important;
    min-height: unset !important;
    box-shadow: none !important;
  }
`;

function StyleInjector() {
  useEffect(() => {
    const id = "adm-styles";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id;
      el.textContent = ADMIN_CSS;
      document.head.appendChild(el);
    }
  }, []);
  return null;
}

// ---------------------------------------------------------------------------
// Vertical letter stack for the FAB
// ---------------------------------------------------------------------------
function FabLabel({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((ch, i) =>
        ch === " " ? (
          <span key={i} className="adm-fab-letter space" />
        ) : (
          <span key={i} className="adm-fab-letter">{ch}</span>
        )
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Main app
// ---------------------------------------------------------------------------
function AppContent() {
  const { user, isAdmin, loading } = useAuth();
  const [view, setView] = useState<
    | "public" | "submit" | "admin" | "upload"
    | "projectexpo" | "rotaract" | "CSquareClub"
    | "YoungOratorClub" | "about"
  >("public");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAdminPopup, setShowAdminPopup] = useState(false);
  const [showAdminFab, setShowAdminFab] = useState(true);

  // Auto-redirect after successful admin login inside popup
  useEffect(() => {
    if (user && isAdmin && showAdminPopup) {
      setShowAdminPopup(false);
      setShowAdminFab(false);
      setView("admin");
    }
  }, [user, isAdmin, showAdminPopup]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const next = !prev;
      document.documentElement.style.setProperty("--sidebar-width", next ? "256px" : "0px");
      window.dispatchEvent(new CustomEvent("toggleSidebar"));
      return next;
    });
  };

  const openAdminPopup  = () => { setShowAdminPopup(true);  setShowAdminFab(false); };
  const closeAdminPopup = () => { setShowAdminPopup(false); setShowAdminFab(true);  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto" />
          <p className="mt-4 text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // ── Admin full-page view ──────────────────────────────────────────────────
  if (view === "admin") {
    document.documentElement.style.setProperty("--sidebar-width", "0px");
    if (!user) {
      return (
        <div className="min-h-screen bg-slate-900">
          <LoginForm />
          <div className="relative z-50"><WhatsAppPhoneWidget /><Chatbot /><SuggestionPopup /></div>
        </div>
      );
    }
    if (!isAdmin) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 max-w-md text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Access Denied</h2>
            <p className="text-slate-600 mb-6">You do not have admin privileges.</p>
            <button onClick={() => setView("public")} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Go to Public View
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-slate-900">
        <AdminDashboard />
        <div className="relative z-50"><WhatsAppPhoneWidget /><Chatbot /><SuggestionPopup /></div>
      </div>
    );
  }

  // ── All other views ───────────────────────────────────────────────────────
  const navItems = [
    { id: "public",  label: "Public View",     icon: <Eye     className="w-4 h-4" /> },
    { id: "submit",  label: "Submit Team",      icon: <Users   className="w-4 h-4" /> },
    { id: "upload",  label: "Submit Project",   icon: <FileUp  className="w-4 h-4" /> },
    { id: "about",   label: "About",            icon: <Users   className="w-4 h-4" /> },
  ];

  return (
    <>
      <StyleInjector />

      {/* ── Navbar ── */}
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <button onClick={toggleSidebar} className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200" aria-label="Toggle menu">
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className="bg-blue-600 p-2 rounded-lg">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">CuSphere</h1>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex gap-2 items-center">
              {navItems.map(({ id, label, icon }) => (
                <button key={id} onClick={() => setView(id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                    view === id ? "bg-blue-600 text-white shadow-lg" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {icon}{label}
                </button>
              ))}
              <NotificationBell />
            </div>

            {/* Mobile toggle */}
            <div className="md:hidden flex items-center gap-2">
              <NotificationBell />
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-md text-slate-700 hover:bg-slate-100 transition">
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          {menuOpen && (
            <div className="md:hidden mt-2 flex flex-col gap-2 pb-4">
              {navItems.map(({ id, label, icon }) => (
                <button key={id} onClick={() => { setView(id as any); setMenuOpen(false); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition w-full text-left ${
                    view === id ? "bg-blue-600 text-white shadow-lg" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {icon}{label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar onNavigate={setView} currentView={view} />

      {/* Page content */}
      {view === "public"         ? <PublicDisplay />
       : view === "submit"       ? <TeamSubmissionForm />
       : view === "upload"       ? <ProjectSubmissionForm />
       : view === "projectexpo"  ? <ProjectExpo />
       : view === "rotaract"     ? <RotaractClub />
       : view === "CSquareClub"  ? <CSquareClub />
       : view === "YoungOratorClub" ? <YoungOratorClub />
       : view === "about"        ? <About />
       : null}

      {/* ── Floating Admin FAB ── */}
      {showAdminFab && (
        <button className="adm-fab" onClick={openAdminPopup} aria-label="Admin Login">
          <Shield className="adm-fab-icon" size={17} />
          <div className="adm-fab-divider" />
          <FabLabel text="ADMIN LOGIN" />
        </button>
      )}

      {/* ── Admin Login Popup ── */}
      {showAdminPopup && (
        <div className="adm-overlay" onClick={closeAdminPopup}>
          <div className="adm-card" onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div className="adm-header">
              <div className="adm-header-icon">
                <Shield size={22} color="#93c5fd" />
              </div>
              <div>
                <p className="adm-title">Admin Access</p>
                <p className="adm-subtitle">Restricted · CuSphere</p>
              </div>
              <button className="adm-close" onClick={closeAdminPopup} aria-label="Close">
                <X size={16} />
              </button>
            </div>

            {/* Login form – rendered inside popup, background stripped via CSS */}
            <div className="adm-body">
              <LoginForm />
            </div>

          </div>
        </div>
      )}

      {/* Floating widgets */}
      <div className="relative z-50">
        <WhatsAppPhoneWidget />
        <Chatbot />
        <SuggestionPopup />
        {showTutorial && <TutorialPopup onClose={() => setShowTutorial(false)} />}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
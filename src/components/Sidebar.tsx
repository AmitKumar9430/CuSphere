// // 
// import React, { useState, useEffect } from 'react';
// import { LayoutDashboard, FolderKanban, Users, GraduationCap, Settings, Sparkles, Zap, CurlyBracesIcon } from 'lucide-react';

// const Sidebar: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(true);
//   const [activeItem, setActiveItem] = useState(0);

//   // Update CSS variable when sidebar state changes
//   useEffect(() => {
//     document.documentElement.style.setProperty(
//       '--sidebar-width',
//       isOpen ? '256px' : '0px'
//     );
//   }, [isOpen]);

//   // Listen for toggle events from navbar
//   useEffect(() => {
//     const handleToggle = () => {
//       setIsOpen(prev => !prev);
//     };
    
//     window.addEventListener('toggleSidebar', handleToggle);
//     return () => window.removeEventListener('toggleSidebar', handleToggle);
//   }, []);

//   const menuItems = [
//     { icon: LayoutDashboard, label: 'Dashboard', href: '#dashboard' },
//     { icon: FolderKanban, label: 'Projects', href: '#projects' },
//     { icon: Users, label: 'Teams', href: '#teams' },
//     { icon: GraduationCap, label: 'Students', href: '#students' },
//     { icon: Settings, label: 'Settings', href: '#settings' },
//     { icon: CurlyBracesIcon, label: 'ProjectEXPO', href: '#projectEXPO' },
//   ];

//   return (
//     <>
//       {/* Overlay for mobile */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden backdrop-blur-sm"
//           onClick={() => window.dispatchEvent(new CustomEvent('toggleSidebar'))}
//         />
//       )}

//       {/* Top Banner - Above Sidebar */}
//       <div
//         className={`fixed left-0 bg-white border-b-2 border-blue-500 w-64 transform transition-all duration-500 ease-out z-40 shadow-lg ${
//           isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
//         }`}
//         style={{ top: '0px', height: '63px' }}
//       >
//         <div className="h-full flex items-center justify-center px-4 relative overflow-hidden">
//           {/* Animated background gradient */}
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 opacity-60"></div>
//           <div className="absolute inset-0">
//             <div className="absolute top-0 left-0 w-20 h-20 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
//             <div className="absolute bottom-0 right-0 w-20 h-20 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
//           </div>
          
//           {/* Content */}
//           <div className="relative z-10 text-center">
//             <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
             
//             </h1>
//             <p className="text-xs font-medium text-blue-700 mt-0.5 flex items-center justify-center gap-1">
//               <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
//               Crafted by code, driven by curiosity
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Sidebar */}
//       <aside
//         className={`fixed left-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white w-64 transform transition-all duration-500 ease-out z-40 shadow-2xl ${
//           isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
//         } flex flex-col overflow-hidden`}
//         style={{ top: '64px', height: 'calc(100vh - 63px)' }}
//       >
//         {/* Animated Background Effects */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
//           <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
//           <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
//         </div>

//         {/* Header Banner */}
//         <div className="relative px-4 py-6 border-b border-white/10 bg-white/5 backdrop-blur-sm">
//           <div className="flex items-center gap-3">
//             <div className="relative">
//               <div className="absolute inset-0 bg-white rounded-lg blur-md opacity-50 animate-pulse"></div>
//               <div className="relative bg-white/20 backdrop-blur-sm p-2 rounded-lg border border-white/30">
//                 <Sparkles className="w-5 h-5 text-white" />
//               </div>
//             </div>
//             <div>
//               <h2 className="text-base font-bold text-white">
//                 Innovation Hub
//               </h2>
//               <p className="text-xs text-blue-100/90 flex items-center gap-1">
//                 <Zap size={12} className="text-yellow-300" />
//                 Empowering Excellence
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Navigation Menu */}
//         <nav className="flex-1 px-3 py-6 overflow-y-auto custom-scrollbar">
//           <div className="mb-3 px-3">
//             <p className="text-xs font-semibold text-blue-100/70 uppercase tracking-wider">Navigation</p>
//           </div>
//           <ul className="space-y-1.5">
//             {menuItems.map((item, index) => {
//               const Icon = item.icon;
//               const isActive = activeItem === index;
//               return (
//                 <li key={index}>
//                   <a
//                     href={item.href}
//                     onClick={(e) => {
//                       e.preventDefault();
//                       setActiveItem(index);
//                     }}
//                     className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden ${
//                       isActive
//                         ? 'bg-white/20 shadow-lg shadow-blue-900/30 scale-105 border border-white/30'
//                         : 'hover:bg-white/10 hover:translate-x-1 border border-transparent'
//                     }`}
//                   >
//                     {/* Animated background for active item */}
//                     {isActive && (
//                       <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 animate-pulse"></div>
//                     )}
                    
//                     <div className={`relative z-10 ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
//                       <Icon size={20} className={isActive ? 'drop-shadow-lg' : ''} />
//                     </div>
//                     <span className={`relative z-10 font-medium ${isActive ? 'font-semibold' : ''}`}>
//                       {item.label}
//                     </span>

//                     {/* Hover shine effect */}
//                     <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
//                     </div>
//                   </a>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>

//         {/* Footer */}
//         <div className="relative p-4 border-t border-white/10 bg-white/5 backdrop-blur-sm">
//           <div className="text-center mb-2">
//             <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm">
//               <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
//               <span className="text-xs font-medium text-white">System Active</span>
//             </div>
//           </div>
//           <p className="text-xs text-center text-blue-100/80 font-medium">
//             © 2024 ProjectSphere
//           </p>
//           <p className="text-[10px] text-center text-blue-200/60 mt-1">
//             Version 2.0.1
//           </p>
//         </div>
//       </aside>

//       <style jsx>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 6px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: rgba(255, 255, 255, 0.05);
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: rgba(255, 255, 255, 0.3);
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: rgba(255, 255, 255, 0.5);
//         }
//       `}</style>
//     </>
//   );
// };

// export default Sidebar;
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, FolderKanban, Users, GraduationCap, Settings, Sparkles, Zap, CurlyBracesIcon, Projector } from 'lucide-react';

interface SidebarProps {
  onNavigate?: (view: 'public' | 'submit' | 'admin' | 'upload' | 'projectexpo' | 'about' | 'rotaract' | 'CSquareClub' | 'YoungOratorClub') => void;
  currentView?: 'public' | 'submit' | 'admin' | 'upload' | 'projectexpo' | 'about' | 'rotaract' | 'CSquareClub' | 'YoungOratorClub';
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentView }) => {
  const [isOpen, setIsOpen] = useState(true);

  // Update CSS variable when sidebar state changes
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-width',
      isOpen ? '256px' : '0px'
    );
  }, [isOpen]);

  // Listen for toggle events from navbar
  useEffect(() => {
    const handleToggle = () => {
      setIsOpen(prev => !prev);
    };
    
    window.addEventListener('toggleSidebar', handleToggle);
    return () => window.removeEventListener('toggleSidebar', handleToggle);
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', view: 'public' as const },
    { icon: FolderKanban, label: 'Projects', view: 'upload' as const },
    { icon: Users, label: 'Teams', view: 'submit' as const },
    { icon: GraduationCap, label: 'Students', view: 'public' as const },
    { icon: Settings, label: 'About', view: 'about' as const },
    { icon: CurlyBracesIcon, label: 'ProjectEXPO', view: 'projectexpo' as const },
    { icon: Users, label: 'Rotaract Club', view: 'rotaract' as const },
    { icon: Projector, label: 'CSquareClub', view: 'CSquareClub' as const },
    { icon: Projector, label: 'YoungOratorClub', view: 'YoungOratorClub' as const },
  ];

  const handleItemClick = (view: 'public' | 'submit' | 'admin' | 'upload' | 'projectexpo' | 'about' | 'rotaract' | 'CSquareClub' | 'YoungOratorClub') => {
    if (onNavigate) {
      onNavigate(view);
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => window.dispatchEvent(new CustomEvent('toggleSidebar'))}
        />
      )}

      {/* Top Banner - Above Sidebar */}
      <div
        className={`fixed left-0 bg-white border-b-2 border-blue-500 w-64 transform transition-all duration-500 ease-out z-40 shadow-lg ${
          isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
        style={{ top: '0px', height: '63px' }}
      >
        <div className="h-full flex items-center justify-center px-4 relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 opacity-60"></div>
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-20 h-20 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 text-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
             
            </h1>
            <p className="text-xs font-medium text-blue-700 mt-0.5 flex items-center justify-center gap-1">
              <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Crafted by code, driven by curiosity
            </p>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white w-64 transform transition-all duration-500 ease-out z-40 shadow-2xl ${
          isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        } flex flex-col overflow-hidden`}
        style={{ top: '64px', height: 'calc(100vh - 63px)' }}
      >
        {/* Animated Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Header Banner */}
        <div className="relative px-4 py-6 border-b border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-lg blur-md opacity-50 animate-pulse"></div>
              <div className="relative bg-white/20 backdrop-blur-sm p-2 rounded-lg border border-white/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Innovation Hub
              </h2>
              <p className="text-xs text-blue-100/90 flex items-center gap-1">
                <Zap size={12} className="text-yellow-300" />
                Empowering Excellence
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto custom-scrollbar">
          <div className="mb-3 px-3">
            <p className="text-xs font-semibold text-blue-100/70 uppercase tracking-wider">Navigation</p>
          </div>
          <ul className="space-y-1.5">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentView === item.view;
              return (
                <li key={index}>
                  <button
                    onClick={() => handleItemClick(item.view)}
                    className={`w-full relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden ${
                      isActive
                        ? 'bg-white/20 shadow-lg shadow-blue-900/30 scale-105 border border-white/30'
                        : 'hover:bg-white/10 hover:translate-x-1 border border-transparent'
                    }`}
                  >
                    {/* Animated background for active item */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 animate-pulse"></div>
                    )}
                    
                    <div className={`relative z-10 ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
                      <Icon size={20} className={isActive ? 'drop-shadow-lg' : ''} />
                    </div>
                    <span className={`relative z-10 font-medium ${isActive ? 'font-semibold' : ''}`}>
                      {item.label}
                    </span>

                    {/* Hover shine effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="relative p-4 border-t border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="text-center mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              <span className="text-xs font-medium text-white">System Active</span>
            </div>
          </div>
          <p className="text-xs text-center text-blue-100/80 font-medium">
            © 2024 ProjectSphere
          </p>
          <p className="text-[10px] text-center text-blue-200/60 mt-1">
            Version 2.0.1
          </p>
        </div>
      </aside>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </>
  );
};

export default Sidebar;
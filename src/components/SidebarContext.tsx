// // SidebarContext.tsx
// import React, { createContext, useContext, useState } from 'react';

// const SidebarContext = createContext<{
//   isOpen: boolean;
//   toggleSidebar: () => void;
// }>({ isOpen: true, toggleSidebar: () => {} });

// export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [isOpen, setIsOpen] = useState(true);

//   const toggleSidebar = () => setIsOpen(!isOpen);

//   return (
//     <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
//       {children}
//     </SidebarContext.Provider>
//   );
// };

// export const useSidebar = () => useContext(SidebarContext);
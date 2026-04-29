// import React, { useState, useEffect } from "react";
// import { X, MessageSquarePlus, Send, Star, Lightbulb } from "lucide-react";
// import { supabase } from "../lib/supabase"; // ✅ Import Supabase client
// // Types
// interface Suggestion {
//   id: string;
//   title: string;
//   description: string;
//   created_at: string;
//   status: string;
// }

// const SuggestionPopup = () => {
//   const [showPrompt, setShowPrompt] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState<"form" | "history">("form");
//   const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Auto-show prompt after 2 seconds
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowPrompt(true);
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, []);

//   // Simulated fetch from Supabase
//   const fetchSuggestions = async () => {
//     // Replace this with actual Supabase query
//     // const { data, error } = await supabase
//     //   .from('suggestions')
//     //   .select('*')
//     //   .order('created_at', { ascending: false });

//     // Mock data for demonstration
//     const mockData: Suggestion[] = [
//       {
//         id: "1",
//         title: "Add Dark Mode",
//         description:
//           "Would be great to have a dark mode option for better viewing at night.",
//         created_at: "2025-11-09T10:30:00Z",
//         status: "pending",
//       },
//       {
//         id: "2",
//         title: "Improve Search",
//         description: "Search functionality could be faster and more accurate.",
//         created_at: "2025-11-08T15:20:00Z",
//         status: "reviewed",
//       },
//     ];

//     setSuggestions(mockData);
//   };

//   useEffect(() => {
//     if (isOpen && activeTab === "history") {
//       fetchSuggestions();
//     }
//   }, [isOpen, activeTab]);

//   const handleSubmit = async () => {
//     if (!formData.title || !formData.description) return;

//     setIsSubmitting(true);

//     // Replace with actual Supabase insert
//     // const { data, error } = await supabase
//     //   .from('suggestions')
//     //   .insert([
//     //     {
//     //       title: formData.title,
//     //       description: formData.description,
//     //       status: 'pending'
//     //     }
//     //   ]);

//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 1000));

//     setFormData({ title: "", description: "" });
//     setIsSubmitting(false);
//     setActiveTab("history");
//     fetchSuggestions();
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "pending":
//         return "bg-yellow-100 text-yellow-800";
//       case "reviewed":
//         return "bg-blue-100 text-blue-800";
//       case "approved":
//         return "bg-green-100 text-green-800";
//       case "rejected":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const openSuggestionForm = () => {
//     setShowPrompt(false);
//     setIsOpen(true);
//   };

//   const closeAll = () => {
//     setShowPrompt(false);
//     setIsOpen(false);
//   };

//   // Initial Prompt Card
//   if (showPrompt && !isOpen) {
//     return (
//       <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 w-[280px] sm:w-[300px] bg-white rounded-xl shadow-2xl z-50 overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-5 duration-500">
//         {/* Close Button */}
//         <button
//           onClick={closeAll}
//           className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-400 hover:text-gray-600 transition-colors z-10 bg-white rounded-full p-1 hover:bg-gray-100"
//           aria-label="Close"
//         >
//           <X size={16} className="sm:w-4 sm:h-4" />
//         </button>

//         {/* Header Section */}
//         <div className="bg-white p-4 sm:p-5 text-black relative overflow-hidden rounded-xl shadow-md">
//           <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-black/5 rounded-full -mr-10 sm:-mr-12 -mt-10 sm:-mt-12"></div>
//           <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-20 sm:h-20 bg-black/5 rounded-full -ml-8 sm:-ml-10 -mb-8 sm:-mb-10"></div>

//           <div className="relative flex items-start gap-2.5 sm:gap-3">
//             <div className="bg-black/5 rounded-full p-2 shadow-md flex-shrink-0">
//               <Star className="text-yellow-500 w-5 h-5" fill="currentColor" />
//             </div>
//             <div className="flex-1">
//               <h2 className="text-lg sm:text-xl font-bold mb-1">
//                 Share Your Suggestions!
//               </h2>
//               <p className="text-black text-xs sm:text-sm leading-relaxed">
//                 We'd love to hear from you! Help us improve your experience.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Button Section */}
//         <div className="p-4 sm:p-5">
//           <button
//             onClick={openSuggestionForm}
//             className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm"
//           >
//             <Lightbulb size={18} />
//             Give Suggestion
//             <Send size={16} />
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Full Form Modal
//   if (isOpen) {
//     return (
//       <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 w-[calc(100vw-2rem)] sm:w-[420px] md:w-[460px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-5 duration-500 max-h-[calc(100vh-2rem)] flex flex-col">
//         {/* Close Button */}
//         <button
//           onClick={closeAll}
//           className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 bg-white rounded-full p-1 hover:bg-gray-100"
//           aria-label="Close"
//         >
//           <X size={18} className="sm:w-5 sm:h-5" />
//         </button>

//         {/* Header Section */}
//         <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 p-6 sm:p-8 text-white relative overflow-hidden flex-shrink-0">
//           <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
//           <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full -ml-10 sm:-ml-12 -mb-10 sm:-mb-12"></div>

//           <div className="relative flex items-start gap-3 sm:gap-4">
//             <div className="bg-white rounded-full p-2.5 sm:p-3 shadow-lg flex-shrink-0">
//               <Star
//                 className="text-purple-600 w-6 h-6 sm:w-7 sm:h-7"
//                 fill="currentColor"
//               />
//             </div>
//             <div className="flex-1">
//               <h2 className="text-xl sm:text-2xl font-bold mb-2">
//                 Share Your Suggestions!
//               </h2>
//               <p className="text-purple-100 text-sm leading-relaxed">
//                 Help us improve your experience
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex border-b border-gray-200 bg-gray-50 flex-shrink-0">
//           <button
//             onClick={() => setActiveTab("form")}
//             className={`flex-1 py-3 px-3 sm:px-4 font-medium text-xs sm:text-sm transition-all ${
//               activeTab === "form"
//                 ? "text-purple-600 bg-white border-b-2 border-purple-600"
//                 : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
//             }`}
//           >
//             Give Suggestion
//           </button>
//           <button
//             onClick={() => setActiveTab("history")}
//             className={`flex-1 py-3 px-3 sm:px-4 font-medium text-xs sm:text-sm transition-all ${
//               activeTab === "history"
//                 ? "text-purple-600 bg-white border-b-2 border-purple-600"
//                 : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
//             }`}
//           >
//             Previous
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-4 sm:p-6 overflow-y-auto flex-1">
//           {activeTab === "form" ? (
//             <div className="space-y-4">
//               <div>
//                 <label
//                   htmlFor="title"
//                   className="block text-sm font-semibold text-gray-700 mb-2"
//                 >
//                   Title
//                 </label>
//                 <input
//                   type="text"
//                   id="title"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleChange}
//                   placeholder="Brief title for your suggestion"
//                   className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                 />
//               </div>

//               <div>
//                 <label
//                   htmlFor="description"
//                   className="block text-sm font-semibold text-gray-700 mb-2"
//                 >
//                   Description
//                 </label>
//                 <textarea
//                   id="description"
//                   name="description"
//                   value={formData.description}
//                   onChange={handleChange}
//                   rows={5}
//                   placeholder="Describe your suggestion in detail..."
//                   className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
//                 />
//               </div>

//               <button
//                 onClick={handleSubmit}
//                 disabled={
//                   isSubmitting || !formData.title || !formData.description
//                 }
//                 className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 sm:py-3.5 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
//               >
//                 {isSubmitting ? (
//                   <>
//                     <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     Submitting...
//                   </>
//                 ) : (
//                   <>
//                     <Lightbulb size={18} className="sm:w-5 sm:h-5" />
//                     Submit Suggestion
//                     <Send size={16} className="sm:w-4 sm:h-4" />
//                   </>
//                 )}
//               </button>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {suggestions.length === 0 ? (
//                 <div className="text-center text-gray-500 py-8 sm:py-12">
//                   <MessageSquarePlus
//                     size={40}
//                     className="sm:w-12 sm:h-12 mx-auto mb-4 text-gray-300"
//                   />
//                   <p className="font-medium text-gray-700 text-sm sm:text-base">
//                     No suggestions yet
//                   </p>
//                   <p className="text-xs sm:text-sm mt-2">
//                     Be the first to share your ideas!
//                   </p>
//                 </div>
//               ) : (
//                 suggestions.map((suggestion) => (
//                   <div
//                     key={suggestion.id}
//                     className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 sm:p-4 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
//                   >
//                     <div className="flex justify-between items-start mb-2 gap-2">
//                       <h3 className="font-semibold text-gray-900 text-sm sm:text-base flex-1">
//                         {suggestion.title}
//                       </h3>
//                       <span
//                         className={`text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-medium flex-shrink-0 ${getStatusColor(
//                           suggestion.status
//                         )}`}
//                       >
//                         {suggestion.status}
//                       </span>
//                     </div>
//                     <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">
//                       {suggestion.description}
//                     </p>
//                     <p className="text-xs text-gray-400 flex items-center gap-1">
//                       <span>📅</span>
//                       {formatDate(suggestion.created_at)}
//                     </p>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return null;
// };

// export default SuggestionPopup;
import React, { useState, useEffect } from "react";
import { X, MessageSquarePlus, Send, Star, Lightbulb } from "lucide-react";
import { supabase } from "../lib/supabase";

// Types
interface Suggestion {
  id: string;
  title: string;
  description: string;
  created_at: string;
  status: string;
}

const SuggestionPopup = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "history">("form");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto-show prompt after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Fetch suggestions from Supabase
  const fetchSuggestions = async () => {
    try {
      const { data, error } = await supabase
        .from('suggestions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching suggestions:', error);
        setError('Failed to load suggestions');
        return;
      }

      setSuggestions(data || []);
      setError(null);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === "history") {
      fetchSuggestions();
    }
  }, [isOpen, activeTab]);

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) return;

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { data, error } = await supabase
        .from('suggestions')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            status: 'pending'
          }
        ])
        .select();

      if (error) {
        console.error('Error submitting suggestion:', error);
        setError('Failed to submit suggestion. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Success
      setFormData({ title: "", description: "" });
      setSuccessMessage('Suggestion submitted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
      
      setActiveTab("history");
      fetchSuggestions();
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const openSuggestionForm = () => {
    setShowPrompt(false);
    setIsOpen(true);
  };

  const closeAll = () => {
    setShowPrompt(false);
    setIsOpen(false);
    setError(null);
    setSuccessMessage(null);
  };

  // Initial Prompt Card
  if (showPrompt && !isOpen) {
    return (
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 w-[280px] sm:w-[300px] bg-white rounded-xl shadow-2xl z-50 overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-5 duration-500">
        {/* Close Button */}
        <button
          onClick={closeAll}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-400 hover:text-gray-600 transition-colors z-10 bg-white rounded-full p-1 hover:bg-gray-100"
          aria-label="Close"
        >
          <X size={16} className="sm:w-4 sm:h-4" />
        </button>

        {/* Header Section */}
        <div className="bg-white p-4 sm:p-5 text-black relative overflow-hidden rounded-xl shadow-md">
          <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-black/5 rounded-full -mr-10 sm:-mr-12 -mt-10 sm:-mt-12"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-20 sm:h-20 bg-black/5 rounded-full -ml-8 sm:-ml-10 -mb-8 sm:-mb-10"></div>

          <div className="relative flex items-start gap-2.5 sm:gap-3">
            <div className="bg-black/5 rounded-full p-2 shadow-md flex-shrink-0">
              <Star className="text-yellow-500 w-5 h-5" fill="currentColor" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-bold mb-1">
                Share Your Suggestions!
              </h2>
              <p className="text-black text-xs sm:text-sm leading-relaxed">
                We'd love to hear from you! Help us improve your experience.
              </p>
            </div>
          </div>
        </div>

        {/* Button Section */}
        <div className="p-4 sm:p-5">
          <button
            onClick={openSuggestionForm}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2.5 sm:py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm"
          >
            <Lightbulb size={18} />
            Give Suggestion
            <Send size={16} />
          </button>
        </div>
      </div>
    );
  }

  // Full Form Modal
  if (isOpen) {
    return (
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 w-[calc(100vw-2rem)] sm:w-[360px] md:w-[380px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-5 duration-500 max-h-[calc(100vh-2rem)] flex flex-col">
        {/* Close Button */}
        <button
          onClick={closeAll}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 bg-white rounded-full p-1 hover:bg-gray-100"
          aria-label="Close"
        >
          <X size={18} className="sm:w-5 sm:h-5" />
        </button>

        {/* Header Section */}
        <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 p-4 sm:p-5 text-white relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full -mr-10 sm:-mr-12 -mt-10 sm:-mt-12"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full -ml-8 sm:-ml-10 -mb-8 sm:-mb-10"></div>

          <div className="relative flex items-start gap-2.5 sm:gap-3">
            <div className="bg-white rounded-full p-2 shadow-lg flex-shrink-0">
              <Star
                className="text-purple-600 w-5 h-5 sm:w-6 sm:h-6"
                fill="currentColor"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-bold mb-1">
                Share Your Suggestions!
              </h2>
              <p className="text-purple-100 text-xs sm:text-sm leading-relaxed">
                Help us improve your experience
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={() => setActiveTab("form")}
            className={`flex-1 py-3 px-3 sm:px-4 font-medium text-xs sm:text-sm transition-all ${
              activeTab === "form"
                ? "text-purple-600 bg-white border-b-2 border-purple-600"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            Give Suggestion
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-3 px-3 sm:px-4 font-medium text-xs sm:text-sm transition-all ${
              activeTab === "history"
                ? "text-purple-600 bg-white border-b-2 border-purple-600"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            Previous
          </button>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 overflow-y-auto flex-1">
          {activeTab === "form" ? (
            <div className="space-y-3">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  {successMessage}
                </div>
              )}

              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Brief title for your suggestion"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe your suggestion in detail..."
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={
                  isSubmitting || !formData.title || !formData.description
                }
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 sm:py-3.5 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Lightbulb size={18} className="sm:w-5 sm:h-5" />
                    Submit Suggestion
                    <Send size={16} className="sm:w-4 sm:h-4" />
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs sm:text-sm mb-3">
                  {error}
                </div>
              )}
              
              {suggestions.length === 0 ? (
                <div className="text-center text-gray-500 py-6 sm:py-8">
                  <MessageSquarePlus
                    size={36}
                    className="sm:w-10 sm:h-10 mx-auto mb-3 text-gray-300"
                  />
                  <p className="font-medium text-gray-700 text-sm sm:text-base">
                    No suggestions yet
                  </p>
                  <p className="text-xs sm:text-sm mt-2">
                    Be the first to share your ideas!
                  </p>
                </div>
              ) : (
                suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 sm:p-4 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base flex-1">
                        {suggestion.title}
                      </h3>
                      <span
                        className={`text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full font-medium flex-shrink-0 ${getStatusColor(
                          suggestion.status
                        )}`}
                      >
                        {suggestion.status}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">
                      {suggestion.description}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <span>📅</span>
                      {formatDate(suggestion.created_at)}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default SuggestionPopup;
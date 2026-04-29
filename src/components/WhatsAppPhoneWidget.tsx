//  import React, { useState, useEffect } from 'react';
// import { MessageCircle, Phone, X, Star, Send, User, TrendingUp, Loader } from 'lucide-react';
// import { supabase } from '../lib/supabase';

// const WhatsAppFeedbackWidget = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [showFeedbackModal, setShowFeedbackModal] = useState(false);
//   const [activeView, setActiveView] = useState('menu');
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [statistics, setStatistics] = useState(null);
//   const [formData, setFormData] = useState({ name: '', email: '', rating: 0, message: '' });
//   const [hoverRating, setHoverRating] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const WHATSAPP_NUMBER = '9523974130';
//   const PHONE_NUMBER = '+91 9523974130';

//   useEffect(() => {
//     if (showFeedbackModal && activeView === 'feedbacks') {
//       loadFeedbacks();
//       loadStatistics();
//     }
//   }, [showFeedbackModal, activeView]);

//   const loadFeedbacks = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const { data, error } = await supabase
//         .from('feedbacks')
//         .select('*')
//         .eq('status', 'approved')
//         .order('created_at', { ascending: false })
//         .limit(50);

//       if (error) throw error;
//       setFeedbacks(data || []);
//     } catch (err) {
//       console.error('Error loading feedbacks:', err);
//       setError('Failed to load feedbacks. Please try again.');
//       setFeedbacks([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadStatistics = async () => {
//     try {
//       const { data: stats, error: statsError } = await supabase
//         .from('feedbacks')
//         .select('rating')
//         .eq('status', 'approved');

//       if (statsError) throw statsError;

//       if (stats && stats.length > 0) {
//         const totalFeedbacks = stats.length;
//         const avgRating = (stats.reduce((sum, f) => sum + f.rating, 0) / totalFeedbacks).toFixed(2);
        
//         const ratingCounts = {
//           five_star_count: stats.filter(f => f.rating === 5).length,
//           four_star_count: stats.filter(f => f.rating === 4).length,
//           three_star_count: stats.filter(f => f.rating === 3).length,
//           two_star_count: stats.filter(f => f.rating === 2).length,
//           one_star_count: stats.filter(f => f.rating === 1).length,
//         };

//         setStatistics({
//           total_feedbacks: totalFeedbacks,
//           average_rating: avgRating,
//           ...ratingCounts
//         });
//       }
//     } catch (err) {
//       console.error('Error loading statistics:', err);
//     }
//   };

//   const saveFeedback = async (feedback) => {
//     setLoading(true);
//     setError('');
//     try {
//       const { data, error } = await supabase
//         .from('feedbacks')
//         .insert([
//           {
//             name: feedback.name,
//             email: feedback.email,
//             rating: feedback.rating,
//             message: feedback.message,
//             status: 'approved',
//             user_agent: navigator.userAgent
//           }
//         ])
//         .select();

//       if (error) throw error;

//       alert('Thank you for your feedback! It has been submitted successfully.');
      
//       await loadFeedbacks();
//       await loadStatistics();
      
//       return data;
//     } catch (err) {
//       console.error('Error saving feedback:', err);
//       setError(err.message || 'Failed to submit feedback. Please try again.');
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleToggle = () => {
//     if (!isOpen) {
//       setIsAnimating(true);
//       setTimeout(() => setIsAnimating(false), 600);
//     }
//     setIsOpen(!isOpen);
//   };

//   const handleWhatsApp = () => {
//     const message = encodeURIComponent('Hello! I would like to get in touch.');
//     window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
//   };

//   const handlePhone = () => {
//     window.location.href = `tel:${PHONE_NUMBER}`;
//   };

//   const handleFeedbackClick = () => {
//     setShowFeedbackModal(true);
//     setActiveView('menu');
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
    
//     if (formData.rating === 0) {
//       setError('Please select a rating');
//       return;
//     }
//     if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
//       setError('Please fill all fields');
//       return;
//     }
    
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       setError('Please enter a valid email address');
//       return;
//     }

//     try {
//       await saveFeedback(formData);
//       setFormData({ name: '', email: '', rating: 0, message: '' });
//       setActiveView('feedbacks');
//     } catch (err) {
//       // Error already handled
//     }
//   };

//   const avgRating = statistics?.average_rating || 
//     (feedbacks.length > 0 
//       ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
//       : 0);

//   const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
//     stars,
//     count: statistics?.[`${['one', 'two', 'three', 'four', 'five'][stars - 1]}_star_count`] || 
//            feedbacks.filter(f => f.rating === stars).length
//   }));

//   const totalFeedbacks = statistics?.total_feedbacks || feedbacks.length;

//   return (
//     <>
//       <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
//         <div
//           className={`absolute bottom-16 sm:bottom-20 right-0 flex flex-col gap-2 sm:gap-3 transition-all duration-300 ${
//             isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
//           }`}
//         >
//           <button
//             onClick={handleWhatsApp}
//             className="group w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 border-2 border-[#25D366]"
//             style={{ animation: isOpen ? 'slideUp 0.3s ease-out 0.1s both' : 'none' }}
//             title="WhatsApp"
//           >
//             <div className="relative">
//               <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 32 32" fill="none">
//                 <path fill="#25D366" d="M16 0C7.164 0 0 7.164 0 16c0 2.825.738 5.478 2.032 7.774L.695 30.32l6.788-1.78A15.897 15.897 0 0016 32c8.836 0 16-7.164 16-16S24.836 0 16 0z"/>
//                 <path fill="#FFF" d="M25.36 22.737c-.376.88-1.858 1.615-2.573 1.723-.689.092-1.587.138-2.557-.16-.586-.18-1.338-.42-2.301-.82-4.04-1.677-6.67-5.77-6.873-6.035-.197-.265-1.635-2.175-1.635-4.148 0-1.973 1.034-2.942 1.402-3.344.368-.402.804-.502 1.072-.502.268 0 .536.003.771.014.247.012.579-.094.906.69.334.8 1.14 2.782 1.24 2.983.1.2.167.434.034.7-.133.264-.2.429-.397.66-.197.23-.414.514-.591.69-.197.197-.402.41-.172.804.23.394 1.023 1.687 2.196 2.733 1.508 1.344 2.778 1.762 3.172 1.962.394.2.624.167.854-.1.23-.268.985-1.15 1.248-1.544.264-.394.527-.328.888-.197.361.132 2.293 1.081 2.687 1.278.394.197.657.295.754.459.1.164.1.937-.276 1.817z"/>
//               </svg>
//               <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-ping"></span>
//             </div>
//           </button>

//           <button
//             onClick={handlePhone}
//             className="group w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-blue-500 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
//             style={{ animation: isOpen ? 'slideUp 0.3s ease-out 0.2s both' : 'none' }}
//             title="Call Now"
//           >
//             <div className="relative">
//               <Phone className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
//               <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-ping"></span>
//             </div>
//           </button>

//           <button
//             onClick={handleFeedbackClick}
//             className="group w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
//             style={{ animation: isOpen ? 'slideUp 0.3s ease-out 0.3s both' : 'none' }}
//             title="Feedback"
//           >
//             <div className="relative">
//               <Star className="w-5 h-5 sm:w-7 sm:h-7 text-white fill-white" />
//               <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-yellow-300 rounded-full animate-ping"></span>
//             </div>
//           </button>
//         </div>

//         <button
//           onClick={handleToggle}
//           className={`relative group bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 sm:p-4 rounded-full shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-110 ${
//             isAnimating ? 'animate-wiggle' : ''
//           }`}
//           style={{ animation: 'float 3s ease-in-out infinite' }}
//         >
//           {isOpen ? (
//             <X className="w-6 h-6 sm:w-7 sm:h-7 animate-spin-once" />
//           ) : (
//             <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
//           )}
//           <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-ping opacity-75"></span>
//           {!isOpen && (
//             <span className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-bounce">
//               3
//             </span>
//           )}
//         </button>

//         <style jsx>{`
//           @keyframes float {
//             0%, 100% { transform: translateY(0px); }
//             50% { transform: translateY(-10px); }
//           }
//           @keyframes wiggle {
//             0%, 100% { transform: rotate(0deg); }
//             25% { transform: rotate(-10deg); }
//             75% { transform: rotate(10deg); }
//           }
//           @keyframes slideUp {
//             from { opacity: 0; transform: translateY(20px); }
//             to { opacity: 1; transform: translateY(0); }
//           }
//           @keyframes spin-once {
//             from { transform: rotate(0deg); }
//             to { transform: rotate(180deg); }
//           }
//           .animate-wiggle { animation: wiggle 0.6s ease-in-out; }
//           .animate-spin-once { animation: spin-once 0.3s ease-out; }
//         `}</style>
//       </div>

//       {showFeedbackModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center pointer-events-auto animate-fadeIn p-4 z-50">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slideUp">
//             <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 sm:p-6 text-white">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
//                   <Star className="w-5 h-5 sm:w-6 sm:h-6" />
//                   Feedback Center
//                 </h2>
//                 <button
//                   onClick={() => {
//                     setShowFeedbackModal(false);
//                     setActiveView('menu');
//                     setError('');
//                   }}
//                   className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all"
//                 >
//                   <X className="w-5 h-5 sm:w-6 sm:h-6" />
//                 </button>
//               </div>
//             </div>

//             {activeView === 'menu' && (
//               <div className="p-4 sm:p-8">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                   <button
//                     onClick={() => setActiveView('form')}
//                     className="group p-6 sm:p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
//                   >
//                     <div className="flex flex-col items-center gap-3 sm:gap-4">
//                       <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
//                         <Send className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
//                       </div>
//                       <h3 className="text-lg sm:text-xl font-bold text-gray-800">Submit Feedback</h3>
//                       <p className="text-sm sm:text-base text-gray-600 text-center">Share your thoughts with us</p>
//                     </div>
//                   </button>

//                   <button
//                     onClick={() => {
//                       setActiveView('feedbacks');
//                       loadFeedbacks();
//                       loadStatistics();
//                     }}
//                     className="group p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
//                   >
//                     <div className="flex flex-col items-center gap-3 sm:gap-4">
//                       <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
//                         <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
//                       </div>
//                       <h3 className="text-lg sm:text-xl font-bold text-gray-800">View Feedbacks</h3>
//                       <p className="text-sm sm:text-base text-gray-600 text-center">See all ratings & reviews</p>
//                       <div className="text-xl sm:text-2xl font-bold text-indigo-600">{totalFeedbacks}</div>
//                     </div>
//                   </button>
//                 </div>
//               </div>
//             )}

//             {activeView === 'form' && (
//               <div className="p-4 sm:p-8 overflow-y-auto max-h-[calc(90vh-80px)] sm:max-h-[calc(90vh-100px)]">
//                 <button
//                   onClick={() => {
//                     setActiveView('menu');
//                     setError('');
//                   }}
//                   className="mb-4 text-purple-600 hover:text-purple-800 flex items-center gap-2 text-sm sm:text-base"
//                 >
//                   ← Back
//                 </button>

//                 {error && (
//                   <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
//                     {error}
//                   </div>
//                 )}

//                 <div className="space-y-4 sm:space-y-6">
//                   <div>
//                     <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Name *</label>
//                     <input
//                       type="text"
//                       value={formData.name}
//                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                       className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors text-sm sm:text-base"
//                       placeholder="Your name"
//                       disabled={loading}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Email *</label>
//                     <input
//                       type="email"
//                       value={formData.email}
//                       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                       className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors text-sm sm:text-base"
//                       placeholder="your@email.com"
//                       disabled={loading}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Rating *</label>
//                     <div className="flex gap-1 sm:gap-2">
//                       {[1, 2, 3, 4, 5].map((star) => (
//                         <button
//                           key={star}
//                           type="button"
//                           onClick={() => setFormData({ ...formData, rating: star })}
//                           onMouseEnter={() => setHoverRating(star)}
//                           onMouseLeave={() => setHoverRating(0)}
//                           className="transform hover:scale-125 active:scale-110 transition-transform"
//                           disabled={loading}
//                         >
//                           <Star
//                             className={`w-8 h-8 sm:w-10 sm:h-10 ${
//                               star <= (hoverRating || formData.rating)
//                                 ? 'fill-yellow-400 text-yellow-400'
//                                 : 'text-gray-300'
//                             }`}
//                           />
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Message *</label>
//                     <textarea
//                       value={formData.message}
//                       onChange={(e) => setFormData({ ...formData, message: e.target.value })}
//                       rows="4"
//                       className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors resize-none text-sm sm:text-base"
//                       placeholder="Tell us what you think..."
//                       disabled={loading}
//                     ></textarea>
//                   </div>

//                   <button
//                     onClick={handleSubmit}
//                     disabled={loading}
//                     className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                   >
//                     {loading ? (
//                       <>
//                         <Loader className="w-5 h-5 animate-spin" />
//                         Submitting...
//                       </>
//                     ) : (
//                       'Submit Feedback'
//                     )}
//                   </button>
//                 </div>
//               </div>
//             )}

//             {activeView === 'feedbacks' && (
//               <div className="p-4 sm:p-8 overflow-y-auto max-h-[calc(90vh-80px)] sm:max-h-[calc(90vh-100px)]">
//                 <button
//                   onClick={() => setActiveView('menu')}
//                   className="mb-4 text-purple-600 hover:text-purple-800 flex items-center gap-2 text-sm sm:text-base"
//                 >
//                   ← Back
//                 </button>

//                 {loading && (
//                   <div className="flex justify-center items-center py-12">
//                     <Loader className="w-12 h-12 animate-spin text-purple-600" />
//                   </div>
//                 )}

//                 {!loading && (
//                   <>
//                     <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 sm:p-6 rounded-xl mb-4 sm:mb-6">
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                         <div className="text-center">
//                           <div className="text-4xl sm:text-5xl font-bold text-purple-600 mb-2">{avgRating}</div>
//                           <div className="flex justify-center mb-2">
//                             {[1, 2, 3, 4, 5].map((star) => (
//                               <Star
//                                 key={star}
//                                 className={`w-4 h-4 sm:w-5 sm:h-5 ${
//                                   star <= Math.round(avgRating)
//                                     ? 'fill-yellow-400 text-yellow-400'
//                                     : 'text-gray-300'
//                                 }`}
//                               />
//                             ))}
//                           </div>
//                           <div className="text-sm sm:text-base text-gray-600">Average Rating</div>
//                           <div className="text-xs text-gray-500 mt-1">Based on {totalFeedbacks} reviews</div>
//                         </div>

//                         <div className="space-y-2">
//                           {ratingDistribution.map(({ stars, count }) => (
//                             <div key={stars} className="flex items-center gap-2">
//                               <span className="text-xs sm:text-sm w-6 sm:w-8">{stars}★</span>
//                               <div className="flex-1 h-3 sm:h-4 bg-gray-200 rounded-full overflow-hidden">
//                                 <div
//                                   className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
//                                   style={{ width: totalFeedbacks ? `${(count / totalFeedbacks) * 100}%` : '0%' }}
//                                 ></div>
//                               </div>
//                               <span className="text-xs sm:text-sm w-6 sm:w-8">{count}</span>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </div>

//                     <div className="space-y-3 sm:space-y-4">
//                       {feedbacks.length === 0 ? (
//                         <div className="text-center py-8 sm:py-12 text-gray-500">
//                           <Star className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
//                           <p className="text-sm sm:text-base">No feedbacks yet. Be the first to share!</p>
//                         </div>
//                       ) : (
//                         feedbacks.map((feedback) => (
//                           <div key={feedback.id} className="bg-white border-2 border-gray-100 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
//                             <div className="flex items-start justify-between mb-3 gap-2">
//                               <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
//                                 <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
//                                   <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
//                                 </div>
//                                 <div className="min-w-0 flex-1">
//                                   <div className="font-semibold text-gray-800 text-sm sm:text-base truncate">{feedback.name}</div>
//                                   <div className="text-xs sm:text-sm text-gray-500">
//                                     {new Date(feedback.created_at).toLocaleDateString()}
//                                   </div>
//                                 </div>
//                               </div>
//                               <div className="flex flex-shrink-0">
//                                 {[1, 2, 3, 4, 5].map((star) => (
//                                   <Star
//                                     key={star}
//                                     className={`w-4 h-4 sm:w-5 sm:h-5 ${
//                                       star <= feedback.rating
//                                         ? 'fill-yellow-400 text-yellow-400'
//                                         : 'text-gray-300'
//                                     }`}
//                                   />
//                                 ))}
//                               </div>
//                             </div>
//                             <p className="text-gray-700 mb-2 text-sm sm:text-base">{feedback.message}</p>
//                             <div className="text-xs text-gray-400">
//                               {new Date(feedback.created_at).toLocaleString()}
//                             </div>
//                           </div>
//                         ))
//                       )}
//                     </div>
//                   </>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes slideUp {
//           from { transform: translateY(20px); opacity: 0; }
//           to { transform: translateY(0); opacity: 1; }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-out;
//         }
//         .animate-slideUp {
//           animation: slideUp 0.3s ease-out;
//         }
//       `}</style>
//     </>
//   );
// };

// export default WhatsAppFeedbackWidget;
import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, X, Star, Send, User, TrendingUp, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';

const WhatsAppFeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showPromptPopup, setShowPromptPopup] = useState(false);
  const [activeView, setActiveView] = useState('menu');
  const [feedbacks, setFeedbacks] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', rating: 0, message: '' });
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const WHATSAPP_NUMBER = '9523974130';
  const PHONE_NUMBER = '+91 9523974130';

  // Show prompt popup after 3 seconds on every page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPromptPopup(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showFeedbackModal && activeView === 'feedbacks') {
      loadFeedbacks();
      loadStatistics();
    }
  }, [showFeedbackModal, activeView]);

  const loadFeedbacks = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setFeedbacks(data || []);
    } catch (err) {
      console.error('Error loading feedbacks:', err);
      setError('Failed to load feedbacks. Please try again.');
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const { data: stats, error: statsError } = await supabase
        .from('feedbacks')
        .select('rating')
        .eq('status', 'approved');

      if (statsError) throw statsError;

      if (stats && stats.length > 0) {
        const totalFeedbacks = stats.length;
        const avgRating = (stats.reduce((sum, f) => sum + f.rating, 0) / totalFeedbacks).toFixed(2);
        
        const ratingCounts = {
          five_star_count: stats.filter(f => f.rating === 5).length,
          four_star_count: stats.filter(f => f.rating === 4).length,
          three_star_count: stats.filter(f => f.rating === 3).length,
          two_star_count: stats.filter(f => f.rating === 2).length,
          one_star_count: stats.filter(f => f.rating === 1).length,
        };

        setStatistics({
          total_feedbacks: totalFeedbacks,
          average_rating: avgRating,
          ...ratingCounts
        });
      }
    } catch (err) {
      console.error('Error loading statistics:', err);
    }
  };

  const saveFeedback = async (feedback) => {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase
        .from('feedbacks')
        .insert([
          {
            name: feedback.name,
            email: feedback.email,
            rating: feedback.rating,
            message: feedback.message,
            status: 'approved',
            user_agent: navigator.userAgent
          }
        ])
        .select();

      if (error) throw error;

      // alert('Thank you for your feedback! It has been submitted successfully.');
      
      await loadFeedbacks();
      await loadStatistics();
      
      return data;
    } catch (err) {
      console.error('Error saving feedback:', err);
      setError(err.message || 'Failed to submit feedback. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handlePromptClose = () => {
    setShowPromptPopup(false);
  };

  const handlePromptClick = () => {
    setShowPromptPopup(false);
    setShowFeedbackModal(true);
    setActiveView('form');
  };

  const handleToggle = () => {
    if (!isOpen) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
    setIsOpen(!isOpen);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hello! I would like to get in touch.');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const handlePhone = () => {
    window.location.href = `tel:${PHONE_NUMBER}`;
  };

  const handleFeedbackClick = () => {
    setShowFeedbackModal(true);
    setActiveView('menu');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.rating === 0) {
      setError('Please select a rating');
      return;
    }
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill all fields');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      await saveFeedback(formData);
      setFormData({ name: '', email: '', rating: 0, message: '' });
      setActiveView('feedbacks');
    } catch (err) {
      // Error already handled in saveFeedback
    }
  };

  const avgRating = statistics?.average_rating || 
    (feedbacks.length > 0 
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
      : 0);

  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: statistics?.[`${['one', 'two', 'three', 'four', 'five'][stars - 1]}_star_count`] || 
           feedbacks.filter(f => f.rating === stars).length
  }));

  const totalFeedbacks = statistics?.total_feedbacks || feedbacks.length;

  return (
    <>
      {/* Main Widget */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        {/* Action Buttons */}
        <div
          className={`absolute bottom-16 sm:bottom-20 right-0 flex flex-col gap-2 sm:gap-3 transition-all duration-300 ${
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <button
            onClick={handleWhatsApp}
            className="group w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 border-2 border-[#25D366]"
            style={{ animation: isOpen ? 'slideUp 0.3s ease-out 0.1s both' : 'none' }}
            title="WhatsApp"
          >
            <div className="relative">
              <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 32 32" fill="none">
                <path fill="#25D366" d="M16 0C7.164 0 0 7.164 0 16c0 2.825.738 5.478 2.032 7.774L.695 30.32l6.788-1.78A15.897 15.897 0 0016 32c8.836 0 16-7.164 16-16S24.836 0 16 0z"/>
                <path fill="#FFF" d="M25.36 22.737c-.376.88-1.858 1.615-2.573 1.723-.689.092-1.587.138-2.557-.16-.586-.18-1.338-.42-2.301-.82-4.04-1.677-6.67-5.77-6.873-6.035-.197-.265-1.635-2.175-1.635-4.148 0-1.973 1.034-2.942 1.402-3.344.368-.402.804-.502 1.072-.502.268 0 .536.003.771.014.247.012.579-.094.906.69.334.8 1.14 2.782 1.24 2.983.1.2.167.434.034.7-.133.264-.2.429-.397.66-.197.23-.414.514-.591.69-.197.197-.402.41-.172.804.23.394 1.023 1.687 2.196 2.733 1.508 1.344 2.778 1.762 3.172 1.962.394.2.624.167.854-.1.23-.268.985-1.15 1.248-1.544.264-.394.527-.328.888-.197.361.132 2.293 1.081 2.687 1.278.394.197.657.295.754.459.1.164.1.937-.276 1.817z"/>
              </svg>
              <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-ping"></span>
            </div>
          </button>

          <button
            onClick={handlePhone}
            className="group w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-blue-500 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
            style={{ animation: isOpen ? 'slideUp 0.3s ease-out 0.2s both' : 'none' }}
            title="Call Now"
          >
            <div className="relative">
              <Phone className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-ping"></span>
            </div>
          </button>

          <button
            onClick={handleFeedbackClick}
            className="group w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
            style={{ animation: isOpen ? 'slideUp 0.3s ease-out 0.3s both' : 'none' }}
            title="Feedback"
          >
            <div className="relative">
              <Star className="w-5 h-5 sm:w-7 sm:h-7 text-white fill-white" />
              <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-yellow-300 rounded-full animate-ping"></span>
            </div>
          </button>
        </div>

        {/* Main Toggle Button */}
        <button
          onClick={handleToggle}
          className={`relative group bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 sm:p-4 rounded-full shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-110 ${
            isAnimating ? 'animate-wiggle' : ''
          }`}
          style={{ animation: 'float 3s ease-in-out infinite' }}
        >
          {isOpen ? (
            <X className="w-6 h-6 sm:w-7 sm:h-7 animate-spin-once" />
          ) : (
            <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
          )}
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-ping opacity-75"></span>
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-bounce">
              3
            </span>
          )}
        </button>
      </div>

      {/* Feedback Prompt Popup */}
      {showPromptPopup && (
        <div className="fixed bottom-24 sm:bottom-28 right-4 sm:right-6 z-40 animate-slideInRight">
          <div className="relative bg-white rounded-2xl shadow-2xl p-5 w-64 sm:w-80 border-2 border-purple-200">
            {/* Close Button */}
            <button
              onClick={handlePromptClose}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-300 hover:rotate-90"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="pr-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-white fill-white" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-800">
                  Share Your Feedback!
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-relaxed">
                We'd love to hear from you! Please give us feedback to help us improve your experience.
              </p>

              <button
                onClick={handlePromptClick}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 px-4 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <Star className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                Give Feedback
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-2 -left-2 w-8 h-8 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-pink-400 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center pointer-events-auto animate-fadeIn p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slideUp">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 sm:p-6 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6" />
                  Feedback Center
                </h2>
                <button
                  onClick={() => {
                    setShowFeedbackModal(false);
                    setActiveView('menu');
                    setError('');
                  }}
                  className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {activeView === 'menu' && (
              <div className="p-4 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <button
                    onClick={() => setActiveView('form')}
                    className="group p-6 sm:p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    <div className="flex flex-col items-center gap-3 sm:gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                        <Send className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800">Submit Feedback</h3>
                      <p className="text-sm sm:text-base text-gray-600 text-center">Share your thoughts with us</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setActiveView('feedbacks');
                      loadFeedbacks();
                      loadStatistics();
                    }}
                    className="group p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    <div className="flex flex-col items-center gap-3 sm:gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                        <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800">View Feedbacks</h3>
                      <p className="text-sm sm:text-base text-gray-600 text-center">See all ratings & reviews</p>
                      <div className="text-xl sm:text-2xl font-bold text-indigo-600">{totalFeedbacks}</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {activeView === 'form' && (
              <div className="p-4 sm:p-8 overflow-y-auto max-h-[calc(90vh-80px)] sm:max-h-[calc(90vh-100px)]">
                <button
                  onClick={() => {
                    setActiveView('menu');
                    setError('');
                  }}
                  className="mb-4 text-purple-600 hover:text-purple-800 flex items-center gap-2 text-sm sm:text-base"
                >
                  ← Back
                </button>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors text-sm sm:text-base"
                      placeholder="Your name"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors text-sm sm:text-base"
                      placeholder="your@email.com"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Rating *</label>
                    <div className="flex gap-1 sm:gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transform hover:scale-125 active:scale-110 transition-transform"
                          disabled={loading}
                        >
                          <Star
                            className={`w-8 h-8 sm:w-10 sm:h-10 ${
                              star <= (hoverRating || formData.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Message *</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows="4"
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors resize-none text-sm sm:text-base"
                      placeholder="Tell us what you think..."
                      disabled={loading}
                    ></textarea>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Feedback'
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeView === 'feedbacks' && (
              <div className="p-4 sm:p-8 overflow-y-auto max-h-[calc(90vh-80px)] sm:max-h-[calc(90vh-100px)]">
                <button
                  onClick={() => setActiveView('menu')}
                  className="mb-4 text-purple-600 hover:text-purple-800 flex items-center gap-2 text-sm sm:text-base"
                >
                  ← Back
                </button>

                {loading && (
                  <div className="flex justify-center items-center py-12">
                    <Loader className="w-12 h-12 animate-spin text-purple-600" />
                  </div>
                )}

                {!loading && (
                  <>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 sm:p-6 rounded-xl mb-4 sm:mb-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="text-center">
                          <div className="text-4xl sm:text-5xl font-bold text-purple-600 mb-2">{avgRating}</div>
                          <div className="flex justify-center mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                  star <= Math.round(avgRating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-sm sm:text-base text-gray-600">Average Rating</div>
                          <div className="text-xs text-gray-500 mt-1">Based on {totalFeedbacks} reviews</div>
                        </div>

                        <div className="space-y-2">
                          {ratingDistribution.map(({ stars, count }) => (
                            <div key={stars} className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm w-6 sm:w-8">{stars}★</span>
                              <div className="flex-1 h-3 sm:h-4 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
                                  style={{ width: totalFeedbacks ? `${(count / totalFeedbacks) * 100}%` : '0%' }}
                                ></div>
                              </div>
                              <span className="text-xs sm:text-sm w-6 sm:w-8">{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      {feedbacks.length === 0 ? (
                        <div className="text-center py-8 sm:py-12 text-gray-500">
                          <Star className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-sm sm:text-base">No feedbacks yet. Be the first to share!</p>
                        </div>
                      ) : (
                        feedbacks.map((feedback) => (
                          <div key={feedback.id} className="bg-white border-2 border-gray-100 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-3 gap-2">
                              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="font-semibold text-gray-800 text-sm sm:text-base truncate">{feedback.name}</div>
                                  <div className="text-xs sm:text-sm text-gray-500">
                                    {new Date(feedback.created_at).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-shrink-0">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                      star <= feedback.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700 mb-2 text-sm sm:text-base">{feedback.message}</p>
                            <div className="text-xs text-gray-400">
                              {new Date(feedback.created_at).toLocaleString()}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin-once {
          from { transform: rotate(0deg); }
          to { transform: rotate(180deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-wiggle { animation: wiggle 0.6s ease-in-out; }
        .animate-spin-once { animation: spin-once 0.3s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.5s ease-out; }
      `}</style>
    </>
  );
};

export default WhatsAppFeedbackWidget;
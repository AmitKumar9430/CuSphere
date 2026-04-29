import { useState, useEffect } from 'react';

interface TutorialPopupProps {
  onClose: () => void;
}

export function TutorialPopup({ onClose }: TutorialPopupProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [activeTab, setActiveTab] = useState<'team' | 'project'>('team');
  const [currentStep, setCurrentStep] = useState(0);

  const teamSteps = [
    "Click 'Submit Team' → Select Subject → Choose Section → Pick Team Leader",
    "Going Solo? Select only leader. OR Add Teammates (min 1, max 3) → Select Project",
    "Enter Technologies used → Write short notes → Click 'Register'",
    "Return to Dashboard and verify registration ✅"
  ];
  
  const projectSteps = [
    "Download Sample Files (for reference) → Navigate to 'Project Submission' → Select Subject & Section",
    "Select your registered team → Upload PPT (.ppt/.pptx, Max 50MB)",
    "Upload Report (.pdf, Max 50MB) → Click 'Submit' → Verify in Submitted Projects ✅"
  ];

  const steps = activeTab === 'team' ? teamSteps : projectSteps;

  useEffect(() => {
    setCurrentStep(0);
  }, [activeTab]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [steps.length]);

  const closeTutorial = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <>
      {/* Background Overlay (Blur effect) */}
      <div
        className={`fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={closeTutorial}
      ></div>

      {/* Tutorial Popup */}
      <div
        className={`fixed top-20 left-1/2 -translate-x-1/2 z-40 p-4 transition-all duration-400 ${
          isClosing ? 'opacity-0' : 'opacity-100 animate-fadeIn'
        }`}
      >
        <div
          className={`bg-white rounded-2xl w-[400px] h-[500px] shadow-2xl overflow-hidden transform transition-all duration-400 flex flex-col ${
            isClosing
              ? 'scale-90 opacity-0 translate-y-8'
              : 'scale-100 opacity-100 animate-slideUp'
          }`}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white px-5 py-3.5 flex justify-between items-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer"></div>
            <h2 className="text-lg font-bold relative z-10">How to Use</h2>
            <button
              onClick={closeTutorial}
              className="w-8 h-8 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center text-2xl transition-all duration-300 hover:rotate-90 hover:scale-110 relative z-10"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 px-5">
            <button
              onClick={() => setActiveTab('team')}
              className={`flex-1 py-2.5 font-semibold text-xs transition-all duration-300 relative ${
                activeTab === 'team'
                  ? 'text-blue-700'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Submit Team
              {activeTab === 'team' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full animate-slideIn"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('project')}
              className={`flex-1 py-2.5 font-semibold text-xs transition-all duration-300 relative ${
                activeTab === 'project'
                  ? 'text-blue-700'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Submit Project
              {activeTab === 'project' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full animate-slideIn"></div>
              )}
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {steps.map((step, index) => (
              <div
                key={`${activeTab}-${index}`}
                className={`flex items-start mb-4 transition-all duration-500 ${
                  currentStep === index ? 'scale-105' : 'scale-100'
                }`}
                style={{
                  animation: `slideInLeft 0.5s ease forwards ${index * 0.1}s`,
                  opacity: 0
                }}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold flex-shrink-0 mr-3 text-white transition-all duration-500 ${
                    currentStep === index
                      ? 'bg-gradient-to-r from-blue-600 to-blue-800 scale-110 shadow-lg'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700'
                  }`}
                >
                  <span
                    className={`text-xs transition-transform duration-300 ${
                      currentStep === index ? 'scale-110' : ''
                    }`}
                  >
                    {index + 1}
                  </span>
                </div>
                <div
                  className={`text-slate-700 pt-0.5 text-xs flex-1 leading-relaxed transition-all duration-500 ${
                    currentStep === index ? 'text-slate-900 font-medium' : ''
                  }`}
                >
                  {step}
                </div>
              </div>
            ))}

            {/* Progress Indicators */}
            <div className="flex justify-center gap-2 mb-4 flex-wrap">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    currentStep === index
                      ? 'w-8 bg-blue-600'
                      : 'w-2 bg-slate-300'
                  }`}
                ></div>
              ))}
            </div>

            {/* Important Notes */}
            {activeTab === 'team' && (
              <div className="bg-blue-50 border-l-4 border-blue-600 p-3 mb-4 rounded-r-lg">
                <h3 className="font-semibold text-blue-900 mb-1.5 flex items-center text-xs">
                  <span className="text-base mr-2">📌</span>
                  Important:
                </h3>
                <ul className="text-xs text-blue-800 space-y-0.5 ml-5">
                  <li>• Min 1, Max 3 teammates</li>
                  <li>• Same section required</li>
                  <li>• Solo option available</li>
                </ul>
              </div>
            )}

            {activeTab === 'project' && (
              <div className="bg-blue-50 border-l-4 border-blue-600 p-3 mb-4 rounded-r-lg">
                <h3 className="font-semibold text-blue-900 mb-1.5 flex items-center text-xs">
                  <span className="text-base mr-2">📌</span>
                  Important:
                </h3>
                <ul className="text-xs text-blue-800 space-y-0.5 ml-5">
                  <li>• PPT: .ppt/.pptx (Max 50MB)</li>
                  <li>• Report: .pdf (Max 50MB)</li>
                  <li>• Sample files for reference</li>
                </ul>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-5 pt-0">
            <button
              onClick={closeTutorial}
              className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-2.5 px-6 rounded-xl font-semibold text-sm shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 active:translate-y-0 relative overflow-hidden group"
            >
              <span className="relative z-10">Got It!</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease; }
        .animate-slideUp { animation: slideUp 0.5s ease; }
        .animate-slideIn { animation: slideIn 0.3s ease; transform-origin: left; }
        .animate-shimmer { animation: shimmer 3s infinite; }
      `}</style>
    </>
  );
}

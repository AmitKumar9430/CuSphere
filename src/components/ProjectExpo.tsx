import React, { useState } from 'react';
import { Users, Trophy, Code, Calendar, Upload, X, Plus, CheckCircle, AlertCircle } from 'lucide-react';

type FormData = {
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  member1Name: string;
  member1Email: string;
  member2Name: string;
  member2Email: string;
  projectTitle: string;
  projectCategory: string;
  projectDescription: string;
  techStack: string;
  githubLink: string;
  demoLink: string;
  preferredDate: string;
};

type Errors = Partial<Record<keyof FormData, string>>;

const ProjectExpo = () => {
  const [formData, setFormData] = useState<FormData>({
    teamName: '',
    leaderName: '',
    leaderEmail: '',
    leaderPhone: '',
    member1Name: '',
    member1Email: '',
    member2Name: '',
    member2Email: '',
    projectTitle: '',
    projectCategory: '',
    projectDescription: '',
    techStack: '',
    githubLink: '',
    demoLink: '',
    preferredDate: '',
  });

  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const categories = [
    'Web Development',
    'Mobile App',
    'AI/ML',
    'IoT',
    'Blockchain',
    'Game Development',
    'Data Science',
    'Cybersecurity',
    'Cloud Computing',
    'Other'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name as keyof FormData]: ''
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size should be less than 10MB');
        return;
      }
      setUploadedFile(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!formData.teamName.trim()) newErrors.teamName = 'Team name is required';
    if (!formData.leaderName.trim()) newErrors.leaderName = 'Leader name is required';
    if (!formData.leaderEmail.trim()) {
      newErrors.leaderEmail = 'Leader email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.leaderEmail)) {
      newErrors.leaderEmail = 'Invalid email format';
    }
    if (!formData.leaderPhone.trim()) {
      newErrors.leaderPhone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.leaderPhone.replace(/\D/g, ''))) {
      newErrors.leaderPhone = 'Invalid phone number';
    }
    if (!formData.projectTitle.trim()) newErrors.projectTitle = 'Project title is required';
    if (!formData.projectCategory) newErrors.projectCategory = 'Please select a category';
    if (!formData.projectDescription.trim()) {
      newErrors.projectDescription = 'Project description is required';
    } else if (formData.projectDescription.length < 50) {
      newErrors.projectDescription = 'Description must be at least 50 characters';
    }
    if (!formData.techStack.trim()) newErrors.techStack = 'Tech stack is required';
    if (!formData.preferredDate) newErrors.preferredDate = 'Please select a date';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form submitted:', formData);
      console.log('Uploaded file:', uploadedFile);
      setSubmitted(true);
      
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          teamName: '',
          leaderName: '',
          leaderEmail: '',
          leaderPhone: '',
          member1Name: '',
          member1Email: '',
          member2Name: '',
          member2Email: '',
          projectTitle: '',
          projectCategory: '',
          projectDescription: '',
          techStack: '',
          githubLink: '',
          demoLink: '',
          preferredDate: '',
        });
        setUploadedFile(null);
      }, 3000);
    }
  };

  const handleReset = () => {
    setFormData({
      teamName: '',
      leaderName: '',
      leaderEmail: '',
      leaderPhone: '',
      member1Name: '',
      member1Email: '',
      member2Name: '',
      member2Email: '',
      projectTitle: '',
      projectCategory: '',
      projectDescription: '',
      techStack: '',
      githubLink: '',
      demoLink: '',
      preferredDate: '',
    });
    setUploadedFile(null);
    setErrors({});
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
            <p className="text-gray-600">
              Your team has been successfully registered for ProjectEXPO 2024
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Team:</strong> {formData.teamName}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Project:</strong> {formData.projectTitle}
            </p>
          </div>
          <p className="text-sm text-gray-500">
            A confirmation email has been sent to {formData.leaderEmail}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ProjectEXPO 2024
          </h1>
          <p className="text-gray-600 text-lg">
            Register your innovative project and showcase your talent
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-blue-500">
            <Calendar className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-800">Event Date</h3>
            <p className="text-sm text-gray-600">December 15-17, 2024</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-purple-500">
            <Users className="w-6 h-6 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-800">Team Size</h3>
            <p className="text-sm text-gray-600">1 Leader + 2 Members</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-green-500">
            <Code className="w-6 h-6 text-green-600 mb-2" />
            <h3 className="font-semibold text-gray-800">Prizes</h3>
            <p className="text-sm text-gray-600">Worth ₹1,00,000+</p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Team Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              Team Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Team Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.teamName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your team name"
                />
                {errors.teamName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.teamName}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Team Leader Details */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Team Leader Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="leaderName"
                  value={formData.leaderName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.leaderName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                />
                {errors.leaderName && (
                  <p className="text-red-500 text-sm mt-1">{errors.leaderName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="leaderEmail"
                  value={formData.leaderEmail}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.leaderEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="john@example.com"
                />
                {errors.leaderEmail && (
                  <p className="text-red-500 text-sm mt-1">{errors.leaderEmail}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="leaderPhone"
                  value={formData.leaderPhone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.leaderPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+91 98765 43210"
                />
                {errors.leaderPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.leaderPhone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Team Members</h3>
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">Member 1</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="member1Name"
                    value={formData.member1Name}
                    onChange={handleChange}
                    className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Full Name"
                  />
                  <input
                    type="email"
                    name="member1Email"
                    value={formData.member1Email}
                    onChange={handleChange}
                    className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email Address"
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">Member 2</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="member2Name"
                    value={formData.member2Name}
                    onChange={handleChange}
                    className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Full Name"
                  />
                  <input
                    type="email"
                    name="member2Email"
                    value={formData.member2Email}
                    onChange={handleChange}
                    className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email Address"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Code className="w-6 h-6 text-purple-600" />
              Project Details
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="projectTitle"
                  value={formData.projectTitle}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.projectTitle ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your project title"
                />
                {errors.projectTitle && (
                  <p className="text-red-500 text-sm mt-1">{errors.projectTitle}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="projectCategory"
                  value={formData.projectCategory}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.projectCategory ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.projectCategory && (
                  <p className="text-red-500 text-sm mt-1">{errors.projectCategory}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project Description <span className="text-red-500">*</span>
                  <span className="text-gray-500 font-normal ml-2">(min. 50 characters)</span>
                </label>
                <textarea
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleChange}
                  rows="5"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.projectDescription ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe your project, its features, and impact..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.projectDescription.length}/500 characters
                </p>
                {errors.projectDescription && (
                  <p className="text-red-500 text-sm mt-1">{errors.projectDescription}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tech Stack <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.techStack ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., React, Node.js, MongoDB, Python"
                />
                {errors.techStack && (
                  <p className="text-red-500 text-sm mt-1">{errors.techStack}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    GitHub Repository Link
                  </label>
                  <input
                    type="url"
                    name="githubLink"
                    value={formData.githubLink}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://github.com/username/repo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Demo/Live Link
                  </label>
                  <input
                    type="url"
                    name="demoLink"
                    value={formData.demoLink}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://your-demo.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preferred Presentation Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  min="2024-12-15"
                  max="2024-12-17"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.preferredDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.preferredDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.preferredDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project Presentation/Document
                  <span className="text-gray-500 font-normal ml-2">(PDF, PPT - Max 10MB)</span>
                </label>
                {!uploadedFile ? (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.ppt,.pptx"
                      onChange={handleFileUpload}
                    />
                  </label>
                ) : (
                  <div className="flex items-center justify-between bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{uploadedFile.name}</p>
                        <p className="text-xs text-gray-600">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Register Team
            </button>
            <button
              onClick={handleReset}
              className="px-8 bg-gray-200 text-gray-700 font-bold py-4 rounded-lg hover:bg-gray-300 transition-all"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectExpo;
import React, { useState } from 'react';
import { Users, Calendar, Award, Heart, TrendingUp, Mail, Phone, MapPin, ChevronRight, Sparkles, Target, Globe } from 'lucide-react';

const RotaractClub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'about' | 'events' | 'members' | 'contact'>('about');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const upcomingEvents = [
    {
      id: 1,
      title: 'Community Blood Donation Drive',
      date: 'December 15, 2024',
      time: '9:00 AM - 5:00 PM',
      location: 'College Campus',
      category: 'Community Service',
      participants: 150,
    },
    {
      id: 2,
      title: 'Environmental Clean-Up Campaign',
      date: 'December 22, 2024',
      time: '6:00 AM - 10:00 AM',
      location: 'City Park',
      category: 'Environment',
      participants: 80,
    },
    {
      id: 3,
      title: 'Leadership Workshop 2024',
      date: 'January 5, 2025',
      time: '2:00 PM - 6:00 PM',
      location: 'Auditorium',
      category: 'Professional Development',
      participants: 120,
    },
  ];

  const achievements = [
    {
      icon: Award,
      title: 'Best Club Award 2023',
      description: 'Recognized by Rotary International',
    },
    {
      icon: Heart,
      title: '500+ Lives Impacted',
      description: 'Through community service projects',
    },
    {
      icon: Users,
      title: '150+ Active Members',
      description: 'Passionate change-makers',
    },
    {
      icon: TrendingUp,
      title: '50+ Projects Completed',
      description: 'In the last academic year',
    },
  ];

  const teamMembers = [
    { name: 'Arjun Sharma', position: 'President', image: '👨‍💼' },
    { name: 'Priya Patel', position: 'Vice President', image: '👩‍💼' },
    { name: 'Rahul Kumar', position: 'Secretary', image: '👨‍💻' },
    { name: 'Sneha Reddy', position: 'Treasurer', image: '👩‍💻' },
  ];

  const focusAreas = [
    {
      icon: Heart,
      title: 'Community Service',
      description: 'Supporting local communities through various welfare programs',
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: Globe,
      title: 'International Understanding',
      description: 'Promoting peace and cultural exchange globally',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Target,
      title: 'Professional Development',
      description: 'Building leadership and professional skills',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      icon: Sparkles,
      title: 'Club Service',
      description: 'Strengthening fellowship among members',
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message sent successfully!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center">
            <div className="inline-block animate-bounce mb-4">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                <Users className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
              Rotaract Club
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-6 max-w-3xl mx-auto">
              Service Above Self | Fellowship Through Service
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Join Us Today
              </button>
              <button className="px-8 py-3 bg-blue-500/30 backdrop-blur-sm text-white rounded-full font-semibold hover:bg-blue-500/50 transition-all border-2 border-white/30">
                View Events
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto">
            {[
              { id: 'about', label: 'About Us' },
              { id: 'events', label: 'Events' },
              { id: 'members', label: 'Team' },
              { id: 'contact', label: 'Contact' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 font-semibold transition-all relative whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="space-y-12 animate-fade-in">
            {/* Mission Statement */}
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Sparkles className="text-blue-600" />
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                The Rotaract Club is a vibrant community of young leaders committed to creating positive change through service, fellowship, and professional development. We believe in the power of youth to transform communities and make a lasting impact on the world.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                As part of the global Rotary family, we work on projects that address local and international needs while developing leadership skills and building lifelong friendships.
              </p>
            </div>

            {/* Focus Areas */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Focus Areas</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {focusAreas.map((area, index) => {
                  const Icon = area.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
                    >
                      <div className={`w-14 h-14 bg-gradient-to-br ${area.color} rounded-xl flex items-center justify-center mb-4`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{area.title}</h3>
                      <p className="text-gray-600">{area.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Achievements</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center hover:shadow-lg transition-all"
                    >
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Events</h2>
              <p className="text-gray-600">Join us in making a difference</p>
            </div>

            <div className="grid gap-6">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-semibold rounded-full">
                          {event.category}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{event.title}</h3>
                      <div className="space-y-2 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-blue-600" />
                          <span>{event.participants} participants expected</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 justify-center">
                      Register Now
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Meet Our Team</h2>
              <p className="text-gray-600">Leading with passion and dedication</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all transform hover:-translate-y-2"
                >
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-semibold">{member.position}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Want to Join Our Team?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                We're always looking for passionate individuals who want to make a difference. Join us and be part of something amazing!
              </p>
              <button className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-all shadow-lg">
                Apply for Membership
              </button>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Get in Touch</h2>
              <p className="text-gray-600">We'd love to hear from you</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-4">
                  <Mail className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600 text-sm">rotaract@college.edu</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-4">
                  <Phone className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-600 text-sm">+91 98765 43210</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-4">
                  <MapPin className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Location</h3>
                <p className="text-gray-600 text-sm">College Campus, Main Building</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Your Email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Subject"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your Message"
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
                <button 
                  onClick={handleSubmit}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RotaractClub;
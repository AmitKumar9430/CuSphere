import React, { useState } from 'react';
import { Users, Calendar, Award, Heart, TrendingUp, Mail, Phone, MapPin, ChevronRight, Sparkles, Target, Globe, Code, Cpu, Trophy, Zap, Terminal, Rocket, BookOpen, Lightbulb } from 'lucide-react';

const CSquareClub: React.FC = () => {
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
      title: 'CodeStorm 2024 - Hackathon',
      date: 'December 15-16, 2024',
      time: '24 Hours',
      location: 'Computer Lab & Online',
      category: 'Hackathon',
      participants: 200,
      prize: '₹50,000'
    },
    {
      id: 2,
      title: 'Algorithm Design Workshop',
      date: 'December 20, 2024',
      time: '2:00 PM - 5:00 PM',
      location: 'Seminar Hall',
      category: 'Workshop',
      participants: 150,
      prize: 'Certificate'
    },
    {
      id: 3,
      title: 'Tech Talk: AI & Machine Learning',
      date: 'January 8, 2025',
      time: '3:00 PM - 5:00 PM',
      location: 'Auditorium',
      category: 'Tech Talk',
      participants: 300,
      prize: 'Free Access'
    },
    {
      id: 4,
      title: 'Code Combat - Programming Contest',
      date: 'January 15, 2025',
      time: '10:00 AM - 4:00 PM',
      location: 'Online Platform',
      category: 'Competition',
      participants: 180,
      prize: '₹30,000'
    },
  ];

  const achievements = [
    {
      icon: Trophy,
      title: '15+ Competitions Organized',
      description: 'Successfully hosted coding contests',
    },
    {
      icon: Users,
      title: '500+ Active Members',
      description: 'Passionate coders and tech enthusiasts',
    },
    {
      icon: Award,
      title: 'Best Tech Club 2023',
      description: 'University Excellence Award',
    },
    {
      icon: Rocket,
      title: '30+ Industry Collaborations',
      description: 'Partnerships with leading tech companies',
    },
  ];

  const teamMembers = [
    { name: 'Aarav Gupta', position: 'President', image: '👨‍💻', expertise: 'Full Stack Dev' },
    { name: 'Diya Sharma', position: 'Vice President', image: '👩‍💻', expertise: 'ML Engineer' },
    { name: 'Rohan Verma', position: 'Technical Head', image: '👨‍🔬', expertise: 'Competitive Programming' },
    { name: 'Ananya Singh', position: 'Event Coordinator', image: '👩‍🎨', expertise: 'UI/UX Design' },
    { name: 'Kabir Mehta', position: 'Treasurer', image: '👨‍💼', expertise: 'FinTech' },
    { name: 'Ishita Patel', position: 'Social Media Head', image: '👩‍🚀', expertise: 'Digital Marketing' },
  ];

  const focusAreas = [
    {
      icon: Code,
      title: 'Competitive Programming',
      description: 'Master algorithms, data structures, and problem-solving skills',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Cpu,
      title: 'Tech Workshops',
      description: 'Hands-on sessions on latest technologies and frameworks',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Lightbulb,
      title: 'Hackathons',
      description: 'Build innovative solutions in intense coding marathons',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: BookOpen,
      title: 'Skill Development',
      description: 'Regular coding challenges and learning resources',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const pastEvents = [
    { name: 'HackFest 2023', participants: 250, winner: 'Team Alpha' },
    { name: 'Web Dev Bootcamp', participants: 180, winner: 'All Participants' },
    { name: 'DSA Championship', participants: 120, winner: 'Ravi Kumar' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message sent successfully! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djEwaC00VjM0aDR6bS0xMCAwdjEwaC00VjM0aDR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="relative max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-10">

          <div className="text-center">
            <div className="inline-block animate-bounce mb-4">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-4 border-white/20 shadow-2xl">
                <Terminal className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
              C Square Club
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-2 max-w-3xl mx-auto font-semibold">
              Code • Compete • Conquer
            </p>
            <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto">
              Where Innovation Meets Implementation
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold hover:bg-blue-50 transition-all shadow-2xl hover:shadow-blue-500/50 transform hover:-translate-y-1 hover:scale-105">
                Join the Club
              </button>
              <button className="px-8 py-4 bg-blue-500/30 backdrop-blur-sm text-white rounded-full font-bold hover:bg-blue-500/50 transition-all border-2 border-white/30 shadow-xl">
                Upcoming Events
              </button>
            </div>
          </div>
        </div>

        {/* Floating Code Snippets Animation */}
        <div className="absolute top-20 left-10 opacity-20 text-sm font-mono text-white hidden lg:block">
          {'<code>'}
        </div>
        <div className="absolute bottom-20 right-10 opacity-20 text-sm font-mono text-white hidden lg:block">
          {'</dev>'}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-slate-800/95 backdrop-blur-md shadow-xl sticky top-0 z-40 border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto">
            {[
              { id: 'about', label: 'About Us', icon: Sparkles },
              { id: 'events', label: 'Events', icon: Calendar },
              { id: 'members', label: 'Team', icon: Users },
              { id: 'contact', label: 'Contact', icon: Mail },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 font-semibold transition-all relative whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'text-blue-400'
                      : 'text-gray-400 hover:text-blue-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-t-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="space-y-12 animate-fade-in">
            {/* Mission Statement */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 md:p-12 border border-blue-500/20">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Zap className="text-blue-400" />
                Our Mission
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                C Square Club is the premier coding and technology community at our university. We are dedicated to fostering a culture of innovation, collaboration, and continuous learning among aspiring developers and tech enthusiasts.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                Through competitive programming contests, hackathons, workshops, and tech talks, we provide a platform for students to enhance their coding skills, work on real-world projects, and connect with industry professionals.
              </p>
              <p className="text-lg text-blue-300 leading-relaxed font-semibold">
                Join us in our journey to transform passionate coders into industry-ready professionals!
              </p>
            </div>

            {/* Focus Areas */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
                <Target className="text-blue-400" />
                What We Do
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {focusAreas.map((area, index) => {
                  const Icon = area.icon;
                  return (
                    <div
                      key={index}
                      className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:shadow-blue-500/20 transition-all transform hover:-translate-y-2 border border-blue-500/10"
                    >
                      <div className={`w-16 h-16 bg-gradient-to-br ${area.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{area.title}</h3>
                      <p className="text-gray-400">{area.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
                <Award className="text-blue-400" />
                Our Achievements
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-xl p-6 text-center hover:shadow-2xl hover:shadow-purple-500/30 transition-all border border-purple-500/20 transform hover:scale-105"
                    >
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{achievement.title}</h3>
                      <p className="text-sm text-gray-300">{achievement.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Past Events Highlights */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 border border-blue-500/20">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Trophy className="text-yellow-400" />
                Recent Success Stories
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {pastEvents.map((event, index) => (
                  <div key={index} className="bg-slate-700/50 rounded-xl p-4 border border-blue-500/10">
                    <h4 className="font-bold text-blue-300 mb-2">{event.name}</h4>
                    <p className="text-sm text-gray-400">Participants: {event.participants}</p>
                    <p className="text-sm text-gray-400">Winner: {event.winner}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                <Calendar className="text-blue-400" />
                Upcoming Events
              </h2>
              <p className="text-gray-400">Join us and showcase your coding prowess</p>
            </div>

            <div className="grid gap-6">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 md:p-8 hover:shadow-purple-500/30 transition-all border border-purple-500/20 transform hover:-translate-y-1"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-4 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-bold rounded-full shadow-lg">
                          {event.category}
                        </span>
                        {event.prize && (
                          <span className="px-4 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold rounded-full shadow-lg">
                            Prize: {event.prize}
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">{event.title}</h3>
                      <div className="space-y-2 text-gray-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-blue-400" />
                          <span>{event.date} • {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-blue-400" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-blue-400" />
                          <span>{event.participants} participants expected</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center gap-2 justify-center shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105">
                      Register Now
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 rounded-2xl p-8 md:p-12 text-white text-center shadow-2xl">
              <Rocket className="w-16 h-16 mx-auto mb-4 animate-bounce" />
              <h3 className="text-3xl font-bold mb-4">Have an Event Idea?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                We're always looking for innovative event ideas and collaboration opportunities. Share your thoughts with us!
              </p>
              <button className="px-8 py-3 bg-white text-blue-600 rounded-full font-bold hover:bg-blue-50 transition-all shadow-xl transform hover:scale-105">
                Propose an Event
              </button>
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                <Users className="text-blue-400" />
                Meet Our Team
              </h2>
              <p className="text-gray-400">The minds behind C Square's success</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 text-center hover:shadow-purple-500/30 transition-all transform hover:-translate-y-2 border border-purple-500/20"
                >
                  <div className="text-7xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-purple-400 font-semibold mb-2">{member.position}</p>
                  <p className="text-sm text-gray-400">{member.expertise}</p>
                </div>
              ))}
            </div>

            {/* Join CTA */}
            <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 text-white text-center border border-blue-500/30 shadow-2xl">
              <Code className="w-16 h-16 mx-auto mb-4 text-blue-300" />
              <h3 className="text-3xl font-bold mb-4">Want to Join Our Team?</h3>
              <p className="text-blue-200 mb-6 max-w-2xl mx-auto">
                We're always looking for passionate coders, creative minds, and tech enthusiasts to join our family. 
                Whether you're a beginner or an expert, there's a place for you here!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-bold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-xl transform hover:scale-105">
                  Apply for Membership
                </button>
                <button className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full font-bold hover:bg-white/20 transition-all border-2 border-white/30">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                <Mail className="text-blue-400" />
                Get in Touch
              </h2>
              <p className="text-gray-400">We'd love to hear from you!</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl p-6 text-center hover:shadow-blue-500/30 transition-all border border-blue-500/20 transform hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mb-4 shadow-lg">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">Email</h3>
                <p className="text-gray-400 text-sm">csquare@university.edu</p>
              </div>

              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl p-6 text-center hover:shadow-purple-500/30 transition-all border border-purple-500/20 transform hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">Phone</h3>
                <p className="text-gray-400 text-sm">+91 98765 43210</p>
              </div>

              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl p-6 text-center hover:shadow-purple-500/30 transition-all border border-purple-500/20 transform hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">Location</h3>
                <p className="text-gray-400 text-sm">University Campus, CS Block</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 border border-blue-500/20">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Sparkles className="text-blue-400" />
                Send us a Message
              </h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-blue-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Your Email"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                  />
                </div>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Subject"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your Message"
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                ></textarea>
                <button 
                  onClick={handleSubmit}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105"
                >
                  Send Message
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 rounded-2xl p-8 text-white text-center shadow-2xl">
              <h3 className="text-2xl font-bold mb-4">Connect With Us</h3>
              <p className="text-blue-100 mb-6">Follow us on social media for updates and announcements</p>
              <div className="flex justify-center gap-4">
                <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all border border-white/30">
                  <Globe className="w-6 h-6" />
                </button>
                <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all border border-white/30">
                  <Mail className="w-6 h-6" />
                </button>
                <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all border border-white/30">
                  <Users className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CSquareClub;
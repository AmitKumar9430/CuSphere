import React, { useState } from 'react';
import { Users, Calendar, Award, Heart, TrendingUp, Mail, Phone, MapPin, ChevronRight, Sparkles, Target, Globe, Mic, MessageCircle, Trophy, Zap, BookOpen, Lightbulb, Volume2, Radio, Presentation, Users2 } from 'lucide-react';

const YoungOratorClub: React.FC = () => {
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
      title: 'National Debate Championship 2024',
      date: 'December 18-19, 2024',
      time: '9:00 AM - 6:00 PM',
      location: 'Main Auditorium',
      category: 'Debate',
      participants: 150,
      prize: '₹75,000'
    },
    {
      id: 2,
      title: 'Public Speaking Masterclass',
      date: 'December 22, 2024',
      time: '2:00 PM - 5:00 PM',
      location: 'Conference Hall',
      category: 'Workshop',
      participants: 120,
      prize: 'Certificate'
    },
    {
      id: 3,
      title: 'The Great Orator - Speech Competition',
      date: 'January 10, 2025',
      time: '10:00 AM - 4:00 PM',
      location: 'University Auditorium',
      category: 'Competition',
      participants: 200,
      prize: '₹50,000'
    },
    {
      id: 4,
      title: 'Storytelling & Elocution Fest',
      date: 'January 20, 2025',
      time: '3:00 PM - 7:00 PM',
      location: 'Drama Hall',
      category: 'Festival',
      participants: 180,
      prize: '₹40,000'
    },
  ];

  const achievements = [
    {
      icon: Trophy,
      title: '20+ Speech Competitions',
      description: 'Organized successful oratory events',
    },
    {
      icon: Users,
      title: '600+ Active Members',
      description: 'Passionate speakers and communicators',
    },
    {
      icon: Award,
      title: 'Best Communication Club 2023',
      description: 'University Excellence Award',
    },
    {
      icon: Mic,
      title: '50+ Guest Speakers',
      description: 'Renowned orators and industry leaders',
    },
  ];

  const teamMembers = [
    { name: 'Priya Malhotra', position: 'President', image: '👩‍💼', expertise: 'Public Speaking' },
    { name: 'Arjun Reddy', position: 'Vice President', image: '👨‍💼', expertise: 'Debate Champion' },
    { name: 'Sneha Kapoor', position: 'Event Coordinator', image: '👩‍🎤', expertise: 'Elocution Expert' },
    { name: 'Vikram Singh', position: 'Communications Head', image: '👨‍🎓', expertise: 'Media Relations' },
    { name: 'Aisha Khan', position: 'Treasurer', image: '👩‍💻', expertise: 'Event Management' },
    { name: 'Karan Sharma', position: 'Social Media Manager', image: '👨‍🎨', expertise: 'Digital Content' },
  ];

  const focusAreas = [
    {
      icon: Mic,
      title: 'Public Speaking',
      description: 'Master the art of confident and impactful public speaking',
      color: 'from-purple-500 to-blue-500',
    },
    {
      icon: MessageCircle,
      title: 'Debate Competitions',
      description: 'Sharpen critical thinking and argumentative skills',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: BookOpen,
      title: 'Elocution & Storytelling',
      description: 'Express emotions and narratives with powerful delivery',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Radio,
      title: 'Communication Workshops',
      description: 'Enhance interpersonal and professional communication',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const pastEvents = [
    { name: 'Speak Up 2023', participants: 220, winner: 'Rahul Verma' },
    { name: 'Debate Masters Summit', participants: 180, winner: 'Team Phoenix' },
    { name: 'Voice of Youth', participants: 150, winner: 'Ananya Joshi' },
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
     <div className="min-h-screen bg-gradient-to-r from-[#223FB4] to-[#2C319D] text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#223FB4] to-[#2C319D] text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djEwaC00VjM0aDR6bS0xMCAwdjEwaC00VjM0aDR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="inline-block animate-bounce mb-4">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-4 border-white/20 shadow-2xl">
                <Mic className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              YoungOrator Club
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-2 max-w-3xl mx-auto font-semibold">
              Speak • Inspire • Transform
            </p>
            <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto">
              Where Words Create Impact and Voices Shape Futures
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold hover:bg-blue-50 transition-all shadow-2xl hover:shadow-blue-500/50 transform hover:-translate-y-1 hover:scale-105">
                Join the Club
              </button>
              <button className="px-8 py-4 bg-purple-500/30 backdrop-blur-sm text-white rounded-full font-bold hover:bg-purple-500/50 transition-all border-2 border-white/30 shadow-xl">
                Upcoming Events
              </button>
            </div>
          </div>
        </div>

        {/* Floating Quote Animation */}
        <div className="absolute top-20 left-10 opacity-20 text-6xl font-serif text-white hidden lg:block">
          "
        </div>
        <div className="absolute bottom-20 right-10 opacity-20 text-6xl font-serif text-white hidden lg:block">
          "
        </div>
      </div>

     {/* Tab Navigation */}
<div className="bg-[#1F2D92]/95 backdrop-blur-md shadow-xl sticky top-0 z-40 border-b border-blue-400/20">

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
                ? 'text-blue-300'
                : 'text-gray-300 hover:text-blue-300'
            }`}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-t-full"></div>
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
            <div className="bg-gradient-to-br from-[#1F2D92] to-[#16206D] rounded-2xl shadow-2xl p-8 md:p-12 border border-blue-500/20">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Volume2 className="text-blue-300" />
                Our Mission
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                YoungOrator Club is the premier platform for aspiring public speakers, debaters, and communication enthusiasts at our university. We are dedicated to nurturing confident communicators who can articulate their ideas with clarity, conviction, and charisma.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                Through speech competitions, debate tournaments, elocution contests, storytelling sessions, and communication workshops, we provide students with opportunities to develop their oratory skills, overcome stage fear, and build leadership qualities that last a lifetime.
              </p>
              <p className="text-lg text-blue-300 leading-relaxed font-semibold">
                Join us in discovering the power of your voice and transforming into a confident, influential speaker!
              </p>
            </div>

            {/* Focus Areas */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
                <Target className="text-blue-300" />
                What We Do
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {focusAreas.map((area, index) => {
                  const Icon = area.icon;
                  return (
                    <div
                      key={index}
                      className="bg-[#1F2D92]/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:shadow-blue-500/20 transition-all transform hover:-translate-y-2 border border-blue-500/10"
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
                <Award className="text-blue-300" />
                Our Achievements
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={index}
                      className="from-[#16206D]/50 to-[#0F174D]/50 border border-blue-400/20 backdrop-blur-sm rounded-xl p-6 text-center hover:shadow-2xl hover:shadow-blue-500/30 transition-all border border-blue-500/20 transform hover:scale-105"
                    >
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-red-500 rounded-full mb-4 shadow-lg">
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
            <div className="bg-gradient-to-br from-blue-800 to-blue-500 rounded-2xl shadow-2xl p-8 border border-blue-500/20">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Trophy className="text-yellow-400" />
                Recent Success Stories
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {pastEvents.map((event, index) => (
                  <div key={index} className="bg-blue-700/50 rounded-xl p-4 border border-blur-500/10">
                    <h4 className="font-bold text-blue-300 mb-2">{event.name}</h4>
                    <p className="text-sm text-gray-400">Participants: {event.participants}</p>
                    <p className="text-sm text-gray-400">Winner: {event.winner}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Communication Skills Benefits */}
            <div className="bg-gradient-to-br from-blue-800 to-purple-900 rounded-2xl shadow-2xl p-8 border border-blue-500/20">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Lightbulb className="text-yellow-400" />
                Why Communication Skills Matter
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <p>Build confidence and overcome stage fear</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <p>Enhance leadership and persuasion abilities</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <p>Improve critical thinking and articulation</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <p>Excel in interviews and professional settings</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                <Calendar className="text-blue-300" />
                Upcoming Events
              </h2>
              <p className="text-gray-400">Unleash your oratory potential</p>
            </div>

            <div className="grid gap-6">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-gradient-to-br from-purple-800 to-blue-900 rounded-2xl shadow-2xl p-6 md:p-8 hover:shadow-blue-500/30 transition-all border border-blue-500/20 transform hover:-translate-y-1"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-4 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-bold rounded-full shadow-lg">
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
                          <Calendar className="w-5 h-5 text-blue-300" />
                          <span>{event.date} • {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-blue-300" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-blue-300" />
                          <span>{event.participants} participants expected</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-blue-600 transition-all flex items-center gap-2 justify-center shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105">
                      Register Now
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-red-600 rounded-2xl p-8 md:p-12 text-white text-center shadow-2xl">
              <Presentation className="w-16 h-16 mx-auto mb-4 animate-bounce" />
              <h3 className="text-3xl font-bold mb-4">Want to Organize an Event?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                We welcome creative ideas for speech events, workshops, and communication-focused activities. Share your vision with us!
              </p>
              <button className="px-8 py-3 bg-white text-purple-600 rounded-full font-bold hover:bg-blue-50 transition-all shadow-xl transform hover:scale-105">
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
                <Users2 className="text-blue-300" />
                Meet Our Team
              </h2>
              <p className="text-gray-400">The voices behind YoungOrator's success</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-purple-800 to-blue-900 rounded-2xl shadow-2xl p-6 text-center hover:shadow-blue-500/30 transition-all transform hover:-translate-y-2 border border-blue-500/20"
                >
                  <div className="text-7xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-blue-300 font-semibold mb-2">{member.position}</p>
                  <p className="text-sm text-gray-400">{member.expertise}</p>
                </div>
              ))}
            </div>

            {/* Join CTA */}
            <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 text-white text-center border border-blue-500/30 shadow-2xl">
              <Mic className="w-16 h-16 mx-auto mb-4 text-blue-300" />
              <h3 className="text-3xl font-bold mb-4">Ready to Find Your Voice?</h3>
              <p className="text-blue-200 mb-6 max-w-2xl mx-auto">
                Whether you're a beginner looking to overcome stage fear or an experienced speaker wanting to refine your skills, YoungOrator Club welcomes you! Join our community of passionate communicators and storytellers.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full font-bold hover:from-purple-600 hover:to-blue-600 transition-all shadow-xl transform hover:scale-105">
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
                <Mail className="text-blue-300" />
                Get in Touch
              </h2>
              <p className="text-gray-400">We'd love to hear from you!</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-800 to-blue-900 rounded-2xl shadow-xl p-6 text-center hover:shadow-blue-500/30 transition-all border border-blue-500/20 transform hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-4 shadow-lg">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">Email</h3>
                <p className="text-gray-400 text-sm">youngorator@university.edu</p>
              </div>

              <div className="bg-gradient-to-br from-purple-800 to-blue-900 rounded-2xl shadow-xl p-6 text-center hover:shadow-blue-500/30 transition-all border border-blue-500/20 transform hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-red-500 rounded-full mb-4 shadow-lg">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">Phone</h3>
                <p className="text-gray-400 text-sm">+91 98765 43210</p>
              </div>

              <div className="bg-gradient-to-br from-purple-800 to-blue-900 rounded-2xl shadow-xl p-6 text-center hover:shadow-blue-500/30 transition-all border border-blue-500/20 transform hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-red-500 rounded-full mb-4 shadow-lg">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">Location</h3>
                <p className="text-gray-400 text-sm">University Campus, Arts Block</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-800 to-blue-900 rounded-2xl shadow-2xl p-8 border border-blue-500/20">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Sparkles className="text-blue-300" />
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
                    className="w-full px-4 py-3 bg-purple-700/50 border border-blue-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Your Email"
                    className="w-full px-4 py-3 bg-purple-700/50 border border-blue-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                  />
                </div>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Subject"
                  className="w-full px-4 py-3 bg-purple-700/50 border border-blue-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your Message"
                  rows={6}
                  className="w-full px-4 py-3 bg-purple-700/50 border border-blue-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                ></textarea>
                <button 
                  onClick={handleSubmit}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-blue-600 transition-all shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105"
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
                             <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all border border-white/30" title="Visit our website" aria-label="Visit our website">
                               <Globe className="w-6 h-6" />
                             </button>
                             <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all border border-white/30" title="Email us" aria-label="Email us">
                               <Mail className="w-6 h-6" />
                             </button>
                             <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all border border-white/30" title="Join our community" aria-label="Join our community">
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
export default YoungOratorClub;
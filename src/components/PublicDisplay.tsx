// import { useState, useEffect } from 'react';
// import { supabase } from '../lib/supabase';
// import { BookOpen, Users, Code, Search } from 'lucide-react';

// interface TeamView {
//   team_id: string;
//   subject_id: string;
//   subject_name: string;
//   section: 'A' | 'B';
//   project_id: string;
//   project_number: number;
//   project_title: string;
//   project_description: string;
//   leader_name: string;
//   leader_uid: string;
//   teammate1_name: string | null;
//   teammate1_uid: string | null;
//   teammate2_name: string | null;
//   teammate2_uid: string | null;
//   technologies: string[];
//   additional_notes: string | null;
//   created_at: string;
// }

// export function PublicDisplay() {
//   const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
//   const [selectedSubject, setSelectedSubject] = useState('all');
//   const [teams, setTeams] = useState<TeamView[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState<'all' | 'A' | 'B'>('all');
//   const [searchTerm, setSearchTerm] = useState('');

//   // Load subjects on mount
//   useEffect(() => {
//     loadSubjects();
//   }, []);

//   // Reload teams whenever selectedSubject changes
//   useEffect(() => {
//     loadTeams();
//   }, [selectedSubject]);

//   // Subscribe to changes in teams table
//   useEffect(() => {
//     const subscription = supabase
//       .channel('teams_changes')
//       .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, () => {
//         loadTeams();
//       })
//       .subscribe();

//     return () => subscription.unsubscribe();
//   }, []);

//   async function loadSubjects() {
//     const { data, error } = await supabase.from('subjects').select('*').order('name');
//     if (error) console.error(error);
//     if (data) setSubjects(data);
//   }

//   async function loadTeams() {
//     setLoading(true);
//     try {
//       let query = supabase.from<TeamView>('teams_view').select('*').order('created_at', { ascending: false });
//       if (selectedSubject !== 'all') {
//         query = query.eq('subject_id', selectedSubject);
//       }
//       const { data, error } = await query;
//       if (error) throw error;
//       if (data) setTeams(data);
//     } catch (err) {
//       console.error('Error loading teams:', err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const filteredTeams = teams
//     .filter((t) => filter === 'all' || t.section === filter)
//     .filter((t) => {
//       if (!searchTerm) return true;
//       const search = searchTerm.toLowerCase();
//       return (
//         t.leader_name.toLowerCase().includes(search) ||
//         t.teammate1_name?.toLowerCase().includes(search) ||
//         t.teammate2_name?.toLowerCase().includes(search) ||
//         t.project_title.toLowerCase().includes(search) ||
//         t.technologies?.some((tech) => tech.toLowerCase().includes(search))
//       );
//     });

//   const stats = {
//     total: teams.length,
//     sectionA: teams.filter((t) => t.section === 'A').length,
//     sectionB: teams.filter((t) => t.section === 'B').length,
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-slate-800 text-white py-12 px-6 shadow-xl">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex items-center gap-4 mb-4">
//             <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
//               <BookOpen className="w-12 h-12" />
//             </div>
//             <div>
//               <h1 className="text-4xl font-bold mb-2">Crafted by code, driven by curiosity.</h1>
//               <p className="text-blue-100 text-lg">Innovation</p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
//             <StatCard label="Total Teams" value={stats.total} />
//             <StatCard label="Section A Teams" value={stats.sectionA} />
//             <StatCard label="Section B Teams" value={stats.sectionB} />
//           </div>
//         </div>
//       </div>

//       {/* Search & Filter */}
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
//           <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search by student, project, or technology..."
//                 className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
//               />
//             </div>

//             <select
//               value={selectedSubject}
//               onChange={(e) => setSelectedSubject(e.target.value)}
//               className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
//             >
//               <option value="all">All Subjects</option>
//               {subjects.map((subj) => (
//                 <option key={subj.id} value={subj.id}>
//                   {subj.name}
//                 </option>
//               ))}
//             </select>

//             <div className="flex gap-2">
//               {['all', 'A', 'B'].map((sec) => (
//                 <button
//                   key={sec}
//                   onClick={() => setFilter(sec as 'all' | 'A' | 'B')}
//                   className={`px-6 py-3 rounded-lg font-medium transition ${
//                     filter === sec ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
//                   }`}
//                 >
//                   {sec === 'all' ? 'All Sections' : `Section ${sec}`}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Teams Grid */}
//           {loading ? (
//             <div className="text-center py-20">
//               <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
//               <p className="mt-4 text-slate-600 text-lg">Loading project data...</p>
//             </div>
//           ) : filteredTeams.length === 0 ? (
//             <div className="text-center py-20">
//               <BookOpen className="w-20 h-20 mx-auto text-slate-300 mb-4" />
//               <p className="text-xl text-slate-500">
//                 {searchTerm ? 'No teams found matching your search' : 'No teams registered yet'}
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {filteredTeams.map((team) => (
//                 <TeamCard key={team.team_id} team={team} />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Team Card
// function TeamCard({ team }: { team: TeamView }) {
//   return (
//     <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-md hover:shadow-xl transition border border-slate-200 overflow-hidden">
//       <div className={`h-2 ${team.section === 'A' ? 'bg-green-500' : 'bg-orange-500'}`} />
//       <div className="p-6">
//         <div className="flex items-center gap-2 mb-2">
//           <span
//             className={`px-3 py-1 rounded-full text-sm font-bold ${
//               team.section === 'A' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
//             }`}
//           >
//             Section {team.section}
//           </span>
//           <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
//             #{team.project_number}
//           </span>
//           <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
//             {team.subject_name}
//           </span>
//         </div>
//         <h3 className="text-xl font-bold text-slate-900 mb-2">{team.project_title}</h3>
//         <p className="text-slate-600 text-sm leading-relaxed">{team.project_description}</p>

//         <div className="space-y-2 mt-4">
//           <StudentInfo name={team.leader_name} uid={team.leader_uid} role="Team Leader" />
//           {team.teammate1_name && <StudentInfo name={team.teammate1_name} uid={team.teammate1_uid} role="Teammate" />}
//           {team.teammate2_name && <StudentInfo name={team.teammate2_name} uid={team.teammate2_uid} role="Teammate" />}
//         </div>

//         {team.technologies?.length > 0 && (
//           <div className="pt-4 border-t border-slate-200 mt-4">
//             <div className="flex items-center gap-2 mb-2">
//               <Code className="w-4 h-4 text-slate-600" />
//               <span className="text-sm font-semibold text-slate-700">Technologies</span>
//             </div>
//             <div className="flex flex-wrap gap-2">
//               {team.technologies.map((tech, idx) => (
//                 <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
//                   {tech}
//                 </span>
//               ))}
//             </div>
//           </div>
//         )}

//         {team.additional_notes && (
//           <div className="mt-4 pt-4 border-t border-slate-200">
//             <p className="text-sm text-slate-600 italic">{team.additional_notes}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // Student Info
// function StudentInfo({ name, uid, role }: { name: string; uid?: string | null; role: string }) {
//   return (
//     <div className="flex items-start gap-3">
//       <Users className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
//       <div>
//         <div className="font-semibold text-slate-900">
//           {name} <span className="text-slate-500 text-sm ml-2">{role}</span>
//         </div>
//         {uid && <div className="text-sm text-slate-500">{uid}</div>}
//       </div>
//     </div>
//   );
// }

// // Stat Card
// function StatCard({ label, value }: { label: string; value: number }) {
//   return (
//     <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
//       <div className="text-3xl font-bold mb-1">{value}</div>
//       <div className="text-blue-100">{label}</div>
//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Cpu, Layers, Star } from 'lucide-react';

interface TeamView {
  team_id: string;
  subject_id: string;
  subject_name: string;
  section: 'A' | 'B';
  project_id: string;
  project_number: number;
  project_title: string;
  project_description: string;
  leader_name: string;
  leader_uid: string;
  teammate1_name: string | null;
  teammate1_uid: string | null;
  teammate2_name: string | null;
  teammate2_uid: string | null;
  technologies: string[];
  additional_notes: string | null;
  created_at: string;
}

export function PublicDisplay() {
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [teams, setTeams] = useState<TeamView[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'A' | 'B'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { loadSubjects(); }, []);
  useEffect(() => { loadTeams(); }, [selectedSubject]);

  useEffect(() => {
    const subscription = supabase
      .channel('teams_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, () => { loadTeams(); })
      .subscribe();
    return () => subscription.unsubscribe();
  }, []);

  async function loadSubjects() {
    const { data, error } = await supabase.from('subjects').select('*').order('name');
    if (error) console.error(error);
    if (data) setSubjects(data);
  }

  async function loadTeams() {
    setLoading(true);
    try {
      let query = supabase.from<TeamView>('teams_view').select('*').order('created_at', { ascending: false });
      if (selectedSubject !== 'all') query = query.eq('subject_id', selectedSubject);
      const { data, error } = await query;
      if (error) throw error;
      if (data) setTeams(data);
    } catch (err) {
      console.error('Error loading teams:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredTeams = teams
    .filter((t) => filter === 'all' || t.section === filter)
    .filter((t) => {
      if (!searchTerm) return true;
      const s = searchTerm.toLowerCase();
      return (
        t.leader_name.toLowerCase().includes(s) ||
        t.teammate1_name?.toLowerCase().includes(s) ||
        t.teammate2_name?.toLowerCase().includes(s) ||
        t.project_title.toLowerCase().includes(s) ||
        t.technologies?.some((tech) => tech.toLowerCase().includes(s))
      );
    });

  const stats = {
    total: teams.length,
    sectionA: teams.filter((t) => t.section === 'A').length,
    sectionB: teams.filter((t) => t.section === 'B').length,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4ff 0%, #f8faff 50%, #eef2ff 100%)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }

        .hero { position: relative; overflow: hidden; padding: 52px 20px 48px; }
        @media (min-width: 640px) { .hero { padding: 68px 32px 60px; } }
        @media (min-width: 1024px) { .hero { padding: 80px 48px 72px; } }

        .hero-bg { position: absolute; inset: 0; z-index: 0; background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 45%, #1e40af 75%, #312e81 100%); }
        .hero-pattern { position: absolute; inset: 0; z-index: 1; opacity: 0.07; background-image: radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px); background-size: 32px 32px; }
        .hero-glow { position: absolute; z-index: 1; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%); top: -200px; right: -100px; pointer-events: none; }
        .hero-inner { position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; }

        .hero-eyebrow { display: inline-flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #bfdbfe; border: 1px solid rgba(191,219,254,0.35); padding: 5px 14px; border-radius: 999px; margin-bottom: 20px; background: rgba(255,255,255,0.1); }
        .hero-title { font-size: clamp(26px, 5vw, 52px); font-weight: 800; line-height: 1.1; letter-spacing: -0.02em; color: #fff; margin-bottom: 14px; }
        .hero-title .accent { color: #93c5fd; }
        .hero-sub { font-size: 14px; color: rgba(191,219,254,0.8); line-height: 1.65; max-width: 460px; margin-bottom: 40px; font-weight: 400; }

        .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; max-width: 520px; }
        @media (max-width: 400px) { .stats-row { gap: 8px; } }
        .stat-card { background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); border-radius: 16px; padding: 18px 16px; backdrop-filter: blur(12px); transition: background 0.2s, border-color 0.2s; }
        .stat-card:hover { background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.35); }
        .stat-num { font-size: 30px; font-weight: 800; color: #fff; line-height: 1; margin-bottom: 5px; }
        .stat-label { font-size: 11px; color: rgba(191,219,254,0.75); font-weight: 600; letter-spacing: 0.03em; }

        .controls-wrap { max-width: 1200px; margin: 0 auto; padding: 28px 20px 0; }
        @media (min-width: 640px) { .controls-wrap { padding: 36px 32px 0; } }
        @media (min-width: 1024px) { .controls-wrap { padding: 44px 48px 0; } }

        .controls-bar { background: #fff; border: 1px solid #e0e7ff; border-radius: 18px; padding: 16px 18px; box-shadow: 0 4px 24px rgba(30,58,138,0.08); display: flex; flex-direction: column; gap: 10px; }
        @media (min-width: 768px) { .controls-bar { flex-direction: row; align-items: center; } }

        .search-wrap { position: relative; flex: 1; }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #93c5fd; pointer-events: none; }
        .search-input { width: 100%; padding: 10px 14px 10px 38px; border: 1.5px solid #e0e7ff; border-radius: 12px; font-size: 13px; color: #1e3a8a; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; background: #f8faff; transition: border-color 0.2s, box-shadow 0.2s; }
        .search-input::placeholder { color: #94a3b8; }
        .search-input:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); background: #fff; }

        .subject-select { padding: 10px 14px; border: 1.5px solid #e0e7ff; border-radius: 12px; font-size: 13px; color: #1e3a8a; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; background: #f8faff; cursor: pointer; transition: border-color 0.2s; width: 100%; }
        @media (min-width: 768px) { .subject-select { width: auto; } }
        .subject-select:focus { border-color: #4f46e5; }

        .pill-group { display: flex; gap: 6px; }
        .pill-btn { padding: 9px 16px; border-radius: 10px; font-size: 12px; font-weight: 700; cursor: pointer; border: 1.5px solid #e0e7ff; font-family: 'Plus Jakarta Sans', sans-serif; background: #f8faff; color: #64748b; transition: all 0.2s; white-space: nowrap; }
        .pill-btn:hover { border-color: #c7d2fe; color: #4338ca; background: #eef2ff; }
        .pill-btn.active { background: linear-gradient(135deg, #4f46e5, #2563eb); color: #fff; border-color: transparent; box-shadow: 0 4px 12px rgba(79,70,229,0.3); }

        .teams-section { max-width: 1200px; margin: 0 auto; padding: 24px 20px 60px; }
        @media (min-width: 640px) { .teams-section { padding: 32px 32px 80px; } }
        @media (min-width: 1024px) { .teams-section { padding: 36px 48px 80px; } }

        .section-divider { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
        .section-divider-line { flex: 1; height: 1px; background: #e2e8f0; }
        .section-divider-label { font-size: 11px; font-weight: 700; color: #94a3b8; letter-spacing: 0.08em; text-transform: uppercase; }

        .teams-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 640px) { .teams-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1100px) { .teams-grid { grid-template-columns: repeat(3, 1fr); } }

        .team-card { background: #fff; border: 1px solid #e0e7ff; border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s; }
        .team-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(30,58,138,0.12); border-color: #c7d2fe; }

        .stripe-a { height: 4px; background: linear-gradient(90deg, #22c55e, #06b6d4); }
        .stripe-b { height: 4px; background: linear-gradient(90deg, #f97316, #ec4899); }

        .card-body { padding: 20px; flex: 1; display: flex; flex-direction: column; gap: 14px; }

        .badge-row { display: flex; flex-wrap: wrap; gap: 6px; }
        .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 999px; font-size: 10px; font-weight: 700; letter-spacing: 0.04em; }
        .badge-a { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        .badge-b { background: #fff7ed; color: #9a3412; border: 1px solid #fed7aa; }
        .badge-num { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
        .badge-sub { background: #f5f3ff; color: #5b21b6; border: 1px solid #ddd6fe; }

        .card-title { font-size: 15px; font-weight: 800; color: #0f172a; line-height: 1.3; }
        .card-desc { font-size: 12px; color: #64748b; line-height: 1.65; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-top: 6px; }

        .divider { height: 1px; background: #f1f5f9; }

        .members { display: flex; flex-direction: column; gap: 7px; }
        .member-row { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 10px; background: #f8fafc; border: 1px solid #f1f5f9; }
        .avatar { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; flex-shrink: 0; }
        .avatar-leader { background: #ede9fe; color: #4f46e5; }
        .avatar-mate { background: #f1f5f9; color: #475569; }
        .member-name { font-size: 12px; font-weight: 700; color: #1e293b; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .member-uid { font-size: 10px; color: #94a3b8; margin-top: 1px; }
        .member-role { font-size: 10px; font-weight: 700; margin-left: auto; flex-shrink: 0; padding: 2px 8px; border-radius: 999px; }
        .role-leader { background: #ede9fe; color: #4f46e5; }
        .role-mate { background: #f1f5f9; color: #64748b; }

        .tech-header { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
        .tech-header-label { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #94a3b8; }
        .tech-list { display: flex; flex-wrap: wrap; gap: 6px; }
        .tech-tag { padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 600; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }

        .notes-box { font-size: 11px; color: #64748b; font-style: italic; line-height: 1.6; padding: 10px 12px; background: #fafaf9; border-left: 3px solid #c7d2fe; border-radius: 0 8px 8px 0; }

        .state-box { text-align: center; padding: 72px 24px; }
        .spinner { width: 38px; height: 38px; border-radius: 50%; border: 2.5px solid #e0e7ff; border-top-color: #4f46e5; animation: spin 0.85s linear infinite; margin: 0 auto 16px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .state-text { font-size: 15px; color: #94a3b8; }
      `}</style>

      {/* Hero */}
      <div className="hero">
        <div className="hero-bg" />
        <div className="hero-pattern" />
        <div className="hero-glow" />
        <div className="hero-inner">
          <div className="hero-eyebrow"><Star size={10} />Student Project Showcase</div>
          <h1 className="hero-title">Crafted by code,<br /><span className="accent">driven by curiosity.</span></h1>
          <p className="hero-sub">Explore every team's innovation — filter by subject, section, or technology to discover what's being built.</p>
          <div className="stats-row">
            <div className="stat-card"><div className="stat-num">{stats.total}</div><div className="stat-label">Total Teams</div></div>
            <div className="stat-card"><div className="stat-num">{stats.sectionA}</div><div className="stat-label">Section A</div></div>
            <div className="stat-card"><div className="stat-num">{stats.sectionB}</div><div className="stat-label">Section B</div></div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-wrap">
        <div className="controls-bar">
          <div className="search-wrap">
            <Search size={15} className="search-icon" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by student, project, or technology…" className="search-input" />
          </div>
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="subject-select">
            <option value="all">All Subjects</option>
            {subjects.map((subj) => <option key={subj.id} value={subj.id}>{subj.name}</option>)}
          </select>
          <div className="pill-group">
            {(['all', 'A', 'B'] as const).map((sec) => (
              <button key={sec} onClick={() => setFilter(sec)} className={`pill-btn ${filter === sec ? 'active' : ''}`}>
                {sec === 'all' ? 'All' : `Sec ${sec}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Teams */}
      <div className="teams-section">
        {loading ? (
          <div className="state-box"><div className="spinner" /><p className="state-text">Loading project data…</p></div>
        ) : filteredTeams.length === 0 ? (
          <div className="state-box">
            <Layers size={40} style={{ margin: '0 auto 16px', color: '#e0e7ff', display: 'block' }} />
            <p className="state-text">{searchTerm ? 'No teams match your search.' : 'No teams registered yet.'}</p>
          </div>
        ) : (
          <>
            <div className="section-divider">
              <div className="section-divider-line" />
              <span className="section-divider-label">{filteredTeams.length} team{filteredTeams.length !== 1 ? 's' : ''} found</span>
              <div className="section-divider-line" />
            </div>
            <div className="teams-grid">
              {filteredTeams.map((team) => <TeamCard key={team.team_id} team={team} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function TeamCard({ team }: { team: TeamView }) {
  return (
    <div className="team-card">
      <div className={team.section === 'A' ? 'stripe-a' : 'stripe-b'} />
      <div className="card-body">
        <div className="badge-row">
          <span className={`badge ${team.section === 'A' ? 'badge-a' : 'badge-b'}`}>Section {team.section}</span>
          <span className="badge badge-num">#{team.project_number}</span>
          <span className="badge badge-sub">{team.subject_name}</span>
        </div>
        <div>
          <h3 className="card-title">{team.project_title}</h3>
          {team.project_description && <p className="card-desc">{team.project_description}</p>}
        </div>
        <div className="divider" />
        <div className="members">
          <MemberRow name={team.leader_name} uid={team.leader_uid} isLeader />
          {team.teammate1_name && <MemberRow name={team.teammate1_name} uid={team.teammate1_uid} />}
          {team.teammate2_name && <MemberRow name={team.teammate2_name} uid={team.teammate2_uid} />}
        </div>
        {team.technologies?.length > 0 && (
          <>
            <div className="divider" />
            <div>
              <div className="tech-header">
                <Cpu size={11} style={{ color: '#60a5fa', flexShrink: 0 }} />
                <span className="tech-header-label">Stack</span>
              </div>
              <div className="tech-list">
                {team.technologies.map((tech, i) => <span key={i} className="tech-tag">{tech}</span>)}
              </div>
            </div>
          </>
        )}
        {team.additional_notes && <div className="notes-box">{team.additional_notes}</div>}
      </div>
    </div>
  );
}

function MemberRow({ name, uid, isLeader = false }: { name: string; uid?: string | null; isLeader?: boolean }) {
  return (
    <div className="member-row">
      <div className={`avatar ${isLeader ? 'avatar-leader' : 'avatar-mate'}`}>{getInitials(name)}</div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div className="member-name">{name}</div>
        {uid && <div className="member-uid">{uid}</div>}
      </div>
      <span className={`member-role ${isLeader ? 'role-leader' : 'role-mate'}`}>{isLeader ? 'Leader' : 'Member'}</span>
    </div>
  );
}
// import { useState, useEffect, useRef } from 'react';
// import { supabase } from '../lib/supabase';
// import { useAuth } from './AuthContext';
// import { AdminNotificationManager } from './AdminNotificationManager';
// import {
//   LayoutDashboard,
//   LogOut,
//   Trash2,
//   RefreshCw,
//   Plus,
//   Edit,
//   Download,
//   X,
//   Save,
//   Upload,
//   FileText,
//   ChevronDown,
// } from 'lucide-react';

// export function AdminDashboard() {
//   const [teams, setTeams] = useState<any[]>([]);
//   const [students, setStudents] = useState<any[]>([]);
//   const [projects, setProjects] = useState<any[]>([]);
//   const [subjects, setSubjects] = useState<any[]>([]);
//   const [submissions, setSubmissions] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState<'all' | 'A' | 'B'>('all');
//   const [subjectFilter, setSubjectFilter] = useState<string>('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [editingTeam, setEditingTeam] = useState<any | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const [isAdding, setIsAdding] = useState(false);
//   const [showProjectModal, setShowProjectModal] = useState(false);
//   const [newProject, setNewProject] = useState({ title: '', subject: '', description: '', project_number: '' });
//   const [showImportModal, setShowImportModal] = useState(false);
//   const [showExportDropdown, setShowExportDropdown] = useState(false);
//   const [showSubjectModal, setShowSubjectModal] = useState(false);
//   const [newSubject, setNewSubject] = useState('');
//   const [editingSubject, setEditingSubject] = useState<any | null>(null);
//   const [showSubmissionsView, setShowSubmissionsView] = useState(false);
//   const [submissionFilter, setSubmissionFilter] = useState<string>('all');
//   const [submissionSectionFilter, setSubmissionSectionFilter] = useState<'all' | 'A' | 'B'>('all');
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const { signOut } = useAuth();

//   useEffect(() => {
//     loadTeams();
//     loadStudents();
//     loadProjects();
//     loadSubjects();
//     loadSubmissions();

//     const subscription = supabase
//       .channel('teams_changes')
//       .on(
//         'postgres_changes',
//         { event: '*', schema: 'public', table: 'teams' },
//         () => {
//           loadTeams();
//           loadSubmissions();
//         }
//       )
//       .subscribe();

//     return () => subscription.unsubscribe();
//   }, []);

//   async function loadTeams() {
//     setLoading(true);
//     const { data, error } = await supabase
//       .from('teams')
//       .select(
//         `
//         *,
//         project:projects(*, subject:subjects(name)),
//         team_leader:students!fk_team_leader(*),
//         teammate1:students!fk_teammate1(*),
//         teammate2:students!fk_teammate2(*)
//       `
//       )
//       .order('created_at', { ascending: false });
//     if (error) console.error('Supabase fetch error:', error);
//     if (data) setTeams(data);
//     setLoading(false);
//   }

//   async function loadStudents() {
//     const { data, error } = await supabase
//       .from('students')
//       .select('*')
//       .order('name');
//     if (error) console.error('Error loading students:', error);
//     if (data) setStudents(data);
//   }

//   async function loadProjects() {
//     const { data, error } = await supabase
//       .from('projects')
//       .select('*, subject:subjects(name)')
//       .order('title', { ascending: true });
//     if (error) console.error('Error loading projects:', error);
//     if (data) setProjects(data);
//   }

//   async function loadSubjects() {
//     const { data, error } = await supabase
//       .from('subjects')
//       .select('*')
//       .order('name', { ascending: true });
//     if (error) console.error('Error loading subjects:', error);
//     if (data) setSubjects(data);
//   }

//   async function loadSubmissions() {
//     const { data, error } = await supabase
//       .from('teams')
//       .select(`
//         *,
//         subject:subjects(name),
//         project:projects(title, project_number),
//         team_leader:students!fk_team_leader(name, uid),
//         teammate1:students!fk_teammate1(name, uid),
//         teammate2:students!fk_teammate2(name, uid)
//       `)
//       .not('submitted_at', 'is', null)
//       .order('submitted_at', { ascending: false });
    
//     if (data) setSubmissions(data);
//     if (error) console.error(error);
//   }

//   async function handleAddSubject() {
//     if (!newSubject.trim()) {
//       alert('Please enter a subject name');
//       return;
//     }

//     const { error } = await supabase.from('subjects').insert({
//       name: newSubject.trim(),
//     });

//     if (error) {
//       console.error('Error adding subject:', error);
//       alert('Failed to add subject: ' + error.message);
//       return;
//     }

//     setNewSubject('');
//     setShowSubjectModal(false);
//     loadSubjects();
//     alert('Subject added successfully!');
//   }

//   async function handleUpdateSubject() {
//     if (!editingSubject || !editingSubject.name.trim()) {
//       alert('Please enter a subject name');
//       return;
//     }

//     const { error } = await supabase
//       .from('subjects')
//       .update({ name: editingSubject.name.trim() })
//       .eq('id', editingSubject.id);

//     if (error) {
//       console.error('Error updating subject:', error);
//       alert('Failed to update subject: ' + error.message);
//       return;
//     }

//     setEditingSubject(null);
//     setShowSubjectModal(false);
//     loadSubjects();
//     loadProjects();
//     loadTeams();
//     alert('Subject updated successfully!');
//   }

//   async function handleDeleteSubject(subjectId: string) {
//     if (!confirm('Are you sure you want to delete this subject? This may affect related projects.')) return;
    
//     const { error } = await supabase.from('subjects').delete().eq('id', subjectId);
    
//     if (error) {
//       console.error('Error deleting subject:', error);
//       alert('Failed to delete subject: ' + error.message);
//       return;
//     }
    
//     loadSubjects();
//     alert('Subject deleted successfully!');
//   }

//   async function exportSubmissionsCSV(subjectFilter: string) {
//     const dataToExport = subjectFilter === 'all' 
//       ? submissions 
//       : submissions.filter(s => s.subject?.name === subjectFilter);

//     if (dataToExport.length === 0) {
//       alert('No submissions to export.');
//       return;
//     }

//     const headers = [
//       'Subject',
//       'Section',
//       'Project Number',
//       'Project Title',
//       'Leader Name',
//       'Leader UID',
//       'Teammate 1 Name',
//       'Teammate 1 UID',
//       'Teammate 2 Name',
//       'Teammate 2 UID',
//       'PPT URL',
//       'Report URL',
//       'Submitted At',
//     ];

//     const rows = dataToExport.map((sub) => [
//       sub.subject?.name || '',
//       sub.section,
//       sub.project?.project_number || '',
//       sub.project?.title || '',
//       sub.team_leader?.name || '',
//       sub.team_leader?.uid || '',
//       sub.teammate1?.name || '',
//       sub.teammate1?.uid || '',
//       sub.teammate2?.name || '',
//       sub.teammate2?.uid || '',
//       sub.ppt_url || '',
//       sub.report_url || '',
//       sub.submitted_at ? new Date(sub.submitted_at).toLocaleString() : '',
//     ]);

//     const csvContent =
//       [headers, ...rows]
//         .map((e) =>
//           e.map((x) => `"${(x ?? '').toString().replace(/"/g, '""')}"`).join(',')
//         )
//         .join('\n');

//     const filename = subjectFilter === 'all' 
//       ? 'all_submissions.csv' 
//       : `${subjectFilter.replace(/\s+/g, '_')}_submissions.csv`;
    
//     downloadCSV(csvContent, filename);
//   }

//   async function enableUpdateForTeam(teamId: string) {
//     if (!confirm('This will allow the team to update their submission. The current files will remain but can be replaced. Continue?')) return;

//     const { error } = await supabase
//       .from('teams')
//       .update({ 
//         submitted_at: null 
//       })
//       .eq('id', teamId);

//     if (error) {
//       console.error('Error enabling update:', error);
//       alert('Failed to enable update: ' + error.message);
//       return;
//     }

//     loadSubmissions();
//     loadTeams();
//     alert('Team can now update their submission!');
//   }

//   async function handleDeleteSubmission(teamId: string) {
//     if (!confirm('Are you sure you want to delete this submission? This will remove the PPT and Report URLs, but the team record will remain.')) return;

//     const { error } = await supabase
//       .from('teams')
//       .update({ 
//         ppt_url: null,
//         report_url: null,
//         submitted_at: null 
//       })
//       .eq('id', teamId);

//     if (error) {
//       console.error('Error deleting submission:', error);
//       alert('Failed to delete submission: ' + error.message);
//       return;
//     }

//     loadSubmissions();
//     loadTeams();
//     alert('Submission deleted successfully!');
//   }

//   async function handleSignOut() {
//   try {
//     const { error } = await supabase.auth.signOut();

//     if (error && error.message === 'Auth session missing!') {
//       window.location.href = 'https://cusphere.netlify.app/';
//       return;
//     }

//     if (error) {
//       console.error('Supabase sign out error:', error);
//       alert('Failed to sign out: ' + error.message);
//       return;
//     }

//     // Clear all stored user data
//     localStorage.clear();
//     sessionStorage.clear();

//     // Redirect to main site after successful logout
//     window.location.href = 'https://cusphere.netlify.app/';
//   } catch (error) {
//     console.error('Error signing out:', error);
//     window.location.href = 'https://cusphere.netlify.app/';
//   }
// }

//   async function handleDelete(teamId: string) {
//     if (!confirm('Are you sure you want to delete this team?')) return;
//     const { error } = await supabase.from('teams').delete().eq('id', teamId);
//     if (!error) loadTeams();
//   }

//   async function handleSave() {
//     if (!editingTeam) return;

//     const payload = {
//       section: editingTeam.section,
//       technologies: editingTeam.technologies,
//       additional_notes: editingTeam.additional_notes,
//       project_id: editingTeam.project_id,
//       team_leader_id: editingTeam.team_leader_id,
//       teammate1_id: editingTeam.teammate1_id || null,
//       teammate2_id: editingTeam.teammate2_id || null,
//     };

//     if (isAdding) {
//       const { error } = await supabase.from('teams').insert(payload);
//       if (error) return console.error('Add error:', error);
//     } else {
//       const { error } = await supabase
//         .from('teams')
//         .update(payload)
//         .eq('id', editingTeam.id);
//       if (error) return console.error('Update error:', error);
//     }

//     setShowModal(false);
//     loadTeams();
//   }

//   async function handleAddProject() {
//     if (!newProject.title || !newProject.subject || !newProject.project_number) {
//       alert('Please fill in title, subject, and project number');
//       return;
//     }

//     const selectedSubject = subjects.find(s => s.name === newProject.subject);
    
//     if (!selectedSubject) {
//       alert('Invalid subject selected');
//       return;
//     }

//     const { error } = await supabase.from('projects').insert({
//       title: newProject.title,
//       subject_id: selectedSubject.id,
//       description: newProject.description,
//       project_number: parseInt(newProject.project_number),
//     });

//     if (error) {
//       console.error('Error adding project:', error);
//       alert('Failed to add project: ' + error.message);
//       return;
//     }

//     setNewProject({ title: '', subject: '', description: '', project_number: '' });
//     setShowProjectModal(false);
//     loadProjects();
//     alert('Project added successfully!');
//   }

//   async function handleImportCSV(event: React.ChangeEvent<HTMLInputElement>) {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = async (e) => {
//       const text = e.target?.result as string;
//       const lines = text.split('\n').filter(line => line.trim());
      
//       const dataLines = lines.slice(1);
//       const projectsToInsert = [];

//       for (const line of dataLines) {
//         const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
//         if (!matches || matches.length < 3) continue;

//         const projectNumber = matches[0].replace(/^"|"$/g, '').trim();
//         const title = matches[1].replace(/^"|"$/g, '').trim();
//         const subjectName = matches[2].replace(/^"|"$/g, '').trim();
//         const description = matches[3]?.replace(/^"|"$/g, '').trim() || '';

//         if (projectNumber && title && subjectName) {
//           const selectedSubject = subjects.find(s => s.name === subjectName);
          
//           if (selectedSubject) {
//             projectsToInsert.push({ 
//               project_number: parseInt(projectNumber),
//               title, 
//               subject_id: selectedSubject.id, 
//               description 
//             });
//           } else {
//             console.warn(`Subject not found: ${subjectName}`);
//           }
//         }
//       }

//       if (projectsToInsert.length === 0) {
//         alert('No valid projects found in CSV. Make sure subject names match existing subjects in database.');
//         return;
//       }

//       const { error } = await supabase.from('projects').insert(projectsToInsert);
      
//       if (error) {
//         console.error('Error importing projects:', error);
//         alert('Failed to import projects: ' + error.message);
//         return;
//       }

//       setShowImportModal(false);
//       loadProjects();
//       alert(`Successfully imported ${projectsToInsert.length} projects!`);
//     };

//     reader.readAsText(file);
//     event.target.value = '';
//   }

//   async function exportToCSV() {
//     if (teams.length === 0) {
//       alert('No team data available to export.');
//       return;
//     }

//     const headers = [
//       'Section',
//       'Project Title',
//       'Subject',
//       'Leader',
//       'Teammate 1',
//       'Teammate 2',
//       'Technologies',
//       'Notes',
//       'Created At',
//     ];

//     const rows = teams.map((team) => [
//       team.section,
//       team.project?.title || '',
//       team.project?.subject?.name || '',
//       team.team_leader?.name || '',
//       team.teammate1?.name || '',
//       team.teammate2?.name || '',
//       team.technologies?.join('; ') || '',
//       team.additional_notes || '',
//       new Date(team.created_at).toLocaleString(),
//     ]);

//     const csvContent =
//       [headers, ...rows]
//         .map((e) =>
//           e.map((x) => `"${(x ?? '').toString().replace(/"/g, '""')}"`).join(',')
//         )
//         .join('\n');

//     downloadCSV(csvContent, 'all_teams_data.csv');
//   }

//   function exportBySubject(subject: string) {
//     const filteredTeams = teams.filter(t => t.project?.subject?.name === subject);
    
//     if (filteredTeams.length === 0) {
//       alert(`No teams found for subject: ${subject}`);
//       return;
//     }

//     const headers = [
//       'Section',
//       'Project Title',
//       'Subject',
//       'Leader',
//       'Teammate 1',
//       'Teammate 2',
//       'Technologies',
//       'Notes',
//       'Created At',
//     ];

//     const rows = filteredTeams.map((team) => [
//       team.section,
//       team.project?.title || '',
//       team.project?.subject?.name || '',
//       team.team_leader?.name || '',
//       team.teammate1?.name || '',
//       team.teammate2?.name || '',
//       team.technologies?.join('; ') || '',
//       team.additional_notes || '',
//       new Date(team.created_at).toLocaleString(),
//     ]);

//     const csvContent =
//       [headers, ...rows]
//         .map((e) =>
//           e.map((x) => `"${(x ?? '').toString().replace(/"/g, '""')}"`).join(',')
//         )
//         .join('\n');

//     downloadCSV(csvContent, `${subject.replace(/\s+/g, '_')}_teams.csv`);
//     setShowExportDropdown(false);
//   }

//   function downloadCSV(content: string, filename: string) {
//     const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = filename;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   }

//   const filteredTeams = teams
//     .filter((t) => filter === 'all' || t.section === filter)
//     .filter((t) => subjectFilter === 'all' || t.project?.subject?.name === subjectFilter)
//     .filter((t) => {
//       if (!searchTerm) return true;
//       const s = searchTerm.toLowerCase();
//       return (
//         t.project?.title.toLowerCase().includes(s) ||
//         t.project?.subject?.name?.toLowerCase().includes(s) ||
//         t.team_leader?.name.toLowerCase().includes(s) ||
//         t.teammate1?.name?.toLowerCase().includes(s) ||
//         t.teammate2?.name?.toLowerCase().includes(s) ||
//         t.technologies?.some((tech: string) => tech.toLowerCase().includes(s))
//       );
//     });

//   const stats = {
//     total: teams.length,
//     sectionA: teams.filter((t) => t.section === 'A').length,
//     sectionB: teams.filter((t) => t.section === 'B').length,
//     uniqueProjects: new Set(teams.map((t) => t.project_id)).size,
//     totalSubmissions: submissions.length,
//   };

//   const filteredSubmissions = submissions
//     .filter(s => submissionFilter === 'all' || s.subject?.name === submissionFilter)
//     .filter(s => submissionSectionFilter === 'all' || s.section === submissionSectionFilter);

//   return (
//     <div className="min-h-screen bg-slate-900 text-white">
//       <nav className="sticky top-0 z-50 bg-slate-950 border-b border-slate-700 shadow-lg">
//         <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-2">
//           <div className="flex items-center gap-2 sm:gap-3">
//             <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6" />
//             <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>
//           </div>
//           <div className="flex gap-1 sm:gap-2 flex-wrap">
//             <button
//               onClick={loadTeams}
//               className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-slate-800 rounded hover:bg-slate-700 transition text-sm"
//             >
//               <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Refresh</span>
//             </button>
            
//             {/* <div className="relative">
//               <button
//                 onClick={() => setShowExportDropdown(!showExportDropdown)}
//                 className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-blue-600 rounded hover:bg-blue-700 transition text-sm"
//               >
//                 <Download className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Export</span> <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
//               </button>
//               {showExportDropdown && (
//                 <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-xl z-50 border border-slate-700">
//                   <button
//                     onClick={exportToCSV}
//                     className="w-full text-left px-4 py-2 hover:bg-slate-700 rounded-t-lg transition"
//                   >
//                     All Teams
//                   </button>
//                   <div className="border-t border-slate-700"></div>
//                   {subjects.map((subject) => (
//                     <button
//                       key={subject.id}
//                       onClick={() => exportBySubject(subject.name)}
//                       className="w-full text-left px-4 py-2 hover:bg-slate-700 transition"
//                     >
//                       {subject.name}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div> */}
//             <div className="relative">
//   <button
//     onClick={() => setShowExportDropdown(!showExportDropdown)}
//     className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-blue-600 rounded hover:bg-blue-700 transition text-sm"
//   >
//     <Download className="w-3 h-3 sm:w-4 sm:h-4" /> 
//     <span className="hidden sm:inline">Export</span> 
//     <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
//   </button>
//   {showExportDropdown && (
//     <div className="fixed sm:absolute left-2 right-2 sm:left-auto sm:right-0 mt-2 sm:w-56 bg-slate-800 rounded-lg shadow-xl z-50 border border-slate-700 max-h-[70vh] overflow-y-auto">
//       <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700">
//         <span className="font-semibold">All subjects </span>
//         <button
//           onClick={() => setShowExportDropdown(false)}
//           className="p-1 rounded hover:bg-slate-700 transition"
//           aria-label="Close dropdown"
//         >
//           <X className="w-4 h-4" />
//         </button>
//       </div>
//       <button
//         onClick={() => {
//           exportToCSV();
//           setShowExportDropdown(false);
//         }}
//         className="w-full text-left px-4 py-2 hover:bg-slate-700 transition"
//       >
//         Export All DATA
//       </button>
//       <div className="border-t border-slate-700"></div>
//       {subjects.map((subject) => (
//         <button
//           key={subject.id}
//           onClick={() => {
//             exportBySubject(subject.name);
//             setShowExportDropdown(false);
//           }}
//           className="w-full text-left px-4 py-2 hover:bg-slate-700 transition"
//         >
//           {subject.name}
//         </button>
//       ))}
//     </div>
//   )}
// </div>

//             <button
//               onClick={() => setShowProjectModal(true)}
//               className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-purple-600 rounded hover:bg-purple-700 transition text-sm"
//             >
//               <Plus className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Project</span>
//             </button>
            
//             <button
//               onClick={() => setShowImportModal(true)}
//               className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-indigo-600 rounded hover:bg-indigo-700 transition text-sm"
//             >
//               <Upload className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Import</span>
//             </button>

//             <button
//               onClick={() => {
//                 setNewSubject('');
//                 setEditingSubject(null);
//                 setShowSubjectModal(true);
//               }}
//               className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-teal-600 rounded hover:bg-teal-700 transition text-sm"
//             >
//               <Plus className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Subjects</span>
//             </button>

//             <button
//               onClick={() => setShowSubmissionsView(!showSubmissionsView)}
//               className={`flex items-center gap-1 px-2 sm:px-3 py-2 rounded transition text-sm ${
//                 showSubmissionsView
//                   ? 'bg-orange-600 hover:bg-orange-700'
//                   : 'bg-cyan-600 hover:bg-cyan-700'
//               }`}
//             >
//               <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
//               <span className="hidden md:inline">{showSubmissionsView ? 'Teams' : 'Submissions'}</span>
//             </button>
//            <AdminNotificationManager />
//             <button
//               onClick={handleSignOut}
//               className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-red-600 rounded hover:bg-red-700 transition text-sm"
//             >
//               <LogOut className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Sign Out</span>
//             </button>
//           </div>
//         </div>
//       </nav>

//       <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
//         <StatCard label="Total Teams" value={stats.total} color="blue" />
//         <StatCard label="Section A" value={stats.sectionA} color="green" />
//         <StatCard label="Section B" value={stats.sectionB} color="orange" />
//         <StatCard label="Projects" value={stats.uniqueProjects} color="purple" />
//         <StatCard label="Submissions" value={stats.totalSubmissions} color="cyan" />
//       </div>

//       {!showSubmissionsView && (
//         <div className="max-w-7xl mx-auto px-3 sm:px-6 mb-6 flex flex-col gap-3 sm:gap-4">
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base"
//           />
          
//           <div className="flex flex-wrap gap-2 items-center justify-between w-full">
//             <div className="flex gap-2">
//               {['all', 'A', 'B'].map((s) => (
//                 <button
//                   key={s}
//                   onClick={() => setFilter(s as any)}
//                   className={`px-3 py-2 rounded-lg text-sm ${
//                     filter === s
//                       ? 'bg-blue-600'
//                       : 'bg-slate-700 hover:bg-slate-600 transition'
//                   }`}
//                 >
//                   {s === 'all' ? 'All' : s}
//                 </button>
//               ))}
//             </div>

//             <select
//               value={subjectFilter}
//               onChange={(e) => setSubjectFilter(e.target.value)}
//               className="px-4 py-2 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm flex-1 sm:flex-none min-w-[150px]"
//             >
//               <option value="all">All Subjects</option>
//               {subjects.map((subject) => (
//                 <option key={subject.id} value={subject.name}>
//                   {subject.name}
//                 </option>
//               ))}
//             </select>

//             <button
//               className="flex items-center gap-1 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition shadow-lg text-sm whitespace-nowrap"
//               onClick={() => {
//                 setEditingTeam({
//                   section: 'A',
//                   technologies: [],
//                   additional_notes: '',
//                   project_id: null,
//                   team_leader_id: null,
//                   teammate1_id: null,
//                   teammate2_id: null,
//                 });
//                 setIsAdding(true);
//                 setShowModal(true);
//               }}
//             >
//               <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="hidden sm:inline">Add Team</span><span className="sm:hidden">Add</span>
//             </button>
//           </div>
//         </div>
//       )}

//       {showSubmissionsView ? (
//         <>
//           <div className="max-w-7xl mx-auto px-3 sm:px-6 mb-6 flex flex-col gap-3">
//             <h2 className="text-xl sm:text-2xl font-bold">Submissions</h2>
            
//             <div className="flex flex-wrap gap-2 items-center justify-between w-full">
//               <div className="flex gap-2">
//                 {['all', 'A', 'B'].map((s) => (
//                   <button
//                     key={s}
//                     onClick={() => setSubmissionSectionFilter(s as any)}
//                     className={`px-3 py-2 rounded-lg text-sm ${
//                       submissionSectionFilter === s
//                         ? 'bg-blue-600'
//                         : 'bg-slate-700 hover:bg-slate-600 transition'
//                     }`}
//                   >
//                     {s === 'all' ? 'All' : `Section ${s}`}
//                   </button>
//                 ))}
//               </div>

//               <div className="flex flex-wrap gap-2 flex-1 sm:flex-none justify-end">
//                 <select
//                   value={submissionFilter}
//                   onChange={(e) => setSubmissionFilter(e.target.value)}
//                   className="px-4 py-2 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm min-w-[150px]"
//                 >
//                   <option value="all">All Subjects</option>
//                   {subjects.map((subject) => (
//                     <option key={subject.id} value={subject.name}>
//                       {subject.name}
//                     </option>
//                   ))}
//                 </select>
//                 <button
//                   onClick={() => exportSubmissionsCSV(submissionFilter)}
//                   className="flex items-center gap-1 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition text-sm whitespace-nowrap"
//                 >
//                   <Download className="w-4 h-4" /> Export
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="max-w-7xl mx-auto px-3 sm:px-6 mb-8">
//             <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden">
//               {loading ? (
//                 <div className="text-center py-12">Loading...</div>
//               ) : filteredSubmissions.length === 0 ? (
//                 <div className="text-center py-12">No submissions found</div>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-white">
//                     <thead className="bg-slate-900">
//                       <tr className="border-b border-slate-600">
//                         <th className="py-3 px-4 text-left whitespace-nowrap">Subject</th>
//                         <th className="py-3 px-4 text-left whitespace-nowrap">Section</th>
//                         <th className="py-3 px-4 text-left whitespace-nowrap">Project</th>
//                         <th className="py-3 px-4 text-left whitespace-nowrap">Leader</th>
//                         <th className="py-3 px-4 text-left whitespace-nowrap">Teammates</th>
//                         <th className="py-3 px-4 text-left whitespace-nowrap">PPT</th>
//                         <th className="py-3 px-4 text-left whitespace-nowrap">Report</th>
//                         <th className="py-3 px-4 text-left whitespace-nowrap">Submitted</th>
//                         <th className="py-3 px-4 text-left whitespace-nowrap">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filteredSubmissions.map((sub) => (
//                         <tr
//                           key={sub.id}
//                           className="border-b border-slate-600 hover:bg-slate-700 transition"
//                         >
//                           <td className="py-3 px-4 whitespace-nowrap">
//                             <span className="px-2 py-1 bg-purple-600 text-white rounded text-xs">
//                               {sub.subject?.name || 'N/A'}
//                             </span>
//                           </td>
//                           <td className="py-3 px-4 whitespace-nowrap">{sub.section}</td>
//                           <td className="py-3 px-4 min-w-[150px]">{sub.project?.title}</td>
//                           <td className="py-3 px-4 min-w-[120px]">
//                             {sub.team_leader?.name}
//                             {sub.team_leader?.uid && (
//                               <span className="text-slate-400 text-xs ml-1">
//                                 ({sub.team_leader.uid})
//                               </span>
//                             )}
//                           </td>
//                           <td className="py-3 px-4 min-w-[150px]">
//                             {sub.teammate1?.name || ''}
//                             {sub.teammate2?.name ? ', ' + sub.teammate2.name : ''}
//                             {!sub.teammate1 && !sub.teammate2 ? 'Solo' : ''}
//                           </td>
//                           <td className="py-3 px-4 whitespace-nowrap">
//                             {sub.ppt_url ? (
//                               <a
//                                 href={sub.ppt_url}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="text-blue-400 hover:text-blue-300 underline"
//                               >
//                                 View
//                               </a>
//                             ) : (
//                               <span className="text-slate-500">N/A</span>
//                             )}
//                           </td>
//                           <td className="py-3 px-4 whitespace-nowrap">
//                             {sub.report_url ? (
//                               <a
//                                 href={sub.report_url}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="text-blue-400 hover:text-blue-300 underline"
//                               >
//                                 View
//                               </a>
//                             ) : (
//                               <span className="text-slate-500">N/A</span>
//                             )}
//                           </td>
//                           <td className="py-3 px-4 whitespace-nowrap text-sm">
//                             {new Date(sub.submitted_at).toLocaleString()}
//                           </td>
//                           <td className="py-3 px-4 whitespace-nowrap">
//                             <div className="flex gap-2">
//                               <button
//                                 className="p-2 bg-yellow-500 rounded-lg hover:bg-yellow-600 transition"
//                                 onClick={() => enableUpdateForTeam(sub.id)}
//                                 title="Enable Update"
//                               >
//                                 <RefreshCw className="w-4 h-4" />
//                               </button>
//                               <button
//                                 className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition"
//                                 onClick={() => handleDeleteSubmission(sub.id)}
//                                 title="Delete Submission"
//                               >
//                                 <Trash2 className="w-4 h-4" />
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </>
//       ) : (
//         <div className="max-w-7xl mx-auto px-3 sm:px-6 mb-8">
//           <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden">
//             {loading ? (
//               <div className="text-center py-12">Loading...</div>
//             ) : filteredTeams.length === 0 ? (
//               <div className="text-center py-12">No teams found</div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full text-white">
//                   <thead className="bg-slate-900">
//                     <tr className="border-b border-slate-600">
//                       <th className="py-3 px-4 text-left whitespace-nowrap">Section</th>
//                       <th className="py-3 px-4 text-left whitespace-nowrap">Project</th>
//                       <th className="py-3 px-4 text-left whitespace-nowrap">Subject</th>
//                       <th className="py-3 px-4 text-left whitespace-nowrap">Leader</th>
//                       <th className="py-3 px-4 text-left whitespace-nowrap">Teammates</th>
//                       <th className="py-3 px-4 text-left whitespace-nowrap">Technologies</th>
//                       <th className="py-3 px-4 text-left whitespace-nowrap">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredTeams.map((team) => (
//                       <tr
//                         key={team.id}
//                         className="border-b border-slate-600 hover:bg-slate-700 transition"
//                       >
//                         <td className="py-3 px-4 whitespace-nowrap">{team.section}</td>
//                         <td className="py-3 px-4 min-w-[150px]">{team.project?.title}</td>
//                         <td className="py-3 px-4 whitespace-nowrap">
//                           <span className="px-2 py-1 bg-indigo-600 text-white rounded text-xs">
//                             {team.project?.subject?.name || 'N/A'}
//                           </span>
//                         </td>
//                         <td className="py-3 px-4 min-w-[120px]">{team.team_leader?.name}</td>
//                         <td className="py-3 px-4 min-w-[150px]">
//                           {team.teammate1?.name || ''}
//                           {team.teammate2?.name ? ', ' + team.teammate2.name : ''}
//                           {!team.teammate1 && !team.teammate2 ? 'Solo' : ''}
//                         </td>
//                         <td className="py-3 px-4 min-w-[200px]">
//                           <div className="flex flex-wrap gap-2">
//                             {team.technologies?.map((tech, i) => (
//                               <span
//                                 key={i}
//                                 className="px-2 py-1 bg-blue-500 text-white rounded-full text-xs whitespace-nowrap"
//                               >
//                                 {tech}
//                               </span>
//                             ))}
//                           </div>
//                         </td>
//                         <td className="py-3 px-4 whitespace-nowrap">
//                           <div className="flex gap-2">
//                             <button
//                               className="p-2 bg-yellow-500 rounded-lg hover:bg-yellow-600 transition"
//                               onClick={() => {
//                                 setEditingTeam({
//                                   ...team,
//                                   team_leader_id: team.team_leader?.id,
//                                   teammate1_id: team.teammate1?.id,
//                                   teammate2_id: team.teammate2?.id,
//                                 });
//                                 setIsAdding(false);
//                                 setShowModal(true);
//                               }}
//                             >
//                               <Edit className="w-5 h-5" />
//                             </button>
//                             <button
//                               className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition"
//                               onClick={() => handleDelete(team.id)}
//                             >
//                               <Trash2 className="w-5 h-5" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {showModal && editingTeam && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-3 sm:p-4">
//           <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
//             <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
//               {isAdding ? 'Add Team' : 'Edit Team'}
//             </h2>

//             <label className="block mb-2 font-medium text-sm">Section</label>
//             <select
//               className="w-full mb-3 sm:mb-4 p-2 rounded-lg bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
//               value={editingTeam.section}
//               onChange={(e) =>
//                 setEditingTeam({ ...editingTeam, section: e.target.value })
//               }
//             >
//               <option value="A">A</option>
//               <option value="B">B</option>
//             </select>

//             <label className="block mb-2 font-medium text-sm">Project</label>
//             <select
//               className="w-full mb-3 sm:mb-4 p-2 rounded-lg bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
//               value={editingTeam.project_id || ''}
//               onChange={(e) =>
//                 setEditingTeam({
//                   ...editingTeam,
//                   project_id: Number(e.target.value),
//                 })
//               }
//             >
//               <option value="">Select project</option>
//               {projects.map((p) => (
//                 <option key={p.id} value={p.id}>
//                   {p.title} ({p.subject?.name || 'No subject'})
//                 </option>
//               ))}
//             </select>

//             <label className="block mb-2 font-medium text-sm">Leader</label>
//             <select
//               className="w-full mb-3 sm:mb-4 p-2 rounded-lg bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
//               value={editingTeam.team_leader_id || ''}
//               onChange={(e) =>
//                 setEditingTeam({
//                   ...editingTeam,
//                   team_leader_id: Number(e.target.value),
//                 })
//               }
//             >
//               <option value="">Select leader</option>
//               {students.map((s) => (
//                 <option key={s.id} value={s.id}>
//                   {s.name}
//                 </option>
//               ))}
//             </select>

//             <label className="block mb-2 font-medium text-sm">Teammate 1</label>
//             <select
//               className="w-full mb-3 sm:mb-4 p-2 rounded-lg bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
//               value={editingTeam.teammate1_id || ''}
//               onChange={(e) =>
//                 setEditingTeam({
//                   ...editingTeam,
//                   teammate1_id: e.target.value ? Number(e.target.value) : null,
//                 })
//               }
//             >
//               <option value="">None</option>
//               {students.map((s) => (
//                 <option key={s.id} value={s.id}>
//                   {s.name}
//                 </option>
//               ))}
//             </select>

//             <label className="block mb-2 font-medium text-sm">Teammate 2</label>
//             <select
//               className="w-full mb-3 sm:mb-4 p-2 rounded-lg bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
//               value={editingTeam.teammate2_id || ''}
//               onChange={(e) =>
//                 setEditingTeam({
//                   ...editingTeam,
//                   teammate2_id: e.target.value ? Number(e.target.value) : null,
//                 })
//               }
//             >
//               <option value="">None</option>
//               {students.map((s) => (
//                 <option key={s.id} value={s.id}>
//                   {s.name}
//                 </option>
//               ))}
//             </select>

//             <label className="block mb-2 font-medium text-sm">
//               Technologies (comma separated)
//             </label>
//             <input
//               type="text"
//               className="w-full mb-3 sm:mb-4 p-2 rounded-lg bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
//               value={editingTeam.technologies.join(', ')}
//               onChange={(e) =>
//                 setEditingTeam({
//                   ...editingTeam,
//                   technologies: e.target.value
//                     .split(',')
//                     .map((t: string) => t.trim()),
//                 })
//               }
//             />

//             <label className="block mb-2 font-medium text-sm">Notes</label>
//             <input
//               type="text"
//               className="w-full mb-3 sm:mb-4 p-2 rounded-lg bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
//               value={editingTeam.additional_notes || ''}
//               onChange={(e) =>
//                 setEditingTeam({
//                   ...editingTeam,
//                   additional_notes: e.target.value,
//                 })
//               }
//             />

//             <div className="flex justify-end gap-2 sm:gap-3 mt-4">
//               <button
//                 className="flex items-center gap-1 px-3 sm:px-4 py-2 bg-gray-500 rounded-lg hover:bg-gray-600 transition text-sm"
//                 onClick={() => setShowModal(false)}
//               >
//                 <X className="w-4 h-4 sm:w-5 sm:h-5" /> Cancel
//               </button>
//               <button
//                 className="flex items-center gap-1 px-3 sm:px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition shadow-lg text-sm"
//                 onClick={handleSave}
//               >
//                 <Save className="w-4 h-4 sm:w-5 sm:h-5" /> Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showProjectModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-3 sm:p-4">
//           <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 w-full max-w-md shadow-2xl">
//             <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Add New Project</h2>

//             <label className="block mb-2 font-medium text-sm">Project Number *</label>
//             <input
//               type="number"
//               className="w-full mb-3 sm:mb-4 p-2 rounded-lg bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
//               value={newProject.project_number}
//               onChange={(e) =>
//                 setNewProject({ ...newProject, project_number: e.target.value })
//               }
//               placeholder="Enter project number"
//             />

//             <label className="block mb-2 font-medium text-sm">Project Title *</label>
//             <input
//               type="text"
//               className="w-full mb-3 sm:mb-4 p-2 rounded-lg bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
//               value={newProject.title}
//               onChange={(e) =>
//                 setNewProject({ ...newProject, title: e.target.value })
//               }
//               placeholder="Enter project title"
//             />

//             <label className="block mb-2 font-medium text-sm">Subject *</label>
//             <select
//               className="w-full mb-3 sm:mb-4 p-2 rounded-lg bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
//               value={newProject.subject}
//               onChange={(e) =>
//                 setNewProject({ ...newProject, subject: e.target.value })
//               }
//             >
//               <option value="">Select a subject</option>
//               {subjects.map((subject) => (
//                 <option key={subject.id} value={subject.name}>
//                   {subject.name}
//                 </option>
//               ))}
//             </select>

//             <label className="block mb-2 font-medium text-sm">Description</label>
//             <textarea
//               className="w-full mb-3 sm:mb-4 p-2 rounded-lg bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
//               value={newProject.description}
//               onChange={(e) =>
//                 setNewProject({ ...newProject, description: e.target.value })
//               }
//               placeholder="Project description (optional)"
//               rows={3}
//             />

//             <div className="flex justify-end gap-2 sm:gap-3 mt-4">
//               <button
//                 className="flex items-center gap-1 px-3 sm:px-4 py-2 bg-gray-500 rounded-lg hover:bg-gray-600 transition text-sm"
//                 onClick={() => {
//                   setShowProjectModal(false);
//                   setNewProject({ title: '', subject: '', description: '', project_number: '' });
//                 }}
//               >
//                 <X className="w-4 h-4 sm:w-5 sm:h-5" /> Cancel
//               </button>
//               <button
//                 className="flex items-center gap-1 px-3 sm:px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition shadow-lg text-sm"
//                 onClick={handleAddProject}
//               >
//                 <Save className="w-4 h-4 sm:w-5 sm:h-5" /> Add
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showImportModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-3 sm:p-4">
//           <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
//             <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Import Projects</h2>
            
//             <div className="mb-4 p-3 sm:p-4 bg-slate-800 rounded-lg">
//               <p className="text-xs sm:text-sm text-gray-300 mb-2">CSV Format Required:</p>
//               <code className="text-xs bg-slate-950 p-2 rounded block overflow-x-auto">
//                 ProjectNumber,Title,Subject,Description<br/>
//                 1,"AI Chatbot","AI","Build an AI assistant"<br/>
//                 2,"E-commerce Site","FS","Online shopping"
//               </code>
//               <p className="text-xs text-yellow-400 mt-2">⚠️ Subjects must match existing ones</p>
//               <p className="text-xs text-blue-400 mt-1 break-words">Available: {subjects.map(s => s.name).join(', ')}</p>
//             </div>

//             <input
//               ref={fileInputRef}
//               type="file"
//               accept=".csv"
//               onChange={handleImportCSV}
//               className="hidden"
//             />

//             <button
//               onClick={() => fileInputRef.current?.click()}
//               className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-lg mb-4 text-sm"
//             >
//               <Upload className="w-5 h-5" /> Choose CSV File
//             </button>

//             <div className="flex justify-end gap-2 sm:gap-3">
//               <button
//                 className="flex items-center gap-1 px-3 sm:px-4 py-2 bg-gray-500 rounded-lg hover:bg-gray-600 transition text-sm"
//                 onClick={() => setShowImportModal(false)}
//               >
//                 <X className="w-4 h-4 sm:w-5 sm:h-5" /> Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showSubjectModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-3 sm:p-4">
//           <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
//             <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Manage Subjects</h2>

//             <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-slate-800 rounded-lg">
//               <h3 className="text-base sm:text-lg font-semibold mb-3">Add New Subject</h3>
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   className="flex-1 p-2 rounded-lg bg-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition text-sm"
//                   value={newSubject}
//                   onChange={(e) => setNewSubject(e.target.value)}
//                   placeholder="Enter subject name"
//                   onKeyPress={(e) => e.key === 'Enter' && handleAddSubject()}
//                 />
//                 <button
//                   className="flex items-center gap-1 px-3 sm:px-4 py-2 bg-teal-600 rounded-lg hover:bg-teal-700 transition text-sm whitespace-nowrap"
//                   onClick={handleAddSubject}
//                 >
//                   <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Add
//                 </button>
//               </div>
//             </div>

//             <div className="mb-4">
//               <h3 className="text-base sm:text-lg font-semibold mb-3">Existing Subjects</h3>
//               <div className="space-y-2">
//                 {subjects.map((subject) => (
//                   <div
//                     key={subject.id}
//                     className="flex items-center justify-between p-2 sm:p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition"
//                   >
//                     {editingSubject?.id === subject.id ? (
//                       <>
//                         <input
//                           type="text"
//                           className="flex-1 p-2 rounded-lg bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition mr-2 text-sm"
//                           value={editingSubject.name}
//                           onChange={(e) =>
//                             setEditingSubject({ ...editingSubject, name: e.target.value })
//                           }
//                           onKeyPress={(e) => e.key === 'Enter' && handleUpdateSubject()}
//                         />
//                         <div className="flex gap-2">
//                           <button
//                             className="p-2 bg-green-600 rounded-lg hover:bg-green-700 transition"
//                             onClick={handleUpdateSubject}
//                           >
//                             <Save className="w-4 h-4 sm:w-5 sm:h-5" />
//                           </button>
//                           <button
//                             className="p-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition"
//                             onClick={() => setEditingSubject(null)}
//                           >
//                             <X className="w-4 h-4 sm:w-5 sm:h-5" />
//                           </button>
//                         </div>
//                       </>
//                     ) : (
//                       <>
//                         <span className="text-sm sm:text-lg">{subject.name}</span>
//                         <div className="flex gap-2">
//                           <button
//                             className="p-2 bg-yellow-500 rounded-lg hover:bg-yellow-600 transition"
//                             onClick={() => setEditingSubject({ ...subject })}
//                           >
//                             <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
//                           </button>
//                           <button
//                             className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition"
//                             onClick={() => handleDeleteSubject(subject.id)}
//                           >
//                             <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
//                           </button>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="flex justify-end gap-2 sm:gap-3 mt-6">
//               <button
//                 className="flex items-center gap-1 px-3 sm:px-4 py-2 bg-gray-500 rounded-lg hover:bg-gray-600 transition text-sm"
//                 onClick={() => {
//                   setShowSubjectModal(false);
//                   setEditingSubject(null);
//                   setNewSubject('');
//                 }}
//               >
//                 <X className="w-4 h-4 sm:w-5 sm:h-5" /> Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function StatCard({
//   label,
//   value,
//   color,
// }: {
//   label: string;
//   value: number;
//   color: string;
// }) {
//   const gradient = {
//     blue: 'from-blue-500 to-blue-600',
//     green: 'from-green-500 to-green-600',
//     orange: 'from-orange-500 to-orange-600',
//     purple: 'from-purple-500 to-purple-600',
//     cyan: 'from-cyan-500 to-cyan-600',
//   }[color];
//   return (
//     <div
//       className={`bg-gradient-to-br ${gradient} rounded-2xl p-4 sm:p-6 text-white shadow-lg transform hover:scale-105 transition`}
//     >
//       <div className="text-2xl sm:text-3xl font-bold">{value}</div>
//       <div className="font-medium text-xs sm:text-base">{label}</div>
//     </div>
//   );
// }
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { AdminNotificationManager } from './AdminNotificationManager';
import {
  LayoutDashboard, LogOut, Trash2, RefreshCw, Plus, Edit,
  Download, X, Save, Upload, FileText, Users, BookOpen,
  FolderOpen, CheckCircle2, FileSpreadsheet, Menu, Search,
  ChevronRight, Shield, Layers,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS  — single source of truth for the entire palette
═══════════════════════════════════════════════════════════════════════════════ */
const T = {
  bg:          '#080C14',
  surface:     '#0E1420',
  surfaceUp:   '#131B2A',
  border:      'rgba(99,120,200,0.15)',
  borderHov:   'rgba(99,120,200,0.35)',

  violet:      '#7C6BF8',
  violetDim:   'rgba(124,107,248,0.18)',
  violetGlow:  'rgba(124,107,248,0.35)',

  teal:        '#2DD4BF',
  tealDim:     'rgba(45,212,191,0.15)',
  tealGlow:    'rgba(45,212,191,0.3)',

  amber:       '#F59E0B',
  amberDim:    'rgba(245,158,11,0.18)',
  amberGlow:   'rgba(245,158,11,0.3)',

  emerald:     '#10B981',
  emeraldDim:  'rgba(16,185,129,0.15)',
  emeraldGlow: 'rgba(16,185,129,0.3)',

  red:         '#EF4444',
  redDim:      'rgba(239,68,68,0.15)',

  textPrimary:   '#F1F5FF',
  textSecondary: '#8899C4',
  textMuted:     '#4A5878',

  fontDisplay: "'Sora', 'Segoe UI', system-ui, sans-serif",
  fontBody:    "'DM Sans', 'Segoe UI', system-ui, sans-serif",
};

/* ═══════════════════════════════════════════════════════════════════════════════
   GLOBAL CSS
═══════════════════════════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: ${T.surface}; }
  ::-webkit-scrollbar-thumb { background: rgba(124,107,248,0.35); border-radius: 99px; }
  select option { background: ${T.surfaceUp}; color: ${T.textPrimary}; }
  input::placeholder, textarea::placeholder { color: ${T.textMuted}; }

  .cu-tr:hover { background: rgba(124,107,248,0.055) !important; }
  .cu-navbtn:hover { opacity: 0.82; transform: translateY(-1px); }
  .cu-card:hover { border-color: rgba(124,107,248,0.28); transform: translateY(-2px); }

  @keyframes cuFadeUp {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .cu-fade { animation: cuFadeUp 0.3s ease both; }

  @keyframes cuShimmer {
    0%   { background-position:-200% center; }
    100% { background-position: 200% center; }
  }
  .cu-shimmer {
    background: linear-gradient(90deg, ${T.surfaceUp} 25%, rgba(124,107,248,0.07) 50%, ${T.surfaceUp} 75%);
    background-size: 200% 100%;
    animation: cuShimmer 1.6s infinite;
  }

  @media (max-width: 767px) { .cu-desktop { display:none !important; } }
  @media (min-width: 768px) { .cu-mobile  { display:none !important; } }
`;

/* ═══════════════════════════════════════════════════════════════════════════════
   EXCEL EXPORT (SheetJS / xlsx — browser native, no extra deps beyond xlsx pkg)
═══════════════════════════════════════════════════════════════════════════════ */
async function exportExcel(
  data: any[], subjectName: string, section: 'all'|'A'|'B', type: 'teams'|'submissions'
) {
  const XLSX = await import('xlsx');
  const PALETTES = [
    { h:'5B4FE8', l:'EEF2FF', m:'C7D2FE' },
    { h:'0E8A8A', l:'CCFBF1', m:'99F6E4' },
    { h:'B45309', l:'FEF3C7', m:'FDE68A' },
    { h:'6D28D9', l:'EDE9FE', m:'DDD6FE' },
    { h:'0369A1', l:'E0F2FE', m:'BAE6FD' },
    { h:'065F46', l:'D1FAE5', m:'A7F3D0' },
    { h:'9D174D', l:'FCE7F3', m:'FBCFE8' },
  ];
  const mk = (v: any, s: any) => ({ v, s, t: typeof v === 'number' ? 'n' : 's' });
  const tS = (h: string) => ({ font:{bold:true,sz:13,color:{rgb:'FFFFFF'},name:'Calibri'}, fill:{fgColor:{rgb:h},patternType:'solid'}, alignment:{horizontal:'left',vertical:'center',indent:1} });
  const hS = (h: string) => ({ font:{bold:true,sz:10,color:{rgb:'FFFFFF'},name:'Calibri'}, fill:{fgColor:{rgb:h},patternType:'solid'}, alignment:{horizontal:'center',vertical:'center'}, border:{bottom:{style:'medium',color:{rgb:'FFFFFF'}},right:{style:'thin',color:{rgb:'FFFFFF'}}} });
  const dS = (bg: string) => ({ font:{sz:9.5,name:'Calibri',color:{rgb:'1E293B'}}, fill:{fgColor:{rgb:bg},patternType:'solid'}, alignment:{horizontal:'left',vertical:'center'}, border:{bottom:{style:'thin',color:{rgb:'D1D5DB'}},right:{style:'thin',color:{rgb:'D1D5DB'}}} });
  const sS = (sec: string, bg: string) => ({ ...dS(bg), font:{sz:9.5,bold:true,name:'Calibri',color:{rgb:sec==='A'?'4F46E5':'B45309'}}, alignment:{horizontal:'center',vertical:'center'} });
  const zS = { font:{sz:9.5,italic:true,bold:true,name:'Calibri',color:{rgb:'6B7280'}}, alignment:{horizontal:'left',vertical:'center'} };

  const filtered = section === 'all' ? data : data.filter(r => r.section === section);
  if (!filtered.length) { alert('No data for this filter.'); return; }

  const groups: Record<string, any[]> = {};
  filtered.forEach(r => {
    const k = r.subject?.name || r.project?.subject?.name || 'Unknown';
    if (subjectName !== 'all' && k !== subjectName) return;
    if (!groups[k]) groups[k] = [];
    groups[k].push(r);
  });
  if (!Object.keys(groups).length) { alert('No data for selected subject.'); return; }

  const wb = XLSX.utils.book_new();
  let pi = 0;
  for (const [subj, rows] of Object.entries(groups)) {
    const p = PALETTES[pi++ % PALETTES.length];
    const isT = type === 'teams';
    const hdrs = isT
      ? ['Section','Proj #','Project Title','Leader Name','Leader UID','Teammate 1','TM1 UID','Teammate 2','TM2 UID','Technologies','Notes','Registered At']
      : ['Section','Proj #','Project Title','Leader Name','Leader UID','Teammate 1','TM1 UID','Teammate 2','TM2 UID','PPT URL','Report URL','Submitted At'];
    const wids = isT ? [10,8,32,22,14,22,12,22,12,34,26,20] : [10,8,32,22,14,22,12,22,12,38,38,20];
    const nc = hdrs.length;
    const secLabel = section === 'all' ? 'All Sections' : `Section ${section}`;

    const aoa: any[][] = [];
    const tr = Array(nc).fill(mk('', tS(p.h)));
    tr[0] = mk(`${subj}   ·   ${secLabel}   ·   ${isT ? 'Teams' : 'Submissions'}`, tS(p.h));
    aoa.push(tr);
    aoa.push(hdrs.map(h => mk(h, hS(p.h))));

    rows.forEach((row, i) => {
      const bg = i % 2 === 0 ? p.l : p.m;
      const vals = isT ? [
        row.section, row.project?.project_number ?? '', row.project?.title ?? '',
        row.team_leader?.name ?? '', row.team_leader?.uid ?? '',
        row.teammate1?.name ?? '', row.teammate1?.uid ?? '',
        row.teammate2?.name ?? '', row.teammate2?.uid ?? '',
        (row.technologies ?? []).join(', '), row.additional_notes ?? '',
        row.created_at ? new Date(row.created_at).toLocaleString() : '',
      ] : [
        row.section, row.project?.project_number ?? '', row.project?.title ?? '',
        row.team_leader?.name ?? '', row.team_leader?.uid ?? '',
        row.teammate1?.name ?? '', row.teammate1?.uid ?? '',
        row.teammate2?.name ?? '', row.teammate2?.uid ?? '',
        row.ppt_url ?? '', row.report_url ?? '',
        row.submitted_at ? new Date(row.submitted_at).toLocaleString() : '',
      ];
      aoa.push(vals.map((v, ci) => ci === 0 ? mk(v, sS(row.section, bg)) : mk(v, dS(bg))));
    });

    aoa.push(Array(nc).fill(mk('', {})));
    const sr = Array(nc).fill(mk('', {}));
    sr[0] = mk(`Total: ${rows.length} record${rows.length !== 1 ? 's' : ''}`, zS);
    aoa.push(sr);

    const ws: any = XLSX.utils.aoa_to_sheet(aoa);
    ws['!merges'] = [{ s:{r:0,c:0}, e:{r:0,c:nc-1} }];
    ws['!cols'] = wids.map(w => ({ wch: w }));
    ws['!rows'] = [{ hpt:28 }, { hpt:20 }, ...rows.map(() => ({ hpt:17 })), { hpt:6 }, { hpt:16 }];
    ws['!freeze'] = { xSplit:0, ySplit:2 };
    XLSX.utils.book_append_sheet(wb, ws, subj.replace(/[*?:\[\]\/\\]/g,'').slice(0,31));
  }
  const ss = subjectName === 'all' ? 'all-subjects' : subjectName.replace(/\s+/g,'_');
  const sc = section === 'all' ? 'all-sections' : `sec-${section}`;
  XLSX.writeFile(wb, `${type}_${ss}_${sc}.xlsx`);
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════════ */
export function AdminDashboard() {
  const [teams, setTeams]           = useState<any[]>([]);
  const [students, setStudents]     = useState<any[]>([]);
  const [projects, setProjects]     = useState<any[]>([]);
  const [subjects, setSubjects]     = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState<'all'|'A'|'B'>('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTeam, setEditingTeam] = useState<any|null>(null);
  const [showModal, setShowModal]   = useState(false);
  const [isAdding, setIsAdding]     = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({ title:'', subject:'', description:'', project_number:'' });
  const [showImportModal, setShowImportModal]   = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [newSubject, setNewSubject]   = useState('');
  const [editingSubject, setEditingSubject] = useState<any|null>(null);
  const [showSubmissionsView, setShowSubmissionsView] = useState(false);
  const [submissionFilter, setSubmissionFilter] = useState('all');
  const [submissionSectionFilter, setSubmissionSectionFilter] = useState<'all'|'A'|'B'>('all');
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [excelType, setExcelType]     = useState<'teams'|'submissions'>('teams');
  const [excelSubject, setExcelSubject] = useState('all');
  const [excelSection, setExcelSection] = useState<'all'|'A'|'B'>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = 'cu-admin-g';
    if (!document.getElementById(id)) {
      const s = document.createElement('style');
      s.id = id; s.textContent = GLOBAL_CSS;
      document.head.appendChild(s);
    }
  }, []);

  useEffect(() => {
    loadAll();
    const sub = supabase.channel('teams_ch')
      .on('postgres_changes', { event:'*', schema:'public', table:'teams' }, () => { loadTeams(); loadSubmissions(); })
      .subscribe();
    return () => sub.unsubscribe();
  }, []);

  function loadAll() { loadTeams(); loadStudents(); loadProjects(); loadSubjects(); loadSubmissions(); }

  async function loadTeams() {
    setLoading(true);
    const { data } = await supabase.from('teams').select(`
      *, project:projects(*, subject:subjects(name)),
      team_leader:students!fk_team_leader(*),
      teammate1:students!fk_teammate1(*),
      teammate2:students!fk_teammate2(*)
    `).order('created_at', { ascending: false });
    if (data) setTeams(data);
    setLoading(false);
  }
  async function loadStudents()    { const {data} = await supabase.from('students').select('*').order('name'); if (data) setStudents(data); }
  async function loadProjects()    { const {data} = await supabase.from('projects').select('*, subject:subjects(name)').order('title'); if (data) setProjects(data); }
  async function loadSubjects()    { const {data} = await supabase.from('subjects').select('*').order('name'); if (data) setSubjects(data); }
  async function loadSubmissions() {
    const {data} = await supabase.from('teams').select(`
      *, subject:subjects(name), project:projects(title,project_number),
      team_leader:students!fk_team_leader(name,uid),
      teammate1:students!fk_teammate1(name,uid),
      teammate2:students!fk_teammate2(name,uid)
    `).not('submitted_at','is',null).order('submitted_at',{ascending:false});
    if (data) setSubmissions(data);
  }

  async function handleAddSubject() {
    if (!newSubject.trim()) return alert('Enter a name');
    const {error} = await supabase.from('subjects').insert({ name:newSubject.trim() });
    if (error) return alert('Failed: '+error.message);
    setNewSubject(''); loadSubjects(); alert('Subject added!');
  }
  async function handleUpdateSubject() {
    if (!editingSubject?.name.trim()) return alert('Enter a name');
    const {error} = await supabase.from('subjects').update({ name:editingSubject.name.trim() }).eq('id', editingSubject.id);
    if (error) return alert('Failed: '+error.message);
    setEditingSubject(null); loadSubjects(); loadProjects(); loadTeams();
  }
  async function handleDeleteSubject(id: string) {
    if (!confirm('Delete subject?')) return;
    await supabase.from('subjects').delete().eq('id', id); loadSubjects();
  }
  async function enableUpdateForTeam(id: string) {
    if (!confirm('Allow resubmit?')) return;
    await supabase.from('teams').update({ submitted_at:null }).eq('id', id);
    loadSubmissions(); loadTeams();
  }
  async function handleDeleteSubmission(id: string) {
    if (!confirm('Delete submission?')) return;
    await supabase.from('teams').update({ ppt_url:null, report_url:null, submitted_at:null }).eq('id', id);
    loadSubmissions(); loadTeams();
  }
  async function handleSignOut() {
    try {
      const {error} = await supabase.auth.signOut();
      if (error && error.message !== 'Auth session missing!') return alert('Error: '+error.message);
      localStorage.clear(); sessionStorage.clear();
      window.location.href = 'https://cusphere.netlify.app/';
    } catch { window.location.href = 'https://cusphere.netlify.app/'; }
  }
  async function handleDelete(id: string) {
    if (!confirm('Delete team?')) return;
    await supabase.from('teams').delete().eq('id', id); loadTeams();
  }
  async function handleSave() {
    if (!editingTeam) return;
    const p = { section:editingTeam.section, technologies:editingTeam.technologies,
      additional_notes:editingTeam.additional_notes, project_id:editingTeam.project_id,
      team_leader_id:editingTeam.team_leader_id,
      teammate1_id:editingTeam.teammate1_id||null, teammate2_id:editingTeam.teammate2_id||null };
    const fn = isAdding ? supabase.from('teams').insert(p) : supabase.from('teams').update(p).eq('id',editingTeam.id);
    const {error} = await fn;
    if (error) return console.error(error);
    setShowModal(false); loadTeams();
  }
  async function handleAddProject() {
    if (!newProject.title || !newProject.subject || !newProject.project_number) return alert('Fill all required fields');
    const sel = subjects.find(s => s.name === newProject.subject);
    if (!sel) return alert('Invalid subject');
    const {error} = await supabase.from('projects').insert({ title:newProject.title, subject_id:sel.id, description:newProject.description, project_number:parseInt(newProject.project_number) });
    if (error) return alert('Failed: '+error.message);
    setNewProject({title:'',subject:'',description:'',project_number:''}); setShowProjectModal(false); loadProjects();
  }
  async function handleImportCSV(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = async e => {
      const lines = (e.target?.result as string).split('\n').filter(l=>l.trim()).slice(1);
      const ins: any[] = [];
      for (const line of lines) {
        const m = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (!m || m.length < 3) continue;
        const [pn,title,subj,desc=''] = m.map(x=>x.replace(/^"|"$/g,'').trim());
        const s = subjects.find(s=>s.name===subj);
        if (s) ins.push({ project_number:parseInt(pn), title, subject_id:s.id, description:desc });
      }
      if (!ins.length) return alert('No valid rows. Check subject names.');
      const {error} = await supabase.from('projects').insert(ins);
      if (error) return alert('Import failed: '+error.message);
      setShowImportModal(false); loadProjects(); alert(`Imported ${ins.length} projects!`);
    };
    reader.readAsText(file); event.target.value = '';
  }

  const filteredTeams = teams
    .filter(t => filter==='all' || t.section===filter)
    .filter(t => subjectFilter==='all' || t.project?.subject?.name===subjectFilter)
    .filter(t => {
      if (!searchTerm) return true;
      const s = searchTerm.toLowerCase();
      return t.project?.title?.toLowerCase().includes(s)
        || t.project?.subject?.name?.toLowerCase().includes(s)
        || t.team_leader?.name?.toLowerCase().includes(s)
        || t.teammate1?.name?.toLowerCase().includes(s)
        || t.teammate2?.name?.toLowerCase().includes(s)
        || t.technologies?.some((x:string)=>x.toLowerCase().includes(s));
    });

  const filteredSubmissions = submissions
    .filter(s => submissionFilter==='all' || s.subject?.name===submissionFilter)
    .filter(s => submissionSectionFilter==='all' || s.section===submissionSectionFilter);

  const stats = {
    total: teams.length,
    sectionA: teams.filter(t=>t.section==='A').length,
    sectionB: teams.filter(t=>t.section==='B').length,
    projects: new Set(teams.map(t=>t.project_id)).size,
    submissions: submissions.length,
  };

  /* nav actions list */
  const navActions = [
    { icon:<RefreshCw size={13}/>,      label:'Refresh',      onClick:loadAll,                         bg:T.surfaceUp,         border:T.border },
    { icon:<FileSpreadsheet size={13}/>, label:'Export Excel', onClick:()=>setShowExcelModal(true),     bg:'rgba(6,78,59,0.8)', border:'rgba(16,185,129,0.3)' },
    { icon:<Plus size={13}/>,           label:'Add Project',  onClick:()=>setShowProjectModal(true),   bg:'rgba(30,27,75,0.8)',border:'rgba(124,107,248,0.3)' },
    { icon:<Upload size={13}/>,         label:'Import CSV',   onClick:()=>setShowImportModal(true),    bg:'rgba(12,26,64,0.8)',border:'rgba(59,130,246,0.3)' },
    { icon:<BookOpen size={13}/>,       label:'Subjects',     onClick:()=>{ setNewSubject(''); setEditingSubject(null); setShowSubjectModal(true); }, bg:'rgba(12,32,48,0.8)', border:'rgba(45,212,191,0.3)' },
  ];

  const activeSection = showSubmissionsView ? submissionSectionFilter : filter;
  const setActiveSection = (s: 'all'|'A'|'B') => showSubmissionsView ? setSubmissionSectionFilter(s) : setFilter(s);

  /* ─── RENDER ──────────────────────────────────────────────────────────── */
  return (
    <div style={{ minHeight:'100vh', background:T.bg, fontFamily:T.fontBody, color:T.textPrimary }}>

      {/* ══ NAV ══════════════════════════════════════════════════════════════ */}
      <nav style={{ position:'sticky', top:0, zIndex:100, background:`${T.surface}F0`, backdropFilter:'blur(24px)', borderBottom:`1px solid ${T.border}`, boxShadow:'0 2px 40px rgba(0,0,0,0.45)' }}>
        <div style={{ maxWidth:1440, margin:'0 auto', padding:'0 18px', height:58, display:'flex', alignItems:'center', gap:14 }}>

          {/* Brand */}
          <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
            <div style={{ width:34, height:34, borderRadius:9, background:`linear-gradient(135deg,${T.violet},#5044D4)`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 14px ${T.violetGlow}` }}>
              <Shield size={16} color="white"/>
            </div>
            <div className="cu-desktop">
              <div style={{ fontFamily:T.fontDisplay, fontWeight:800, fontSize:14, color:T.textPrimary, lineHeight:1.1 }}>CUSphere</div>
              <div style={{ fontSize:10, color:T.textMuted, letterSpacing:'0.07em', textTransform:'uppercase' }}>Admin Panel</div>
            </div>
          </div>

          {/* Desktop actions */}
          <div className="cu-desktop" style={{ display:'flex', alignItems:'center', gap:6, flex:1, justifyContent:'flex-end', flexWrap:'wrap' }}>
            {navActions.map(a => (
              <button key={a.label} onClick={a.onClick} className="cu-navbtn"
                style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 11px', borderRadius:8, background:a.bg, border:`1px solid ${a.border}`, color:T.textPrimary, fontSize:12, fontWeight:600, cursor:'pointer', transition:'all 0.18s', whiteSpace:'nowrap' }}>
                {a.icon} {a.label}
              </button>
            ))}
            <button onClick={()=>setShowSubmissionsView(v=>!v)} className="cu-navbtn"
              style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 11px', borderRadius:8, border:'1px solid', borderColor: showSubmissionsView ? T.amberGlow : 'rgba(45,212,191,0.3)', background: showSubmissionsView ? T.amberDim : T.tealDim, color: showSubmissionsView ? T.amber : T.teal, fontSize:12, fontWeight:700, cursor:'pointer', transition:'all 0.18s', whiteSpace:'nowrap' }}>
              <FileText size={13}/> {showSubmissionsView ? 'Teams View' : 'Submissions'}
            </button>
            <AdminNotificationManager/>
            <button onClick={handleSignOut} className="cu-navbtn"
              style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 11px', borderRadius:8, background:T.redDim, border:'1px solid rgba(239,68,68,0.3)', color:T.red, fontSize:12, fontWeight:700, cursor:'pointer', transition:'all 0.18s' }}>
              <LogOut size={13}/> Sign Out
            </button>
          </div>

          {/* Mobile right strip */}
          <div className="cu-mobile" style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8 }}>
            <button onClick={()=>setShowSubmissionsView(v=>!v)}
              style={{ padding:'6px 10px', borderRadius:8, background: showSubmissionsView ? T.amberDim : T.tealDim, border:`1px solid ${showSubmissionsView ? T.amberGlow : T.tealGlow}`, color: showSubmissionsView ? T.amber : T.teal, fontSize:11, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' }}>
              {showSubmissionsView ? 'Teams' : 'Subs'}
            </button>
            <button onClick={()=>setMobileMenuOpen(o=>!o)}
              style={{ width:36, height:36, borderRadius:9, background:T.surfaceUp, border:`1px solid ${T.border}`, color:T.textPrimary, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
              {mobileMenuOpen ? <X size={17}/> : <Menu size={17}/>}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="cu-mobile cu-fade" style={{ borderTop:`1px solid ${T.border}`, background:T.surface, padding:'12px 16px 18px', display:'flex', flexDirection:'column', gap:8 }}>
            {navActions.map(a => (
              <button key={a.label} onClick={()=>{ a.onClick(); setMobileMenuOpen(false); }}
                style={{ display:'flex', alignItems:'center', gap:8, padding:'11px 14px', borderRadius:10, background:a.bg, border:`1px solid ${a.border}`, color:T.textPrimary, fontSize:13, fontWeight:600, cursor:'pointer' }}>
                {a.icon} {a.label}
              </button>
            ))}
            <div style={{ display:'flex', gap:8, marginTop:4 }}>
              <div style={{ flex:1 }}><AdminNotificationManager/></div>
              <button onClick={handleSignOut}
                style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'10px', borderRadius:10, background:T.redDim, border:'1px solid rgba(239,68,68,0.3)', color:T.red, fontSize:13, fontWeight:700, cursor:'pointer' }}>
                <LogOut size={14}/> Sign Out
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ══ CONTENT ══════════════════════════════════════════════════════════ */}
      <div style={{ maxWidth:1440, margin:'0 auto', padding:'20px 18px 50px' }}>

        {/* ── STATS ─────────────────────────────────────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:12, marginBottom:22 }}>
          {[
            { label:'Total Teams',   value:stats.total,       accent:T.violet,  icon:<Users size={16}/> },
            { label:'Section A',     value:stats.sectionA,    accent:'#6366F1', icon:<Layers size={16}/> },
            { label:'Section B',     value:stats.sectionB,    accent:T.amber,   icon:<Layers size={16}/> },
            { label:'Projects',      value:stats.projects,    accent:T.teal,    icon:<FolderOpen size={16}/> },
            { label:'Submissions',   value:stats.submissions, accent:T.emerald, icon:<CheckCircle2 size={16}/> },
          ].map(s => (
            <div key={s.label} className="cu-fade" style={{ background:T.surfaceUp, border:`1px solid ${T.border}`, borderRadius:13, padding:'16px 18px', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, right:0, width:64, height:64, borderRadius:'0 13px 0 64px', background:`${s.accent}18`, display:'flex', alignItems:'center', justifyContent:'center', paddingLeft:18, paddingBottom:18 }}>
                <span style={{ color:s.accent }}>{s.icon}</span>
              </div>
              <div style={{ fontSize:10, color:T.textMuted, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:6 }}>{s.label}</div>
              <div style={{ fontFamily:T.fontDisplay, fontWeight:800, fontSize:30, color:T.textPrimary, lineHeight:1 }}>{s.value}</div>
              <div style={{ width:20, height:3, borderRadius:2, background:`linear-gradient(to right,${s.accent},transparent)`, marginTop:8 }}/>
            </div>
          ))}
        </div>

        {/* ── FILTER BAR ────────────────────────────────────────────────── */}
        <div style={{ background:T.surfaceUp, border:`1px solid ${T.border}`, borderRadius:13, padding:'14px 16px', marginBottom:14 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10, marginBottom:12 }}>
            {/* Section title */}
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:4, height:18, borderRadius:4, background:`linear-gradient(to bottom,${T.violet},${T.teal})` }}/>
              <span style={{ fontFamily:T.fontDisplay, fontWeight:700, fontSize:16, color:T.textPrimary }}>{showSubmissionsView ? 'Submissions' : 'Teams'}</span>
              <span style={{ fontSize:11, padding:'2px 9px', borderRadius:20, background:T.violetDim, color:T.violet, border:`1px solid rgba(124,107,248,0.3)`, fontWeight:700 }}>
                {showSubmissionsView ? filteredSubmissions.length : filteredTeams.length}
              </span>
            </div>

            <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
              {/* Section A/B/all pills */}
              <div style={{ display:'flex', gap:5 }}>
                {(['all','A','B'] as const).map(s => {
                  const active = activeSection === s;
                  const ac = s==='A' ? T.violet : s==='B' ? T.amber : T.textSecondary;
                  return (
                    <button key={s} onClick={()=>setActiveSection(s)}
                      style={{ padding:'6px 13px', borderRadius:20, fontSize:12, fontWeight:700, cursor:'pointer', border:'1.5px solid', borderColor: active ? ac : T.border, background: active ? `${ac}22` : 'transparent', color: active ? ac : T.textSecondary, transition:'all 0.18s', boxShadow: active ? `0 0 10px ${ac}44` : 'none' }}>
                      {s==='all' ? 'All' : `§${s}`}
                    </button>
                  );
                })}
              </div>

              {/* Subject dropdown */}
              <select value={showSubmissionsView ? submissionFilter : subjectFilter}
                onChange={e => showSubmissionsView ? setSubmissionFilter(e.target.value) : setSubjectFilter(e.target.value)}
                style={{ padding:'7px 11px', borderRadius:9, background:T.surface, border:`1px solid ${T.border}`, color:T.textPrimary, fontSize:12, cursor:'pointer', minWidth:140, outline:'none' }}>
                <option value="all">All Subjects</option>
                {subjects.map(s=><option key={s.id} value={s.name}>{s.name}</option>)}
              </select>

              {/* Add team / Export buttons */}
              {!showSubmissionsView ? (
                <button onClick={()=>{ setEditingTeam({section:'A',technologies:[],additional_notes:'',project_id:null,team_leader_id:null,teammate1_id:null,teammate2_id:null}); setIsAdding(true); setShowModal(true); }}
                  style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:9, background:`linear-gradient(135deg,${T.emerald},#059669)`, border:'none', color:'white', fontWeight:700, fontSize:12, cursor:'pointer', boxShadow:`0 4px 12px ${T.emeraldGlow}`, whiteSpace:'nowrap' }}>
                  <Plus size={14}/> Add Team
                </button>
              ) : (
                <button onClick={()=>setShowExcelModal(true)}
                  style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:9, background:'rgba(6,78,59,0.8)', border:'1px solid rgba(16,185,129,0.3)', color:T.emerald, fontSize:12, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' }}>
                  <Download size={13}/> Export
                </button>
              )}
            </div>
          </div>

          {/* Search (teams only) */}
          {!showSubmissionsView && (
            <div style={{ position:'relative' }}>
              <Search size={13} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:T.textMuted, pointerEvents:'none' }}/>
              <input type="text" placeholder="Search projects, teams, technologies…" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}
                style={{ width:'100%', padding:'8px 12px 8px 33px', borderRadius:9, background:T.surface, border:`1px solid ${T.border}`, color:T.textPrimary, fontSize:13, outline:'none' }}/>
            </div>
          )}
        </div>

        {/* ── TABLE / CARDS ─────────────────────────────────────────────── */}
        {loading ? (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {Array(6).fill(0).map((_,i)=><div key={i} className="cu-shimmer" style={{ height:50, borderRadius:10 }}/>)}
          </div>
        ) : showSubmissionsView ? (
          <>
            {filteredSubmissions.length === 0 ? <EmptyState/> : (
              <>
                {/* Desktop */}
                <div className="cu-desktop" style={{ background:T.surfaceUp, border:`1px solid ${T.border}`, borderRadius:13, overflow:'hidden' }}>
                  <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                      <CuThead cols={['Subject','Sec','Project','Leader','Teammates','PPT','Report','Submitted','Actions']}/>
                      <tbody>
                        {filteredSubmissions.map((sub, i) => (
                          <tr key={sub.id} className="cu-tr" style={{ borderBottom:`1px solid ${T.border}`, background: i%2===0 ? 'rgba(255,255,255,0.011)' : 'transparent', transition:'background 0.15s' }}>
                            <td style={TD}><SubjectBadge name={sub.subject?.name}/></td>
                            <td style={TD}><SectionBadge section={sub.section}/></td>
                            <td style={{...TD, minWidth:150, color:T.textPrimary, fontSize:13}}>{sub.project?.title}</td>
                            <td style={{...TD, minWidth:120}}>
                              <div style={{color:T.textPrimary,fontSize:13,fontWeight:500}}>{sub.team_leader?.name}</div>
                              {sub.team_leader?.uid && <div style={{color:T.textMuted,fontSize:11}}>{sub.team_leader.uid}</div>}
                            </td>
                            <td style={{...TD, minWidth:140, color:T.textSecondary, fontSize:12}}>
                              {[sub.teammate1?.name,sub.teammate2?.name].filter(Boolean).join(', ') || <em>Solo</em>}
                            </td>
                            <td style={TD}><UrlLink href={sub.ppt_url}/></td>
                            <td style={TD}><UrlLink href={sub.report_url}/></td>
                            <td style={{...TD, whiteSpace:'nowrap', color:T.textSecondary, fontSize:11}}>{new Date(sub.submitted_at).toLocaleString()}</td>
                            <td style={TD}>
                              <div style={{display:'flex',gap:6}}>
                                <ABtn accent="#D97706" dim="rgba(217,119,6,0.15)" onClick={()=>enableUpdateForTeam(sub.id)} title="Enable Update"><RefreshCw size={12}/></ABtn>
                                <ABtn accent={T.red} dim={T.redDim} onClick={()=>handleDeleteSubmission(sub.id)} title="Delete"><Trash2 size={12}/></ABtn>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Mobile cards */}
                <div className="cu-mobile" style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {filteredSubmissions.map(sub => (
                    <div key={sub.id} className="cu-card" style={{ background:T.surfaceUp, border:`1px solid ${T.border}`, borderRadius:13, padding:'14px 15px', transition:'all 0.2s' }}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
                        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}><SubjectBadge name={sub.subject?.name}/><SectionBadge section={sub.section}/></div>
                        <div style={{display:'flex',gap:6}}>
                          <ABtn accent="#D97706" dim="rgba(217,119,6,0.15)" onClick={()=>enableUpdateForTeam(sub.id)} title="Update"><RefreshCw size={12}/></ABtn>
                          <ABtn accent={T.red} dim={T.redDim} onClick={()=>handleDeleteSubmission(sub.id)} title="Delete"><Trash2 size={12}/></ABtn>
                        </div>
                      </div>
                      <div style={{fontWeight:700,fontSize:14,color:T.textPrimary,marginBottom:6}}>{sub.project?.title}</div>
                      <MF label="Leader" value={`${sub.team_leader?.name}${sub.team_leader?.uid ? ` (${sub.team_leader.uid})` : ''}`}/>
                      <MF label="Teammates" value={[sub.teammate1?.name,sub.teammate2?.name].filter(Boolean).join(', ') || 'Solo'}/>
                      <div style={{display:'flex',gap:12,marginTop:8}}>
                        {sub.ppt_url && <a href={sub.ppt_url} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:T.teal,fontWeight:700}}>📊 PPT</a>}
                        {sub.report_url && <a href={sub.report_url} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:T.violet,fontWeight:700}}>📄 Report</a>}
                      </div>
                      <div style={{fontSize:11,color:T.textMuted,marginTop:6}}>{new Date(sub.submitted_at).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            {filteredTeams.length === 0 ? <EmptyState/> : (
              <>
                {/* Desktop */}
                <div className="cu-desktop" style={{ background:T.surfaceUp, border:`1px solid ${T.border}`, borderRadius:13, overflow:'hidden' }}>
                  <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                      <CuThead cols={['Sec','Project','Subject','Leader','Teammates','Technologies','Actions']}/>
                      <tbody>
                        {filteredTeams.map((team, i) => (
                          <tr key={team.id} className="cu-tr" style={{ borderBottom:`1px solid ${T.border}`, background: i%2===0 ? 'rgba(255,255,255,0.011)' : 'transparent', transition:'background 0.15s' }}>
                            <td style={TD}><SectionBadge section={team.section}/></td>
                            <td style={{...TD, minWidth:150, color:T.textPrimary, fontSize:13, fontWeight:500}}>{team.project?.title}</td>
                            <td style={TD}><SubjectBadge name={team.project?.subject?.name}/></td>
                            <td style={{...TD, minWidth:115, color:T.textPrimary, fontSize:13}}>{team.team_leader?.name}</td>
                            <td style={{...TD, minWidth:140, color:T.textSecondary, fontSize:12}}>
                              {[team.teammate1?.name,team.teammate2?.name].filter(Boolean).join(', ') || <em>Solo</em>}
                            </td>
                            <td style={{...TD, minWidth:180}}>
                              <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                                {team.technologies?.map((t:string,j:number)=><TechTag key={j} index={j} label={t}/>)}
                              </div>
                            </td>
                            <td style={TD}>
                              <div style={{display:'flex',gap:6}}>
                                <ABtn accent="#D97706" dim="rgba(217,119,6,0.15)" onClick={()=>{ setEditingTeam({...team,team_leader_id:team.team_leader?.id,teammate1_id:team.teammate1?.id,teammate2_id:team.teammate2?.id}); setIsAdding(false); setShowModal(true); }} title="Edit"><Edit size={12}/></ABtn>
                                <ABtn accent={T.red} dim={T.redDim} onClick={()=>handleDelete(team.id)} title="Delete"><Trash2 size={12}/></ABtn>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Mobile cards */}
                <div className="cu-mobile" style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {filteredTeams.map(team => (
                    <div key={team.id} className="cu-card" style={{ background:T.surfaceUp, border:`1px solid ${T.border}`, borderRadius:13, padding:'14px 15px', transition:'all 0.2s' }}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}><SectionBadge section={team.section}/><SubjectBadge name={team.project?.subject?.name}/></div>
                        <div style={{display:'flex',gap:6}}>
                          <ABtn accent="#D97706" dim="rgba(217,119,6,0.15)" onClick={()=>{ setEditingTeam({...team,team_leader_id:team.team_leader?.id,teammate1_id:team.teammate1?.id,teammate2_id:team.teammate2?.id}); setIsAdding(false); setShowModal(true); }} title="Edit"><Edit size={12}/></ABtn>
                          <ABtn accent={T.red} dim={T.redDim} onClick={()=>handleDelete(team.id)} title="Delete"><Trash2 size={12}/></ABtn>
                        </div>
                      </div>
                      <div style={{fontWeight:700,fontSize:14,color:T.textPrimary,marginBottom:6}}>{team.project?.title}</div>
                      <MF label="Leader"    value={team.team_leader?.name || '—'}/>
                      <MF label="Teammates" value={[team.teammate1?.name,team.teammate2?.name].filter(Boolean).join(', ') || 'Solo'}/>
                      {team.technologies?.length > 0 && (
                        <div style={{marginTop:8,display:'flex',flexWrap:'wrap',gap:4}}>
                          {team.technologies.map((t:string,j:number)=><TechTag key={j} index={j} label={t}/>)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* ══ MODALS ═══════════════════════════════════════════════════════════ */}

      {/* Excel Export */}
      {showExcelModal && (
        <CuModal title="Export to Excel (.xlsx)" onClose={()=>setShowExcelModal(false)} icon={<FileSpreadsheet size={17} color={T.emerald}/>}>
          <FF label="Data Type">
            <div style={{display:'flex',gap:8}}>
              {(['teams','submissions'] as const).map(t=>(
                <TBtn key={t} active={excelType===t} onClick={()=>setExcelType(t)} ac={T.emerald} dm={T.emeraldDim}>
                  {t.charAt(0).toUpperCase()+t.slice(1)}
                </TBtn>
              ))}
            </div>
          </FF>
          <FF label="Subject">
            <CuSel value={excelSubject} onChange={e=>setExcelSubject(e.target.value)}>
              <option value="all">All Subjects (separate sheets)</option>
              {subjects.map(s=><option key={s.id} value={s.name}>{s.name}</option>)}
            </CuSel>
          </FF>
          <FF label="Section Filter">
            <div style={{display:'flex',gap:8}}>
              {(['all','A','B'] as const).map(s=>{
                const ac = s==='A'?T.violet:s==='B'?T.amber:T.textSecondary;
                return <TBtn key={s} active={excelSection===s} onClick={()=>setExcelSection(s)} ac={ac} dm={`${ac}22`}>{s==='all'?'All':`§${s}`}</TBtn>;
              })}
            </div>
          </FF>
          <div style={{background:T.emeraldDim,border:`1px solid ${T.emeraldGlow}`,borderRadius:9,padding:11,fontSize:12,color:T.emerald}}>
            📊 <strong>{excelType}</strong>{excelSubject!=='all'?` · ${excelSubject}`:' · all subjects'}{excelSection!=='all'?` · Section ${excelSection}`:' · all sections'}
          </div>
          <div style={{display:'flex',gap:10,marginTop:4}}>
            <button onClick={()=>setShowExcelModal(false)} style={CS}>Cancel</button>
            <button onClick={async()=>{ await exportExcel(excelType==='teams'?teams:submissions,excelSubject,excelSection,excelType); setShowExcelModal(false); }}
              style={{...PS,flex:2,background:`linear-gradient(135deg,${T.emerald},#059669)`,boxShadow:`0 4px 14px ${T.emeraldGlow}`}}>
              <Download size={13}/> Download Excel
            </button>
          </div>
        </CuModal>
      )}

      {/* Team edit/add */}
      {showModal && editingTeam && (
        <CuModal title={isAdding?'Add Team':'Edit Team'} onClose={()=>setShowModal(false)}>
          <FF label="Section">
            <CuSel value={editingTeam.section} onChange={e=>setEditingTeam({...editingTeam,section:e.target.value})}>
              <option value="A">Section A</option><option value="B">Section B</option>
            </CuSel>
          </FF>
          <FF label="Project">
            <CuSel value={editingTeam.project_id||''} onChange={e=>setEditingTeam({...editingTeam,project_id:Number(e.target.value)})}>
              <option value="">Select project…</option>
              {projects.map(p=><option key={p.id} value={p.id}>{p.title} ({p.subject?.name})</option>)}
            </CuSel>
          </FF>
          {[['Team Leader','team_leader_id'],['Teammate 1','teammate1_id'],['Teammate 2','teammate2_id']].map(([lbl,key])=>(
            <FF key={key} label={lbl}>
              <CuSel value={(editingTeam as any)[key]||''} onChange={e=>setEditingTeam({...editingTeam,[key]:e.target.value?Number(e.target.value):null})}>
                <option value="">{lbl==='Team Leader'?'Select leader…':'None'}</option>
                {students.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
              </CuSel>
            </FF>
          ))}
          <FF label="Technologies (comma separated)">
            <CuIn value={editingTeam.technologies.join(', ')} onChange={e=>setEditingTeam({...editingTeam,technologies:e.target.value.split(',').map((x:string)=>x.trim())})} placeholder="React, Node.js…"/>
          </FF>
          <FF label="Notes">
            <CuIn value={editingTeam.additional_notes||''} onChange={e=>setEditingTeam({...editingTeam,additional_notes:e.target.value})} placeholder="Optional…"/>
          </FF>
          <div style={{display:'flex',gap:10,marginTop:4}}>
            <button onClick={()=>setShowModal(false)} style={CS}>Cancel</button>
            <button onClick={handleSave} style={{...PS,flex:2}}><Save size={13}/> Save</button>
          </div>
        </CuModal>
      )}

      {/* Add Project */}
      {showProjectModal && (
        <CuModal title="Add New Project" onClose={()=>{ setShowProjectModal(false); setNewProject({title:'',subject:'',description:'',project_number:''}); }}>
          <FF label="Project Number *"><CuIn type="number" value={newProject.project_number} onChange={e=>setNewProject({...newProject,project_number:e.target.value})} placeholder="e.g. 12"/></FF>
          <FF label="Project Title *"><CuIn value={newProject.title} onChange={e=>setNewProject({...newProject,title:e.target.value})} placeholder="Enter title"/></FF>
          <FF label="Subject *">
            <CuSel value={newProject.subject} onChange={e=>setNewProject({...newProject,subject:e.target.value})}>
              <option value="">Select subject…</option>
              {subjects.map(s=><option key={s.id} value={s.name}>{s.name}</option>)}
            </CuSel>
          </FF>
          <FF label="Description">
            <textarea value={newProject.description} onChange={e=>setNewProject({...newProject,description:e.target.value})} rows={3} placeholder="Optional" style={{...INS, resize:'vertical'}}/>
          </FF>
          <div style={{display:'flex',gap:10,marginTop:4}}>
            <button onClick={()=>setShowProjectModal(false)} style={CS}>Cancel</button>
            <button onClick={handleAddProject} style={{...PS,flex:2,background:`linear-gradient(135deg,${T.violet},#5044D4)`,boxShadow:`0 4px 14px ${T.violetGlow}`}}><Plus size={13}/> Add Project</button>
          </div>
        </CuModal>
      )}

      {/* Import CSV */}
      {showImportModal && (
        <CuModal title="Import Projects from CSV" onClose={()=>setShowImportModal(false)}>
          <div style={{background:'rgba(59,130,246,0.07)',border:'1px solid rgba(59,130,246,0.22)',borderRadius:10,padding:14,marginBottom:14}}>
            <div style={{fontSize:11,color:T.textSecondary,fontWeight:700,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.06em'}}>CSV Format</div>
            <code style={{fontSize:11,color:'#93C5FD',lineHeight:1.9,display:'block'}}>
              ProjectNumber,Title,Subject,Description<br/>
              1,"AI Chatbot","Machine Learning","Build a bot"
            </code>
            <div style={{fontSize:11,color:T.amber,marginTop:8}}>⚠ Subject names must match exactly</div>
            <div style={{fontSize:11,color:T.textMuted,marginTop:4}}>Available: {subjects.map(s=>s.name).join(', ')}</div>
          </div>
          <input ref={fileInputRef} type="file" accept=".csv" onChange={handleImportCSV} style={{display:'none'}}/>
          <button onClick={()=>fileInputRef.current?.click()} style={{...PS,width:'100%',justifyContent:'center',background:'linear-gradient(135deg,#1D4ED8,#1E40AF)',boxShadow:'0 4px 14px rgba(29,78,216,0.3)'}}>
            <Upload size={13}/> Choose CSV File
          </button>
          <button onClick={()=>setShowImportModal(false)} style={{...CS,marginTop:10}}>Close</button>
        </CuModal>
      )}

      {/* Subjects */}
      {showSubjectModal && (
        <CuModal title="Manage Subjects" onClose={()=>{ setShowSubjectModal(false); setEditingSubject(null); setNewSubject(''); }} wide>
          <div style={{background:T.tealDim,border:`1px solid rgba(45,212,191,0.22)`,borderRadius:10,padding:14,marginBottom:14}}>
            <div style={{fontSize:13,color:T.teal,fontWeight:700,marginBottom:10}}>Add New Subject</div>
            <div style={{display:'flex',gap:8}}>
              <CuIn value={newSubject} onChange={e=>setNewSubject(e.target.value)} placeholder="Subject name" onKeyDown={(e:any)=>e.key==='Enter'&&handleAddSubject()}/>
              <button onClick={handleAddSubject} style={{...PS,background:`linear-gradient(135deg,${T.teal},#0D9488)`,boxShadow:`0 4px 12px ${T.tealGlow}`,whiteSpace:'nowrap',flexShrink:0}}><Plus size={13}/> Add</button>
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:7,maxHeight:320,overflowY:'auto'}}>
            {subjects.map(subj=>(
              <div key={subj.id} style={{display:'flex',alignItems:'center',gap:8,padding:'10px 14px',background:T.surface,border:`1px solid ${T.border}`,borderRadius:10}}>
                {editingSubject?.id===subj.id ? (
                  <>
                    <CuIn value={editingSubject.name} onChange={e=>setEditingSubject({...editingSubject,name:e.target.value})} onKeyDown={(e:any)=>e.key==='Enter'&&handleUpdateSubject()}/>
                    <ABtn accent={T.emerald} dim={T.emeraldDim} onClick={handleUpdateSubject} title="Save"><Save size={12}/></ABtn>
                    <ABtn accent={T.textMuted} dim={T.surfaceUp} onClick={()=>setEditingSubject(null)} title="Cancel"><X size={12}/></ABtn>
                  </>
                ) : (
                  <>
                    <span style={{color:T.textPrimary,fontSize:14,fontWeight:500,flex:1}}>{subj.name}</span>
                    <ABtn accent="#D97706" dim="rgba(217,119,6,0.15)" onClick={()=>setEditingSubject({...subj})} title="Edit"><Edit size={12}/></ABtn>
                    <ABtn accent={T.red} dim={T.redDim} onClick={()=>handleDeleteSubject(subj.id)} title="Delete"><Trash2 size={12}/></ABtn>
                  </>
                )}
              </div>
            ))}
          </div>
          <button onClick={()=>{ setShowSubjectModal(false); setEditingSubject(null); setNewSubject(''); }} style={{...CS,marginTop:14}}><X size={13}/> Close</button>
        </CuModal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SHARED STYLE CONSTANTS
═══════════════════════════════════════════════════════════════════════════════ */
const TD: React.CSSProperties = { padding:'11px 14px', verticalAlign:'middle' };

const INS: React.CSSProperties = {
  width:'100%', padding:'9px 12px', borderRadius:9,
  background:T.surface, border:`1px solid ${T.border}`,
  color:T.textPrimary, fontSize:13, outline:'none', boxSizing:'border-box',
};

const CS: React.CSSProperties = {
  display:'flex', alignItems:'center', gap:6, padding:'9px 16px',
  background:'transparent', border:`1px solid ${T.border}`,
  borderRadius:9, color:T.textSecondary, fontWeight:600, fontSize:13, cursor:'pointer',
};

const PS: React.CSSProperties = {
  display:'flex', alignItems:'center', gap:7, padding:'9px 18px',
  background:`linear-gradient(135deg,${T.emerald},#059669)`,
  border:'none', borderRadius:9, color:'white', fontWeight:700, fontSize:13, cursor:'pointer',
  boxShadow:`0 4px 14px ${T.emeraldGlow}`,
};

/* ═══════════════════════════════════════════════════════════════════════════════
   PURE COMPONENTS
═══════════════════════════════════════════════════════════════════════════════ */
function CuModal({ title, onClose, children, icon, wide }: { title:string; onClose:()=>void; children:React.ReactNode; icon?:React.ReactNode; wide?:boolean }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.78)', backdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, padding:16 }}>
      <div className="cu-fade" style={{ background:T.surfaceUp, border:`1px solid ${T.border}`, borderRadius:16, padding:'22px 22px 20px', width:'100%', maxWidth: wide?580:440, maxHeight:'92vh', overflowY:'auto', boxShadow:'0 32px 80px rgba(0,0,0,0.7)', display:'flex', flexDirection:'column', gap:14 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:9 }}>
            {icon}
            <h2 style={{ fontFamily:T.fontDisplay, fontWeight:800, fontSize:16, color:T.textPrimary, margin:0 }}>{title}</h2>
          </div>
          <button onClick={onClose} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:8, padding:6, cursor:'pointer', color:T.textSecondary, display:'flex' }}><X size={14}/></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FF({ label, children }: { label:string; children:React.ReactNode }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
      <div style={{ fontSize:10, fontWeight:700, color:T.textMuted, textTransform:'uppercase', letterSpacing:'0.07em' }}>{label}</div>
      {children}
    </div>
  );
}

function CuIn({ value, onChange, placeholder, type, onKeyDown }: any) {
  return <input type={type||'text'} value={value} onChange={onChange} placeholder={placeholder} onKeyDown={onKeyDown} style={INS}/>;
}

function CuSel({ value, onChange, children }: any) {
  return <select value={value} onChange={onChange} style={{ ...INS, cursor:'pointer', appearance:'auto' }}>{children}</select>;
}

function TBtn({ active, onClick, ac, dm, children }: { active:boolean; onClick:()=>void; ac:string; dm:string; children:React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ flex:1, padding:'9px', borderRadius:9, border:`1.5px solid ${active?ac:T.border}`, background: active?dm:'transparent', color: active?ac:T.textSecondary, fontWeight:700, fontSize:13, cursor:'pointer', transition:'all 0.18s', textAlign:'center' }}>
      {children}
    </button>
  );
}

function CuThead({ cols }: { cols:string[] }) {
  return (
    <thead>
      <tr style={{ background:'rgba(124,107,248,0.07)', borderBottom:`1px solid ${T.border}` }}>
        {cols.map(c=>(
          <th key={c} style={{ padding:'11px 14px', textAlign:'left', fontSize:10, fontWeight:700, color:T.textSecondary, textTransform:'uppercase', letterSpacing:'0.07em', whiteSpace:'nowrap' }}>{c}</th>
        ))}
      </tr>
    </thead>
  );
}

function ABtn({ accent, dim, onClick, title, children }: { accent:string; dim:string; onClick:()=>void; title:string; children:React.ReactNode }) {
  return (
    <button onClick={onClick} title={title}
      style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'7px', borderRadius:8, background:dim, border:`1px solid ${accent}44`, color:accent, cursor:'pointer', transition:'all 0.15s' }}
      onMouseOver={e=>(e.currentTarget.style.background=`${accent}33`)}
      onMouseOut={e=>(e.currentTarget.style.background=dim)}>
      {children}
    </button>
  );
}

function SectionBadge({ section }: { section:string }) {
  const a = section==='A';
  return <span style={{ fontSize:11, fontWeight:800, padding:'3px 10px', borderRadius:20, background: a?'rgba(99,102,241,0.18)':'rgba(245,158,11,0.18)', color: a?'#A5B4FC':'#FCD34D', border:`1px solid ${a?'rgba(99,102,241,0.35)':'rgba(245,158,11,0.35)'}`, letterSpacing:'0.03em', whiteSpace:'nowrap' }}>§{section}</span>;
}

function SubjectBadge({ name }: { name?:string }) {
  if (!name) return <span style={{ color:T.textMuted, fontSize:12 }}>—</span>;
  return <span style={{ fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, background:T.tealDim, color:T.teal, border:'1px solid rgba(45,212,191,0.25)', whiteSpace:'nowrap' }}>{name}</span>;
}

function TechTag({ label, index }: { label:string; index:number }) {
  const HUES = [248,168,158,200,280,30,320,190,100,50];
  const h = HUES[index % HUES.length];
  return <span style={{ fontSize:11, padding:'2px 8px', borderRadius:20, background:`hsla(${h},55%,28%,0.8)`, color:`hsl(${h},75%,80%)`, border:`1px solid hsla(${h},55%,45%,0.45)`, whiteSpace:'nowrap' }}>{label}</span>;
}

function UrlLink({ href }: { href?:string }) {
  if (!href) return <span style={{ color:T.textMuted, fontSize:12 }}>—</span>;
  return <a href={href} target="_blank" rel="noopener noreferrer" style={{ color:T.violet, fontSize:12, fontWeight:600, display:'flex', alignItems:'center', gap:3, textDecoration:'none' }}>View<ChevronRight size={11}/></a>;
}

function MF({ label, value }: { label:string; value:any }) {
  return (
    <div style={{ display:'flex', gap:8, marginBottom:3 }}>
      <span style={{ fontSize:11, color:T.textMuted, fontWeight:700, minWidth:60, flexShrink:0 }}>{label}</span>
      <span style={{ fontSize:12, color:T.textSecondary }}>{value}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ textAlign:'center', padding:'56px 32px', background:T.surfaceUp, border:`1px solid ${T.border}`, borderRadius:13 }}>
      <FolderOpen size={42} style={{ color:T.textMuted, margin:'0 auto 12px', display:'block' }}/>
      <div style={{ fontWeight:700, fontSize:15, color:T.textSecondary, marginBottom:4 }}>No records found</div>
      <div style={{ fontSize:13, color:T.textMuted }}>Try adjusting your filters or section</div>
    </div>
  );
}
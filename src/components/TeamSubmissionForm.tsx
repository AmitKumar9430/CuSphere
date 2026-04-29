// import { useState, useEffect } from "react";
// import { supabase, type Student, type Project } from "../lib/supabase";
// import {
//   Users,
//   BookOpen,
//   Code,
//   FileText,
//   CheckCircle,
//   AlertCircle,
// } from "lucide-react";

// export function TeamSubmissionForm() {
//   const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
//   const [selectedSubject, setSelectedSubject] = useState("");

//   const [students, setStudents] = useState<Student[]>([]);
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [selectedSection, setSelectedSection] = useState<"A" | "B">("A");
//   const [selectedLeader, setSelectedLeader] = useState("");
//   const [selectedTeammates, setSelectedTeammates] = useState<string[]>([]);
//   const [selectedProject, setSelectedProject] = useState("");
//   const [technologies, setTechnologies] = useState("");
//   const [additionalNotes, setAdditionalNotes] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");
//   const [takenProjects, setTakenProjects] = useState<Set<string>>(new Set());
//   const [takenStudents, setTakenStudents] = useState<Set<string>>(new Set());
//   const [registeredTeams, setRegisteredTeams] = useState<any[]>([]);

//   // Load subjects on mount
//   useEffect(() => {
//     loadSubjects();
//     loadStudents(); // Load all students once
//   }, []);

//   // Load projects and taken data when subject or section changes
//   useEffect(() => {
//     if (!selectedSubject) {
//       loadAllRegisteredTeams();
//       return;
//     }
//     loadProjects();
//     loadTakenProjects();
//     loadTakenStudents();
//     loadRegisteredTeams();

//     // Reset selections when section changes
//     setSelectedLeader("");
//     setSelectedTeammates([]);
//     setSelectedProject("");
//   }, [selectedSubject, selectedSection]);

//   // Fetch subjects
//   async function loadSubjects() {
//     const { data, error } = await supabase
//       .from("subjects")
//       .select("*")
//       .order("name");
//     if (data) setSubjects(data);
//     if (error) console.error(error);
//   }

//   // Load all students (global)
//   async function loadStudents() {
//     const { data, error } = await supabase
//       .from("students")
//       .select("*")
//       .order("name");
//     if (data) setStudents(data);
//     if (error) console.error(error);
//   }

//   // Load projects for selected subject
//   async function loadProjects() {
//     const { data, error } = await supabase
//       .from("projects")
//       .select("*")
//       .eq("subject_id", selectedSubject)
//       .order("project_number");
//     if (data) setProjects(data);
//     if (error) console.error(error);
//   }

//   // Load taken projects for section + subject
//   async function loadTakenProjects() {
//     const { data } = await supabase
//       .from("teams")
//       .select("project_id")
//       .eq("section", selectedSection)
//       .eq("subject_id", selectedSubject);
//     if (data) setTakenProjects(new Set(data.map((t) => t.project_id)));
//   }

//   // Load taken students for section + subject
//   async function loadTakenStudents() {
//     const { data, error } = await supabase
//       .from("teams")
//       .select("team_leader_id, teammate1_id, teammate2_id")
//       .eq("section", selectedSection)
//       .eq("subject_id", selectedSubject);
//     if (error) console.error(error);

//     if (data) {
//       const ids = new Set<string>();
//       data.forEach((row) => {
//         if (row.team_leader_id) ids.add(row.team_leader_id);
//         if (row.teammate1_id) ids.add(row.teammate1_id);
//         if (row.teammate2_id) ids.add(row.teammate2_id);
//       });
//       setTakenStudents(ids);
//     }
//   }

//   // Load registered teams for selected subject and section
//   async function loadRegisteredTeams() {
//     const { data, error } = await supabase
//       .from('registered_teams_view')
//       .select('*')
//       .eq('section', selectedSection)
//       .eq('subject_id', selectedSubject)
//       .order('created_at', { ascending: false });

//     if (error) console.error('Error loading teams:', error);
//     else setRegisteredTeams(data);
//   }

//   async function loadAllRegisteredTeams() {
//     const { data, error } = await supabase
//       .from('registered_teams_view')
//       .select('*')
//       .eq('section', selectedSection)
//       .order('created_at', { ascending: false });

//     if (error) console.error('Error loading all teams:', error);
//     else setRegisteredTeams(data);
//   }

//   // Toggle teammate selection
//   function toggleTeammate(id: string) {
//     setSelectedTeammates((prev) => {
//       if (prev.includes(id)) return prev.filter((t) => t !== id);
//       if (prev.length >= 2) return prev; // max 2 teammates
//       return [...prev, id];
//     });
//   }

//   // Form submission
//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     setLoading(true);

//     try {
//       const teamSize = 1 + selectedTeammates.length;
//       if (teamSize < 1 || teamSize > 3)
//         throw new Error("Team must have 1–3 members including the leader");

//       if (selectedTeammates.includes(selectedLeader))
//         throw new Error("Leader cannot also be a teammate");

//       const techArray = technologies
//         .split(",")
//         .map((t) => t.trim())
//         .filter(Boolean);

//       const { error: insertError } = await supabase.from("teams").insert({
//         subject_id: selectedSubject,
//         project_id: selectedProject,
//         team_leader_id: selectedLeader,
//         teammate1_id: selectedTeammates[0] || null,
//         teammate2_id: selectedTeammates[1] || null,
//         section: selectedSection,
//         technologies: techArray,
//         additional_notes: additionalNotes || null,
//       });

//       if (insertError) throw insertError;

//       setSuccess("Team registered successfully!");
//       setSelectedLeader("");
//       setSelectedTeammates([]);
//       setSelectedProject("");
//       setTechnologies("");
//       setAdditionalNotes("");
//       await Promise.all([
//         loadTakenProjects(),
//         loadTakenStudents(),
//         loadRegisteredTeams(),
//       ]);

//       setTimeout(() => setSuccess(""), 4000);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   }

//   const sectionStudents = students.filter(
//     (s) => s.section === selectedSection && !takenStudents.has(s.id)
//   );
//   const availableProjects = projects.filter((p) => !takenProjects.has(p.id));

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 p-4 lg:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Page Header */}
//         <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 mb-6 shadow-xl">
//           <div className="flex items-center gap-3">
//             <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
//               <Users className="w-8 h-8 text-white" />
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold text-white">
//                 Project Team Registration
//               </h1>
//               <p className="text-blue-100">
//                 Form to register project teams (1–3 members)
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Main Grid Layout */}
// <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
//   {/* Left Side - Registration Form */}
//   <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full">
//     <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
//       <FileText className="w-5 h-5 text-blue-600" />
//       Register Team
//     </h2>

//     {success && (
//       <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg flex items-center gap-2 text-sm">
//         <CheckCircle className="w-4 h-4" />
//         {success}
//       </div>
//     )}

//     {error && (
//       <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg flex items-center gap-2 text-sm">
//         <AlertCircle className="w-4 h-4" />
//         {error}
//       </div>
//     )}
//              <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
//             {/* Subject Selection */}
//             <div>
//               <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
//                 <BookOpen className="w-3 h-3" /> Subject
//               </label>
//               <select
//                 value={selectedSubject}
//                 onChange={(e) => setSelectedSubject(e.target.value)}
//                 required
//                 className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
//               >
//                 <option value="">Select Subject</option>
//                 {subjects.map((subj) => (
//                   <option key={subj.id} value={subj.id}>
//                     {subj.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Section Selection */}
//             <div>
//               <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
//                 <Users className="w-3 h-3" /> Section
//               </label>
//               <div className="grid grid-cols-2 gap-3">
//                 {["A", "B"].map((sec) => (
//                   <button
//                     key={sec}
//                     type="button"
//                     onClick={() => setSelectedSection(sec as "A" | "B")}
//                     className={`py-2 px-4 rounded-lg font-semibold text-sm transition ${
//                       selectedSection === sec
//                         ? "bg-blue-600 text-white shadow-lg"
//                         : "bg-slate-100 text-slate-700 hover:bg-slate-200"
//                     }`}
//                   >
//                     Section {sec}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Leader */}
//             <div>
//               <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
//                 <Users className="w-3 h-3" /> Team Leader
//               </label>
//               <select
//                 value={selectedLeader}
//                 onChange={(e) => setSelectedLeader(e.target.value)}
//                 required
//                 className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
//               >
//                 <option value="">Select team leader</option>
//                 {sectionStudents.map((student) => (
//                   <option key={student.id} value={student.id}>
//                     {student.name} {student.uid ? `(${student.uid})` : ""}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Teammates */}
//             <div>
//               <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
//                 <Users className="w-3 h-3" /> Teammates (max 2)
//               </label>
//               <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
//                 {sectionStudents
//                   .filter((s) => s.id !== selectedLeader)
//                   .map((student) => (
//                     <label
//                       key={student.id}
//                       className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition text-sm ${
//                         selectedTeammates.includes(student.id)
//                           ? "bg-blue-100 border-blue-500"
//                           : "bg-slate-100 border-slate-200 hover:bg-slate-200"
//                       }`}
//                     >
//                       <input
//                         type="checkbox"
//                         checked={selectedTeammates.includes(student.id)}
//                         onChange={() => toggleTeammate(student.id)}
//                         disabled={
//                           !selectedTeammates.includes(student.id) &&
//                           selectedTeammates.length >= 2
//                         }
//                         className="w-4 h-4 accent-blue-600"
//                       />
//                       <span className="truncate">
//                         {student.name} {student.uid ? `(${student.uid})` : ""}
//                       </span>
//                     </label>
//                   ))}
//               </div>
//             </div>

//             {/* Project */}
//             <div>
//               <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
//                 <BookOpen className="w-3 h-3" /> Project (
//                 {availableProjects.length} available)
//               </label>
//               <select
//                 value={selectedProject}
//                 onChange={(e) => setSelectedProject(e.target.value)}
//                 required
//                 className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
//               >
//                 <option value="">Select project</option>
//                 {availableProjects.map((project) => (
//                   <option key={project.id} value={project.id}>
//                     #{project.project_number} - {project.title}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Technologies */}
//             <div>
//               <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
//                 <Code className="w-3 h-3" /> Technologies
//                 <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={technologies}
//                 onChange={(e) => setTechnologies(e.target.value)}
//                 placeholder="e.g., React, TypeScript, Node.js"
//                 required
//                 className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
//               />
//             </div>

//             {/* Notes */}
//             <div>
//               <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
//                 <FileText className="w-3 h-3" /> Additional Notes
//               </label>
//               <textarea
//                 value={additionalNotes}
//                 onChange={(e) => setAdditionalNotes(e.target.value)}
//                 rows={3}
//                 placeholder="Any additional requirements..."
//                 className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition resize-none"
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading || !selectedSubject}
//               className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
//             >
//               {loading ? "Submitting..." : "Register Team"}
//             </button>
//           </form>
//         </div>
// {/* Right Side - Registered Teams Grid */}
// <div className="flex flex-col h-full">
//   {/* Header */}
//   <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-5 mb-6 shadow-xl flex-shrink-0">
//     <h2 className="text-2xl font-bold text-white text-center">🌈 Registered Teams</h2>
//     <p className="text-indigo-100 text-center mt-1 text-sm">
//       {registeredTeams.length} {registeredTeams.length === 1 ? "team" : "teams"} registered
//     </p>
//   </div>

//   {/* Content */}
//   {registeredTeams.length === 0 ? (
//     <div className="bg-white rounded-2xl shadow-lg p-12 text-center flex-1 flex flex-col justify-center">
//       <div className="text-6xl mb-4">📋</div>
//       <p className="text-slate-500 text-lg">No teams registered yet.</p>
//       <p className="text-slate-400 text-sm mt-2">Be the first to register your team!</p>
//     </div>
//   ) : (
//     <div
//       className="grid grid-cols-1 md:grid-cols-2 gap-5 overflow-y-auto pr-2"
//       style={{
//         // 👇 About 3.8 cards tall — shows 4 full, 5th/6th partially
//         maxHeight: "calc(3.8 * 230px)",
//         scrollBehavior: "smooth",
//         scrollbarWidth: "thin",
//       }}
//     >
//       {registeredTeams.map((team, index) => (
//         <div
//           key={team.id || index}
//           className="bg-gradient-to-br from-white via-indigo-50 to-purple-50 
//                      shadow-lg rounded-2xl p-5 border-2 border-indigo-100
//                      hover:shadow-2xl hover:-translate-y-1 transition-all duration-300
//                      transform relative overflow-hidden group"
//         >
//           {/* Decorative corner gradient */}
//           <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-400 to-transparent opacity-20 rounded-bl-full"></div>

//           {/* Badge */}
//           <div className="absolute top-3 right-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
//             Team #{index + 1}
//           </div>

//           {/* Header */}
//           <div className="mb-3 pr-16">
//             <h3 className="text-lg font-bold text-indigo-900 mb-1 leading-tight line-clamp-2">
//               {team.project_title || "Untitled Project"}
//             </h3>
//             <div className="flex items-center gap-2 text-xs text-indigo-600">
//               <BookOpen className="w-3 h-3" />
//               <span className="font-semibold">
//                 Project #{team.project_number || "N/A"}
//               </span>
//             </div>
//           </div>

//           {/* Subject Tag */}
//           <div className="mb-3">
//             <span className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-purple-200">
//               <Code className="w-3 h-3" />
//               {team.subject_name || "Unknown"}
//             </span>
//           </div>

//           {/* Team Members */}
//           <div className="mb-3 space-y-1.5">
//             <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-1.5">
//               <Users className="w-3 h-3 text-indigo-600" />
//               Team Members
//             </div>
//             <div className="space-y-1.5 pl-1">
//               <div className="flex items-start gap-2 text-xs">
//                 <span className="text-base">👑</span>
//                 <div className="flex-1 min-w-0">
//                   <p className="font-semibold text-indigo-900 truncate">{team.leader_name}</p>
//                   <p className="text-xs text-slate-500">{team.leader_uid}</p>
//                 </div>
//               </div>
//               {team.teammate1_name && (
//                 <div className="flex items-start gap-2 text-xs">
//                   <span className="text-base">🤝</span>
//                   <div className="flex-1 min-w-0">
//                     <p className="font-medium text-slate-800 truncate">{team.teammate1_name}</p>
//                     <p className="text-xs text-slate-500">{team.teammate1_uid}</p>
//                   </div>
//                 </div>
//               )}
//               {team.teammate2_name && (
//                 <div className="flex items-start gap-2 text-xs">
//                   <span className="text-base">🤝</span>
//                   <div className="flex-1 min-w-0">
//                     <p className="font-medium text-slate-800 truncate">{team.teammate2_name}</p>
//                     <p className="text-xs text-slate-500">{team.teammate2_uid}</p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="pt-3 border-t border-indigo-100 flex items-center justify-between">
//             <div className="flex items-center gap-1.5 text-xs text-slate-500">
//               <CheckCircle className="w-3 h-3" />
//               Registered
//             </div>
//             <span className="text-xs text-slate-500 font-medium">
//               {new Date(team.created_at).toLocaleDateString()}
//             </span>
//           </div>

//           {/* Hover effect overlay */}
//           <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>
//         </div>
//       ))}
//     </div>
//   )}
// </div>

         
//       </div>
//     </div>
//      </div>
//   );
// }
// import { useState, useEffect } from "react";
// import { supabase, type Student, type Project } from "../lib/supabase";
// import {
//   Users,
//   BookOpen,
//   Code,
//   FileText,
//   CheckCircle,
//   AlertCircle,
//   Crown,
//   Handshake,
//   Calendar,
//   Layers,
//   ChevronRight,
// } from "lucide-react";

// export function TeamSubmissionForm() {
//   const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
//   const [selectedSubject, setSelectedSubject] = useState("");
//   const [students, setStudents] = useState<Student[]>([]);
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [selectedSection, setSelectedSection] = useState<"A" | "B">("A");
//   const [selectedLeader, setSelectedLeader] = useState("");
//   const [selectedTeammates, setSelectedTeammates] = useState<string[]>([]);
//   const [selectedProject, setSelectedProject] = useState("");
//   const [technologies, setTechnologies] = useState("");
//   const [additionalNotes, setAdditionalNotes] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");
//   const [takenProjects, setTakenProjects] = useState<Set<string>>(new Set());
//   const [takenStudents, setTakenStudents] = useState<Set<string>>(new Set());
//   const [registeredTeams, setRegisteredTeams] = useState<any[]>([]);

//   useEffect(() => {
//     loadSubjects();
//     loadStudents();
//   }, []);

//   useEffect(() => {
//     if (!selectedSubject) {
//       loadAllRegisteredTeams();
//       return;
//     }
//     loadProjects();
//     loadTakenProjects();
//     loadTakenStudents();
//     loadRegisteredTeams();
//     setSelectedLeader("");
//     setSelectedTeammates([]);
//     setSelectedProject("");
//   }, [selectedSubject, selectedSection]);

//   async function loadSubjects() {
//     const { data, error } = await supabase.from("subjects").select("*").order("name");
//     if (data) setSubjects(data);
//     if (error) console.error(error);
//   }

//   async function loadStudents() {
//     const { data, error } = await supabase.from("students").select("*").order("name");
//     if (data) setStudents(data);
//     if (error) console.error(error);
//   }

//   async function loadProjects() {
//     const { data, error } = await supabase
//       .from("projects")
//       .select("*")
//       .eq("subject_id", selectedSubject)
//       .order("project_number");
//     if (data) setProjects(data);
//     if (error) console.error(error);
//   }

//   async function loadTakenProjects() {
//     const { data } = await supabase
//       .from("teams")
//       .select("project_id")
//       .eq("section", selectedSection)
//       .eq("subject_id", selectedSubject);
//     if (data) setTakenProjects(new Set(data.map((t) => t.project_id)));
//   }

//   async function loadTakenStudents() {
//     const { data, error } = await supabase
//       .from("teams")
//       .select("team_leader_id, teammate1_id, teammate2_id")
//       .eq("section", selectedSection)
//       .eq("subject_id", selectedSubject);
//     if (error) console.error(error);
//     if (data) {
//       const ids = new Set<string>();
//       data.forEach((row) => {
//         if (row.team_leader_id) ids.add(row.team_leader_id);
//         if (row.teammate1_id) ids.add(row.teammate1_id);
//         if (row.teammate2_id) ids.add(row.teammate2_id);
//       });
//       setTakenStudents(ids);
//     }
//   }

//   async function loadRegisteredTeams() {
//     const { data, error } = await supabase
//       .from("registered_teams_view")
//       .select("*")
//       .eq("section", selectedSection)
//       .eq("subject_id", selectedSubject)
//       .order("created_at", { ascending: false });
//     if (error) console.error("Error loading teams:", error);
//     else setRegisteredTeams(data);
//   }

//   async function loadAllRegisteredTeams() {
//     const { data, error } = await supabase
//       .from("registered_teams_view")
//       .select("*")
//       .eq("section", selectedSection)
//       .order("created_at", { ascending: false });
//     if (error) console.error("Error loading all teams:", error);
//     else setRegisteredTeams(data);
//   }

//   function toggleTeammate(id: string) {
//     setSelectedTeammates((prev) => {
//       if (prev.includes(id)) return prev.filter((t) => t !== id);
//       if (prev.length >= 2) return prev;
//       return [...prev, id];
//     });
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     setLoading(true);
//     try {
//       const teamSize = 1 + selectedTeammates.length;
//       if (teamSize < 1 || teamSize > 3)
//         throw new Error("Team must have 1–3 members including the leader");
//       if (selectedTeammates.includes(selectedLeader))
//         throw new Error("Leader cannot also be a teammate");

//       const techArray = technologies.split(",").map((t) => t.trim()).filter(Boolean);
//       const { error: insertError } = await supabase.from("teams").insert({
//         subject_id: selectedSubject,
//         project_id: selectedProject,
//         team_leader_id: selectedLeader,
//         teammate1_id: selectedTeammates[0] || null,
//         teammate2_id: selectedTeammates[1] || null,
//         section: selectedSection,
//         technologies: techArray,
//         additional_notes: additionalNotes || null,
//       });
//       if (insertError) throw insertError;

//       setSuccess("Team registered successfully!");
//       setSelectedLeader("");
//       setSelectedTeammates([]);
//       setSelectedProject("");
//       setTechnologies("");
//       setAdditionalNotes("");
//       await Promise.all([loadTakenProjects(), loadTakenStudents(), loadRegisteredTeams()]);
//       setTimeout(() => setSuccess(""), 4000);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An error occurred");
//     } finally {
//       setLoading(false);
//     }
//   }

//   const sectionStudents = students.filter(
//     (s) => s.section === selectedSection && !takenStudents.has(s.id)
//   );
//   const availableProjects = projects.filter((p) => !takenProjects.has(p.id));

//   return (
//     <div
//       className="min-h-screen p-4 lg:p-8"
//       style={{ background: "linear-gradient(135deg, #eff6ff 0%, #f8faff 40%, #f5f3ff 100%)" }}
//     >
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
//         * { font-family: 'Plus Jakarta Sans', sans-serif; }

//         .field-label {
//           display: flex; align-items: center; gap: 6px;
//           font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
//           text-transform: uppercase; color: #475569; margin-bottom: 7px;
//         }
//         .field-label svg { color: #6366f1; }

//         .form-control {
//           width: 100%; padding: 9px 12px; font-size: 13px;
//           border: 1.5px solid #e2e8f0; border-radius: 10px;
//           background: #f8fafc; color: #1e293b;
//           transition: all 0.2s; outline: none;
//           font-family: 'Plus Jakarta Sans', sans-serif;
//         }
//         .form-control:focus { border-color: #6366f1; background: #fff; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }

//         .section-btn {
//           flex: 1; padding: 9px 16px; border-radius: 10px;
//           font-weight: 700; font-size: 13px; cursor: pointer;
//           transition: all 0.2s; border: 1.5px solid transparent;
//         }
//         .section-btn.active {
//           background: linear-gradient(135deg, #6366f1, #8b5cf6);
//           color: white; box-shadow: 0 4px 12px rgba(99,102,241,0.35);
//           border-color: transparent;
//         }
//         .section-btn.inactive {
//           background: #f1f5f9; color: #64748b; border-color: #e2e8f0;
//         }
//         .section-btn.inactive:hover { background: #e8edf5; border-color: #c7d2fe; }

//         .teammate-row {
//           display: flex; align-items: center; gap: 10px;
//           padding: 8px 12px; border-radius: 10px; cursor: pointer;
//           border: 1.5px solid #e2e8f0; background: #f8fafc;
//           transition: all 0.15s; font-size: 13px; color: #334155;
//         }
//         .teammate-row.checked { background: #eef2ff; border-color: #818cf8; color: #3730a3; }
//         .teammate-row:hover:not(.checked) { border-color: #c7d2fe; background: #f0f4ff; }

//         .submit-btn {
//           width: 100%; padding: 12px;
//           background: linear-gradient(135deg, #4f46e5, #7c3aed);
//           color: white; border: none; border-radius: 12px;
//           font-weight: 700; font-size: 14px; cursor: pointer;
//           transition: all 0.2s; letter-spacing: 0.02em;
//           box-shadow: 0 4px 14px rgba(79,70,229,0.4);
//         }
//         .submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(79,70,229,0.5); }
//         .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

//         .team-card {
//           background: white; border-radius: 16px;
//           border: 1.5px solid #e0e7ff;
//           transition: all 0.25s;
//           overflow: hidden;
//           position: relative;
//         }
//         .team-card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(99,102,241,0.15); border-color: #c7d2fe; }

//         .card-accent { height: 4px; background: linear-gradient(90deg, #6366f1, #a78bfa, #ec4899); }

//         .badge-pill {
//           display: inline-flex; align-items: center; gap: 4px;
//           padding: 3px 10px; border-radius: 999px;
//           font-size: 11px; font-weight: 600;
//         }

//         .member-chip {
//           display: flex; align-items: center; gap: 8px;
//           padding: 6px 10px; border-radius: 8px;
//           background: #f8fafc; font-size: 12px;
//         }

//         .scrollable-list { overflow-y: auto; scrollbar-width: thin; scrollbar-color: #c7d2fe #f0f4ff; }

//         .form-section { margin-bottom: 18px; }
//         .form-divider { height: 1px; background: #f1f5f9; margin: 18px 0; }

//         .alert { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 10px; font-size: 13px; font-weight: 500; margin-bottom: 16px; }
//         .alert-success { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #166534; }
//         .alert-error { background: #fef2f2; border: 1.5px solid #fecaca; color: #991b1b; }

//         .step-number {
//           width: 22px; height: 22px; border-radius: 50%;
//           background: linear-gradient(135deg, #6366f1, #8b5cf6);
//           color: white; font-size: 11px; font-weight: 800;
//           display: flex; align-items: center; justify-content: center;
//           flex-shrink: 0;
//         }

//         .teams-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
//         @media (min-width: 640px) { .teams-grid { grid-template-columns: repeat(2, 1fr); } }
//       `}</style>

//       <div style={{ maxWidth: 1280, margin: "0 auto" }}>

//         {/* ── Page Header ── */}
//         <div
//           style={{
//             background: "linear-gradient(135deg, #4338ca 0%, #6366f1 50%, #7c3aed 100%)",
//             borderRadius: 20, padding: "28px 32px", marginBottom: 28,
//             boxShadow: "0 8px 32px rgba(67,56,202,0.3)",
//             display: "flex", alignItems: "center", gap: 20,
//           }}
//         >
//           <div style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", borderRadius: 14, padding: 14 }}>
//             <Users size={32} color="white" />
//           </div>
//           <div>
//             <h1 style={{ fontSize: 26, fontWeight: 800, color: "white", margin: 0, letterSpacing: "-0.02em" }}>
//               Project Team Registration
//             </h1>
//             <p style={{ color: "rgba(255,255,255,0.75)", margin: "4px 0 0", fontSize: 14 }}>
//               Register your team of 1–3 members for a project
//             </p>
//           </div>
//         </div>

//         {/* ── Two-Column Layout ── */}
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "stretch" }}
//           className="registration-grid"
//         >

//           {/* ── LEFT: Registration Form ── */}
//           <div style={{ background: "white", borderRadius: 20, boxShadow: "0 4px 24px rgba(99,102,241,0.08)", border: "1.5px solid #e8edf8", overflow: "hidden" }}>
//             {/* Card top accent */}
//             <div className="card-accent" />

//             <div style={{ padding: "24px 28px" }}>
//               <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1e293b", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
//                 <FileText size={17} color="#6366f1" />
//                 New Team Registration
//               </h2>

//               {success && <div className="alert alert-success"><CheckCircle size={15} />{success}</div>}
//               {error && <div className="alert alert-error"><AlertCircle size={15} />{error}</div>}

//               <form onSubmit={handleSubmit}>

//                 {/* Step 1 — Subject & Section */}
//                 <div className="form-section">
//                   <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
//                     <div className="step-number">1</div>
//                     <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em" }}>Subject & Section</span>
//                   </div>

//                   <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "end" }}>
//                     <div>
//                       <label className="field-label"><BookOpen size={12} />Subject</label>
//                       <select
//                         value={selectedSubject}
//                         onChange={(e) => setSelectedSubject(e.target.value)}
//                         required
//                         className="form-control"
//                       >
//                         <option value="">Select a subject…</option>
//                         {subjects.map((subj) => (
//                           <option key={subj.id} value={subj.id}>{subj.name}</option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="field-label"><Layers size={12} />Section</label>
//                       <div style={{ display: "flex", gap: 6 }}>
//                         {["A", "B"].map((sec) => (
//                           <button
//                             key={sec}
//                             type="button"
//                             onClick={() => setSelectedSection(sec as "A" | "B")}
//                             className={`section-btn ${selectedSection === sec ? "active" : "inactive"}`}
//                           >
//                             {sec}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="form-divider" />

//                 {/* Step 2 — Team Members */}
//                 <div className="form-section">
//                   <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
//                     <div className="step-number">2</div>
//                     <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em" }}>Team Members</span>
//                   </div>

//                   <div>
//                     <label className="field-label"><Crown size={12} />Team Leader</label>
//                     <select
//                       value={selectedLeader}
//                       onChange={(e) => setSelectedLeader(e.target.value)}
//                       required
//                       className="form-control"
//                     >
//                       <option value="">Select team leader…</option>
//                       {sectionStudents.map((student) => (
//                         <option key={student.id} value={student.id}>
//                           {student.name}{student.uid ? ` (${student.uid})` : ""}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div style={{ marginTop: 14 }}>
//                     <label className="field-label">
//                       <Handshake size={12} />
//                       Teammates
//                       <span style={{ marginLeft: "auto", fontWeight: 600, color: "#6366f1", fontSize: 11, textTransform: "none", letterSpacing: 0 }}>
//                         {selectedTeammates.length}/2 selected
//                       </span>
//                     </label>
//                     <div className="scrollable-list" style={{ maxHeight: 160, display: "flex", flexDirection: "column", gap: 6 }}>
//                       {sectionStudents.filter((s) => s.id !== selectedLeader).length === 0 ? (
//                         <p style={{ fontSize: 13, color: "#94a3b8", padding: "12px 0", textAlign: "center" }}>No available teammates in this section</p>
//                       ) : (
//                         sectionStudents.filter((s) => s.id !== selectedLeader).map((student) => (
//                           <label
//                             key={student.id}
//                             className={`teammate-row ${selectedTeammates.includes(student.id) ? "checked" : ""}`}
//                           >
//                             <input
//                               type="checkbox"
//                               checked={selectedTeammates.includes(student.id)}
//                               onChange={() => toggleTeammate(student.id)}
//                               disabled={!selectedTeammates.includes(student.id) && selectedTeammates.length >= 2}
//                               style={{ accentColor: "#6366f1", width: 15, height: 15, flexShrink: 0 }}
//                             />
//                             <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                               {student.name}
//                             </span>
//                             {student.uid && (
//                               <span style={{ fontSize: 11, color: "#94a3b8", flexShrink: 0 }}>{student.uid}</span>
//                             )}
//                           </label>
//                         ))
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="form-divider" />

//                 {/* Step 3 — Project */}
//                 <div className="form-section">
//                   <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
//                     <div className="step-number">3</div>
//                     <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em" }}>Project</span>
//                   </div>

//                   <div>
//                     <label className="field-label">
//                       <BookOpen size={12} />
//                       Project
//                       <span style={{ marginLeft: "auto", fontWeight: 600, color: availableProjects.length > 0 ? "#059669" : "#dc2626", fontSize: 11, textTransform: "none", letterSpacing: 0 }}>
//                         {availableProjects.length} available
//                       </span>
//                     </label>
//                     <select
//                       value={selectedProject}
//                       onChange={(e) => setSelectedProject(e.target.value)}
//                       required
//                       className="form-control"
//                     >
//                       <option value="">Select a project…</option>
//                       {availableProjects.map((project) => (
//                         <option key={project.id} value={project.id}>
//                           #{project.project_number} — {project.title}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div style={{ marginTop: 14 }}>
//                     <label className="field-label"><Code size={12} />Technologies <span style={{ color: "#ef4444" }}>*</span></label>
//                     <input
//                       type="text"
//                       value={technologies}
//                       onChange={(e) => setTechnologies(e.target.value)}
//                       placeholder="e.g. React, TypeScript, Node.js"
//                       required
//                       className="form-control"
//                     />
//                     <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 5 }}>Separate multiple technologies with commas</p>
//                   </div>

//                   <div style={{ marginTop: 14 }}>
//                     <label className="field-label"><FileText size={12} />Additional Notes <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
//                     <textarea
//                       value={additionalNotes}
//                       onChange={(e) => setAdditionalNotes(e.target.value)}
//                       rows={2}
//                       placeholder="Any special requirements or notes…"
//                       className="form-control"
//                       style={{ resize: "none" }}
//                     />
//                   </div>
//                 </div>

//                 <button type="submit" disabled={loading || !selectedSubject} className="submit-btn">
//                   {loading ? (
//                     <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
//                       <svg style={{ animation: "spin 1s linear infinite" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>
//                       Registering…
//                     </span>
//                   ) : (
//                     <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
//                       <CheckCircle size={16} />
//                       Register Team
//                       <ChevronRight size={16} />
//                     </span>
//                   )}
//                 </button>

//                 <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//               </form>
//             </div>
//           </div>

//           {/* ── RIGHT: Registered Teams ── */}
//           <div style={{ display: "flex", flexDirection: "column" }}>
//             {/* Header */}
//             <div
//               style={{
//                 background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #a855f7 100%)",
//                 borderRadius: 16, padding: "18px 24px", marginBottom: 16,
//                 display: "flex", alignItems: "center", justifyContent: "space-between",
//                 boxShadow: "0 4px 20px rgba(79,70,229,0.25)",
//               }}
//             >
//               <div>
//                 <h2 style={{ fontSize: 18, fontWeight: 800, color: "white", margin: 0 }}>Registered Teams</h2>
//                 <p style={{ color: "rgba(255,255,255,0.7)", margin: "3px 0 0", fontSize: 13 }}>
//                   Section {selectedSection} · {selectedSubject ? "Selected subject" : "All subjects"}
//                 </p>
//               </div>
//               <div style={{
//                 background: "rgba(255,255,255,0.2)", borderRadius: 12,
//                 padding: "8px 16px", backdropFilter: "blur(8px)",
//               }}>
//                 <span style={{ fontSize: 22, fontWeight: 800, color: "white" }}>{registeredTeams.length}</span>
//                 <p style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", margin: 0, fontWeight: 600 }}>TEAMS</p>
//               </div>
//             </div>

//             {/* Teams List */}
//             {registeredTeams.length === 0 ? (
//               <div style={{
//                 flex: 1,
//                 background: "white", borderRadius: 20, padding: "48px 24px",
//                 textAlign: "center", border: "1.5px dashed #c7d2fe",
//                 display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
//               }}>
//                 <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
//                 <p style={{ fontSize: 16, fontWeight: 700, color: "#475569", margin: "0 0 6px" }}>No teams yet</p>
//                 <p style={{ fontSize: 13, color: "#94a3b8" }}>Registered teams will appear here</p>
//               </div>
//             ) : (
//               <div
//                 className="scrollable-list"
//                 style={{ flex: 1, minHeight: 0, maxHeight: "780px", overflowY: "auto", paddingRight: 4 }}
//               >
//                 <div className="teams-grid">
//                   {registeredTeams.map((team, index) => (
//                     <div key={team.id || index} className="team-card">
//                       <div className="card-accent" />
//                       <div style={{ padding: "16px 18px" }}>

//                         {/* Team number badge */}
//                         <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
//                           <span className="badge-pill" style={{ background: "#eef2ff", color: "#4338ca", border: "1px solid #c7d2fe" }}>
//                             <Layers size={10} />
//                             Team #{index + 1}
//                           </span>
//                           <span style={{ fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4 }}>
//                             <Calendar size={11} />
//                             {new Date(team.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
//                           </span>
//                         </div>

//                         {/* Project Title */}
//                         <h3 style={{ fontSize: 14, fontWeight: 800, color: "#1e293b", margin: "0 0 4px", lineHeight: 1.3 }}>
//                           {team.project_title || "Untitled Project"}
//                         </h3>
//                         <p style={{ fontSize: 12, color: "#6366f1", fontWeight: 600, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 4 }}>
//                           <BookOpen size={11} />
//                           Project #{team.project_number || "N/A"} · {team.subject_name || "Unknown Subject"}
//                         </p>

//                         {/* Members */}
//                         <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
//                           <div className="member-chip" style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}>
//                             <Crown size={12} color="#2563eb" style={{ flexShrink: 0 }} />
//                             <div style={{ flex: 1, overflow: "hidden" }}>
//                               <p style={{ margin: 0, fontWeight: 700, color: "#1e40af", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{team.leader_name}</p>
//                               {team.leader_uid && <p style={{ margin: 0, fontSize: 10, color: "#60a5fa" }}>{team.leader_uid}</p>}
//                             </div>
//                           </div>
//                           {team.teammate1_name && (
//                             <div className="member-chip">
//                               <Handshake size={12} color="#7c3aed" style={{ flexShrink: 0 }} />
//                               <div style={{ flex: 1, overflow: "hidden" }}>
//                                 <p style={{ margin: 0, fontWeight: 600, color: "#334155", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{team.teammate1_name}</p>
//                                 {team.teammate1_uid && <p style={{ margin: 0, fontSize: 10, color: "#94a3b8" }}>{team.teammate1_uid}</p>}
//                               </div>
//                             </div>
//                           )}
//                           {team.teammate2_name && (
//                             <div className="member-chip">
//                               <Handshake size={12} color="#7c3aed" style={{ flexShrink: 0 }} />
//                               <div style={{ flex: 1, overflow: "hidden" }}>
//                                 <p style={{ margin: 0, fontWeight: 600, color: "#334155", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{team.teammate2_name}</p>
//                                 {team.teammate2_uid && <p style={{ margin: 0, fontSize: 10, color: "#94a3b8" }}>{team.teammate2_uid}</p>}
//                               </div>
//                             </div>
//                           )}
//                         </div>

//                         {/* Footer: registered status */}
//                         <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 5 }}>
//                           <CheckCircle size={12} color="#22c55e" />
//                           <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Registered</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { supabase, type Student, type Project } from "../lib/supabase";
import {
  Users,
  BookOpen,
  Code,
  FileText,
  CheckCircle,
  AlertCircle,
  Crown,
  Handshake,
  Calendar,
  Layers,
  ChevronRight,
} from "lucide-react";

export function TeamSubmissionForm() {
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedSection, setSelectedSection] = useState<"A" | "B">("A");
  const [selectedLeader, setSelectedLeader] = useState("");
  const [selectedTeammates, setSelectedTeammates] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [takenProjects, setTakenProjects] = useState<Set<string>>(new Set());
  const [takenStudents, setTakenStudents] = useState<Set<string>>(new Set());
  const [registeredTeams, setRegisteredTeams] = useState<any[]>([]);

  useEffect(() => {
    loadSubjects();
    loadStudents();
  }, []);

  useEffect(() => {
    if (!selectedSubject) {
      loadAllRegisteredTeams();
      return;
    }
    loadProjects();
    loadTakenProjects();
    loadTakenStudents();
    loadRegisteredTeams();
    setSelectedLeader("");
    setSelectedTeammates([]);
    setSelectedProject("");
  }, [selectedSubject, selectedSection]);

  async function loadSubjects() {
    const { data, error } = await supabase.from("subjects").select("*").order("name");
    if (data) setSubjects(data);
    if (error) console.error(error);
  }

  async function loadStudents() {
    const { data, error } = await supabase.from("students").select("*").order("name");
    if (data) setStudents(data);
    if (error) console.error(error);
  }

  async function loadProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("subject_id", selectedSubject)
      .order("project_number");
    if (data) setProjects(data);
    if (error) console.error(error);
  }

  async function loadTakenProjects() {
    const { data } = await supabase
      .from("teams")
      .select("project_id")
      .eq("section", selectedSection)
      .eq("subject_id", selectedSubject);
    if (data) setTakenProjects(new Set(data.map((t) => t.project_id)));
  }

  async function loadTakenStudents() {
    const { data, error } = await supabase
      .from("teams")
      .select("team_leader_id, teammate1_id, teammate2_id")
      .eq("section", selectedSection)
      .eq("subject_id", selectedSubject);
    if (error) console.error(error);
    if (data) {
      const ids = new Set<string>();
      data.forEach((row) => {
        if (row.team_leader_id) ids.add(row.team_leader_id);
        if (row.teammate1_id) ids.add(row.teammate1_id);
        if (row.teammate2_id) ids.add(row.teammate2_id);
      });
      setTakenStudents(ids);
    }
  }

  async function loadRegisteredTeams() {
    const { data, error } = await supabase
      .from("registered_teams_view")
      .select("*")
      .eq("section", selectedSection)
      .eq("subject_id", selectedSubject)
      .order("created_at", { ascending: false });
    if (error) console.error("Error loading teams:", error);
    else setRegisteredTeams(data);
  }

  async function loadAllRegisteredTeams() {
    const { data, error } = await supabase
      .from("registered_teams_view")
      .select("*")
      .eq("section", selectedSection)
      .order("created_at", { ascending: false });
    if (error) console.error("Error loading all teams:", error);
    else setRegisteredTeams(data);
  }

  function toggleTeammate(id: string) {
    setSelectedTeammates((prev) => {
      if (prev.includes(id)) return prev.filter((t) => t !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const teamSize = 1 + selectedTeammates.length;
      if (teamSize < 1 || teamSize > 3)
        throw new Error("Team must have 1–3 members including the leader");
      if (selectedTeammates.includes(selectedLeader))
        throw new Error("Leader cannot also be a teammate");

      const techArray = technologies.split(",").map((t) => t.trim()).filter(Boolean);
      const { error: insertError } = await supabase.from("teams").insert({
        subject_id: selectedSubject,
        project_id: selectedProject,
        team_leader_id: selectedLeader,
        teammate1_id: selectedTeammates[0] || null,
        teammate2_id: selectedTeammates[1] || null,
        section: selectedSection,
        technologies: techArray,
        additional_notes: additionalNotes || null,
      });
      if (insertError) throw insertError;

      setSuccess("Team registered successfully!");
      setSelectedLeader("");
      setSelectedTeammates([]);
      setSelectedProject("");
      setTechnologies("");
      setAdditionalNotes("");
      await Promise.all([loadTakenProjects(), loadTakenStudents(), loadRegisteredTeams()]);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  const sectionStudents = students.filter(
    (s) => s.section === selectedSection && !takenStudents.has(s.id)
  );
  const availableProjects = projects.filter((p) => !takenProjects.has(p.id));

  return (
    <div
      className="min-h-screen p-3 sm:p-4 lg:p-8"
      style={{ background: "linear-gradient(135deg, #eff6ff 0%, #f8faff 40%, #f5f3ff 100%)" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }

        .field-label {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; color: #475569; margin-bottom: 7px;
        }
        .field-label svg { color: #6366f1; }

        .form-control {
          width: 100%; padding: 9px 12px; font-size: 13px;
          border: 1.5px solid #e2e8f0; border-radius: 10px;
          background: #f8fafc; color: #1e293b;
          transition: all 0.2s; outline: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .form-control:focus { border-color: #6366f1; background: #fff; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }

        .section-btn {
          flex: 1; padding: 9px 16px; border-radius: 10px;
          font-weight: 700; font-size: 13px; cursor: pointer;
          transition: all 0.2s; border: 1.5px solid transparent;
        }
        .section-btn.active {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white; box-shadow: 0 4px 12px rgba(99,102,241,0.35);
          border-color: transparent;
        }
        .section-btn.inactive {
          background: #f1f5f9; color: #64748b; border-color: #e2e8f0;
        }
        .section-btn.inactive:hover { background: #e8edf5; border-color: #c7d2fe; }

        .teammate-row {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 12px; border-radius: 10px; cursor: pointer;
          border: 1.5px solid #e2e8f0; background: #f8fafc;
          transition: all 0.15s; font-size: 13px; color: #334155;
        }
        .teammate-row.checked { background: #eef2ff; border-color: #818cf8; color: #3730a3; }
        .teammate-row:hover:not(.checked) { border-color: #c7d2fe; background: #f0f4ff; }

        .submit-btn {
          width: 100%; padding: 12px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white; border: none; border-radius: 12px;
          font-weight: 700; font-size: 14px; cursor: pointer;
          transition: all 0.2s; letter-spacing: 0.02em;
          box-shadow: 0 4px 14px rgba(79,70,229,0.4);
        }
        .submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(79,70,229,0.5); }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

        .team-card {
          background: white; border-radius: 16px;
          border: 1.5px solid #e0e7ff;
          transition: all 0.25s;
          overflow: hidden;
          position: relative;
        }
        .team-card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(99,102,241,0.15); border-color: #c7d2fe; }

        .card-accent { height: 4px; background: linear-gradient(90deg, #6366f1, #a78bfa, #ec4899); }

        .badge-pill {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 10px; border-radius: 999px;
          font-size: 11px; font-weight: 600;
        }

        .member-chip {
          display: flex; align-items: center; gap: 8px;
          padding: 6px 10px; border-radius: 8px;
          background: #f8fafc; font-size: 12px;
        }

        .scrollable-list { overflow-y: auto; scrollbar-width: thin; scrollbar-color: #c7d2fe #f0f4ff; }

        .form-section { margin-bottom: 18px; }
        .form-divider { height: 1px; background: #f1f5f9; margin: 18px 0; }

        .alert { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 10px; font-size: 13px; font-weight: 500; margin-bottom: 16px; }
        .alert-success { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #166534; }
        .alert-error { background: #fef2f2; border: 1.5px solid #fecaca; color: #991b1b; }

        .step-number {
          width: 22px; height: 22px; border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white; font-size: 11px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        /* ── Responsive Layout ── */
        .page-layout {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* On large screens: side-by-side */
        @media (min-width: 1024px) {
          .page-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            align-items: start;
          }
        }

        /* Teams grid: 1 col on mobile, 2 on ≥640 */
        .teams-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 640px) { .teams-grid { grid-template-columns: repeat(2, 1fr); } }

        /* Subject + Section row: stack on very small screens */
        .subject-section-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12px;
          align-items: end;
        }
        @media (max-width: 400px) {
          .subject-section-row {
            grid-template-columns: 1fr;
          }
        }

        /* Page header responsive padding */
        .page-header {
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 8px 32px rgba(67,56,202,0.3);
          display: flex;
          align-items: center;
          gap: 14px;
          background: linear-gradient(135deg, #4338ca 0%, #6366f1 50%, #7c3aed 100%);
        }
        @media (min-width: 640px) {
          .page-header { padding: 28px 32px; gap: 20px; margin-bottom: 28px; }
        }

        .page-header h1 { font-size: 20px; }
        @media (min-width: 640px) { .page-header h1 { font-size: 26px; } }

        .header-icon-wrap {
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(8px);
          border-radius: 12px;
          padding: 10px;
          flex-shrink: 0;
        }
        @media (min-width: 640px) { .header-icon-wrap { border-radius: 14px; padding: 14px; } }

        /* Registered teams panel: on mobile has fixed max-height for scroll */
        .teams-scroll-wrapper {
          max-height: 500px;
          overflow-y: auto;
          padding-right: 4px;
        }
        @media (min-width: 1024px) {
          .teams-scroll-wrapper {
            max-height: 780px;
          }
        }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* ── Page Header ── */}
        <div className="page-header">
          <div className="header-icon-wrap">
            <Users size={28} color="white" />
          </div>
          <div>
            <h1 className="page-header h1" style={{ fontWeight: 800, color: "white", margin: 0, letterSpacing: "-0.02em" }}>
              Project Team Registration
            </h1>
            <p style={{ color: "rgba(255,255,255,0.75)", margin: "4px 0 0", fontSize: 13 }}>
              Register your team of 1–3 members for a project
            </p>
          </div>
        </div>

        {/* ── Responsive Two-Column / Single-Column Layout ── */}
        <div className="page-layout">

          {/* ── FORM (always first — top on mobile, left on desktop) ── */}
          <div style={{ background: "white", borderRadius: 20, boxShadow: "0 4px 24px rgba(99,102,241,0.08)", border: "1.5px solid #e8edf8", overflow: "hidden" }}>
            <div className="card-accent" />

            <div style={{ padding: "20px" }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1e293b", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
                <FileText size={16} color="#6366f1" />
                New Team Registration
              </h2>

              {success && <div className="alert alert-success"><CheckCircle size={15} />{success}</div>}
              {error && <div className="alert alert-error"><AlertCircle size={15} />{error}</div>}

              <form onSubmit={handleSubmit}>

                {/* Step 1 — Subject & Section */}
                <div className="form-section">
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <div className="step-number">1</div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em" }}>Subject & Section</span>
                  </div>

                  <div className="subject-section-row">
                    <div>
                      <label className="field-label"><BookOpen size={12} />Subject</label>
                      <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        required
                        className="form-control"
                      >
                        <option value="">Select a subject…</option>
                        {subjects.map((subj) => (
                          <option key={subj.id} value={subj.id}>{subj.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="field-label"><Layers size={12} />Group</label>
                      <div style={{ display: "flex", gap: 6 }}>
                        {["A", "B"].map((sec) => (
                          <button
                            key={sec}
                            type="button"
                            onClick={() => setSelectedSection(sec as "A" | "B")}
                            className={`section-btn ${selectedSection === sec ? "active" : "inactive"}`}
                          >
                            {sec}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-divider" />

                {/* Step 2 — Team Members */}
                <div className="form-section">
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <div className="step-number">2</div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em" }}>Team Members</span>
                  </div>

                  <div>
                    <label className="field-label"><Crown size={12} />Team Leader</label>
                    <select
                      value={selectedLeader}
                      onChange={(e) => setSelectedLeader(e.target.value)}
                      required
                      className="form-control"
                    >
                      <option value="">Select team leader…</option>
                      {sectionStudents.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.name}{student.uid ? ` (${student.uid})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginTop: 14 }}>
                    <label className="field-label">
                      <Handshake size={12} />
                      Teammates
                      <span style={{ marginLeft: "auto", fontWeight: 600, color: "#6366f1", fontSize: 11, textTransform: "none", letterSpacing: 0 }}>
                        {selectedTeammates.length}/2 selected
                      </span>
                    </label>
                    <div className="scrollable-list" style={{ maxHeight: 160, display: "flex", flexDirection: "column", gap: 6 }}>
                      {sectionStudents.filter((s) => s.id !== selectedLeader).length === 0 ? (
                        <p style={{ fontSize: 13, color: "#94a3b8", padding: "12px 0", textAlign: "center" }}>No available teammates in this section</p>
                      ) : (
                        sectionStudents.filter((s) => s.id !== selectedLeader).map((student) => (
                          <label
                            key={student.id}
                            className={`teammate-row ${selectedTeammates.includes(student.id) ? "checked" : ""}`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedTeammates.includes(student.id)}
                              onChange={() => toggleTeammate(student.id)}
                              disabled={!selectedTeammates.includes(student.id) && selectedTeammates.length >= 2}
                              style={{ accentColor: "#6366f1", width: 15, height: 15, flexShrink: 0 }}
                            />
                            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {student.name}
                            </span>
                            {student.uid && (
                              <span style={{ fontSize: 11, color: "#94a3b8", flexShrink: 0 }}>{student.uid}</span>
                            )}
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-divider" />

                {/* Step 3 — Project */}
                <div className="form-section">
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <div className="step-number">3</div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em" }}>Project</span>
                  </div>

                  <div>
                    <label className="field-label">
                      <BookOpen size={12} />
                      Project
                      <span style={{ marginLeft: "auto", fontWeight: 600, color: availableProjects.length > 0 ? "#059669" : "#dc2626", fontSize: 11, textTransform: "none", letterSpacing: 0 }}>
                        {availableProjects.length} available
                      </span>
                    </label>
                    <select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      required
                      className="form-control"
                    >
                      <option value="">Select a project…</option>
                      {availableProjects.map((project) => (
                        <option key={project.id} value={project.id}>
                          #{project.project_number} — {project.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginTop: 14 }}>
                    <label className="field-label"><Code size={12} />Technologies <span style={{ color: "#ef4444" }}>*</span></label>
                    <input
                      type="text"
                      value={technologies}
                      onChange={(e) => setTechnologies(e.target.value)}
                      placeholder="e.g. React, TypeScript, Node.js"
                      required
                      className="form-control"
                    />
                    <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 5 }}>Separate multiple technologies with commas</p>
                  </div>

                  <div style={{ marginTop: 14 }}>
                    <label className="field-label"><FileText size={12} />Additional Notes <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                    <textarea
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      rows={2}
                      placeholder="Any special requirements or notes…"
                      className="form-control"
                      style={{ resize: "none" }}
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading || !selectedSubject} className="submit-btn">
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <svg style={{ animation: "spin 1s linear infinite" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56" /></svg>
                      Registering…
                    </span>
                  ) : (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <CheckCircle size={16} />
                      Register Team
                      <ChevronRight size={16} />
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ── REGISTERED TEAMS (below form on mobile, right on desktop) ── */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #a855f7 100%)",
                borderRadius: 16, padding: "16px 20px", marginBottom: 16,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                boxShadow: "0 4px 20px rgba(79,70,229,0.25)",
              }}
            >
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: "white", margin: 0 }}>Registered Teams</h2>
                <p style={{ color: "rgba(255,255,255,0.7)", margin: "3px 0 0", fontSize: 12 }}>
                  Section {selectedSection} · {selectedSubject ? "Selected subject" : "All subjects"}
                </p>
              </div>
              <div style={{
                background: "rgba(255,255,255,0.2)", borderRadius: 12,
                padding: "8px 16px", backdropFilter: "blur(8px)",
                flexShrink: 0,
              }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: "white" }}>{registeredTeams.length}</span>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", margin: 0, fontWeight: 600 }}>TEAMS</p>
              </div>
            </div>

            {/* Teams List */}
            {registeredTeams.length === 0 ? (
              <div style={{
                background: "white", borderRadius: 20, padding: "40px 24px",
                textAlign: "center", border: "1.5px dashed #c7d2fe",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#475569", margin: "0 0 6px" }}>No teams yet</p>
                <p style={{ fontSize: 13, color: "#94a3b8" }}>Registered teams will appear here</p>
              </div>
            ) : (
              <div className="scrollable-list teams-scroll-wrapper">
                <div className="teams-grid">
                  {registeredTeams.map((team, index) => (
                    <div key={team.id || index} className="team-card">
                      <div className="card-accent" />
                      <div style={{ padding: "14px 16px" }}>

                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                          <span className="badge-pill" style={{ background: "#eef2ff", color: "#4338ca", border: "1px solid #c7d2fe" }}>
                            <Layers size={10} />
                            Team #{index + 1}
                          </span>
                          <span style={{ fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4 }}>
                            <Calendar size={11} />
                            {new Date(team.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                          </span>
                        </div>

                        <h3 style={{ fontSize: 13, fontWeight: 800, color: "#1e293b", margin: "0 0 4px", lineHeight: 1.3 }}>
                          {team.project_title || "Untitled Project"}
                        </h3>
                        <p style={{ fontSize: 12, color: "#6366f1", fontWeight: 600, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 4 }}>
                          <BookOpen size={11} />
                          Project #{team.project_number || "N/A"} · {team.subject_name || "Unknown Subject"}
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <div className="member-chip" style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}>
                            <Crown size={12} color="#2563eb" style={{ flexShrink: 0 }} />
                            <div style={{ flex: 1, overflow: "hidden" }}>
                              <p style={{ margin: 0, fontWeight: 700, color: "#1e40af", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{team.leader_name}</p>
                              {team.leader_uid && <p style={{ margin: 0, fontSize: 10, color: "#60a5fa" }}>{team.leader_uid}</p>}
                            </div>
                          </div>
                          {team.teammate1_name && (
                            <div className="member-chip">
                              <Handshake size={12} color="#7c3aed" style={{ flexShrink: 0 }} />
                              <div style={{ flex: 1, overflow: "hidden" }}>
                                <p style={{ margin: 0, fontWeight: 600, color: "#334155", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{team.teammate1_name}</p>
                                {team.teammate1_uid && <p style={{ margin: 0, fontSize: 10, color: "#94a3b8" }}>{team.teammate1_uid}</p>}
                              </div>
                            </div>
                          )}
                          {team.teammate2_name && (
                            <div className="member-chip">
                              <Handshake size={12} color="#7c3aed" style={{ flexShrink: 0 }} />
                              <div style={{ flex: 1, overflow: "hidden" }}>
                                <p style={{ margin: 0, fontWeight: 600, color: "#334155", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{team.teammate2_name}</p>
                                {team.teammate2_uid && <p style={{ margin: 0, fontSize: 10, color: "#94a3b8" }}>{team.teammate2_uid}</p>}
                              </div>
                            </div>
                          )}
                        </div>

                        <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 5 }}>
                          <CheckCircle size={12} color="#22c55e" />
                          <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Registered</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
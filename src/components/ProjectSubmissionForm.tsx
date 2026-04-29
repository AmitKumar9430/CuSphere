import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  FileUp,
  FileText,
  Presentation,
  CheckCircle,
  AlertCircle,
  Upload,
  X,
  Download,
  Eye,
  ExternalLink,
} from 'lucide-react';

export function ProjectSubmissionForm() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [submittedTeams, setSubmittedTeams] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSection, setSelectedSection] = useState<'A' | 'B'>('A');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [viewFilter, setViewFilter] = useState<'all' | string>('all');

  useEffect(() => {
    loadSubjects();
    loadSubmittedTeams();
  }, []);

  useEffect(() => {
    if (selectedSubject && selectedSection) {
      loadTeams();
    }
  }, [selectedSubject, selectedSection]);

  async function loadSubjects() {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('name');
    if (data) setSubjects(data);
    if (error) console.error(error);
  }

  async function loadTeams() {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        project:projects(title, project_number),
        team_leader:students!fk_team_leader(name, uid),
        teammate1:students!fk_teammate1(name, uid),
        teammate2:students!fk_teammate2(name, uid)
      `)
      .eq('subject_id', selectedSubject)
      .eq('section', selectedSection);
    
    if (data) setTeams(data);
    if (error) console.error(error);

    
  }

  async function loadSubmittedTeams() {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        subject:subjects(name),
        project:projects(title, project_number),
        team_leader:students!fk_team_leader(name, uid),
        teammate1:students!fk_teammate1(name, uid),
        teammate2:students!fk_teammate2(name, uid)
      `)
      .not('submitted_at', 'is', null)
      .order('submitted_at', { ascending: false });
    
    if (data) setSubmittedTeams(data);
    if (error) console.error(error);
  }

  function handlePptChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = [
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      ];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid PowerPoint file (.ppt or .pptx)');
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setError('PPT file size must be less than 50MB');
        return;
      }
      setPptFile(file);
      setError('');
    }
  }

  function handleReportChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload a valid PDF file');
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setError('Report file size must be less than 50MB');
        return;
      }
      setReportFile(file);
      setError('');
    }
  }

  async function handleSubmit() {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!selectedTeam) {
        throw new Error('Please select a team');
      }
      if (!pptFile && !reportFile) {
        throw new Error('Please upload at least one file (PPT or Report)');
      }

      const team = teams.find(t => t.id === selectedTeam);
      if (!team) {
        throw new Error('Team not found');
      }

      // Check if already submitted
      if (team.submitted_at) {
        throw new Error('This team has already submitted their project');
      }

      let pptUrl = null;
      let reportUrl = null;

      if (pptFile) {
        const pptPath = `${selectedSubject}/${selectedSection}/${team.id}/ppt_${Date.now()}_${pptFile.name}`;
        const { data: pptData, error: pptError } = await supabase.storage
          .from('project-submissions')
          .upload(pptPath, pptFile);
        
        if (pptError) throw new Error('Failed to upload PPT: ' + pptError.message);
        
        const { data: pptPublicData } = supabase.storage
          .from('project-submissions')
          .getPublicUrl(pptPath);
        
        pptUrl = pptPublicData.publicUrl;
      }

      if (reportFile) {
        const reportPath = `${selectedSubject}/${selectedSection}/${team.id}/report_${Date.now()}_${reportFile.name}`;
        const { data: reportData, error: reportError } = await supabase.storage
          .from('project-submissions')
          .upload(reportPath, reportFile);
        
        if (reportError) throw new Error('Failed to upload Report: ' + reportError.message);
        
        const { data: reportPublicData } = supabase.storage
          .from('project-submissions')
          .getPublicUrl(reportPath);
        
        reportUrl = reportPublicData.publicUrl;
      }

      const updateData: any = {
        submitted_at: new Date().toISOString(),
      };
      if (pptUrl) updateData.ppt_url = pptUrl;
      if (reportUrl) updateData.report_url = reportUrl;

      const { error: updateError } = await supabase
        .from('teams')
        .update(updateData)
        .eq('id', selectedTeam);

      if (updateError) throw updateError;

      setSuccess('✅ Project files uploaded successfully!');
      setPptFile(null);
      setReportFile(null);
      setSelectedTeam('');
      loadSubmittedTeams();

      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  function downloadSamplePPT() {
  const link = document.createElement('a');
  link.href = '/samples/sample-presentation.pptx'; // ✅ remove "public"
  link.download = 'Sample_Project_Presentation.pptx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function downloadSampleReport() {
  const link = document.createElement('a');
  link.href = '/samples/Report_Format.pdf'; // ✅ remove "public"
  link.download = 'Sample_Project_Report.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


  const selectedTeamData = teams.find(t => t.id === selectedTeam);
  const isAlreadySubmitted = selectedTeamData?.submitted_at;

  const filteredSubmissions = viewFilter === 'all' 
    ? submittedTeams 
    : submittedTeams.filter(t => t.subject?.name === viewFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Download Sample Files */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Sample Files</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={downloadSamplePPT}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg"
            >
              <Download className="w-5 h-5" />
              Download Sample PPT
            </button>
            <button
              onClick={downloadSampleReport}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-lg"
            >
              <Download className="w-5 h-5" />
              Download Sample Report
            </button>
          </div>
        </div>

        {/* Submission Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-600 p-3 rounded-lg">
              <FileUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Project Submission
              </h1>
              <p className="text-slate-600">
                Upload your project PPT and Report
              </p>
            </div>
          </div>

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {success}
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {isAlreadySubmitted && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="font-semibold">Already Submitted</p>
                <p className="text-sm">This team has already submitted their project on {new Date(selectedTeamData.submitted_at).toLocaleString()}</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                <FileText className="w-4 h-4" /> Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setSelectedTeam('');
                }}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
              >
                <option value="">Select Subject</option>
                {subjects.map((subj) => (
                  <option key={subj.id} value={subj.id}>
                    {subj.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                <FileText className="w-4 h-4" /> Group
              </label>
              <div className="grid grid-cols-2 gap-4">
                {['A', 'B'].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => {
                      setSelectedSection(sec as 'A' | 'B');
                      setSelectedTeam('');
                    }}
                    className={`py-3 px-6 rounded-lg font-semibold transition ${
                      selectedSection === sec
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                     Group {sec}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                <FileText className="w-4 h-4" /> Your Team
              </label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                disabled={!selectedSubject}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition disabled:bg-slate-100 disabled:cursor-not-allowed"
              >
                <option value="">Select your team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.team_leader?.name} {team.team_leader?.uid ? `(${team.team_leader.uid})` : ''} - {team.project?.title}
                  </option>
                ))}
              </select>
              {selectedTeamData && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm">
                  <p className="font-semibold text-blue-900">Selected Team Details:</p>
                  <p className="text-blue-800">
                    Leader: {selectedTeamData.team_leader?.name} 
                    {selectedTeamData.team_leader?.uid ? ` (${selectedTeamData.team_leader.uid})` : ''}
                  </p>
                  {selectedTeamData.teammate1 && (
                    <p className="text-blue-800">
                      Teammate 1: {selectedTeamData.teammate1.name}
                      {selectedTeamData.teammate1.uid ? ` (${selectedTeamData.teammate1.uid})` : ''}
                    </p>
                  )}
                  {selectedTeamData.teammate2 && (
                    <p className="text-blue-800">
                      Teammate 2: {selectedTeamData.teammate2.name}
                      {selectedTeamData.teammate2.uid ? ` (${selectedTeamData.teammate2.uid})` : ''}
                    </p>
                  )}
                  <p className="text-blue-800 font-medium mt-1">Project: {selectedTeamData.project?.title}</p>
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                <Presentation className="w-4 h-4" /> PowerPoint Presentation (.ppt, .pptx)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-purple-400 transition">
                <input
                  id="ppt-input"
                  type="file"
                  accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                  onChange={handlePptChange}
                  disabled={isAlreadySubmitted}
                  className="hidden"
                />
                <label
                  htmlFor="ppt-input"
                  className={`flex flex-col items-center gap-2 ${isAlreadySubmitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <Upload className="w-12 h-12 text-purple-600" />
                  {pptFile ? (
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-medium">{pptFile.name}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setPptFile(null);
                        }}
                        className="text-red-600 hover:text-red-700"
                        disabled={isAlreadySubmitted}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-slate-600 font-medium">
                        Click to upload PPT
                      </span>
                      <span className="text-slate-400 text-sm">Max size: 50MB</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                <FileText className="w-4 h-4" /> Project Report (.pdf)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-purple-400 transition">
                <input
                  id="report-input"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleReportChange}
                  disabled={isAlreadySubmitted}
                  className="hidden"
                />
                <label
                  htmlFor="report-input"
                  className={`flex flex-col items-center gap-2 ${isAlreadySubmitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <Upload className="w-12 h-12 text-purple-600" />
                  {reportFile ? (
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-medium">{reportFile.name}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setReportFile(null);
                        }}
                        className="text-red-600 hover:text-red-700"
                        disabled={isAlreadySubmitted}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-slate-600 font-medium">
                        Click to upload Report
                      </span>
                      <span className="text-slate-400 text-sm">Max size: 50MB</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !selectedTeam || (!pptFile && !reportFile) || isAlreadySubmitted}
              className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Submit Project Files
                </>
              )}
            </button>
          </div>
        </div>

        {/* Submitted Projects Table */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Submitted Projects</h2>
            <select
              value={viewFilter}
              onChange={(e) => setViewFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
            >
              <option value="all">All Subjects</option>
              {subjects.map((subj) => (
                <option key={subj.id} value={subj.name}>
                  {subj.name}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-100 border-b-2 border-slate-300">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700">Subject</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700">Section</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700">Leader</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700">Project</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700">PPT</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700">Report</th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                      No submissions yet
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((team) => (
                    <tr key={team.id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                          {team.subject?.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{team.section}</td>
                      <td className="px-4 py-3 text-sm">
                        {team.team_leader?.name}
                        {team.team_leader?.uid && (
                          <span className="text-slate-500 text-xs ml-1">({team.team_leader.uid})</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">{team.project?.title}</td>
                      <td className="px-4 py-3 text-sm">
                        {team.ppt_url ? (
                          <a
                            href={team.ppt_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </a>
                        ) : (
                          <span className="text-slate-400">Not uploaded</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {team.report_url ? (
                          <a
                            href={team.report_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </a>
                        ) : (
                          <span className="text-slate-400">Not uploaded</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {new Date(team.submitted_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
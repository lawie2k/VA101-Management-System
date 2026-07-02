import React from "react";
import { Button } from "./VAProfileUI";
import { IconX } from "./VAProfileIcons";
import { VAProfileData } from "./types";

export function VAProfileModals(props: any) {
  const { activeModal, setActiveModal, profileForm, setProfileForm, aboutForm, setAboutForm, expForm, setExpForm, portForm, setPortForm, certForm, setCertForm, availForm, setAvailForm, avatarForm, setAvatarForm, coverForm, setCoverForm, handleSaveProfile, handleSaveAbout, handleSaveExperience, handleSavePortfolio, handleSaveCertifications, handleSaveAvailability, handleSaveAvatar, handleSaveCover, handleFileUpload, uploadError, handleCoverUpload, coverUploadError, ALL_NICHES } = props;
  if (!activeModal) return null;
  return (
        <div className="fixed inset-0 bg-[#000312]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-extrabold text-slate-900 text-base">
                {activeModal === "profile" && "Edit Profile Details"}
                {activeModal === "about" && "Edit About Bio"}
                {activeModal === "experience" && "Add Experience"}
                {activeModal === "portfolio" && "Add Portfolio Item"}
                {activeModal === "certification" && "Add Certification"}
                {activeModal === "availability" && "Edit Availability"}
              </h3>
              <button 
                type="button"
                onClick={() => setActiveModal(null)} 
                className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-800 transition-all cursor-pointer"
              >
                <IconX className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body Forms */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              
              {/* EDIT PROFILE INFO */}
              {activeModal === "profile" && (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={profileForm.fullName} 
                      onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Professional Title</label>
                    <input 
                      type="text" 
                      required
                      value={profileForm.title} 
                      onChange={e => setProfileForm({ ...profileForm, title: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Experience (Years)</label>
                      <input 
                        type="number" 
                        required
                        min="0"
                        value={profileForm.experienceYears} 
                        onChange={e => setProfileForm({ ...profileForm, experienceYears: parseInt(e.target.value) || 0 })}
                        className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Expected Rate ($/hr)</label>
                      <input 
                        type="number" 
                        required
                        min="1"
                        value={profileForm.expectedRate} 
                        onChange={e => setProfileForm({ ...profileForm, expectedRate: parseInt(e.target.value) || 0 })}
                        className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Location</label>
                    <input 
                      type="text" 
                      required
                      value={profileForm.location} 
                      onChange={e => setProfileForm({ ...profileForm, location: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Primary Niche</label>
                    <select
                      value={profileForm.niche}
                      onChange={e => setProfileForm({ ...profileForm, niche: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                    >
                      {ALL_NICHES.map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <input 
                      type="checkbox" 
                      id="opp-status"
                      checked={profileForm.openToOpportunities} 
                      onChange={e => setProfileForm({ ...profileForm, openToOpportunities: e.target.checked })}
                      className="h-4.5 w-4.5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor="opp-status" className="text-xs font-bold text-slate-700 cursor-pointer">Open to employment opportunities</label>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button type="button" variant="outline" size="sm" onClick={() => setActiveModal(null)}>Cancel</Button>
                    <Button type="submit" variant="secondary" size="sm">Save Changes</Button>
                  </div>
                </form>
              )}

              {/* EDIT ABOUT BIO */}
              {activeModal === "about" && (
                <form onSubmit={handleSaveAbout} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">About Bio</label>
                    <textarea 
                      rows={5}
                      required
                      value={aboutForm} 
                      onChange={e => setAboutForm(e.target.value)}
                      placeholder="Describe what you specialize in, platforms you use, and typical clients you support..."
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-medium text-slate-750 leading-relaxed resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button type="button" variant="outline" size="sm" onClick={() => setActiveModal(null)}>Cancel</Button>
                    <Button type="submit" variant="secondary" size="sm">Save Bio</Button>
                  </div>
                </form>
              )}

              {/* ADD EXPERIENCE */}
              {activeModal === "experience" && (
                <form onSubmit={handleSaveExperience} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Company Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Harbor Realty Group"
                      value={expForm.company} 
                      onChange={e => setExpForm({ ...expForm, company: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Role / Job Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Lead-Gen Specialist VA"
                      value={expForm.role} 
                      onChange={e => setExpForm({ ...expForm, role: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Period (Duration)</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 2024 – Present or 2022 – 2024"
                      value={expForm.period} 
                      onChange={e => setExpForm({ ...expForm, period: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button type="button" variant="outline" size="sm" onClick={() => setActiveModal(null)}>Cancel</Button>
                    <Button type="submit" variant="secondary" size="sm">Add Experience</Button>
                  </div>
                </form>
              )}

              {/* ADD PORTFOLIO ITEM */}
              {activeModal === "portfolio" && (
                <form onSubmit={handleSavePortfolio} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Work Sample Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Outbound Lead Generation Playbook"
                      value={portForm.title} 
                      onChange={e => setPortForm({ ...portForm, title: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Format / Details</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. PDF · 18 pages or Audio · 3 min"
                      value={portForm.sub} 
                      onChange={e => setPortForm({ ...portForm, sub: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Representative Emoji Icon</label>
                    <select
                      value={portForm.icon}
                      onChange={e => setPortForm({ ...portForm, icon: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                    >
                      <option value="📎">📎 File Attachment</option>
                      <option value="🎙️">🎙️ Audio Recording</option>
                      <option value="📊">📊 PDF Report / Slide deck</option>
                      <option value="📝">📝 Article / Playbook</option>
                      <option value="🎥">🎥 Video Reel</option>
                      <option value="📧">📧 Email Template Pack</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button type="button" variant="outline" size="sm" onClick={() => setActiveModal(null)}>Cancel</Button>
                    <Button type="submit" variant="secondary" size="sm">Add Item</Button>
                  </div>
                </form>
              )}

              {/* ADD CERTIFICATION */}
              {activeModal === "certification" && (
                <form onSubmit={handleSaveCertifications} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Course / Certification Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Advanced Cold Email Mastery"
                      value={certForm.title} 
                      onChange={e => setCertForm({ ...certForm, title: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Provider / Coach</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Daniel K. / VA101 Portal"
                      value={certForm.provider} 
                      onChange={e => setCertForm({ ...certForm, provider: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <input 
                      type="checkbox" 
                      id="cert-completed"
                      checked={certForm.completed} 
                      onChange={e => setCertForm({ ...certForm, completed: e.target.checked, progress: e.target.checked ? 100 : 50 })}
                      className="h-4.5 w-4.5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor="cert-completed" className="text-xs font-bold text-slate-700 cursor-pointer">I have completed this course</label>
                  </div>

                  {!certForm.completed && (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Current Progress ({certForm.progress}%)</label>
                      <input 
                        type="range" 
                        min="1" 
                        max="99"
                        value={certForm.progress} 
                        onChange={e => setCertForm({ ...certForm, progress: parseInt(e.target.value) || 0 })}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button type="button" variant="outline" size="sm" onClick={() => setActiveModal(null)}>Cancel</Button>
                    <Button type="submit" variant="secondary" size="sm">Add Certification</Button>
                  </div>
                </form>
              )}

              {/* EDIT AVAILABILITY */}
              {activeModal === "availability" && (
                <form onSubmit={handleSaveAvailability} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Weekly Commitment (Hours)</label>
                    <select
                      required
                      value={availForm.hours} 
                      onChange={e => setAvailForm({ ...availForm, hours: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold bg-white"
                    >
                      <option value="" disabled>Select weekly commitment</option>
                      <option value="Full-time (40+ hrs/week)">Full-time (40+ hrs/week)</option>
                      <option value="Part-time (20-30 hrs/week)">Part-time (20-30 hrs/week)</option>
                      <option value="Project-based (Flexible)">Project-based (Flexible)</option>
                      <option value="Less than 20 hrs/week">Less than 20 hrs/week</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Work Schedule</label>
                    <select
                      required
                      value={availForm.schedule} 
                      onChange={e => setAvailForm({ ...availForm, schedule: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold bg-white"
                    >
                      <option value="" disabled>Select work schedule</option>
                      <option value="Day Shift (8AM - 5PM)">Day Shift (8AM - 5PM)</option>
                      <option value="Mid Shift (4PM - 1AM)">Mid Shift (4PM - 1AM)</option>
                      <option value="Night Shift (12AM - 9AM)">Night Shift (12AM - 9AM)</option>
                      <option value="Flexible Schedule">Flexible Schedule</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Standard Time Zone</label>
                    <select
                      required
                      value={availForm.timezone} 
                      onChange={e => setAvailForm({ ...availForm, timezone: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-semibold bg-white"
                    >
                      <option value="" disabled>Select timezone</option>
                      <option value="PHT (UTC+8) Philippine Time">PHT (UTC+8) Philippine Time</option>
                      <option value="EST (UTC-5) Eastern Time">EST (UTC-5) Eastern Time</option>
                      <option value="CST (UTC-6) Central Time">CST (UTC-6) Central Time</option>
                      <option value="PST (UTC-8) Pacific Time">PST (UTC-8) Pacific Time</option>
                      <option value="AEST (UTC+10) Australian Eastern Time">AEST (UTC+10) Australian Eastern Time</option>
                      <option value="GMT (UTC+0) Greenwich Mean Time">GMT (UTC+0) Greenwich Mean Time</option>
                      <option value="CET (UTC+1) Central European Time">CET (UTC+1) Central European Time</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button type="button" variant="outline" size="sm" onClick={() => setActiveModal(null)}>Cancel</Button>
                    <Button type="submit" variant="secondary" size="sm">Save Availability</Button>
                  </div>
                </form>
              )}

              {/* EDIT AVATAR PHOTO */}
              {activeModal === "avatar" && (
                <form onSubmit={handleSaveAvatar} className="space-y-4">
                  {/* File Upload Selector */}
                  <div className="space-y-1.5 p-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    <label className="block text-xs font-bold text-slate-555 uppercase tracking-wider mb-1">Upload from Computer</label>
                    <div className="flex flex-wrap items-center gap-3">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="avatar-file-upload"
                      />
                      <label 
                        htmlFor="avatar-file-upload"
                        className="inline-flex items-center justify-center font-bold px-4 py-2 border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-55/70 text-slate-700 rounded-xl cursor-pointer text-xs transition-all shadow-xs shrink-0"
                      >
                        📂 Select Image File
                      </label>
                      {avatarForm && (
                        <button 
                          type="button"
                          onClick={() => setAvatarForm("")}
                          className="px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-650 hover:bg-red-100/50 hover:border-red-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                          title="Clear profile photo"
                        >
                          🗑️ Clear Photo
                        </button>
                      )}
                      <span className="text-[10px] font-bold text-slate-400">Max size: 1.5MB (JPG, PNG)</span>
                    </div>
                    {uploadError && <p className="text-[10px] font-bold text-red-550 mt-1">{uploadError}</p>}
                    
                    {avatarForm && avatarForm.startsWith("data:image/") && (
                      <div className="mt-3 flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-white">
                          <img src={avatarForm} alt="Upload preview" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600">✓ Image file loaded successfully!</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button type="button" variant="outline" size="sm" onClick={() => setActiveModal(null)}>Cancel</Button>
                    <Button type="submit" variant="secondary" size="sm">Save Photo</Button>
                  </div>
                </form>
              )}

              {/* EDIT COVER BANNER */}
              {activeModal === "cover" && (
                <form onSubmit={handleSaveCover} className="space-y-4">
                  {/* File Upload Selector */}
                  <div className="space-y-1.5 p-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider mb-1">Upload Cover Photo from Computer</label>
                    <div className="flex flex-wrap items-center gap-3">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="hidden"
                        id="cover-file-upload"
                      />
                      <label 
                        htmlFor="cover-file-upload"
                        className="inline-flex items-center justify-center font-bold px-4 py-2 border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-55/70 text-slate-700 rounded-xl cursor-pointer text-xs transition-all shadow-xs shrink-0"
                      >
                        📂 Select Cover Image
                      </label>
                      {coverForm && (
                        <button 
                          type="button"
                          onClick={() => setCoverForm("")}
                          className="px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-650 hover:bg-red-100/50 hover:border-red-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                          title="Clear cover image"
                        >
                          🗑️ Clear Cover
                        </button>
                      )}
                      <span className="text-[10px] font-bold text-slate-400">Max size: 1.5MB (JPG, PNG)</span>
                    </div>
                    {coverUploadError && <p className="text-[10px] font-bold text-red-500 mt-1">{coverUploadError}</p>}
                    
                    {coverForm && coverForm.startsWith("data:image/") && (
                      <div className="mt-3 flex items-center gap-2">
                        <div className="w-16 h-10 rounded-lg overflow-hidden border border-slate-200 bg-white">
                          <img src={coverForm} alt="Cover preview" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600">✓ Cover file loaded successfully!</span>
                       </div>
                     )}
                   </div>

                   <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                     <Button type="button" variant="outline" size="sm" onClick={() => setActiveModal(null)}>Cancel</Button>
                     <Button type="submit" variant="secondary" size="sm">Save Cover</Button>
                   </div>
                  </form>
                )}

            </div>
          </div>
        </div>
  );
}

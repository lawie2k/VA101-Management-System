export default function FormHeader() {
  return (
    <div className="w-full max-w-6xl flex justify-between">
      <img src="/logo/VA101%20logo1.svg" alt="logo" className="w-50 h-20" />
      <a 
        href="https://www.virtualassistant101.com/" 
        className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-semibold transition-all"
      >
        Back to main site
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
}

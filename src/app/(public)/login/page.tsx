"use client";

import { useState } from "react";

const roles = ["Super Admin", "Manager", "Virtual Assistant", "Client"];

export default function Page() {
  const [selectedRole, setSelectedRole] = useState("Super Admin");

  return (
  <div className="flex">
    <div className="w-[50%] h-screen bg-[#191940] flex flex-col px-10 py-8">
      <div>
        <header className="text-white text-xl font-bold">VA101</header>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-white text-4xl font-bold">Run your VA agency like <br></br> clockwork.</h1>
        <p className="text-gray-400 mt-4">One place for VAs, clients, projects, tasks, schedules, attendance, <br></br> time logs, reports, and invoices.</p>
      </div>

      <div>
        <footer className="text-gray-500 text-sm">© 2026 Virtual Assistant 101</footer>
      </div>
    </div>

    <div className="bg-amber-30 w-[50%] h-screen flex items-center justify-center">
      <div className="flex flex-col">
        <form className="flex flex-col justify-center">
          <h2 className=" text-xl font-bold">Sign in to your workspace</h2>
            <p className="text-gray-500 mb-5">Enter your email and password to sign in</p>
          <h3 className="mb-1">Email</h3>
          <input className="w-100 border border-gray-200 shadow-md rounded-md p-2 mb-5" type="email" placeholder="Email" required />
          <h3 className="mb-1">Password</h3>
          <input className="w-100 border border-gray-200 shadow-md rounded-md p-2" type="password" placeholder="Password" required />

          <div className="flex justify-between items-center mt-5">
            <div>
              <input className="mr-2" type="checkbox"/>
              <label className="text-gray-500 text-sm">Remember me</label>
            </div>
            <a className="text-orange-500 text-sm mt-2" href="#">Forgot password?</a>
          </div>

          <button className="w-100 bg-orange-500 mt-3 text-white p-1 rounded-md" type="submit">Sign in</button>
        </form>

        <div className="border-2  border-gray-200 shadow-md rounded-2xl p-5 mt-6 w-100">
          <h4 className="text-xs font-semibold tracking-widest text-gray-500 mb-4"> ROLES</h4>
          <div className="grid grid-cols-2 gap-3">
            {roles.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`rounded-xl p-3 text-left transition-all ${
                  selectedRole === role
                    ? "border-2 border-orange-400 bg-orange-50"
                    : "border-2 border-gray-200 bg-white hover:border-orange-300"
                }`}
              >
                <p className="font-semibold text-sm">{role}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

"use client";

import StudentLeftSidebar from "../../../../components/student-dashboard-components/dashboard/StudentLeftSidebar";
import { PaymentsHistory } from "../../../../components/student-dashboard-components/payments/PaymentsHistory";
import { PaymentsRightSidebar } from "../../../../components/student-dashboard-components/payments/PaymentsRightSidebar";

export default function StudentPaymentsPage() {
  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Sidebar (3 cols) */}
        <div className="md:col-span-3">
          <div className="sticky top-8">
            <StudentLeftSidebar />
          </div>
        </div>

        {/* Main Feed (6 cols) */}
        <div className="md:col-span-6 flex flex-col gap-6">
          <PaymentsHistory />
        </div>

        {/* Right Sidebar (3 cols) */}
        <div className="md:col-span-3">
          <div className="sticky top-8">
            <PaymentsRightSidebar />
          </div>
        </div>

      </div>
    </div>
  );
}

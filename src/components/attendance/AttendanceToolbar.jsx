"use client";
import { Search, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function AttendanceToolbar() {
  const [search, setSearch] = useState("");

  return (  
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search */}
      <div className="relative w-full sm:max-w-md">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by Student ID or Student Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10"
        />
      </div>

      {/* Status Filter */}
      <div className="relative w-full sm:w-56">
        <select
          className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3.5 pl-4 pr-10 text-sm text-gray-800 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10"
          defaultValue="All"
        >
          <option value="All">All</option>
          <option value="Complete">Complete</option>
          <option value="Incomplete">Incomplete</option>
          <option value="Absent">Absent</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
}

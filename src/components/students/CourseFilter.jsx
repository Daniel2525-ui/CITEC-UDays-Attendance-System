"use client";
import { Filter } from "lucide-react";

export default function CourseFilter({ courses, value, onChange }) {
  return (
    <div className="w-full sm:w-60">
      <div className="relative">
        <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <select
          id="course-filter"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-8 text-sm text-gray-800 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10"
        >
          <option value="all">All Courses</option>
          {courses.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
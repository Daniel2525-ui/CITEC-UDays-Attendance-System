"use client";

import { supabase } from "../lib/supabse.js";
import { useEffect, useState } from "react";

export default function Page() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    const { data, error } = await supabase.from("students").select("*");

    if (error) {
      console.error("Fetch Error:", error);
      return;
    }

    console.log("Students:", data);

    setStudents(data);
  }

  return (
    <div>
      <h1>Display Students</h1>

      {students.map((student) => (
        <div key={student.id}>
          <p>ID: {student.student_id}</p>
          <p>Full Name: {student.full_name}</p>
          <p>Course: {student.course}</p>
          <p>Year Level: {student.year_level}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

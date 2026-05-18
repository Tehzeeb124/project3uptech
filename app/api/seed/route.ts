import { connectDB } from "@/lib/db";
import { Employee } from "@/models/Employee";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    // Purana data delete karne ke liye (Optional)
    await Employee.deleteMany({});

    const dummyEmployees = [
      { name: "Tehzeeb Awan", email: "tehzeeb@example.com", department: "IT", salary: 75000, status: "Active" },
      { name: "Ali Ahmed", email: "ali@example.com", department: "HR", salary: 50000, status: "Active" },
      { name: "Sara Khan", email: "sara@example.com", department: "IT", salary: 85000, status: "Inactive" },
      { name: "Usman Pirzada", email: "usman@example.com", department: "Sales", salary: 45000, status: "Active" },
      { name: "Zainab Bibi", email: "zainab@example.com", department: "HR", salary: 55000, status: "Active" },
      { name: "Hamza Sheikh", email: "hamza@example.com", department: "IT", salary: 90000, status: "Active" },
      { name: "Ayesha Gull", email: "ayesha@example.com", department: "Sales", salary: 40000, status: "Active" },
      { name: "Bilal Malik", email: "bilal@example.com", department: "IT", salary: 65000, status: "Inactive" },
      { name: "Dania Jadoon", email: "dania@example.com", department: "HR", salary: 52000, status: "Active" },
      { name: "Fahad Mustafa", email: "fahad@example.com", department: "Sales", salary: 48000, status: "Active" },
      { name: "Hina Rabbani", email: "hina@example.com", department: "IT", salary: 77000, status: "Active" },
      { name: "Imran Abbas", email: "imran@example.com", department: "HR", salary: 51000, status: "Active" },
    ];

    await Employee.insertMany(dummyEmployees);

    return NextResponse.json({ message: "Database Seeded Successfully! 12 employees added." });
  } catch (error) {
    return NextResponse.json({ error: "Seeding failed" }, { status: 500 });
  }
}
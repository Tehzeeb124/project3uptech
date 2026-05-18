import { connectDB } from "@/lib/db";
import { Employee } from "@/models/Employee";
import { NextResponse } from "next/server";

// 1. GET Method (Existing - Data Fetch karne ke liye)
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { department: { $regex: search, $options: "i" } }
        ]
      };
    }

    const employees = await Employee.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Employee.countDocuments(query);

    return NextResponse.json({
      employees,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    return NextResponse.json({ error: "Data fetch nahi ho saka" }, { status: 500 });
  }
}

// 2. POST Method (Existing - Naya Employee add karne ke liye)
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, department, salary } = body;

    if (!name || !email || !department || !salary) {
      return NextResponse.json({ error: "Tamam fields lazmi hain" }, { status: 400 });
    }

    const newEmployee = await Employee.create({
      name,
      email,
      department,
      salary: Number(salary),
      status: "Active"
    });

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "Yeh email pehle se majood hai" }, { status: 400 });
    }
    return NextResponse.json({ error: "Employee save karne mein masla hua" }, { status: 500 });
  }
}

// 3. NAYA DELETE METHOD (Yeh lagana zaroori tha deletion chalane ke liye)
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // Frontend se bheji gayi ID extract karega

    if (!id) {
      return NextResponse.json({ error: "Employee ID lazmi hai" }, { status: 400 });
    }

    // MongoDB/Mongoose command database se delete karne ke liye
    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return NextResponse.json({ error: "Record nahi mila" }, { status: 404 });
    }

    return NextResponse.json({ message: "Record delete ho gaya hai" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Delete karne mein masla hua" }, { status: 500 });
  }
}
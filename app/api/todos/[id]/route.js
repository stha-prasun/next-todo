import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/config/mongodb";
import Todo from "@/app/lib/models/todoSchema";

// Update a todo
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { title, completed } = await req.json();
    const { id } = await params;
    const todo = await Todo.findById(id);
    if (!todo) {
      return NextResponse.json(
        {
          error: "Invalid Todo",
        },
        { status: 400 }
      );
    }
    todo.title = title !== undefined ? title : todo.title;
    todo.completed = completed !== undefined ? completed : todo.completed;

    // Save the updated todo
    const updatedTodo = await todo.save();

    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Delete a todo
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    await Todo.findByIdAndDelete(id);
    return NextResponse.json({ message: "Todo deleted" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

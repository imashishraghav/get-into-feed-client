import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { _id, name, email, comment } = await req.json();

    if (!_id || !name || !email || !comment) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // 🟢 We need a special client with a WRITE token to create documents
    const writeClient = client.withConfig({
      token: process.env.SANITY_API_TOKEN, // Add this token in your .env.local file
      useCdn: false,
    });

    await writeClient.create({
      _type: "comment",
      post: {
        _type: "reference",
        _ref: _id,
      },
      name,
      email,
      comment,
      approved: false, // Moderation gatekeeper
    });

    return NextResponse.json({ message: "Comment submitted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Comment API Error:", error);
    return NextResponse.json({ message: "Error submitting comment", error }, { status: 500 });
  }
}
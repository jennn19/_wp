import { NextResponse } from "next/server";
import { posts } from "@/lib/data";

let localNextId = 1;

export async function GET() {
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { author, content } = body;

  if (!author || !content) {
    return NextResponse.json({ error: "請填寫暱稱和內容" }, { status: 400 });
  }

  const now = new Date().toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const newPost = {
    id: localNextId++,
    author,
    content,
    likes: 0,
    createdAt: now,
    comments: [],
  };

  posts.unshift(newPost);
  return NextResponse.json(newPost, { status: 201 });
}
import { NextResponse } from "next/server";
import { posts } from "@/lib/data";

let localNextCommentId = 1;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const postId = parseInt(id);
  const body = await request.json();
  const { author, content } = body;

  if (!content) {
    return NextResponse.json({ error: "請填寫留言內容" }, { status: 400 });
  }

  const post = posts.find((p) => p.id === postId);
  if (!post) {
    return NextResponse.json({ error: "貼文不存在" }, { status: 404 });
  }

  const newComment = {
    id: localNextCommentId++,
    author: author || "訪客",
    content,
  };

  post.comments.push(newComment);
  return NextResponse.json(newComment, { status: 201 });
}
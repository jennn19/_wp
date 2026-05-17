import { NextResponse } from "next/server";
import { posts } from "@/lib/data";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const postId = parseInt(id);

  const post = posts.find((p) => p.id === postId);
  if (!post) {
    return NextResponse.json({ error: "貼文不存在" }, { status: 404 });
  }

  post.likes += 1;
  return NextResponse.json({ likes: post.likes });
}
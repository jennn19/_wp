export interface Post {
  id: number;
  author: string;
  content: string;
  likes: number;
  createdAt: string;
  comments: { id: number; author: string; content: string }[];
}

export let posts: Post[] = [];
export let nextId = 1;
export let nextCommentId = 1;
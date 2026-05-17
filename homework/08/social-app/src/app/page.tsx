"use client";

import { useState, useEffect } from "react";

interface Post {
  id: number;
  author: string;
  content: string;
  likes: number;
  createdAt: string;
  comments: { id: number; author: string; content: string }[];
}

const stories = [
  { name: "me", color: "gradient-avatar-1", isAdd: true },
  { name: "sophia_", color: "gradient-avatar-2" },
  { name: "john_dev", color: "gradient-avatar-3" },
  { name: "luna_k", color: "gradient-avatar-4" },
  { name: "mike_o", color: "gradient-avatar-5" },
  { name: "emma_w", color: "gradient-avatar-6" },
  { name: "alex_", color: "gradient-avatar-7" },
  { name: "kai", color: "gradient-avatar-8" },
];

const avatarColors = [
  "gradient-avatar-1", "gradient-avatar-2", "gradient-avatar-3", "gradient-avatar-4",
  "gradient-avatar-5", "gradient-avatar-6", "gradient-avatar-7", "gradient-avatar-8"
];

function getRandomColor(author: string) {
  const index = author.charCodeAt(0) % avatarColors.length;
  return avatarColors[index];
}

const servers = [
  { name: "Next.js", url: "http://localhost:3000", port: "3000" },
  { name: "Node.js", url: "http://localhost:4000", port: "4000" },
  { name: "FastAPI", url: "http://localhost:5000", port: "5000" },
  { name: "Rust", url: "http://localhost:6000", port: "6000" },
];

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
  const [showAllComments, setShowAllComments] = useState<{ [key: number]: boolean }>({});
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [showHeartAnim, setShowHeartAnim] = useState<{ [key: number]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeServer, setActiveServer] = useState(0);
  const [serverStatus, setServerStatus] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    checkServerStatus();
    fetchPosts();
  }, [activeServer]);

  const checkServerStatus = async () => {
    const newStatus: { [key: number]: string } = {};
    for (let i = 0; i < servers.length; i++) {
      try {
        const res = await fetch(`${servers[i].url}/api/status`, { method: 'GET' });
        if (res.ok) {
          newStatus[i] = "online";
        } else {
          newStatus[i] = "offline";
        }
      } catch {
        newStatus[i] = "offline";
      }
    }
    setServerStatus(newStatus);
  };

  const currentServer = servers[activeServer];

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${currentServer.url}/api/posts`);
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    await fetch(`${currentServer.url}/api/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author, content }),
    });
    setContent("");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
    fetchPosts();
  };

  const handleDoubleClick = (postId: number) => {
    if (!likedPosts.has(postId)) {
      likePost(postId);
    }
    setShowHeartAnim({ ...showHeartAnim, [postId]: true });
    setTimeout(() => setShowHeartAnim({ ...showHeartAnim, [postId]: false }), 1000);
  };

  const likePost = async (id: number) => {
    setLikedPosts(prev => new Set(prev).add(id));
    await fetch(`${currentServer.url}/api/posts/${id}/like`, { method: "POST" });
    fetchPosts();
  };

  const addComment = async (postId: number) => {
    const commentContent = commentInputs[postId];
    if (!commentContent?.trim()) return;

    await fetch(`${currentServer.url}/api/posts/${postId}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: "訪客", content: commentContent }),
    });
    setCommentInputs({ ...commentInputs, [postId]: "" });
    fetchPosts();
  };

  const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}秒`;
    if (diff < 3600) return `${Math.floor(diff / 60)}分`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}小時`;
    return `${Math.floor(diff / 86400)}天`;
  };

  return (
    <div className="container relative">
      {showSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-bounce flex items-center gap-2">
          <span>✅</span> 發布成功！
        </div>
      )}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
          <div className="w-12 h-12 border-4 border-white/30 border-t-rose-500 rounded-full animate-spin"></div>
        </div>
      )}
      <div className="floating-element float-1">
        <div className="w-8 h-8 bg-white/70 rounded-full blur-[1px]"></div>
      </div>
      <div className="floating-element float-2">
        <div className="w-5 h-5 bg-white/60 rounded-full blur-[1px]"></div>
      </div>
      <div className="floating-element float-3">
        <div className="w-10 h-10 bg-white/75 rounded-full blur-[1px]"></div>
      </div>
      <div className="floating-element float-4">
        <div className="text-3xl text-white/70 animate-pulse">❄️</div>
      </div>
      <div className="floating-element float-5">
        <div className="w-4 h-4 bg-white/55 rounded-full blur-[1px]"></div>
      </div>
      <div className="floating-element float-6">
        <div className="text-2xl text-white/65 animate-pulse">❄️</div>
      </div>
      <div className="floating-element float-7">
        <div className="text-xl text-white/60 animate-pulse">❄️</div>
      </div>
      <div className="py-4 flex flex-col gap-3 px-4 mb-5 bg-gradient-to-r from-sky-500 via-indigo-600 to-cyan-500 rounded-2xl shadow-lg sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">✨</span>
            </div>
            <span className="text-white font-bold text-lg tracking-wide">Discover</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="w-9 h-9 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors relative">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
          </button>
        </div>
        </div>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {servers.map((server, index) => (
            <button
              key={index}
              onClick={() => setActiveServer(index)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeServer === index 
                  ? "bg-white text-indigo-600 shadow-md" 
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {server.name}
              <span className={`ml-1 inline-block w-2 h-2 rounded-full ${
                serverStatus[index] === "online" ? "bg-green-400" : "bg-red-400"
              }`}></span>
            </button>
          ))}
        </div>
      </div>

      <div className="story-section bg-white/60 backdrop-blur-sm rounded-2xl p-3 mb-5 shadow-sm">
        {stories.map((story, index) => (
          <div key={index} className="story-item group">
            <div className={`story-ring rounded-full p-[3px] ${index === 0 ? '' : 'group-hover:scale-110 transition-transform'}`}>
              {story.isAdd ? (
                <div className={`story-avatar w-14 h-14 rounded-full ${story.color} flex items-center justify-center shadow-md relative`}>
                  <span className="text-white text-xl font-bold">+</span>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className={`story-avatar w-14 h-14 rounded-full ${story.color} flex items-center justify-center shadow-md`}>
                  <span className="text-white text-lg font-bold">{story.name.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            <span className="story-username mt-2">{story.name}</span>
          </div>
        ))}
      </div>

      <div className="create-post-card relative p-5 mb-6 border border-gray-100/50">
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold text-gray-800">建立新貼文</span>
          <button className="text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors">分享</button>
        </div>
        <form onSubmit={createPost} className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-xl">
            <div className={`w-10 h-10 rounded-full ${author ? getRandomColor(author) : 'bg-gradient-to-br from-gray-300 to-gray-400'} flex items-center justify-center shadow-sm`}>
              <span className="text-white font-bold">{author ? author.charAt(0).toUpperCase() : "👤"}</span>
            </div>
            <input
              type="text"
              placeholder="暱稱"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="input-ig flex-1 bg-transparent border-0 focus:ring-0"
            />
          </div>
          <textarea
            placeholder="有什麼新鮮事？"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input-ig w-full resize-none min-h-[100px]"
            rows={3}
          />
          <div className="flex gap-3">
            <button type="button" className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              相片
            </button>
            <button type="button" className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              地點
            </button>
          </div>
          <button
            type="submit"
            disabled={!author.trim() || !content.trim()}
            className="btn-primary w-full py-3 rounded-xl"
          >
            發布
          </button>
        </form>
      </div>

      <div className="space-y-5">
        {posts.map((post) => (
          <div key={post.id} className="ig-card">
            <div className="p-4 flex items-center">
              <div className="story-ring rounded-full">
                <div className={`story-avatar w-10 h-10 rounded-full ${getRandomColor(post.author)} flex items-center justify-center shadow-sm`}>
                  <span className="text-white font-bold">{post.author.charAt(0).toUpperCase()}</span>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <span className="font-semibold text-sm">{post.author}</span>
                <span className="ml-2 text-xs text-[#737373]">· {timeAgo(post.createdAt)}</span>
              </div>
              <button className="text-[#737373] hover:text-[#262626] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="1.5"/>
                  <circle cx="12" cy="5.5" r="1.5"/>
                  <circle cx="12" cy="18.5" r="1.5"/>
                </svg>
              </button>
            </div>

            <div className="post-image aspect-square flex items-center justify-center p-6 relative overflow-hidden cursor-pointer" onDoubleClick={() => handleDoubleClick(post.id)}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-orange-50/50"></div>
              <p className="text-center text-gray-700 text-lg whitespace-pre-wrap relative z-10 leading-relaxed font-medium">{post.content}</p>
              {showHeartAnim[post.id] && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-8xl animate-bounce">❤️</span>
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="post-actions">
                <button 
                  onClick={() => likePost(post.id)}
                  className={`like-btn transition-transform hover:scale-125 active:scale-90 ${likedPosts.has(post.id) ? 'liked' : ''}`}
                >
                  <svg fill={likedPosts.has(post.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <button className="hover:scale-110 transition-transform">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
                <button className="hover:scale-110 transition-transform">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
                <button className="ml-auto hover:scale-110 transition-transform">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>

              <p className="likes-count text-base">{post.likes} 個讚</p>

              <div className="caption">
                <span className="text-[#262626]">{post.author}</span> 
                <span className="text-gray-700">{post.content}</span>
              </div>

              {post.comments.length > 0 && (
                <>
                  <p 
                    className="view-comments text-sm"
                    onClick={() => setShowAllComments({ ...showAllComments, [post.id]: !showAllComments[post.id] })}
                  >
                    查看全部 {post.comments.length} 則留言
                  </p>
                  {(showAllComments[post.id] ? post.comments : post.comments.slice(-1)).map((comment) => (
                    <div key={comment.id} className="text-sm mb-2 leading-relaxed">
                      <span className="font-semibold text-[#262626]">{comment.author}</span> 
                      <span className="text-gray-700 ml-1">{comment.content}</span>
                    </div>
                  ))}
                </>
              )}

              <div className="comment-section mt-4">
                <input
                  type="text"
                  placeholder="寫下你的回覆..."
                  value={commentInputs[post.id] || ""}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && addComment(post.id)}
                  className="comment-input"
                />
                <button 
                  onClick={() => addComment(post.id)}
                  disabled={!commentInputs[post.id]?.trim()}
                  className="post-btn ml-2 text-[#0095f6] hover:text-[#0074cc] font-semibold"
                >
                  發送
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg mt-6">
          <div className="text-6xl mb-5 animate-bounce">❄️</div>
          <p className="font-bold text-xl text-[#262626] mb-2">還沒有任何貼文</p>
          <p className="text-[#737373]">開始發布你的第一篇貼文吧！</p>
        </div>
      )}

      <div className="text-center py-8">
        <button 
          onClick={() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 1000); }}
          className="text-sm text-gray-500 hover:text-rose-500 transition-colors flex items-center gap-2 mx-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          載入更多
        </button>
      </div>
    </div>
  );
}
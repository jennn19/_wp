from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel
from datetime import datetime

app = FastAPI(title="Social App API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Comment(BaseModel):
    id: int
    author: str
    content: str

class Post(BaseModel):
    id: int
    author: str
    content: str
    likes: int
    createdAt: str
    comments: List[Comment]

class CreatePost(BaseModel):
    author: str
    content: str

class CreateComment(BaseModel):
    author: str
    content: str

posts = [
    {"id": 1, "author": "alex_", "content": "新專案啟動！🚀", "likes": 56, "createdAt": datetime.now().isoformat(), "comments": []},
    {"id": 2, "author": "kai", "content": "學習 Rust 中... 🦀", "likes": 33, "createdAt": datetime.now().isoformat(), "comments": []},
    {"id": 3, "author": "emma_w", "content": "健身時間 💪", "likes": 29, "createdAt": datetime.now().isoformat(), "comments": []},
]
next_id = 4

@app.get("/")
def root():
    return {"server": "FastAPI", "version": "1.0.0"}

@app.get("/api/status")
def get_status():
    return {"server": "FastAPI (Python)", "version": "1.0.0", "port": 5000}

@app.get("/api/posts")
def get_posts():
    return posts

@app.post("/api/posts")
def create_post(post: CreatePost):
    global next_id
    new_post = {
        "id": next_id,
        "author": post.author,
        "content": post.content,
        "likes": 0,
        "createdAt": datetime.now().isoformat(),
        "comments": []
    }
    next_id += 1
    posts.insert(0, new_post)
    return new_post

@app.post("/api/posts/{post_id}/like")
def like_post(post_id: int):
    for post in posts:
        if post["id"] == post_id:
            post["likes"] += 1
            return {"success": True, "likes": post["likes"]}
    return {"error": "Post not found"}

@app.post("/api/posts/{post_id}/comment")
def add_comment(post_id: int, comment: CreateComment):
    for post in posts:
        if post["id"] == post_id:
            new_comment = {
                "id": len(post["comments"]) + 1,
                "author": comment.author,
                "content": comment.content
            }
            post["comments"].append(new_comment)
            return new_comment
    return {"error": "Post not found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
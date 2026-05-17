use axum::{
    routing::{get, post},
    Router, Json, extract::Path,
};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use chrono::Utc;

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Comment {
    id: u64,
    author: String,
    content: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Post {
    id: u64,
    author: String,
    content: String,
    likes: u64,
    #[serde(rename = "createdAt")]
    created_at: String,
    comments: Vec<Comment>,
}

#[derive(Debug, Deserialize)]
struct CreatePost {
    author: String,
    content: String,
}

#[derive(Debug, Deserialize)]
struct CreateComment {
    author: String,
    content: String,
}

struct AppState {
    posts: Mutex<Vec<Post>>,
    next_id: Mutex<u64>,
}

#[tokio::main]
async fn main() {
    let state = AppState {
        posts: Mutex::new(vec![
            Post {
                id: 1,
                author: "mike_o".to_string(),
                content: "今日目標：學會 Rust！🦀".to_string(),
                likes: 67,
                created_at: Utc::now().to_rfc3339(),
                comments: vec![],
            },
            Post {
                id: 2,
                author: "sophia_".to_string(),
                content: "晚餐時間 🍕".to_string(),
                likes: 41,
                created_at: Utc::now().to_rfc3339(),
                comments: vec![],
            },
            Post {
                id: 3,
                author: "john_dev".to_string(),
                content: "Debug 了一整天 😅".to_string(),
                likes: 23,
                created_at: Utc::now().to_rfc3339(),
                comments: vec![],
            },
        ]),
        next_id: Mutex::new(4),
    };

    let app = Router::new()
        .route("/", get(root))
        .route("/api/status", get(status))
        .route("/api/posts", get(get_posts).post(create_post))
        .route("/api/posts/:id/like", post(like_post))
        .route("/api/posts/:id/comment", post(add_comment))
        .with_state(state);

    let addr = "0.0.0.0:6000".parse().unwrap();
    println!("🚀 Rust server running on http://localhost:6000");

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn root() -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "server": "Rust Axum",
        "version": "1.0.0"
    }))
}

async fn status() -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "server": "Rust (Axum)",
        "version": "1.0.0",
        "port": 6000
    }))
}

async fn get_posts(axum::extract::State(state): axum::extract::State<AppState>) -> Json<Vec<Post>> {
    let posts = state.posts.lock().unwrap().clone();
    Json(posts)
}

async fn create_post(
    axum::extract::State(state): axum::extract::State<AppState>,
    Json(payload): Json<CreatePost>,
) -> Json<Post> {
    let mut next_id = state.next_id.lock().unwrap();
    let new_post = Post {
        id: *next_id,
        author: payload.author,
        content: payload.content,
        likes: 0,
        created_at: Utc::now().to_rfc3339(),
        comments: vec![],
    };
    *next_id += 1;
    
    let mut posts = state.posts.lock().unwrap();
    posts.insert(0, new_post.clone());
    
    Json(new_post)
}

async fn like_post(
    axum::extract::State(state): axum::extract::State<AppState>,
    Path(id): Path<u64>,
) -> Json<serde_json::Value> {
    let mut posts = state.posts.lock().unwrap();
    if let Some(post) = posts.iter_mut().find(|p| p.id == id) {
        post.likes += 1;
        Json(serde_json::json!({ "success": true, "likes": post.likes }))
    } else {
        Json(serde_json::json!({ "error": "Post not found" }))
    }
}

async fn add_comment(
    axum::extract::State(state): axum::extract::State<AppState>,
    Path(id): Path<u64>,
    Json(payload): Json<CreateComment>,
) -> Json<serde_json::Value> {
    let mut posts = state.posts.lock().unwrap();
    if let Some(post) = posts.iter_mut().find(|p| p.id == id) {
        let comment = Comment {
            id: post.comments.len() as u64 + 1,
            author: payload.author,
            content: payload.content,
        };
        post.comments.push(comment.clone());
        Json(serde_json::json!(comment))
    } else {
        Json(serde_json::json!({ "error": "Post not found" }))
    }
}
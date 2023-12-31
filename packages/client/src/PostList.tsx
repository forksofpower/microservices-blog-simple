import React, { useState, useEffect } from "react";
import axios from "axios";
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";
import { Post, Comment } from "@microservice-blog/common";

export const PostList = () => {
  const [posts, setPosts] = useState<
    Record<string, Post & { comments: Comment[] }>
  >({});

  const deletePost = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await axios.delete(`http://my-micro-posts.com/posts/${postId}/delete`);
    }
  };

  const fetchPosts = async () => {
    const res = await axios.get("http://my-micro-posts.com/posts");
    console.log(res.data);
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderedPosts = Object.values(posts).map((post) => (
    <div
      className="card"
      style={{ width: "30%", marginBottom: "20px" }}
      key={post.id}
    >
      <div className="card-body">
        <h3>{post.title}</h3>
        {post.comments && (
          <CommentList postId={post.id} comments={post.comments} />
        )}
        <CommentCreate postId={post.id} />
        <div
          style={{ cursor: "pointer", color: "red" }}
          onClick={() => deletePost(post.id)}
        >
          <small>delete</small>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="d-flex flex-row flex-wrap justify-content-between">
      {renderedPosts}
    </div>
  );
};

export default PostList;

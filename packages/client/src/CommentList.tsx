import React from "react";
import axios from "axios";
import { TiDeleteOutline } from "react-icons/ti";
import { Comment } from "@microservice-blog/common";

interface Props {
  postId: string;
  comments: Array<Comment>;
}

const CommentList: React.FC<Props> = ({ postId, comments = [] }) => {
  const deleteComment = async (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      await axios.delete(
        `http://my-micro-posts.com/posts/${postId}/comments/${commentId}`,
      );
    }
  };

  const renderedComments = comments.map((comment) => {
    return (
      comment.status !== "rejected" && (
        <li key={comment.id}>
          {comment.content}{" "}
          <TiDeleteOutline
            style={{ cursor: "pointer", color: "red" }}
            onClick={() => deleteComment(comment.id)}
          />
        </li>
      )
    );
  });
  return <ul>{renderedComments}</ul>;
};

export default CommentList;

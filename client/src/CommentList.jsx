import React from "react";
import axios from "axios";
import { TiDeleteOutline } from "react-icons/ti";
const CommentList = ({ postId, comments = [] }) => {
  const deleteComment = async (commentId, postId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      await axios.delete(
        `http://localhost:4001/posts/${postId}/comments/${commentId}`,
      );
    }
  };

  const renderedComments = comments.map((comment) => {
    return (
      <li key={comment.id}>
        {comment.content}{" "}
        <TiDeleteOutline
          style={{ cursor: "pointer", color: "red" }}
          onClick={() => deleteComment(comment.id, postId)}
        />
      </li>
    );
  });
  return <ul>{renderedComments}</ul>;
};

export default CommentList;

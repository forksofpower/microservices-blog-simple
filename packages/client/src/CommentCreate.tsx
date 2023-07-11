import React, { FormEvent, useState } from "react";
import axios from "axios";
import { getServiceUrl } from "./utils";
import { Services, Post } from "@microservice-blog/common";

const CommentCreate: React.FC<{ postId: Post["id"] }> = ({ postId }) => {
  const [content, setContent] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await axios.post(
      `${getServiceUrl(Services.Comments)}/posts/${postId}/comments`,
      {
        content,
      }
    );
    setContent("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>New Comment</label>
          <input
            type="text"
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default CommentCreate;

import React, { useState } from "react";
import axios from "axios";

const PostCreate = (props) => {
  const [title, setTitle] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post("http://localhost:4000/posts", { title });
      setTitle("");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          className="form-control"
        />
      </div>
      <button className="btn btn-primary">Sumbit</button>
    </form>
  );
};

export default PostCreate;

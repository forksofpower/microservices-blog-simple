export * from "./services";
export * as config from "./config";

export type PostAction = "Created" | "Deleted";
export type PostEvent = `Post${PostAction}`;

export type CommentAction = "Created" | "Moderated" | "Updated" | "Deleted";
export type CommentEvent = `Comment${CommentAction}`;

export type Post = {
  id: string;
  title: string;
};

export type Comment = {
  id: string;
  postId: Post["id"];
  content: string;
  status: ModerationStatus;
};

export type ModerationStatus = "pending" | "accepted" | "rejected";

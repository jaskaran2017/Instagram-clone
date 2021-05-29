import React, { useState, useEffect } from "react";
import "./Post.css";
import { Avatar, Button } from "@material-ui/core";
import { db } from "../Firebase";
import firebase from "firebase";
///////////////////
function Post({ postId, user, username, caption, imageUrl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (e) => {
    e.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  return (
    <div className="post">
      {/* header--> avatar + usename */}
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt={username}
          src="/static/images/avatar/1.jpg"
        />
        <h3>{username}</h3>
      </div>
      {/* image*/}
      <img className="post__img" src={imageUrl} alt="avatar" />
      {/* username + caption*/}
      <h4 className="post__text">
        <strong>{username}:</strong> {caption}
      </h4>
      <div className="post_comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}</strong>:-
            {comment.text}
          </p>
        ))}
      </div>
      {user && (
        <form className="post_commentBox">
          <input
            className="post_input"
            type="text"
            value={comment}
            palceholder="Add a comment"
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            clasName="post_button"
            color="primary"
            type="submit"
            disabled={!comment}
            onClick={postComment}
          >
            Post
          </Button>
        </form>
      )}
    </div>
  );
}

export default Post;

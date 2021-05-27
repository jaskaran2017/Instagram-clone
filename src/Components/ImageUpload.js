import React, { useState } from "react";
import { Input, Button } from "@material-ui/core";
import "./ImageUpload.css";
import firebase from "firebase";
import { db, storage } from "../Firebase";

///////////////////////////////////

function ImageUpload({ username }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  /////////////////////////////////

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  //////////////////////////////////
  const handleUpload = (e) => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    //this line means "go to firebase storage, reffer to image folder and take the selected image then .put means place the image here."
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // this code down will show the progress bar
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // entertaining any error here
        console.log(error);
        alert(error.message);
      },
      () => {
        //complete function
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            //post image into db
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username, // here username will come from App.js asprops.
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };
  return (
    <div className="image__upload">
      <progress className="progressBar" value={progress} max="100" />
      <Input
        type="text"
        value={caption}
        placeholder="Enter a Caption..."
        onChange={(e) => setCaption(e.target.value)}
      />
      <Input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>UPLOAD</Button>
    </div>
  );
}

export default ImageUpload;

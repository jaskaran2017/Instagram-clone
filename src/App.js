import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Components/Post";
// import firebase from "firebase"
import { db, auth } from "./Firebase";
import { makeStyles } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./Components/ImageUpload";

///////////////////////////
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const Unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //if the user is already logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        //if user logged out
        setUser(null);
      }
    });
    return () => {
      Unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      });
  }, []);
  /////////////////////////////
  const signin = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  };
  /////////////////////////////
  const signup = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        //here we will update username after login
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };
////////////////////////////////////////

  return (
    <div className="App">
      {/*now will check by optional chaining that if the user is present/loggedin
      or not present using "?" then our app will allow or denie the upload
      request accordingly.*/}

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry you need to LOGIN to upload</h3>
      )}
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app_headerLogo"
                src="https://th.bing.com/th/id/OIF.GiknaeXS1LPtIpVtwjNVnw?w=100&h=30&c=7&o=5&pid=1.7"
                alt="LOGO"
              />
            </center>

            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signin}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app_headerLogo"
                src="https://th.bing.com/th/id/OIF.GiknaeXS1LPtIpVtwjNVnw?w=100&h=30&c=7&o=5&pid=1.7"
                alt="LOGO"
              />
            </center>
            <Input
              placeholder="User Name"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signup}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>
      <div className="app_header">
        {/* header */}
        <img
          className="app_headerLogo"
          src="https://th.bing.com/th/id/OIF.GiknaeXS1LPtIpVtwjNVnw?w=100&h=30&c=7&o=5&pid=1.7"
          alt="LOGO"
        />
      </div>
      {user ? (
        <Button onClick={() => auth.signOut()}>LOGOUT</Button>
      ) : (
        <div className="loginContaainer">
          <Button onClick={() => setOpenSignIn(true)}>SIGNIN</Button>
          <Button onClick={() => setOpen(true)}>SIGNUP</Button>
        </div>
      )}
      <h1>Hello Instagram 🛰️ </h1>
      {/* posts */}
      {posts.map(({ id, post }) => (
        <Post
          key={id}
          username={post.username}
          caption={post.caption}
          imageUrl={post.imageUrl}
        />
      ))}
      {/* posts */}
    </div>
  );
}

export default App;

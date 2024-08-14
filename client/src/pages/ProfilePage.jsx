import React from "react";

function ProfilePage(user) {
  return <>
  <h1>your profile</h1>;
  <p>name: {user.name}</p>;
  <p>email: {user.email}</p>;
  
  </>
}

export default ProfilePage;

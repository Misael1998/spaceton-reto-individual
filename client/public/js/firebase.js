var db;
document.addEventListener("DOMContentLoaded", () => {
  try {
    db = firebase.firestore();
  } catch (err) {
    console.log(err);
  }
});

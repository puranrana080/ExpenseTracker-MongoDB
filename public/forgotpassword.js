function forgotPassword(event) {
  event.preventDefault();
  const email = event.target.email.value;

  axios
    .post("http://localhost:3000/password/forgotpassword", { email: email })
    .then((result) => {
      console.log(result.data.message);
      event.target.reset();
      const body = document.querySelector("body");
      body.innerHTML =
        'Use the link send in Email for Password update and then<a href="/login.html"> Login</a>';
    })
    .catch((err) => {
      console.log(err);
      const body = document.querySelector("body");
      body.innerHTML += "User not found, something went wrong";
    });
}

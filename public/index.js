function registeringUser(event) {
  event.preventDefault();
  const newUser = {
    name: event.target.name.value,
    email: event.target.email.value,
    password: event.target.password.value,
  };

  axios
    .post("http://localhost:3000/user/register", newUser)
    .then((response) => {
      console.log("User Added Successfully", response.data.message);
      event.target.reset();
    })
    .catch((err) => {
      const p = document.querySelector("#message");
      p.innerHTML = err.response.data.message;

      console.log("something is wrong", err);
    });
}

function loginUser(event) {
  event.preventDefault();
  const loginData = {
    email: event.target.email.value,
    password: event.target.password.value,
  };
  axios
    .post("http://localhost:3000/user/login", loginData)
    .then((response) => {
      alert("Login successful");
      console.log("User Logged in", response.data.message);

      localStorage.setItem("token", response.data.token);
      window.location.href = "/expense";
    })
    .catch((err) => {
      const p = document.querySelector("#message");
      p.innerHTML = "User Not found";

      console.log("Error in server", err);
    });
}

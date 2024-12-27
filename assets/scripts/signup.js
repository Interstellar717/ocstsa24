var url, redirect;
var username, password;

window.onload = () => {
  url = new URL(window.location);
  redirect = url.searchParams.get('redirect');
};

document.querySelector('#signup-form').onsubmit = e => {
  e.preventDefault(); //to stop the STUPID REFRESHING

  localStorage.setItem('loggedin', '');
  localStorage.removeItem('loggedin');

  username = document.querySelector('#username').value;
  password = document.querySelector('#password').value;

  var logins;
  addCredentials(username, password);

};


qs('#signup-form').onsubmit = e => {
  e.preventDefault(); //to stop the STUPID REFRESHING

  sessionStorage.setItem('loggedin', '');
  sessionStorage.removeItem('loggedin');

  username = qs('#username_signup').value;
  password = qs('#password_signup').value;

  var logins;
  addCredentials(username, password);

};

qs('#signup-form-container').click(); //to fix saved password font
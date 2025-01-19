var url, redirect;
var username, password;

url = new URL(window.location);
redirect = url.searchParams.get('redirect');

qs('#guest').addEventListener('click', guest); //to solve onclick attr problem with extensions



qs('#login-form').onsubmit = e => {
  e.preventDefault(); //to stop the STUPID REFRESHING

  sessionStorage.setItem('loggedin', '');
  sessionStorage.removeItem('loggedin');

  username = qs('#username_login').value;
  password = qs('#password_login').value;

  var logins;
  fetchNcheck(username, password, 'assets/ad83rdk.json');

};

qs('#login-form-container').click(); //to fix saved password font
async function fetchNcheck(u, p, file) {
  let x = await fetch(file);
  let y = await x.json();
  checkInfo(u, p, await y);
}
function checkInfo(u, p, logins) {
  console.log(logins);
  for (let [key, val] of Object.entries(logins)) {
    var k = key,
      v = val;
    for (let i of new Array(7)) k = atob(k);
    for (let i of new Array(7)) v = atob(v);

    console.log(k, v);

    if (username == k && password == v) {
      window.location = redirect ? `/${redirect}` : '/';
      window.localStorage.setItem('username', key);
      window.localStorage.setItem('password', val);
      window.localStorage.setItem('loggedin', true);
      break;
    } else alert(`${username} is not equal to ${k}`);
  }
  if (!localStorage.loggedin) {
    alert('Invalid username or password');
    window.location.href = '/login.html';
  }
}

if (localStorage.loggedin == 'true') {
}

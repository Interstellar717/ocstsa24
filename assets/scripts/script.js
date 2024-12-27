const touchscreen = (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0));

//login functionality

async function fetchNcheck(u, p, file, check = true) {
  let x = await fetch(file);
  let y = { ...await x.json(), ...JSON.parse(localStorage.getItem('new_logins') || "{}") };
  if (check) {
    checkInfo(u, p, await y);
  } else return await y;
}
function checkInfo(u, p, logins) {

  for (let [key, val] of Object.entries(logins)) {
    var k = key,
      v = val;

    k = decode(k);
    v = decode(v);

    console.log(k, v);

    if (u == k && p == v) {
      window.location = redirect ? `/${redirect}` : '/index.html';
      window.localStorage.setItem('username', key);
      window.localStorage.setItem('password', val);
      window.localStorage.setItem('loggedin', true);
      break;
    }// else alert(`${username} is not equal to ${k}`); //this was for testing purposes
  }
  if (!localStorage.loggedin) {
    alert('Invalid username or password');
    window.location.href = '/login.html';
  }
}

const encode = i => { return btoa(btoa(btoa(btoa(btoa(btoa(btoa(i))))))) };
const decode = i => { return atob(atob(atob(atob(atob(atob(atob(i))))))) };

//logo click functionality
document.querySelector('#go-home').addEventListener('click', () => window.location = 'index.html');

//sign up functionality
async function addCredentials(u, p) {
  var new_logins = JSON.parse(localStorage.getItem("new_logins") || "{}");
  var all_logins = await fetchNcheck(u, p, "/assets/ad83rdk.json", false);
  if (!(await all_logins[encode(u)])) {
    new_logins[encode(u)] = encode(p);
  }

  localStorage.setItem("new_logins", JSON.stringify(new_logins));
  window.location = "/login.html";
}

function stars(rating) {
  var result = "";
  for (let i = 0.5; i <= rating; i += 0.5) {
    if (i % 1 == 0) { // if i is on a .0 
      result += `<img class="star" src="/img/full_star.png" draggable="false" alt="star ">`;
    }
    else { // if i is on a .5
      if (rating == i) {
        result += `<img class="star" src="/img/half_star.png" draggable="false" alt="half star ">`;
      }
    }
  }
  return result
}

function diet_labels(diets, name) {
  var result = "";
  var key = { "V": "Standard Vegetarian", "OV": "Ovo-Vegetarian", "LV": "Lacto-Vegetarian", "V+": "Vegan" }
  for (let diet of diets) {
    if (key[diet]) {
      result += `<span title="${key[diet]}" class="diet ${diet.replace('+', 'P')}">${!touchscreen ? diet : key[diet]}</span>` + '&nbsp;'
    }
    else console.warn(`Warning: undefined diet '${diet}' at meal '${name}'`);
  }
  return result
}

function price_format(n) {

  var input = n.toString(),
    changed,
    z = (n) => { var res = ''; for (let i of new Array(n)) res += "0"; return res };


  var no_dec = input.split('.').join('');
  if (no_dec.length < 3) { //if number, without decimal points, has under 3 characters
    changed = input + z(3 - no_dec.length) //add zeroes
  } else changed = input

  if (changed.split('.').length <= 1) { //if isn't already decimal
    changed = changed.split('');
    changed.splice(changed.length - 2, 0, ".");
    changed = changed.join('');
  }
  changed = "$" + changed; //add unit


  return changed;
}
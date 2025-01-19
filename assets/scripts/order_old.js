const select = meal_dropdowns(0);
var meals = [];

if (sessionStorage.meals) {
    meals = JSON.parse(sessionStorage.meals);
    for (let i = 0; i < meals.length - 1; i++) add_item(false);
}

var url, data;
url = new URL(window.location);
data = url.searchParams.get('m');

if (data || sessionStorage.getItem('checkoutScreenSlideUp')) {
    // data = JSON.parse(data);
    if (data && !sessionStorage.getItem('checkoutScreenSlideUp')) {
        slide_down('#checkout-menu');
        qs('.background-logo').style.top = "10%";
    } // styling ^ if checkout enabled


    qs('#checkout-price').innerHTML = `<div style="font-size: 20px; margin-bottom: auto;">Total Cost: </div>${price_format(data)}`;
    var remove_duplicates = [];
    for (let i of meals) {
        let meal_price = menu[Object.keys(menu)[i]].price;

        if (!remove_duplicates[i]) {
            remove_duplicates[i] = [1, meal_price];
        } else {
            remove_duplicates[i][0]++;
            remove_duplicates[i][1] += meal_price;
        }
    }

    let html = ``;
    for (let [k, v] of Object.entries(remove_duplicates)) {

        html += `<tr><td>${Object.keys(menu)[k]}</td> <td>x${v[0]}</td> <td>${price_format(v[1])}</td> </tr>`;
    }
    qs('#checkout-items tbody').innerHTML = html;

    if (!data && sessionStorage.getItem('checkoutScreenSlideUp')) {

        slide_up('#checkout-menu');

        qs('.background-logo').style.top = "10%";
        setTimeout(() => {
            qs('html').style.overflowY = "auto";
        }, 2000);

        sessionStorage.removeItem('checkoutScreenSlideUp');

        //HELLO THERE BOZO. THE BKG LOGO IS STILL GLITCHING. FIX IT.

    } // styling ^ if closing checkout
}


function slide_down(q) {
    qs(q).style.display = "";
    qs(q).style.animation = "slide-in-top 0.75s";
    qs('.content').style.setProperty('animation', 'fade-blur 2s');
    qs('#nav').style.setProperty('animation', 'fade-blur 2s');

    disable();

    setTimeout(() => {
        qs('.content').style.setProperty('--blur', '2px');
        qs('#nav').style.setProperty('--blur', '2px');
    }, 2000); //to make blur permanent
}

function slide_up(q) {
    qs(q).style.display = "";
    qs(q).style.animation = "slide-out-top 0.75s";

    qs('.content').style.setProperty('animation', 'fade-out-blur 2s');
    qs('#nav').style.setProperty('animation', 'fade-out-blur 2s');

    setTimeout(() => {
        qs(q).style.display = "none";
    }, 750 - 1);

    setTimeout(() => {
        qs('.content').style.setProperty('--blur', '0px');
        qs('#nav').style.setProperty('--blur', '0px');
    }, 2000);
}

function disable() {
    for (let i of Array.from(qsa('.content'))) i.classList.add('disabled');
    for (let i of Array.from(qsa('nav'))) i.classList.add('disabled');
}

function enable() {
    for (let i of Array.from(qsa('.content'))) i.classList.remove('disabled');
    for (let i of Array.from(qsa('nav'))) i.classList.remove('disabled');
}

function select_listener_apply() {
    for (let i of qsa('.meal-select')) {
        i.addEventListener('click', (e) => {
            select_listener_func(i, e);
        });
    }
}

function select_listener_func(i, event, is_click = (event ? event.isTrusted : true)) { //isTrusted check for falsifying .click() 

    if (i.selectedIndex === -1) {
        i.selectedIndex = 0;
    }

    var o = i.querySelectorAll('option')[i.selectedIndex].textContent; //the value of the selected option
    
    var index = Array.from(qsa('.meal-select')).indexOf(i); //the number in order of the meal

    meals[index] = i.selectedIndex; //change list at index of meal to title of meal
    sessionStorage.setItem('meals', `[${meals}]`); //set meals to the list of meals


    //set info values
    i.parentElement.parentElement.querySelector('.meal-price').innerHTML = `${price_format(menu[o].price)}`;
    i.parentElement.parentElement.querySelector('.meal-diets').innerHTML = `${diet_labels(menu[o].diets)}`;
    i.parentElement.parentElement.querySelector('.meal-desc').innerHTML = `${desc_format(menu[o].desc)}`;

    set_total_price();

    if (!is_click) return; //end func if not click
    
    //focus on slide-down meal select menu
    slide_down('#meal-select-menu');
  
    i.blur();
    disable();
    qs('.background-logo').style.top = "10%";

    qs('#meal-select-menu-container').innerHTML += ""; //to reset all Event Listeners, indirectly

    for (let j of qsa('#meal-select-menu-container button')) {
        j.addEventListener('click', btn_event => {
            var btn = btn_event.target;

            i.selectedIndex = Object.keys(menu).indexOf(btn.textContent || ""); //select correct option
            
            select_listener_func(i, null, false); //update info

            slide_up('#meal-select-menu'); //get rid of popup
            enable(); //enable pointer events
        })
    }

}

select_listener_func(qs('.meal-select'), null, false); //false to prevent from 
select_listener_apply();



function add_item(is_click = true) {
    const meals_temp = meals.slice();

    const htmlString = `<table class="meal-info"> <tbody> <tr> <td>${select.outerHTML}</td> <td><span class="meal-price"></span></td> <td><span class="meal-diets"></span></td> <td><span class="meal-desc"></span></td> </tr> </tbody> </table>`;

    qs('.meal-list').innerHTML += htmlString;

    for (let i = 0; i < qsa('.meal-select').length; i++) {
        if (qsa('.meal-select')[i].innerHTML == "") {
            meal_dropdowns(i)
        }
        select_listener_apply();

        qsa('select.meal-select')[i].selectedIndex = meals_temp[i]; // to keep selected meals

        qsa('select.meal-select')[i].click(); // to display info

        set_total_price();

    }

    select_listener_func(qsa('.meal-select')[qsa('.meal-select').length - 1], null, is_click);
}

function set_total_price() {
    var total_price = 0;
    for (let i in Array.from(qsa('table.meal-info'))) {
        let x = qsa('table.meal-info .meal-price')[i].textContent.split('$')[1];

        total_price += parseFloat(x);
    }
    var t = price_format(Math.round(total_price * 100) / 100);
    qs('.price').textContent = t;

    return t
}

function checkout() {
    var t = set_total_price();
    sessionStorage.setItem('checkout', meals);
    window.location.href += `?m=${t.split('$')[1]}`;
}

qs('#add-item').addEventListener('click', add_item);
qs('#checkout').addEventListener('click', checkout);
qs('#clear-order').addEventListener('click', () => {
    confirm('Are you sure?') &&
        (sessionStorage.removeItem('meals'),
            window.location.href = window.location.href)
});

qs('a#checkout-exit').addEventListener('click', () => {
    sessionStorage.setItem('checkoutScreenSlideUp', true);
})

for (let i of Object.keys(menu)) {
    qs('#meal-select-menu-container').innerHTML += `<button class="gray-btn hover-change" style="width: 80%;">${i != "" ? i : "&nbsp;&nbsp;&nbsp;"}</button><br>`;
}
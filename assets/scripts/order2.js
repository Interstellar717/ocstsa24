const select = meal_dropdowns(0);
var meals = [];

if (sessionStorage.meals) {
    meals = JSON.parse(sessionStorage.meals);
    meals.splice(meals.indexOf(0), 1);
    for (let i = 0; i < meals.length - 1; i++) {
        add_item(false);
    }
}


function slide_down(q) {
    qs(q).style.display = "";
    qs(q).style.animation = "slide-in-top 0.75s";
    qs('.content').style.setProperty('animation', 'fade-blur 2s');
    qs('#nav').style.setProperty('animation', 'fade-blur 2s');
    qs(q).style.setProperty('border-bottom-right-radius', '20px');
    qs(q).style.setProperty('border-bottom-left-radius', '20px');

    disable();

    setTimeout(() => {
        qs(q).style.setProperty('border-bottom-right-radius', '0px');
        qs(q).style.setProperty('border-bottom-left-radius', '0px');
    }, 750 - 5);

    setTimeout(() => {
        qs('.content').style.setProperty('--blur', '2px');
        qs('#nav').style.setProperty('--blur', '2px');
    }, 2000 - 5); //to make blur permanent
}

function slide_up(q) {
    qs(q).style.display = "";
    qs(q).style.animation = "slide-out-top 0.75s";

    qs('.content').style.setProperty('animation', 'fade-out-blur 2s');
    qs('#nav').style.setProperty('animation', 'fade-out-blur 2s');

    qs(q).style.setProperty('border-bottom-right-radius', '20px');
    qs(q).style.setProperty('border-bottom-left-radius', '20px');


    enable();

    setTimeout(() => {
        qs(q).style.display = "none";
        qs(q).style.setProperty('border-bottom-right-radius', '0px');
        qs(q).style.setProperty('border-bottom-left-radius', '0px');
    }, 750 - 5);

    setTimeout(() => {
        qs('.content').style.setProperty('--blur', '0px');
        qs('#nav').style.setProperty('--blur', '0px');
    }, 2000 - 5);
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


    i.parentElement.parentElement.querySelector('.meal-price').innerHTML = `${price_format(find_in_menu(o).price)}`;
    i.parentElement.parentElement.querySelector('.meal-diets').innerHTML = `${diet_labels(find_in_menu(o).diets)}`;
    i.parentElement.parentElement.querySelector('.meal-desc').innerHTML = `${desc_format(find_in_menu(o).desc)}`;

    set_total_price();

    if (!is_click) return; //end func if not click

    //focus on slide-down meal select menu
    slide_down('#meal-select-menu');

    i.blur();
    disable();
    qs('.background-logo').style.top = "10%";

    qs('#meal-select-menu-container').innerHTML += ""; //to reset all Event Listeners, indirectly

    for (let j of qsa('#meal-select-menu-container button.meal-option-btn')) {
        j.addEventListener('click', btn_event => {
            var btn = btn_event.target;

            for (let op of Array.from(i.querySelectorAll('option'))) { //search for match in select tag
                if (op.textContent == btn.textContent) {
                    i.selectedIndex = Array.from(i.querySelectorAll('option')).indexOf(op) //then display
                }
            }

            select_listener_func(i, null, false); //update info

            slide_up('#meal-select-menu'); //get rid of popup
            enable(); //enable pointer events
        })
    }
    for (let j of qsa('#meal-select-menu-container div.tab')) {
        j.addEventListener('click', btn_event => {
            switch_tab(btn_event.target.textContent.replace('é', 'e').toLowerCase());
            console.log(btn_event.target.textContent.replace('é', 'e').toLowerCase());
        });
    }

    qs('#close-meal-select-menu').addEventListener('click', () => {
        select_listener_func(i, null, false); //update info
        slide_up('#meal-select-menu'); //get rid of popup
        enable(); //enable pointer events
    })

    /* if (qsa('.meal-select').length > 1) {
        for (let i of qsa('.meal-select')) {
            if (i.selectedIndex === 0) {
                delete i.parentElement.parentElement
            }
        }
    } */

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
    set_total_price();
    sessionStorage.setItem('checkout', meals);
    set_checkout_info();
    slide_down('#checkout-menu');
    qs('.background-logo').style.top = "10%";
}

function set_checkout_info() {
    qs('#checkout-price').innerHTML = `<div style="font-size: 20px; margin-bottom: auto;">Total Cost: </div>${price_format(qs('span.price').textContent.split('$')[1])}`;
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
    qs('#checkout-exit').addEventListener('click', checkout_exit)
}

function checkout_exit() {
    slide_up('#checkout-menu');

    qs('.background-logo').style.top = "10%";
    setTimeout(() => {
        qs('html').style.overflowY = "auto";
    }, 2000);
}

qs('#add-item').addEventListener('click', add_item);
qs('#checkout').addEventListener('click', checkout);
qs('#clear-order').addEventListener('click', () => {
    confirm('Are you sure?') &&
        (sessionStorage.removeItem('meals'),
            window.location.href = window.location.href)
});


//meal select popup container content

for (let [k, v] of Object.entries(menu)) {
    var form_k = k.toLowerCase().split(':')[0].split('é').join('e');

    // qs('#meal-select-menu-container').innerHTML += `<h2>${k != "" ? k : "&nbsp;&nbsp;&nbsp;"}</h2>`;
    form_k && (qs('.tab-bar').innerHTML += `<div class="tab ${form_k}"><button class="gray-btn hover-change">${k.split(':')[0]}</button></div>`);
    form_k && (qs('#meal-select-menu-container').innerHTML += `<div class="tab-content ${form_k.toLowerCase()}"></div>`);

    for (let [k2, v2] of Object.entries(v)) {
        // qs('#meal-select-menu-container').innerHTML += `<button class="gray-btn hover-change" style="width: 80%;">${k2 != "" ? k2 : "&nbsp;&nbsp;&nbsp;"}</button><br>`;
        qs(`#meal-select-menu-container .tab-content.${form_k.toLowerCase()}`).innerHTML += `<button class="meal-option-btn gray-btn hover-change" >${k2 != "" ? k2 : "&nbsp;&nbsp;&nbsp;"}</button><br>`;
    }
}


function switch_tab(tab_name) {
    for (let i of ["entrees", "sides", "drinks", "desserts"]) {
        qs(`.tab-content.${i}`).style.display = (i == tab_name ? "flex" : "none");
    }
}
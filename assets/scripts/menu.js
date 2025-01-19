var html = "";

for (let [category, meals_in_category] of Object.entries(menu)) {

    if (category) {
        html += `<tr><td id="${((category[0] + category[1]).toLowerCase())}-container"><h2 class="menu-header" id="${(category[0] + category[1]).toLowerCase()}">${category}</h2></td><td></td><td></td><td></td><td></td></tr>`;
        for (let [name, data] of Object.entries(meals_in_category)) {

            data.price = price_format(data.price);
            data.diets = diet_labels(data.diets, category);
            data.rating = stars(data.rating);
            data.desc = desc_format(data.desc);


            /* 
                <button class="order-q-add gray-btn hover-change">+</button>
                <input class="order-q" type="number" value="0" min="0" max="99">
            */

            html += `<tr>
                    <td class="item-name">${name}
                        <div class="order-q-container">
                            <label class="container">
                                <input type="checkbox" class="order-check">
                                <span class="order-check-style checkmark"></span>
                            </label>
                        </div>

                    </td>
                    <td class="item-desc">${data.desc}</td>
                    <td class="item-diets">${data.diets}</td>
                    <td class="item-rating">${data.rating}</td>
                    <td class="item-price">${data.price}</td>
                </tr>`;
        }
    }



}

qs('#menu tbody').innerHTML += html;



for (let i of Array.from(qsa(".order-q-container"))) {

    /* i.querySelector('.order-q-add').addEventListener('click', (e) => {
         e.target.style.display = "none";
         i.querySelector('.order-q').style.display = "block";
     })
 
     function orderQChange(e) {
         if (e.target.value == 0) {
             e.target.style.display = "none";
             i.querySelector('.order-q-add').style.display = "block";
         }
         
         var meals = JSON.parse(sessionStorage.getItem('meals') || '[]');
         var index = Array.from(qsa('#menu tr')).indexOf(e.target.parentElement.parentElement.parentElement);
         console.log(index);
 
     }
 
     i.querySelector('.order-q').addEventListener('click', orderQChange);
     i.querySelector('.order-q').addEventListener('change', orderQChange);
     i.querySelector('.order-q').addEventListener('keyup', orderQChange); */

    i.querySelector('.order-check').addEventListener('click', (e) => {
        var checked = e.target.checked;
        var meals = JSON.parse(sessionStorage.getItem('meals') || '[0]');
        // + 1 bc of blank option on order page :/ --->
        var index = Array.from(qsa('#menu tr')).indexOf(e.target.parentElement.parentElement.parentElement.parentElement) + 1;

        if (checked) {
            meals.push(index);
        } else {
            meals.splice(meals.indexOf(index), 1);
        }

        sessionStorage.setItem('meals', JSON.stringify(meals));
    })
}
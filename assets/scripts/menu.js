const menu = {
    "Example" : {
        price: 4.7,
        diets: ["V+", "OV"],
        rating: 4.5,
        desc: "This is a filler description"
    }
};
var html = "";

for (let [name, data] of Object.entries(menu)) {
    

    data.price = price_format(data.price);
    data.diets = diet_labels(data.diets, name);
    data.rating = stars(data.rating);

    html += `<tr>
                <td class="item-name">${name}</td>
                <td class="item-price">${data.price}</td>
                <td class="item-diets">${data.diets}</td>
                <td class="item-rating">${data.rating}</td>
                <td class="item-desc">${data.desc}</td>
            </tr>`;
    document.querySelector('tbody').innerHTML += html;
}
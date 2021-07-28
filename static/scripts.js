/* 
  WEB322 Assignment 2
  Name: Omar Khan
  Student Number: 132197203
  Email: okhan27@myseneca.ca
  Section NCC
  Date: 29/06/2021
  Live demo: https://web322-a2-omar-khan.herokuapp.com/
  github repo: https://github.com/lowsound42/web322a2
  All the work in the project is my own except for stock photos, icons, and bootstrap files included
*/
function viewPlans() {
    fetch('/planData')
        .then((response) => response.json())
        .then((data) => {
            let container = document.getElementById('planContainer');
            container.innerHTML = '';
            data.forEach((element) => {
                console.log(element);
                let title = document.createTextNode(element.title);
                let description = document.createTextNode(element.description);
                let price = document.createTextNode(element.price);
                let outerDiv = document.createElement('div');
                let innerDiv = document.createElement('div');
                let header = document.createElement('h5');
                let p1 = document.createElement('p');
                let p2 = document.createElement('p');
                let uList = document.createElement('ul');
                uList.classList.add('list-group');
                outerDiv.classList.add('col-lg');
                outerDiv.classList.add('card');
                outerDiv.classList.add('card-body-special');
                outerDiv.setAttribute('id', 'card');
                header.classList.add('card-body');
                p1.classList.add('card-text');
                p2.classList.add('card-text');
                header.classList.add('card-title');
                outerDiv.appendChild(innerDiv);
                innerDiv.appendChild(header);
                innerDiv.appendChild(p1);
                innerDiv.appendChild(p2);
                innerDiv.appendChild(uList);
                element.items.forEach((item) => {
                    let listItem = document.createElement('li');
                    listItem.classList.add('list-group-item');
                    let listItemText = document.createTextNode(item);
                    listItem.appendChild(listItemText);
                    uList.appendChild(listItem);
                });
                header.appendChild(title);
                p1.appendChild(description);
                p2.appendChild(price);
                container.appendChild(outerDiv);
            });
        });
}

function planForm() {
    console.log('Test');
    let container = document.getElementById('planContainer');
    container.innerHTML = '';
    let formContainer = document.createElement('form');
    formContainer.setAttribute('onSubmit', 'submitForm(event); return false;');
    formContainer.classList.add('centerBox');
    let titleDiv = document.createElement('div');
    let titleDivInner = document.createElement('div');
    let descriptionDiv = document.createElement('div');
    let descriptionDivInner = document.createElement('div');
    let priceDiv = document.createElement('div');
    let priceDivInner = document.createElement('div');
    let itemsDiv = document.createElement('div');
    let itemsDivInner = document.createElement('div');
    let titleLabel = document.createElement('label');
    let titleInput = document.createElement('input');
    let descriptionLabel = document.createElement('label');
    let descriptionInput = document.createElement('input');
    let priceLabel = document.createElement('label');
    let priceInput = document.createElement('input');
    let itemsLabel = document.createElement('label');
    let itemsInput = document.createElement('input');
    let submitButton = document.createElement('input');
    submitButton.setAttribute('type', 'submit');
    titleDiv.classList.add('row');
    titleDivInner.classList.add('col-lg-12');
    titleDivInner.classList.add('form-group');
    titleLabel.setAttribute('for', 'title');
    titleInput.setAttribute('name', 'title');
    titleInput.classList.add('form-control');
    titleInput.setAttribute('type', 'text');
    titleLabel.innerHTML = 'Title';
    descriptionDiv.classList.add('row');
    descriptionDivInner.classList.add('col-lg-12');
    descriptionDivInner.classList.add('form-group');
    descriptionLabel.setAttribute('for', 'title');
    descriptionInput.setAttribute('name', 'title');
    descriptionInput.classList.add('form-control');
    descriptionInput.setAttribute('type', 'text');
    descriptionLabel.innerHTML = 'Description';
    priceDiv.classList.add('row');
    priceDivInner.classList.add('col-lg-12');
    priceDivInner.classList.add('form-group');
    priceLabel.setAttribute('for', 'title');
    priceInput.setAttribute('name', 'title');
    priceInput.classList.add('form-control');
    priceInput.setAttribute('type', 'number');
    priceLabel.innerHTML = 'Price';
    itemsDiv.classList.add('row');
    itemsDivInner.classList.add('col-lg-12');
    itemsDivInner.classList.add('form-group');
    itemsLabel.setAttribute('for', 'title');
    itemsInput.setAttribute('name', 'title');
    itemsInput.classList.add('form-control');
    itemsInput.setAttribute('type', 'textarea');
    itemsLabel.innerHTML = 'Items';
    container.appendChild(formContainer);
    formContainer.appendChild(titleDiv);
    formContainer.appendChild(descriptionDiv);
    formContainer.appendChild(priceDiv);
    formContainer.appendChild(itemsDiv);
    titleDiv.appendChild(titleDivInner);
    descriptionDiv.appendChild(descriptionDivInner);
    priceDiv.appendChild(priceDivInner);
    itemsDiv.appendChild(itemsDivInner);
    titleDivInner.appendChild(titleLabel);
    titleDivInner.appendChild(titleInput);
    descriptionDivInner.appendChild(descriptionLabel);
    descriptionDivInner.appendChild(descriptionInput);
    priceDivInner.appendChild(priceLabel);
    priceDivInner.appendChild(priceInput);
    formContainer.appendChild(submitButton);
    itemsDivInner.appendChild(itemsLabel);
    itemsDivInner.appendChild(itemsInput);
}

function submitForm(e) {
    console.log(e.target.elements[0].value);
    let data;
    data = {
        title: e.target.elements[0].value,
        description: e.target.elements[1].value,
        price: e.target.elements[2].value,
        items: [e.target.elements[3].value]
    };

    fetch('/uploadPlan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then((response) => console.log(response));
}
{
    /* <div class="row">
<div class="col-lg-12 form-group">
  <label for="email">Email Address</label>
  <input id="email" name="email" type="text" placeholder="Email Address" class="form-control">
</div>
</div> */
}

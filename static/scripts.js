/* 
  WEB322 Assignment 2
  Name: Omar Khan
  Student Number: 132197203
  Email: okhan27@myseneca.ca
  Section NCC
  Date: 29/06/2021
  Live demo: https://web322-a2-omar-khan.herokuapp.com/
  github repo: https://github.com/lowsound42/web322a2
  All the work in the project is my own except for stock photos, icons, and bootstrap files included<img src="data:image/jpeg;base64,{binary data}" />
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
                header.setAttribute('id', 'planTitle');
                outerDiv.appendChild(innerDiv);
                if (element.chosenOne) {
                    let popPara = document.createElement('p');
                    popPara.innerHTML = 'Our most POPULAR plan!';
                    popPara.classList.add('popular');
                    innerDiv.appendChild(popPara);
                }
                if (element.img) {
                    let img = document.createElement('img');
                    let mimeType = element.img.contentType;
                    let binData = element.img.data;
                    img.setAttribute(
                        'src',
                        'data:' + mimeType + ';base64,' + binData
                    );
                    img.classList.add('planImage');
                    innerDiv.appendChild(img);
                }
                let deleteButton = document.createElement('button');
                deleteButton.setAttribute('onclick', 'deletePlan(event);');
                deleteButton.setAttribute('value', element._id);
                deleteButton.innerHTML = 'Delete Plan';
                let popButton = document.createElement('button');
                popButton.setAttribute('onclick', 'makePopular(event);');
                popButton.setAttribute('value', element._id);
                popButton.innerHTML = 'Make Popular';
                let editButton = document.createElement('button');
                editButton.setAttribute('onclick', 'editPlan(event);');
                editButton.setAttribute('value', element._id);
                editButton.innerHTML = 'Edit Plan';
                innerDiv.appendChild(header);
                innerDiv.appendChild(p1);
                innerDiv.appendChild(p2);
                innerDiv.appendChild(uList);
                innerDiv.appendChild(deleteButton);
                innerDiv.appendChild(popButton);
                innerDiv.appendChild(editButton);
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

function editForm(e) {
    e.preventDefault();
    console.log(e.target);
    var formData = new FormData();

    let itemsArray = [];
    itemsArray.push(e.target.elements[5].value);
    if (e.target.elements[6].type === 'text') {
        itemsArray.push(e.target.elements[6].value);
    }
    if (e.target.elements[7].type === 'text') {
        itemsArray.push(e.target.elements[7].value);
    }
    if (e.target.elements[8] && e.target.elements[8].type === 'text') {
        itemsArray.push(e.target.elements[8].value);
    }
    if (e.target.elements[9] && e.target.elements[9].type === 'text') {
        itemsArray.push(e.target.elements[9].value);
    }
    if (e.target.elements[10] && e.target.elements[10].type === 'text') {
        itemsArray.push(e.target.elements[10].value);
    }
    formData.append('_id', e.target.elements[0].value);
    formData.append('title', e.target.elements[1].value);
    formData.append('description', e.target.elements[2].value);
    formData.append('price', e.target.elements[3].value);
    formData.append('items', JSON.stringify(itemsArray));
    formData.append('PlanPicture', e.target.elements[4].files[0]);

    fetch('/editPlan', {
        method: 'POST',
        body: formData
    }).then((response) => console.log(response));
    setTimeout(() => {
        viewPlans();
    }, 2000);
}

function editPlan(e) {
    let container = document.getElementById('planContainer');
    container.innerHTML = '';
    let formContainer = document.createElement('form');
    formContainer.setAttribute('onSubmit', `editForm(event);`);
    formContainer.setAttribute('enctype', 'multipart/form-data');
    formContainer.setAttribute('id', 'planForm');
    formContainer.classList.add('centerBox');
    let idDiv = document.createElement('div');
    let idDivInner = document.createElement('div');
    idDiv.classList.add('row');
    idDivInner.classList.add('col-lg-12');
    idDivInner.classList.add('form-group');
    let idLabel = document.createElement('label');
    let idInput = document.createElement('input');
    idLabel.setAttribute('for', '_id');
    idInput.setAttribute('name', '_id');
    idInput.classList.add('form-control');
    idInput.setAttribute('type', 'text');
    idInput.setAttribute('readonly', true);
    idInput.classList.add('hidden');
    idInput.setAttribute('value', e.target.value);
    idDivInner.appendChild(idLabel);
    idDivInner.appendChild(idInput);
    let titleDiv = document.createElement('div');
    let titleDivInner = document.createElement('div');
    let descriptionDiv = document.createElement('div');
    let descriptionDivInner = document.createElement('div');
    let priceDiv = document.createElement('div');
    let priceDivInner = document.createElement('div');
    let itemsDiv = document.createElement('ul');
    let itemsDivInner = document.createElement('li');
    itemsDiv.classList.add('listRemove');
    itemsDiv.setAttribute('id', 'items');
    let addItem = document.createElement('button');
    addItem.setAttribute('id', 'specButton');
    let picDiv = document.createElement('div');
    let picDivInner = document.createElement('div');
    let titleLabel = document.createElement('label');
    let titleInput = document.createElement('input');
    let descriptionLabel = document.createElement('label');
    let descriptionInput = document.createElement('input');
    let priceLabel = document.createElement('label');
    let priceInput = document.createElement('input');
    let itemsLabel = document.createElement('label');
    let itemsInput = document.createElement('input');
    let picLabel = document.createElement('label');
    let picInput = document.createElement('input');
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
    picDiv.classList.add('row');
    picDivInner.classList.add('col-lg-12');
    picDivInner.classList.add('form-group');
    picLabel.setAttribute('for', 'PlanPicture');
    picInput.setAttribute('name', 'PlanPicture');
    picInput.classList.add('form-control');
    picInput.setAttribute('type', 'file');
    picLabel.innerHTML = 'Picture';
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
    formContainer.appendChild(idDiv);
    formContainer.appendChild(titleDiv);
    formContainer.appendChild(descriptionDiv);
    formContainer.appendChild(priceDiv);
    formContainer.appendChild(picDiv);
    formContainer.appendChild(itemsDiv);
    idDiv.appendChild(idDivInner);
    titleDiv.appendChild(titleDivInner);
    descriptionDiv.appendChild(descriptionDivInner);
    priceDiv.appendChild(priceDivInner);
    picDiv.appendChild(picDivInner);
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
    itemsDiv.appendChild(addItem);
    addItem.innerHTML = 'Add more stuff';
    addItem.setAttribute('type', 'button');
    addItem.setAttribute('onclick', 'moreItems();');
    addItem.classList.add('itemButton');
    picDivInner.appendChild(picLabel);
    picDivInner.appendChild(picInput);
}

function makePopular(e) {
    console.log('popular');
    fetch('/plans/:' + e.target.value, {
        method: 'PATCH'
    })
        .then((response) => response.json())
        .then((data) => console.log(data));
    setTimeout(() => {
        viewPlans();
        console.log('here');
    }, 500);
}

function deletePlan(e) {
    console.log(e.target);
    fetch('/plans/:' + e.target.value, {
        method: 'DELETE'
    }).then((response) => console.log(response));
    setTimeout(() => {
        viewPlans();
        console.log('here');
    }, 500);
}

function planForm() {
    console.log('Test');
    let container = document.getElementById('planContainer');
    container.innerHTML = '';
    let formContainer = document.createElement('form');
    formContainer.setAttribute('onSubmit', 'submitForm(event);');
    formContainer.setAttribute('enctype', 'multipart/form-data');
    formContainer.setAttribute('id', 'planForm');
    formContainer.classList.add('centerBox');
    let titleDiv = document.createElement('div');
    let titleDivInner = document.createElement('div');
    let descriptionDiv = document.createElement('div');
    let descriptionDivInner = document.createElement('div');
    let priceDiv = document.createElement('div');
    let priceDivInner = document.createElement('div');
    let itemsDiv = document.createElement('ul');
    let itemsDivInner = document.createElement('li');
    itemsDiv.classList.add('listRemove');
    itemsDiv.setAttribute('id', 'items');
    let addItem = document.createElement('button');
    addItem.setAttribute('id', 'specButton');
    let picDiv = document.createElement('div');
    let picDivInner = document.createElement('div');
    let titleLabel = document.createElement('label');
    let titleInput = document.createElement('input');
    let descriptionLabel = document.createElement('label');
    let descriptionInput = document.createElement('input');
    let priceLabel = document.createElement('label');
    let priceInput = document.createElement('input');
    let itemsLabel = document.createElement('label');
    let itemsInput = document.createElement('input');
    let picLabel = document.createElement('label');
    let picInput = document.createElement('input');
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
    picDiv.classList.add('row');
    picDivInner.classList.add('col-lg-12');
    picDivInner.classList.add('form-group');
    picLabel.setAttribute('for', 'PlanPicture');
    picInput.setAttribute('name', 'PlanPicture');
    picInput.classList.add('form-control');
    picInput.setAttribute('type', 'file');
    picLabel.innerHTML = 'Picture';
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
    formContainer.appendChild(picDiv);
    formContainer.appendChild(itemsDiv);
    titleDiv.appendChild(titleDivInner);
    descriptionDiv.appendChild(descriptionDivInner);
    priceDiv.appendChild(priceDivInner);
    picDiv.appendChild(picDivInner);
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
    itemsDiv.appendChild(addItem);
    addItem.innerHTML = 'Add more stuff';
    addItem.setAttribute('type', 'button');
    addItem.setAttribute('onclick', 'moreItems();');
    addItem.classList.add('itemButton');
    picDivInner.appendChild(picLabel);
    picDivInner.appendChild(picInput);
}

function moreItems() {
    let itemDiv = document.getElementById('items');
    let count = itemDiv.getElementsByTagName('li').length;
    let ref = document.getElementById('specButton');
    if (count < 5) {
        let itemsDivInner = document.createElement('li');
        let itemsLabel = document.createElement('label');
        let itemsInput = document.createElement('input');
        itemsLabel.setAttribute('for', 'item');
        itemsInput.setAttribute('name', 'item');
        itemsInput.classList.add('form-control');
        itemsInput.setAttribute('type', 'text');
        itemsLabel.innerHTML = 'Item';
        itemDiv.classList.add('row');
        itemsDivInner.classList.add('col-lg-12');
        itemsDivInner.classList.add('form-group');
        itemsDivInner.appendChild(itemsLabel);
        itemsDivInner.appendChild(itemsInput);
        itemDiv.insertBefore(itemsDivInner, ref);
    }
}

function submitForm(e) {
    e.preventDefault();
    let data;
    var formData = new FormData();

    let itemsArray = [];
    itemsArray.push(e.target.elements[4].value);
    if (e.target.elements[5].type === 'text') {
        itemsArray.push(e.target.elements[5].value);
    }
    if (e.target.elements[6].type === 'text') {
        itemsArray.push(e.target.elements[6].value);
    }
    if (e.target.elements[7] && e.target.elements[7].type === 'text') {
        itemsArray.push(e.target.elements[7].value);
    }
    if (e.target.elements[8] && e.target.elements[8].type === 'text') {
        itemsArray.push(e.target.elements[8].value);
    }
    if (e.target.elements[9] && e.target.elements[9].type === 'text') {
        itemsArray.push(e.target.elements[9].value);
    }

    formData.append('title', e.target.elements[0].value);
    formData.append('description', e.target.elements[1].value);
    formData.append('price', e.target.elements[2].value);
    formData.append('items', JSON.stringify(itemsArray));
    formData.append('PlanPicture', e.target.elements[3].files[0]);

    fetch('/uploadPlan', {
        method: 'POST',
        body: formData
    }).then((response) => console.log(response));
    setTimeout(() => {
        viewPlans();
    }, 1000);
}

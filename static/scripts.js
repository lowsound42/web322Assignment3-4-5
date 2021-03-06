/*  
  WEB322 Assignment 3/4/5
  Name: Omar Khan
  Student Number: 132197203
  Email: okhan27@myseneca.ca
  Section NCC
  Date: 29/6/2021
  Live demo: https://web322-final-omarkhan.herokuapp.com/
  github repo: https://github.com/lowsound42/web322Assignment3-4-5
  All the work in the project is my own except for stock photos, icons, and bootstrap files included

**The admin user credentials are:**
**email**: admin@hoster.ca
**password**: 123qwe123

**One sample customer user is:**
**email**: test@hoster.ca
**password**: 123qwe123
  */

function checkCart(check) {
    fetch('/orders')
        .then((response) => response.json())
        .then((data) => {
            let emptyButton = document.getElementById('emptyButton');
            if (emptyButton) {
                emptyButton.setAttribute('value', data._id);
                emptyButton.addEventListener('click', (event) => {
                    emptyCart(event.target.value);
                });
            }
            if (data && data.cart && data.cart.planId != null) {
                let container = document.getElementById('cartContainer');
                container.style.position = 'relative';
                let cartHolder = document.getElementById('cartFull');
                cartHolder.style.height = '1rem';
                cartHolder.style.width = '1rem';
                cartHolder.style.backgroundColor = 'red';
                cartHolder.style.borderRadius = '50%';
                cartHolder.style.position = 'absolute';
                cartHolder.style.right = '10%';
            } else if (check) {
                let cartHolder = document.getElementById('cartFull');
                cartHolder.attributeStyleMap.clear();
            }
        });
}

function getName() {
    fetch('/userDetails')
        .then((response) => response.json())
        .then((data) => {
            if (data.message) {
                let holder = document.getElementById('planHolder');
                if (holder)
                    holder.innerHTML =
                        "Select a plan to purchase from the 'Plans' page.";
            } else {
                let holder = document.getElementById('planHolder');
                if (holder)
                    holder.innerHTML = `Web hosting plan: ${data.title}`;
            }
        });
}

function addToCart(id) {
    fetch('/addToCart', {
        method: 'POST',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id })
    })
        .then((data) => {
            document
                .querySelectorAll('.purchaseButton')
                .forEach((element) => element.setAttribute('disabled', 'true'));
            let banner = document.getElementById('purchaseConfirm');
            banner.innerHTML = 'Check your cart for your current order';
            banner.style.display = 'block';
            banner.style.textAlign = 'center';
            banner.style.backgroundColor = 'black';
            banner.style.color = 'white';
            banner.style.height = '4rem';
            banner.style.position = 'absolute';
            banner.style.top = '50%';
            banner.style.width = '100%';
            setTimeout(() => {
                banner.innerHTML = '';
                banner.style.display = 'none';
                document
                    .querySelectorAll('.purchaseButton')
                    .forEach((element) => {
                        element.disabled = false;
                    });
            }, 3000);
        })
        .then((final) => checkCart(false))
        .then((result) => (window.location = '/cart'));
}

function checkForm() {
    document.querySelectorAll('.purchaseButton').forEach((element) =>
        element.addEventListener('click', (event) => {
            addToCart(event.target.value);
        })
    );
}

function getPrice(input) {
    let removeExtras = input.slice(2).slice(0, -3);
    return parseFloat(removeExtras);
}

function getMonths(input) {
    let removeExtras = '';
    let lastLetter = input.substr(-1);
    if (lastLetter === 's') {
        removeExtras = input.slice(0, -7);
    } else {
        removeExtras = input.slice(0, -6);
    }
    return parseInt(removeExtras);
}

function finalCheckout(data) {
    fetch('/finalCheckout', {
        method: 'POST',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: data })
    })
        .then(() => emptyCart())
        .then((final) =>
            setTimeout(() => {
                location.reload();
            }, 1000)
        );
}

function populateDashboard() {
    let apiCheck = document.getElementById('userDash');
    if (apiCheck) {
        fetch('/orders')
            .then((response) => response.json())
            .then((data) => {
                if (data.orders.length > 0) {
                    let orderContainer =
                        document.getElementById('orderContainer');
                    orderContainer.innerHTML = '';
                    let prevOrderTitle = document.createElement('h5');
                    prevOrderTitle.innerHTML = 'Your previous orders:';
                    orderContainer.appendChild(prevOrderTitle);
                    let orderHolder = document.createElement('div');
                    orderHolder.classList.add('col-lg');
                    orderHolder.classList.add('card');
                    orderHolder.classList.add('col-body-special');
                    orderContainer.appendChild(orderHolder);
                    data.orders.forEach((element) => {
                        let priceBase = (getPrice(element.price) * 100) / 57;
                        let planPrice;
                        switch (element.months) {
                            case 36:
                                planPrice = getPrice(element.price);
                                break;
                            case 24:
                                planPrice = (
                                    priceBase -
                                    (40 / 100) * priceBase
                                ).toFixed(2);
                                break;
                            case 12:
                                planPrice = (
                                    priceBase -
                                    (37 / 100) * priceBase
                                ).toFixed(2);
                                break;
                            case 1:
                                planPrice = priceBase.toFixed(2);
                                break;
                            default:
                                break;
                        }
                        let cardHolder = document.createElement('div');
                        let cardTitle = document.createElement('h5');
                        let cardTextOne = document.createElement('p');
                        cardHolder.classList.add('card-body');
                        cardTitle.classList.add('card-title');
                        cardTextOne.classList.add('card-text');
                        cardTitle.innerHTML = element.title;
                        cardTextOne.innerHTML = `${element.months} month plan at $${planPrice}/mo`;
                        cardHolder.appendChild(cardTitle);
                        cardHolder.appendChild(cardTextOne);
                        orderHolder.appendChild(cardHolder);
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

function checkOut(event) {
    fetch('/plan', {
        method: 'POST',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: event.value })
    })
        .then((response) => response.json())
        .then((data) => {
            let tempData = data;
            let sumPlan = document.getElementById('summaryPlan');
            let sumPromo = document.getElementById('summaryPromo');
            let sumFinal = document.getElementById('summaryTotal');
            if (sumPlan) {
                let sumTotal =
                    ((getPrice(data.price) * 100) / 57) *
                    getMonths(event.parentElement.children[0].innerHTML);
                tempData.months = getMonths(
                    event.parentElement.children[0].innerHTML
                );
                sumPlan.innerHTML = data.title + ' ' + sumTotal.toFixed(2);
                sumPlan.style.fontWeight = 'bold';
                let buttonHolder = document.getElementById('checkButContainer');
                buttonHolder.innerHTML = '';

                if (sumPromo) {
                    sumPromo.innerHTML = `PROMO: WEB322  -$${(
                        sumTotal * 0.35
                    ).toFixed(2)}`;
                    sumPromo.style.textDecoration = 'underline';
                    let finalTotal = (sumTotal - sumTotal * 0.35).toFixed(2);
                    tempData.finalPrice = finalTotal;
                    sumFinal.innerHTML = `TOTAL: ${finalTotal}`;
                    sumFinal.style.fontWeight = 'bold';
                    sumFinal.style.color = 'green';
                }
                let sumButton = document.getElementById('summaryButton');
                sumButton.innerHTML = '';
                let sumSubmitButton = document.createElement('button');
                sumSubmitButton.addEventListener('click', function () {
                    finalCheckout(tempData);
                });
                sumSubmitButton.classList.add('btn');
                sumSubmitButton.classList.add('btn-primary');
                sumSubmitButton.classList.add('btn-md');
                sumSubmitButton.setAttribute('id', 'checkoutButton');
                sumSubmitButton.innerHTML = 'Checkout';
                buttonHolder.appendChild(sumSubmitButton);
            }
        });
}

function getSelection() {
    document.querySelectorAll('.priceButton').forEach((element) =>
        element.addEventListener('click', (event) => {
            checkOut(event.target);
        })
    );
}

function setSummary() {
    let sumPlan = document.getElementById('summaryPlan');
    if (sumPlan) {
        sumPlan.innerHTML = 'Select one of the pricing options';
        sumPlan.style.textAlign = 'center';
    }
}

function emptyCart(data) {
    fetch('/cart/:' + data, {
        method: 'PATCH'
    })
        .then((response) => response.json())
        .then((result) => checkCart(true))
        .then((result) => {
            setTimeout(() => {
                location.reload();
            }, 200);
        })
        .catch((err) => console.log(err));
}

window.onload = function () {
    checkForm();
    getName();
    getSelection();
    setSummary();
    populateDashboard();
    checkCart();
};

function viewPlans() {
    fetch('/planData')
        .then((response) => response.json())
        .then((data) => {
            let container = document.getElementById('planContainer');
            container.innerHTML = '';
            data.forEach((element) => {
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
                deleteButton.classList.add('deleteButtonAdmin');
                editButton.classList.add('editButtonAdmin');
                popButton.classList.add('popButtonAdmin');
                deleteButton.classList.add('btn');
                deleteButton.classList.add('btn-primary');
                deleteButton.classList.add('btn-sm');
                popButton.classList.add('btn');
                popButton.classList.add('btn-primary');
                popButton.classList.add('btn-sm');
                editButton.classList.add('btn');
                editButton.classList.add('btn-primary');
                editButton.classList.add('btn-sm');
                let buttonDiv = document.createElement('div');
                buttonDiv.setAttribute('id', 'buttonDiv');
                innerDiv.appendChild(header);
                innerDiv.appendChild(p1);
                innerDiv.appendChild(p2);
                innerDiv.appendChild(uList);
                buttonDiv.appendChild(deleteButton);
                buttonDiv.appendChild(popButton);
                buttonDiv.appendChild(editButton);
                innerDiv.appendChild(buttonDiv);
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
    let submitBut = document.getElementById('submitBut');
    submitBut.disabled = true;
    let container = document.getElementById('planForm');
    let modal = document.createElement('div');
    modal.setAttribute('id', 'modal');
    modal.style.position = 'absolute';
    modal.style.width = '80%';
    modal.style.height = '10rem';
    modal.style.backgroundColor = 'white';
    modal.style.top = '10%';
    modal.style.border = '1px black solid';
    modal.style.textAlign = 'center';
    let modalPara = document.createElement('p');
    let modalText = document.createTextNode(
        'Plan is being uploaded, please wait...'
    );
    modalPara.classList.add('modalPara');
    modalPara.appendChild(modalText);
    modal.appendChild(modalPara);
    container.appendChild(modal);
    var formData = new FormData();

    let itemsArray = [];
    itemsArray.push(e.target.elements[5].value);
    let count = e.target.elements.length;
    for (let i = 6; i <= count - 3; i++) {
        if (e.target.elements[6].type === 'text') {
            itemsArray.push(e.target.elements[i].value);
        }
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
    })
        .then((response) => response.json())
        .then((result) => {
            let modal = document.getElementById('modal');
            modal.style.display = 'none';
            let errorBox = document.getElementById('errorBox');
            if (result.picError) {
                submitBut.disabled = false;
                errorBox.innerHTML =
                    'Plan must have an image and image must be a valid format (jpg/jpeg/gif)';
                setTimeout(() => {
                    viewPlans();
                }, 1300);
            } else if (result.validError) {
                submitBut.disabled = false;
                errorBox.innerHTML = 'Please enter all the data for the plan';
                setTimeout(() => {
                    viewPlans();
                }, 1300);
            } else {
                setTimeout(() => {
                    viewPlans();
                }, 200);
            }
        });
}

function editPlan(e) {
    let n = 0;
    if (
        e.target.parentElement.parentElement.children[0].innerHTML ===
        'Our most POPULAR plan!'
    ) {
        n = 1;
    }
    let container = document.getElementById('planContainer');
    container.innerHTML = '';
    let formContainer = document.createElement('form');
    let formTitle = document.createElement('h5');
    formTitle.innerHTML = 'Editing plan:';
    formContainer.setAttribute('onSubmit', `editForm(event);`);
    formContainer.setAttribute('enctype', 'multipart/form-data');
    formContainer.setAttribute('id', 'planForm');
    formContainer.classList.add('centerBox');
    formContainer.style.position = 'relative';
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
    addItem.classList.add('btn');
    addItem.classList.add('btn-primary');
    addItem.classList.add('btn-sm');
    addItem.classList.add('addItemButton');
    addItem.innerHTML = 'Add more items';
    addItem.setAttribute('type', 'button');
    addItem.setAttribute('onclick', 'moreItems();');
    addItem.classList.add('itemButton');
    let cancelButton = document.createElement('button');
    cancelButton.classList.add('btn');
    cancelButton.classList.add('btn-primary');
    cancelButton.classList.add('btn-sm');
    cancelButton.classList.add('cancelButton');
    cancelButton.innerHTML = 'Cancel';
    cancelButton.setAttribute('type', 'button');
    cancelButton.setAttribute('onclick', 'viewPlans();');
    let picDiv = document.createElement('div');
    let picDivInner = document.createElement('div');
    let titleLabel = document.createElement('label');
    let titleInput = document.createElement('input');
    titleInput.value =
        e.target.parentElement.parentElement.children[n + 1].innerHTML;
    titleInput.readOnly = true;
    let descriptionLabel = document.createElement('label');
    let descriptionInput = document.createElement('input');
    descriptionInput.value =
        e.target.parentElement.parentElement.children[n + 2].innerHTML;
    let priceLabel = document.createElement('label');
    let priceInput = document.createElement('input');
    priceInput.value =
        e.target.parentElement.parentElement.children[n + 3].innerHTML;
    let itemsLabel = document.createElement('label');
    let numItems =
        e.target.parentElement.parentElement.children[n + 4].children.length;

    let itemsInput = document.createElement('input');
    let picLabel = document.createElement('label');
    let picInput = document.createElement('input');
    let submitButton = document.createElement('input');
    submitButton.setAttribute('type', 'submit');
    submitButton.setAttribute('id', 'submitBut');
    let errorBox = document.createElement('div');
    errorBox.classList.add('errorBox');
    errorBox.setAttribute('id', 'errorBox');
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
    descriptionLabel.setAttribute('for', 'description');
    descriptionInput.setAttribute('name', 'description');
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
    priceLabel.setAttribute('for', 'price');
    priceInput.setAttribute('name', 'price');
    priceInput.classList.add('form-control');
    priceInput.setAttribute('type', 'number');
    priceInput.setAttribute('step', '0.01');
    priceLabel.innerHTML = 'Price';
    itemsDiv.classList.add('row');
    itemsDivInner.classList.add('col-lg-12');
    itemsDivInner.classList.add('form-group');
    itemsLabel.setAttribute('for', 'items');
    itemsInput.setAttribute('name', 'items');
    itemsInput.classList.add('form-control');
    itemsInput.setAttribute('type', 'textarea');
    itemsLabel.innerHTML = 'Item';
    submitButton.classList.add('btn');
    submitButton.classList.add('btn-primary');
    submitButton.classList.add('btn-sm');
    for (let i = 0; i < numItems; i++) {
        let itemsInner = document.createElement('li');
        let itemsLabel = document.createElement('label');
        itemsLabel.setAttribute('for', 'items');
        itemsLabel.innerHTML = 'Item';
        let inputBox = document.createElement('input');
        inputBox.setAttribute('name', 'title');
        inputBox.classList.add('form-control');
        inputBox.setAttribute('type', 'textarea');
        inputBox.value =
            e.target.parentElement.parentElement.children[n + 4].children[
                i
            ].innerHTML;
        if (
            e.target.parentElement.parentElement.children[n + 4].children[i]
                .innerHTML !== ''
        ) {
            itemsInner.appendChild(itemsLabel);
            itemsInner.appendChild(inputBox);
            itemsDiv.appendChild(itemsInner);
        }
    }
    container.appendChild(formContainer);
    formContainer.append(formTitle);
    formContainer.appendChild(idDiv);
    formContainer.appendChild(errorBox);
    formContainer.appendChild(titleDiv);
    formContainer.appendChild(descriptionDiv);
    formContainer.appendChild(priceDiv);
    formContainer.appendChild(picDiv);
    formContainer.appendChild(itemsDiv);
    idDiv.appendChild(idDivInner);
    titleDiv.appendChild(titleDivInner);
    descriptionDiv.appendChild(descriptionDivInner);
    priceDiv.appendChild(priceDivInner);
    picDivInner.appendChild(picLabel);
    picDivInner.appendChild(picInput);
    picDiv.appendChild(picDivInner);
    titleDivInner.appendChild(titleLabel);
    titleDivInner.appendChild(titleInput);
    descriptionDivInner.appendChild(descriptionLabel);
    descriptionDivInner.appendChild(descriptionInput);
    priceDivInner.appendChild(priceLabel);
    priceDivInner.appendChild(priceInput);
    formContainer.appendChild(cancelButton);
    formContainer.appendChild(submitButton);
    itemsDiv.appendChild(addItem);
}

function makePopular(e) {
    fetch('/plans/:' + e.target.value, {
        method: 'PATCH'
    }).then((response) => response.json());
    setTimeout(() => {
        viewPlans();
    }, 500);
}

function ajaxDelete(e) {
    fetch('/plans/:' + e.target.value, {
        method: 'DELETE'
    });
    setTimeout(() => {
        viewPlans();
    }, 500);
}

function cancelDelete(e) {
    let selectedPlan = document.querySelectorAll(`[value="${e.target.value}"]`);
    selectedPlan[0].style.display = 'block';
    selectedPlan[1].style.display = 'none';
    selectedPlan[2].style.display = 'none';
}

function deletePlan(e) {
    e.preventDefault();
    let selectedPlan = document.querySelectorAll(`[value="${e.target.value}"]`);
    let yesButton = document.createElement('button');
    let noButton = document.createElement('button');
    yesButton.innerHTML = 'Confirm';
    noButton.innerHTML = 'Cancel';
    yesButton.classList.add('btn');
    yesButton.classList.add('yesButtonAdmin');
    yesButton.classList.add('btn-danger');
    yesButton.classList.add('btn-sm');
    noButton.classList.add('btn');
    noButton.classList.add('btn-secondary');
    noButton.classList.add('btn-sm');
    noButton.classList.add('noButtonAdmin');
    yesButton.setAttribute('value', selectedPlan[0].value);
    yesButton.setAttribute('onclick', 'ajaxDelete(event)');
    noButton.setAttribute('value', selectedPlan[0].value);
    noButton.setAttribute('onclick', 'cancelDelete(event)');
    selectedPlan[1].parentNode.insertBefore(yesButton, selectedPlan[1]);
    selectedPlan[1].parentNode.insertBefore(noButton, selectedPlan[1]);
    selectedPlan[0].style.display = 'none';
}

function planForm() {
    let container = document.getElementById('planContainer');
    container.innerHTML = '';
    let formContainer = document.createElement('form');
    let formTitle = document.createElement('h5');
    formTitle.innerHTML = 'Create a new plan:';
    formContainer.setAttribute('onSubmit', 'submitForm(event);');
    formContainer.setAttribute('enctype', 'multipart/form-data');
    formContainer.setAttribute('id', 'planForm');
    formContainer.classList.add('centerBox');
    formContainer.style.position = 'relative';
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
    addItem.classList.add('btn');
    addItem.classList.add('btn-primary');
    addItem.classList.add('btn-sm');
    addItem.classList.add('addItemButton');
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
    let errorBox = document.createElement('div');
    errorBox.classList.add('errorBox');
    errorBox.setAttribute('id', 'errorBox');
    submitButton.setAttribute('type', 'submit');
    submitButton.classList.add('btn');
    submitButton.classList.add('btn-primary');
    submitButton.classList.add('btn-sm');
    submitButton.setAttribute('id', 'submitBut');
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
    priceLabel.setAttribute('for', 'price');
    priceInput.setAttribute('name', 'price');
    priceInput.classList.add('form-control');
    priceInput.setAttribute('type', 'number');
    priceInput.setAttribute('step', '0.01');
    priceLabel.innerHTML = 'Price';
    itemsDiv.classList.add('row');
    itemsDivInner.classList.add('col-lg-12');
    itemsDivInner.classList.add('form-group');
    itemsLabel.setAttribute('for', 'title');
    itemsInput.setAttribute('name', 'title');
    itemsInput.classList.add('form-control');
    itemsInput.setAttribute('type', 'textarea');
    itemsLabel.innerHTML = 'Item';
    container.appendChild(formContainer);
    formContainer.append(formTitle);
    formContainer.appendChild(errorBox);
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
    addItem.innerHTML = 'Add more items';
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
    if (count < 13) {
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
    let submitBut = document.getElementById('submitBut');
    submitBut.disabled = true;
    let errorBox = document.getElementById('errorBox');
    let container = document.getElementById('planForm');
    let modal = document.createElement('div');
    modal.setAttribute('id', 'modal');
    modal.style.position = 'absolute';
    modal.style.width = '80%';
    modal.style.height = '10rem';
    modal.style.backgroundColor = 'white';
    modal.style.top = '10%';
    modal.style.border = '1px black solid';
    modal.style.textAlign = 'center';
    let modalPara = document.createElement('p');
    let modalText = document.createTextNode(
        'Plan is being uploaded, please wait...'
    );
    modalPara.classList.add('modalPara');
    modalPara.appendChild(modalText);
    modal.appendChild(modalPara);
    container.appendChild(modal);
    errorBox.innerHTML = '';
    var formData = new FormData();

    let itemsArray = [];
    itemsArray.push(e.target.elements[4].value);
    let count = e.target.elements.length;
    for (let i = 5; i <= count - 3; i++) {
        if (e.target.elements[5].type === 'text') {
            itemsArray.push(e.target.elements[i].value);
        }
    }

    formData.append('title', e.target.elements[0].value);
    formData.append('description', e.target.elements[1].value);
    formData.append('price', e.target.elements[2].value);
    formData.append('items', JSON.stringify(itemsArray));
    formData.append('PlanPicture', e.target.elements[3].files[0]);

    fetch('/uploadPlan', {
        method: 'POST',
        body: formData
    })
        .then((response) => response.json())
        .then((result) => {
            let errorBox = document.getElementById('errorBox');
            let modal = document.getElementById('modal');
            if (result.picError) {
                modal.style.display = 'none';
                submitBut.disabled = false;
                errorBox.innerHTML =
                    'Plan must have an image and image must be a valid format (jpg/jpeg/gif/png)';
                setTimeout(() => {
                    planForm();
                }, 2000);
            } else if (result.validError) {
                modal.style.display = 'none';
                submitBut.disabled = false;
                errorBox.innerHTML = 'Please enter all the data for the plan';
                setTimeout(() => {
                    planForm();
                }, 2000);
            } else if (result.exists) {
                modal.style.display = 'none';
                submitBut.disabled = false;
                errorBox.innerHTML = `The ${e.target.elements[0].value} plan already exists!`;
                setTimeout(() => {
                    planForm();
                }, 2000);
            } else if (result.limit) {
                modal.style.display = 'none';
                submitBut.disabled = false;
                errorBox.innerHTML = `You cannot have more than 6 active plans`;
                setTimeout(() => {
                    planForm();
                }, 2000);
            } else {
                setTimeout(() => {
                    viewPlans();
                }, 200);
            }
        });
}

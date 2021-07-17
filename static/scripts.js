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
function createCardTitle(src) {
    let title = document.createElement('h5');
    let titleText = document.createTextNode(src);
    title.appendChild(titleText);
    title.classList.add('card-title');

    return title;
}
function createCardDesc(src) {
    let para = document.createElement('p');
    let paraText = document.createTextNode(src);
    para.appendChild(paraText);
    para.classList.add('card-text');
    return para;
}

function createCardPrice(src) {
    let para = document.createElement('p');
    let paraText = document.createTextNode(src);
    para.appendChild(paraText);
    para.classList.add('card-text');
    return para;
}

function createCardList(src) {
    let listArray = [];
    src.map((element) => {
        let listItem = document.createElement('li');
        let listItemText = document.createTextNode(element);
        listItem.appendChild(listItemText);
        listItem.classList.add('list-group-item');
        listArray.push(listItem);
    });
    return listArray;
}

function createCard(element) {
    let cardNo;
    let imgElement = document.createElement('i');
    switch (element.title) {
        case 'Personal':
            cardNo = 'cardOne';
            imgElement.classList.add('fas');
            imgElement.classList.add('fa-2x');
            imgElement.classList.add('fa-portrait');
            break;
        case 'Pro':
            cardNo = 'cardTwo';
            imgElement.classList.add('fas');
            imgElement.classList.add('fa-2x');
            imgElement.classList.add('fa-briefcase');
            break;
        case 'Enterprise':
            cardNo = 'cardThree';
            imgElement.classList.add('fas');
            imgElement.classList.add('fa-2x');
            imgElement.classList.add('fa-building');
            break;
        default:
            break;
    }

    let card = document.getElementById(cardNo);
    card.classList.add('card-body-special');
    let container = document.createElement('div');
    container.classList.add('card-body');
    container.appendChild(imgElement);
    card.appendChild(container);
    let title = createCardTitle(element.title);
    container.appendChild(title);
    let para = createCardDesc(element.description);
    container.appendChild(para);
    let price = createCardPrice(element.price);
    container.appendChild(price);
    let listContainer = document.createElement('ul');
    listContainer.classList.add('list-group');
    listContainer.classList.add('list-group=flush');
    container.appendChild(listContainer);
    let listItems = createCardList(element.items);
    listItems.map((element) => {
        listContainer.appendChild(element);
    });
}

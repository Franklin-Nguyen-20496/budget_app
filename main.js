'use strict';
// data
const actives = [
    {
        id: 1,
        name: 'Salary',
        img: './assets/img/salary.png',
    },
    {
        id: 2,
        name: 'Gift',
        img: './assets/img/gift.png',
    },
    {
        id: 3,
        name: 'Friend',
        img: './assets/img/friend.png',
    },
    {
        id: 4,
        name: 'Shopping',
        img: './assets/img/shopping.png',
    },
    {
        id: 5,
        name: 'Cooking',
        img: './assets/img/cooking.png',
    },
    {
        id: 6,
        name: 'invoice',
        img: './assets/img/invoice.png',
    },
    {
        id: 7,
        name: 'other',
        img: './assets/img/other.png',
    },
];
let length = actives.length;
// handle when click active-item
function showModalActives(element) {
    $('.modal__new--header').text(`Create new ${element.attr('name')}`);
    element.removeClass('d-none');
}

class Model {

    getItems() {
        if (JSON.parse(localStorage.getItem('items')) === null) {
            localStorage.setItem('countItems', JSON.stringify(0));
            localStorage.setItem('items', JSON.stringify([]));
            return JSON.parse(localStorage.getItem('items'));
        }
        else {
            return JSON.parse(localStorage.getItem('items'));
        }
    }

    addItem(value) {
        if (JSON.parse(localStorage.getItem('items')) === null) {
            localStorage.setItem('countItems', JSON.stringify(1));
            value.id = 1;
            localStorage.setItem('items', JSON.stringify([value]));
        }
        else {
            // reset data
            const items = JSON.parse(localStorage.getItem('items'));
            value.id = JSON.parse(localStorage.getItem('countItems')) + 1;
            localStorage.setItem('countItems', JSON.stringify(value.id));
            items.unshift(value);
            localStorage.setItem('items', JSON.stringify(items));
        }
    }

    deleteItem(type, activeId) {
        const items = [];
        (JSON.parse(localStorage.getItem('items'))).forEach((value, index) => {
            if (value.type === type && value.activeId === activeId) {
            }
            else {
                items.push(value);
            }
        });
        localStorage.setItem('items', JSON.stringify(items));
        return items;
    }
}
const model = new Model();

// render item when just create item
function renderItemWhenCreate(type, activeId) {
    const items = model.getItems();
    let value = actives.find((val, index) => {
        return val.id == activeId;
    })

    if (type === 'income') {

        $(`.income__id--${activeId}`).remove();

        let dateCreated = '';

        let array = items.filter((item) => {
            return (value.id == item.activeId && item.type === 'income');
        });

        let total = array.reduce((total, item) => {
            dateCreated = item.createdDateAt;
            return total + Number(item.value);
        }, 0);

        $(` <div class="modal__history--item history__income--item br-8 p-2 income__id--${value.id}" 
            type="income" active-id="${value.id}" name="${value.name}">
                    <div class="history__income--img br-8">
                        <img src="${value.img}" alt="">
                    </div>
                    <div class="history__income--description ml-2">
                        <h1 class="history__income--name text-topic fs-20 fw-500 mb-1">
                            ${value.name} income
                        </h1>
                        <h3 class="history__income--total fs-18 fw-500 mb-1">
                            $${total}
                        </h3>
                        <p class="history__income--date fs-14 fs-italic fw-400">
                            Created at: ${dateCreated}
                        </p>
                    </div>
                    <i class="fa-solid fa-trash-can fs-16 history__item--delete"></i>
                </div>`
        ).prependTo('.history__income--body');
    }
    else {
        $(`.cost__id--${activeId}`).remove();

        let dateCreated = '';

        let array = items.filter((item) => {
            return (value.id == item.activeId && item.type === 'cost');
        });

        let total = array.reduce((total, item) => {
            dateCreated = item.createdDateAt;
            return total + Number(item.value);
        }, 0);

        $(`<div class="modal__history--item history__cost--item cost__id--${value.id} br-8 p-2" 
            type="cost" active-id="${value.id}" name="${value.name}">
                        <div class="history__cost--img br-8">
                            <img src="${value.img}" alt="">
                        </div>
                        <div class="history__cost--description ml-2">
                            <h1 class="history__cost--name text-pink fs-20 fw-500 mb-1">
                                ${value.name} cost
                            </h1>
                            <h3 class="history__cost--total fs-18 fw-500 mb-1">
                                -$${total}
                            </h3>
                            <p class="history__cost--date fs-14 fs-italic fw-400">
                                Created at: ${dateCreated}
                            </p>
                        </div>
                        <i class="fa-solid fa-trash-can fs-16 history__item--delete"></i>
                    </div>`
        ).prependTo('.history__cost--body');
    }
}

function calcTotalBudgetWhenReload(items) {
    const totalBudget = items.reduce((total, item) => {
        if (item.type === 'income') {
            return total + Number(item.value);
        }
        else {
            return total - Number(item.value);
        }
    }, 0);

    $('.header__total').attr('total', totalBudget);

    if (totalBudget >= 0) {
        $('.header__total').text(`$${totalBudget}`);
    }
    else {
        $('.header__total').text(`-$${-totalBudget}`);
    }
}

function handleModalActives() {
    function resetForm() {
        $('#modal__new--number').val('');
        $('#modal__new--name').val('');
        $('#modal__new--description').val('');
        $('#form__radio1').prop('checked', true);
        $('.modal__actives').addClass('d-none');
    }

    $('.category__body--item').click((event) => {
        let element = $(event.currentTarget);
        const modalActives = $('.modal__actives');
        modalActives.attr('active-id', element.attr('id'));
        modalActives.attr('name', element.attr('name'));
        modalActives.attr('img', element.attr('img'));
        showModalActives(modalActives);
    })

    $('.modal__btn--confirm').click(() => {
        let activeId = $('.modal__actives').attr('active-id');
        let value = $('#modal__new--number').val();
        let name = $('#modal__new--name').val();
        let description = $('#modal__new--description').val();
        let type = $('input[name="budget"]:checked').val();
        let createdDateAt = (new Date()).toDateString();

        if (value > 0 && !!name && !!description) {
            const item = { activeId, value, name, description, type, createdDateAt };
            model.addItem(item);
            resetForm();
            renderItemWhenCreate(type, activeId);
            addNewValueForTotalBudget(value, type);
            renderModalHistoryWhenClick();
            $('.history__item--delete').click((event) => {
                event.stopPropagation();
                handleDeleteItemHistory(event);
            });
            $('#modal__actives').addClass('d-none');
        }
        else {
            // show notify validation form
            $('#modal__form--valid').removeClass('d-none');
        }
    })

    $('.modal__btn--cancel').click(() => {
        // reset form
        resetForm()
    })
};

function renderHistoryWhenInit() {

    const items = model.getItems();

    // research item valid income or course
    function checkItem(val, value) {
        return items.some((item, key) => {
            return (item.type === val && value.id == item.activeId);
        })
    }
    // set total budget when init
    const totalBudget = items.reduce((total, item) => {
        if (item.type === 'income') {
            return total + Number(item.value);
        }
        else {
            return total - Number(item.value);
        }
    }, 0);

    $('.header__total').attr('total', totalBudget);

    if (totalBudget >= 0) {
        $('.header__total').text(`$${totalBudget}`);
    }
    else {
        $('.header__total').text(`-$${-totalBudget}`);
    }

    actives.forEach((value, index) => {

        if (checkItem('income', value)) {
            // process total income value
            let dateCreated = '';

            let array = items.filter((item) => {
                return (value.id == item.activeId && item.type === 'income');
            });

            let total = array.reduce((total, item) => {
                dateCreated = item.createdDateAt;
                return total + Number(item.value);
            }, 0);

            $(`<div class="modal__history--item history__income--item br-8 p-2 income__id--${value.id}" 
                type="income" active-id="${value.id}" name="${value.name}">
                        <div class="history__income--img br-8">
                            <img src="${value.img}" alt="">
                        </div>
                        <div class="history__income--description ml-2">
                            <h1 class="history__income--name text-topic fs-20 fw-500 mb-1">
                                ${value.name} income
                            </h1>
                            <h3 class="history__income--total fs-18 fw-500 mb-1">
                                $${total}
                            </h3>
                            <p class="history__income--date fs-14 fs-italic fw-400">
                                Created at: ${dateCreated}
                            </p>
                        </div>
                        <i class="fa-solid fa-trash-can fs-16 history__item--delete"></i>
                    </div>`
            ).appendTo('.history__income--body');
        }

        if (checkItem('cost', value)) {
            let dateCreated = '';

            let array = items.filter((item) => {
                return (value.id == item.activeId && item.type === 'cost');
            });

            let total = array.reduce((total, item) => {
                dateCreated = item.createdDateAt;
                return total + Number(item.value);
            }, 0);

            $(` <div class="modal__history--item history__cost--item cost__id--${value.id} br-8 p-2"
                type="cost" active-id="${value.id}" name="${value.name}">
                        <div class="history__cost--img br-8">
                            <img src="${value.img}" alt="">
                        </div>
                        <div class="history__cost--description ml-2">
                            <h1 class="history__cost--name text-pink fs-20 fw-500 mb-1">
                                ${value.name} cost
                            </h1>
                            <h3 class="history__cost--total fs-18 fw-500 mb-1">
                                -$${total}
                            </h3>
                            <p class="history__cost--date fs-14 fs-italic fw-400">
                                Created at: ${dateCreated}
                            </p>
                        </div>
                        <i class="fa-solid fa-trash-can fs-16 history__item--delete"></i>
                    </div>`
            ).appendTo('.history__cost--body');
        }

    })
}

function getTotalSlideItems() {
    let totalSlide = $('.category__body--item').length * 120;
    return ((totalSlide / 120 - 5) / 2).toFixed();
};

function renderActives() {
    actives.forEach((value, index) => {
        $(` 
            <div class="category__body--item btn-click text-dark" id="${value.id}" name="${value.name}" img="${value.img}">
                <div class="category__body--img br-full">
                    <img src="${value.img}" alt="${value.name}">
                </div>

                <h2 class="category__body--name text-center fs-20 fw-600 mt-2">
                    ${value.name}
                </h2>
            </div>
        `).appendTo('.category__body--container')
    })
};

// handle slide Modal history
function slideContainerItemsHistory(n) {
    if (n == 1) {
        $('.modal__history--btn1').addClass('d-none');
    }
    else {
        $('.modal__history--btn1').removeClass('d-none');
    }
    let j = 0;
    let stepItem1 = $('.modal__history--item1').outerWidth();
    let sequelize2 = 0;

    $('.modal__history--btn1').click(() => {
        sequelize2 = sequelize2 + stepItem1;
        j++;
        $('.modal__history--item1').css('transform', `translateX(${-sequelize2}px)`);
        if (j == n - 1) {
            $('.modal__history--btn1').addClass('d-none');
            $('.modal__history--btn2').removeClass('d-none');
        }
        else $('.modal__history--btn2').removeClass('d-none');
    })

    $('.modal__history--btn2').click(() => {
        sequelize2 = sequelize2 - stepItem1;
        j--;
        $('.modal__history--item1').css('transform', `translateX(${-sequelize2}px)`);
        if (j === 0) {
            $('.modal__history--btn2').addClass('d-none');
            $('.modal__history--btn1').removeClass('d-none');
        }
        else $('.modal__history--btn1').removeClass('d-none');
    })
}

// make item1 in modal history
function makeItem1(page) {
    $(`<div class="modal__history--item1 modal__history--page${page} br-8 p-2"></div>`).appendTo('.modal__history--slide');
}

// make item2 in modal history
function makeItem2(page, value) {
    $(` <div class="modal__history--item2 mb-2 pl-2 ml-1">
            <img src="./assets/img/calendar.png" alt="">
            <div class="modal__history--info ml-2">
            <h3 class="modal__history--value fw-600 fs-16 mb-1">
                ${value.name}:
                <span class="text-pink">
                    ${value.value}
                </span>
            </h3>

            <h4 class="modal__history--name fs-14 fw-500 mb-1">
                ${value.description}
            </h4>

            <p class="modal__history--date fs-14 fw-400 fs-italic text-topic">
                Created at: ${value.createdDateAt}
            </p>
            </div>
        </div>`).appendTo(`.modal__history--page${page}`);
}

// render modal history when click
function renderModalHistoryWhenClick() {
    $('.modal__history--item').click((event) => {
        let type = $(event.currentTarget).attr('type');
        let activeId = $(event.currentTarget).attr('active-id');
        let activeName = $(event.currentTarget).attr('name');
        const items = model.getItems().filter((value, index) => {
            return (value.type === type && value.activeId === activeId);
        });
        const total = items.reduce((total, item) => {
            return total + Number(item.value);
        }, 0);
        $('.modal__history--number').text(type === 'income' ? `$${total}` : `-$${total}`);
        $('.modal__history--name').text(`${activeName} ${type}`);

        const container = $('.modal__history--slide').empty();
        const n = Math.ceil(items.length / 3);
        let i = 1;
        let page = 1;
        items.forEach((value, index) => {
            switch (i) {
                case 1:
                    makeItem1(page);
                    makeItem2(page, value);

                    i++;
                    break;
                case 2:
                    makeItem2(page, value);
                    i++;
                    break;
                case 3:
                    makeItem2(page, value);
                    i = 1;
                    page++;
                    break;
            }
        })
        slideContainerItemsHistory(n);
        $('.modal__history').removeClass('d-none');
    })
    return 0;
}

// add new total budget when create new item
function addNewValueForTotalBudget(value, type) {

    let totalBudget = Number($('.header__total').attr('total'));

    if (type === 'income') {
        totalBudget = totalBudget + Number(value);
    }
    else {
        totalBudget = totalBudget - Number(value);
    }

    $('.header__total').attr('total', totalBudget);

    if (totalBudget >= 0) {
        $('.header__total').text(`$${totalBudget}`);
    }
    else {
        $('.header__total').text(`-$${-totalBudget}`);
    }
}

// handle delete item history
function handleDeleteItemHistory(event) {
    let element = $(event.currentTarget).parent();
    let type = element.attr('type');
    let activeId = element.attr('active-id');
    $('.modal__confirm--btn1').attr('type', type);
    $('.modal__confirm--btn1').attr('active-id', activeId);

    $('.modal__confirm--delete').removeClass('d-none');

    $('.modal__confirm--btn1').click(() => {
        let btnType = $('.modal__confirm--btn1').attr('type');
        let btnId = $('.modal__confirm--btn1').attr('active-id');
        const items = model.deleteItem(btnType, btnId);
        calcTotalBudgetWhenReload(items);
        console.log(btnType, btnId);
        $(`.${btnType}__id--${btnId}`).remove();
        $('.modal__confirm--delete').addClass('d-none');
        // items.splice(0, items.length);
        return 0;
    })

    $('.modal__confirm--btn2').click(() => {
        $('.modal__confirm--delete').addClass('d-none');
        return 0;
    })
}

$('document').ready(() => {
    renderActives();
    renderHistoryWhenInit();

    // handle slide active
    let sequelize = 0;
    let n = getTotalSlideItems();
    let i = 0;

    $('.category__header--next').click(() => {
        sequelize = sequelize + 240;
        i++;
        $('.category__body--container').css('transform', `translateX(${-sequelize}px)`);

        if (i == n) {
            $('.category__header--next').addClass('disable');
            $('.category__header--previous').removeClass('disable');
        }
        else $('.category__header--previous').removeClass('disable');
    });

    $('.category__header--previous').click(() => {
        sequelize = sequelize - 240;
        i--;
        $('.category__body--container').css('transform', `translateX(${-sequelize}px)`);
        if (i === 0) {
            $('.category__header--previous').addClass('disable');
            $('.category__header--next').removeClass('disable');
        }
        else $('.category__header--next').removeClass('disable');
    });

    // stop Propagation when click delete history item and handle confirm
    $('.history__item--delete').click((event) => {
        event.stopPropagation();
        handleDeleteItemHistory(event);
    })

    // handle btn click scale
    $('.btn-click').click((event) => {
        $(event.currentTarget).addClass('active');
        setTimeout(() => {
            $(event.currentTarget).removeClass('active');
        }, 300)
    })

    // handle click close modal history
    $('.modal__history--close').click(() => {
        $('.modal__history--btn1').removeClass('d-none');
        $('.modal__history--btn2').addClass('d-none');
        $('.modal__history').addClass('d-none');
    })

    // handle close modal confirm : modal__form--valid-
    $('.form__valid--btn1').click(() => {
        $('#modal__form--valid').addClass('d-none');
    });

    // handle Modal active
    handleModalActives();

    // render modal history when click
    renderModalHistoryWhenClick();
})

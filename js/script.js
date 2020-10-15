const userForm = document.querySelector('.user-form');
const loginDatas = document.querySelectorAll('.login-form-input');
const loginBtn = document.querySelector('.login-form-btn');
const adminLog = document.querySelector('.admin-log');
const adminForm = document.querySelector('.admin');

const postData = async (url, data) => {
    let res = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    });

    return await res.json();
};

const getResourse = async (url) => {
    let res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Could not fetch ${url}, status: ${res.status}`)
    }
    return await res.json();
};

const adminModal = () => {
    headerBtn.style.display = "none";
    userForm.style.display = "none";
    adminLog.style.display = "block";
    modal.style.display = "none";
    adminForm.style.display = "flex";
    adminForm.innerHTML = '';
    cards();
}

const userFormBtn = document.querySelector('.user-form-btn');

userFormBtn.addEventListener('click', async () => {
    const userDatas = document.querySelectorAll('.user-form-input');
    let dataObject = {};
    let inputChecker = [false, false, false, false, false, false, true, true, false];
    userDatas.forEach((item, key) => {
        dataObject[item.name] = item.value;
        if (item.value != "") {
            inputChecker[key] = true;
        } else {
            inputChecker[key] = inputChecker[key];
        }
    });
    if (inputChecker.every(item => item == true)) {
        const json = JSON.stringify(dataObject);
        postData('http://localhost:3000/userposts', json)
        .then(data => alert('Данные отправлены успешно'))
        .catch(() => alert('Oops, что-то пошло не так'))
        .finally(() => location.reload())
    } else {
        alert('Не все поля заполнены')
    }
})

function deleteItem(id) {
    fetch(`http://localhost:3000/userposts/${id}`, {
        method: "DELETE"
    }).then(() => console.log('yeah'))
    .catch(() => console.log('oh no'));
    adminModal();
}

const cards = () => {
    class MenuCard {
        constructor(surname, name, fatherName, phone, street, house, entrance, flat, type, id, parentSelector) {
            this.surname = surname;
            this.name = name;
            this.fatherName = fatherName;
            this.phone = phone;
            this.street = street;
            this.house = house;
            this.entrance = entrance;
            this.flat = flat;
            this.type = type;
            this.id = id;
            this.parent = document.querySelector(parentSelector);
        }

        render() {
            const element = document.createElement('div');
            element.classList.add('admin-item');

            element.innerHTML = `
            <table>
                <tr>
                    <td>Фамилия</td>
                    <td>${this.surname}</td>
                </tr>
                <tr>
                    <td>Имя</td>
                    <td>${this.name}</td>
                </tr>
                <tr>
                    <td>Отчество</td>
                    <td>${this.fatherName}</td>
                </tr>
                <tr>
                    <td>Номер телефона</td>
                    <td>${this.phone}</td>
                </tr>
                <tr>
                    <td>Улица</td>
                    <td>${this.street}</td>
                </tr>
                <tr>
                    <td>Дом</td>
                    <td>${this.house}</td>
                </tr>
                <tr>
                    <td>Подъезд</td>
                    <td>${this.entrance}</td>
                </tr>
                <tr>
                    <td>Квартира</td>
                    <td>${this.flat}</td>
                </tr>
                <tr>
                    <td>Название бытовой техники</td>
                    <td>${this.type}</td>
                </tr>
                <tr>
                    <td>id</td>
                    <td>${this.id}</td>
                </tr>
            </table>
            <input class="admin-item-btn" onclick="deleteItem(${this.id})" type="button" value="Удалить">
            `;
            this.parent.append(element);
        }
    };

    getResourse('http://localhost:3000/userposts')
        .then(data => {
            data.forEach(({surname, name, fatherName, phone, street, house, entrance, flat, type, id}) => {
                new MenuCard(surname, name, fatherName, phone, street, house, entrance, flat, type, id, '.admin').render();
            });
        });
};

const modal = document.querySelector('.modal');
const headerBtn = document.querySelector('.header-btn');
let id = 1;

headerBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

window.addEventListener('click', (e) => {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
});

loginBtn.addEventListener('click', () => {
    const login = loginDatas[0].value;
    const password = loginDatas[1].value;

    if (login == "admin" && password == "admin") {
        adminModal();
    } else {
        modal.style.display = "none";
        loginDatas.forEach(item => item.value = "")
    }
});
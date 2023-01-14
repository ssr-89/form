'use strict'
document.addEventListener('DOMContentLoaded', function () {
  const form = document.forms['form']; // forms - специальный метод для работы с формами с указанием значения 'name'
  const button = form.elements['button'];

  const inputArr = Array.from(form); // массив всех инпутов
  const validInputArr = []; // в этом массиве хранятся поля, которые надо проверить

  inputArr.forEach(function (el) {
    if (el.hasAttribute('data-reg')) { // если у элемента есть атрибут data-reg
      el.setAttribute('is-valid', '0'); // проверка атрибута на валидность???
      validInputArr.push(el); // тогда элемент добавляем в массив
    }
  });

  form.addEventListener('input', inputHandler);
  form.addEventListener('submit', formCheck); // событие submit на всю форму

  function inputHandler({ target }) { // target - цель, по которой будет клик 'input'
    if (target.hasAttribute('data-reg')) { // ищем элемент с атрибутом data-reg
      inputCheck(target);
    }
  }

  function inputCheck(el) {
    const inputValue = el.value; // считываем введённое значение в input
    const inputReg = el.getAttribute('data-reg'); // считываем значение атрибута data-reg
    const reg = new RegExp(inputReg);
    if (reg.test(inputValue)) { // проверяет введённые значения в input
      el.style.border = "2px solid rgba(0,196,0,1)";
      el.setAttribute('is-valid', '1'); // если валид, то добавляем в 1 позицию
    } else {
      el.style.border = "2px solid rgba(255,0,0,1)";
      el.setAttribute('is-valid', '0'); // если невалид, то добавляем в 0 позицию
    }
  }

  function formCheck(e) {
    e.preventDefault();
    const isAllValid = [];
    validInputArr.forEach(function (el) {
      isAllValid.push(el.getAttribute('is-valid')); // добавляем элементы с атрибутом is-valid в массив isAllValid
    });
    // console.log(isAllValid);
    const isValid = isAllValid.reduce(function (acc, current) { // проверка всех инпутов на 1
      return acc && current;
    });
    console.log(Boolean(Number(isValid)));
    if (!Boolean(Number(isValid))) {
      alert("Заполните поля правильно!");
      return;
    }
    formSubmit();
  }

  async function formSubmit() {
    const data = serializeForm(form); // все данные с формы
    const response = await sendData(data); // await - считывает ответ?
    if (response.ok) { // после отправки выводится сообщение об успешности отправки
      let result = await response.json();  // await - считывает ответ?
      alert(result.message);
      formReset(); // сбрасывает все поля формы
    } else {
      alert("Код ошибки: " + response.status); // код ошибки
      formReset(); // сбрасывает все поля формы
    }
  }

  function serializeForm(formNode) {
    return new FormData(form); // объект FormData представляет данные с HTML-формы
  }

  async function sendData(data) {
    return await fetch("send_mail.php", { // функция fetch отправляет запрос ассинхронно, тем самым отправляя форму без перезагрузки
      method: "POST",
      body: data,
    });
  }

  function formReset() { // сбрасывает все поля формы
    form.reset();
    validInputArr.forEach(function (element) {
      element.setAttribute("is-valid", 0);
      element.style.border = "none";
    });
  }
});
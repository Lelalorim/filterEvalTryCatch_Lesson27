//сравниваем тип каждого элемента массива с переданным в функцию. оставляем в массиве только прошедшие проверку на соответствие
const filterByType = (type, ...values) => values.filter(value => typeof value === type),

	// обьявлена переменная - функция скрыть все блоки с текстовым полем.
	hideAllResponseBlocks = () => { 
		//получаем в массив из HTMLколлекции со страницы всех div с классом "dialog__response-block"
		const responseBlocksArray = Array.from(document.querySelectorAll('div.dialog__response-block'));
		// для каждого div задаем стиль display: none;
		responseBlocksArray.forEach(block => block.style.display = 'none');
	},

	// обьявлена переменная - функция. принимаем класс div, текст и id элемента span.
	showResponseBlock = (blockSelector, msgText, spanSelector) => {
		//скрыть все блоки с ответом
		hideAllResponseBlocks();
		//получаем div с классом, задаем стиль display="block"
		document.querySelector(blockSelector).style.display = 'block';
		//если был передан id элемента span
		if (spanSelector) {
			//получаем span и в него пишем текст
			document.querySelector(spanSelector).textContent = msgText;
		}
	},
	//вызываем showResponseBlock div и span для ошибки. Используется если тип элемента в массиве значений из инпута будет неопределен. Например символ/текст без ковычек. или знаки препинания
	showError = msgText => showResponseBlock('.dialog__response-block_error', msgText, '#error'),
	//вызываем showResponseBlock div и span для вывода результата
	showResults = msgText => showResponseBlock('.dialog__response-block_ok', msgText, '#ok'),
	//вызываем showResponseBlock div с сообщением:  Пока что нечего показать.
	showNoResults = () => showResponseBlock('.dialog__response-block_no-results'),

	//принимаем тип из selector(тип данных) и содержимое инпута(Данные) 
	tryFilterByType = (type, values) => {
		//начало блока трай
		try {
			//в переменную пишем в строку через запятую результат функции filterByType в которую передаем тип из selector(тип данных) и содержимое инпута(Данные)
			const valuesArray = eval(`filterByType('${type}', ${values})`).join(", ");
			//если получили какие то данные(т.е. совпали типы данных)
			const alertMsg = (valuesArray.length) ?
			//в переменную присваиваем строку `Данные с типом тип из selector(тип данных): и valuesArray`
				`Данные с типом ${type}: ${valuesArray}` :
			//valuesArray - пустой массив поэтому пишем `Отсутствуют данные типа тип из selector(тип данных)`
				`Отсутствуют данные типа ${type}`;
			//вызов функции showResults
			showResults(alertMsg);
			//если будет ошибка продолжить выполнение кода
		} catch (e) {
			//вызов функции showError, передать в нее текст ошибки
			showError(`Ошибка: ${e}`);
		}
	};
//получаем кнопку фильтровать со страницы
const filterButton = document.querySelector('#filter-btn');
//навешиваем слушатель события клик
filterButton.addEventListener('click', e => {
	//получем select со страницы с id  type
	const typeInput = document.querySelector('#type');
	//получем input со страницы с id  data
	const dataInput = document.querySelector('#data');
	// если dataInput пустой
	if (dataInput.value === '') {
		//задаем текст:Поле не должно быть пустым! для подсказки валидации
		dataInput.setCustomValidity('Поле не должно быть пустым!');
		//выполнить showNoResults (показать блок)
		showNoResults();
		//dataInput непустой
	} else {
		//задаем пустую строку для подсказки валидации
		dataInput.setCustomValidity('');
		//запрещаем выполнение события поумолчанию(т.к. кнопка submit-запрещаем отправку формы, что бы не перезагружалась страница)
		e.preventDefault();
		//передаем значение селектора и инпута в tryFilterByType. Обрезаются пробелы вначале и в конце
		tryFilterByType(typeInput.value.trim(), dataInput.value.trim());
	}
});


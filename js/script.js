const $todoListSection = document.getElementById('todo-list');
const $addBtn = document.querySelector('.add-todo-btn');
const $todoTemplate = document.getElementById('todo-template');
const STORAGE_KEY = 'todo-datas';

// 저장용 TODO 목록
let todoList = [];

// 새 TODO 입력 항목 추가
function showInlineInput() {
	if (document.querySelector('.todo-item.editing')) return;

	const $clonedTemplate = $todoTemplate.content.cloneNode(true);
	const $todoContainer = $clonedTemplate.querySelector('.todo-item');
	const $checkbox = $clonedTemplate.querySelector('input[type="checkbox"]');
	const $todoText = $clonedTemplate.querySelector('.todo-text');
	const $todoInput = $clonedTemplate.querySelector('.edit-input');
	const $editBtn = $clonedTemplate.querySelector('.edit-btn');
	const $delBtn = $clonedTemplate.querySelector('.delete-btn');

	$checkbox.disabled = true;
	$todoText.classList.add('hidden');
	$todoInput.classList.remove('hidden');
	$todoContainer.classList.add('editing');

	$editBtn.addEventListener('click', () => {
		const text = $todoInput.value.trim();
		if (text) {
			todoList.unshift({ text, done: false });
			saveTodoList();
			renderTodoList();
		}
		$todoContainer.remove();
	});

	$delBtn.addEventListener('click', () => {
		$todoContainer.remove();
	});

	$todoInput.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') $editBtn.click();
		else if (e.key === 'Escape') $delBtn.click();
	});

	$todoInput.addEventListener('blur', () => {
		const text = $todoInput.value.trim();
		if (text) {
			$editBtn.click();
		}
	});

	$todoListSection.prepend($clonedTemplate);
	$todoInput.focus();
}

// 저장하기
function saveTodoList() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(todoList));
}

// 저장된 정보 가져오기
function loadTodoList() {
	const savedTodoList = localStorage.getItem(STORAGE_KEY);
	if (savedTodoList) {
		todoList = JSON.parse(savedTodoList);
	}
	renderTodoList();
}

// 저장된 TODO 목록 그리기
function renderTodoList() {
	
	$todoListSection.innerHTML = '';
	
	todoList.forEach((todo, index) => {
		const $clonedTemplate = $todoTemplate.content.cloneNode(true);
		const $todoContainer = $clonedTemplate.querySelector('.todo-item');
		const $checkbox = $clonedTemplate.querySelector('input[type="checkbox"]');
		const $todoText = $clonedTemplate.querySelector('.todo-text');
		const $todoInput = $clonedTemplate.querySelector('.edit-input');
		const $editBtn = $clonedTemplate.querySelector('.edit-btn');
		const $delBtn = $clonedTemplate.querySelector('.delete-btn');

		$checkbox.checked = todo.done;
		$todoText.textContent = todo.text;
		$todoInput.value = todo.text;
		$todoInput.classList.add('hidden');
		$todoContainer.classList.toggle('completed', todo.done);

		$checkbox.addEventListener('change', (e) => {
			todoList[index].done = e.target.checked;
			saveTodoList();
			//renderTodoList();
			$todoContainer.classList.toggle('completed', e.target.checked);
		});

		$editBtn.addEventListener('click', () => {
			var oldText = $todoInput.value;
			$todoText.classList.add('hidden');
			$todoInput.classList.remove('hidden');
			$todoInput.focus();
			
			$todoInput.addEventListener('keydown', (e) => {
				if (e.key === 'Enter') {
					const newText = $todoInput.value.trim();
					if (newText) {
						todoList[index].text = newText;
						saveTodoList();
						//renderTodoList();
						$todoText.textContent = newText;
						$todoText.classList.remove('hidden');
						$todoInput.classList.add('hidden');
					}
				} else if (e.key === 'Escape') {
					$todoInput.value = oldText;
					$todoText.classList.remove('hidden');
					$todoInput.classList.add('hidden');
				}
			});
			
			$todoInput.addEventListener('blur', () => {
				const newText = $todoInput.value.trim();
				if (newText) {
					if (oldText === newText) {
						$todoInput.value = oldText;
						$todoText.classList.remove('hidden');
						$todoInput.classList.add('hidden');
					} else {
						todoList[index].text = newText;
						saveTodoList();
						//renderTodoList();
						$todoText.textContent = newText;
						$todoText.classList.remove('hidden');
						$todoInput.classList.add('hidden');
					}
				}
			});
		});

		$delBtn.addEventListener('click', () => {
			todoList.splice(index, 1);
			saveTodoList();
			renderTodoList();
		});

		$todoListSection.appendChild($todoContainer);
	});
}

$addBtn.addEventListener('click', showInlineInput);
loadTodoList();

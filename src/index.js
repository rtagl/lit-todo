import { html, css, LitElement } from 'lit';

class TodoApp extends LitElement {
	constructor() {
		super();
		this.todos = [
			{ text: 'Read 30 mins', finished: true },
			{ text: 'Feed puppy', finished: false },
			{ text: 'Make Dinner', finished: false },
			{ text: 'Groceries', finished: false },
		];
	}

	static properties = {
		todos: { type: Array },
	};

	_addTodo() {
		const input = this.shadowRoot.getElementById('addTodoInput');
		const text = input.value;
		input.value = '';

		this.todos = [...this.todos, { text, finished: false }];
	}

	_removeTodo(e) {
		this.todos = this.todos.filter((todo) => todo !== e.detail);
	}

	_changeTodoFinished(e) {
		const { changedTodo, finished } = e.detail;

		this.todos = this.todos.map((todo) => {
			if (todo !== changedTodo) {
				return todo;
			}
			return { ...changedTodo, finished };
		});
	}

	render() {
		const finishedCount = this.todos.filter((e) => e.finished).length;
		const unfinishedCount = this.todos.length - finishedCount;

		return html`
			<h1>Todo App</h1>

			<input id="addTodoInput" placeholder="Name" />
			<button @click="${this._addTodo}">Add</button>

			<todo-list
				@change-todo-finished="${this._changeTodoFinished}"
				@remove-todo="${this._removeTodo}"
				.todos=${this.todos}></todo-list>

			<div>Total finished: ${finishedCount}</div>
			<div>Total unfinished: ${unfinishedCount}</div>

			${footerTemplate}
		`;
	}
}

class TodoList extends LitElement {
	static properties = {
		todos: { type: Array },
	};

	static styles = css`
		:host {
			color: blue;
		}

		ul {
			list-style: none;
			padding: 0;
		}

		button {
			background-color: transparent;
			border: none;
		}
	`;

	_changeTodoFinished(e, changedTodo) {
		const eventDetails = { changedTodo, finished: e.target.checked };
		this.dispatchEvent(
			new CustomEvent('change-todo-finished', { detail: eventDetails })
		);
	}

	_removeTodo(item) {
		this.dispatchEvent(new CustomEvent('remove-todo', { detail: item }));
	}

	render() {
		if (!this.todos) {
			return html``;
		}
		return html`
			<ul>
				${this.todos.map(
					(todo) =>
						html` <li>
							<input
								type="checkbox"
								.checked=${todo.finished}
								@change=${(e) => this._changeTodoFinished(e, todo)} />
							${todo.text} ${todo.text}
							(${todo.finished ? 'finished' : 'unfinished'})
							<button @click=${() => this._removeTodo(todo)}>X</button>
						</li>`
				)}
			</ul>
		`;
	}
}

const author = 'open-wc';
const homepage = 'https://open-wc.org/';
const footerTemplate = html`<footer>
	Made with love by <a href=${homepage}>${author}</a>
</footer>`;

customElements.define('todo-app', TodoApp);
customElements.define('todo-list', TodoList);

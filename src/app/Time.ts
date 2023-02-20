export default class Time {
	#name: string = '';
	#timeContainer: HTMLDivElement;
	#dayContainer: HTMLDivElement;
	#greetingContainer: HTMLInputElement;
	#options: Intl.DateTimeFormatOptions = {
		month: 'long',
		weekday: 'long',
		day: 'numeric',
	};
	constructor(container: HTMLDivElement, dayContainer: HTMLDivElement, greetingContainer: HTMLInputElement) {
		this.#timeContainer = container;
		this.#dayContainer = dayContainer;
		this.#greetingContainer = greetingContainer;
	}
	#time() {
		const date = new Date();
		this.#timeContainer.textContent = date.toLocaleTimeString();
		this.#dayContainer.textContent = date.toLocaleDateString('ru-RU', this.#options);
	}
	#greeting() {
		const text = this.#name;
	}
	init() {
		this.#time();
	}
}

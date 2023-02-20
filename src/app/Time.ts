export default class Time {
	#name: string | null = '';
	#timeContainer: HTMLDivElement;
	#dayContainer: HTMLDivElement;
	#greetingContainer: HTMLDivElement;
	#input: HTMLInputElement;
	#options: Intl.DateTimeFormatOptions = {
		month: 'long',
		weekday: 'long',
		day: 'numeric',
	};
	constructor(container: HTMLDivElement, dayContainer: HTMLDivElement, greetingContainer: HTMLDivElement) {
		this.#timeContainer = container;
		this.#dayContainer = dayContainer;
		this.#greetingContainer = greetingContainer;
		this.#input = this.#greetingContainer.querySelector('input') as HTMLInputElement;
		this.#getLocalStorage();
		this.#setLocalStorage();
		this.#setName();
	}
	#time() {
		const date = new Date();
		this.#timeContainer.textContent = date.toLocaleTimeString();
		this.#dayContainer.textContent = date.toLocaleDateString('ru-RU', this.#options);
	}
	#greeting() {
		const hr = new Date().getHours();
		let datePart = this.getDayPart(hr);

		this.#greetingContainer.firstElementChild!.textContent = `Good ${datePart}`;
		if (this.#name) {
			this.#input.value = this.#name
				.split('')
				.map((char, i) => {
					return i === 0 ? char.toUpperCase() : char;
				})
				.join('');
		}
	}
	#setLocalStorage() {
		document.addEventListener('visibilitychange', () => {
			if (document.visibilityState === 'hidden' && this.#name) {
				localStorage.setItem('name', this.#name);
			}
		});
	}
	#setName() {
		this.#input.addEventListener('input', () => {
			this.#name = this.#input.value;
		});
	}
	#getLocalStorage() {
		this.#name = localStorage.getItem('name') ? localStorage.getItem('name') : this.#name;
		this.#greeting();
	}
	getDayPart(hour: number) {
		let partOfDay: string = '';
		if (hour < 12) {
			partOfDay = 'morning';
		}
		if (12 <= hour && hour < 16) {
			partOfDay = 'afternoon';
		}
		if (16 <= hour && hour < 24) {
			partOfDay = 'evening';
		}
		return partOfDay;
	}
	init() {
		this.#time();
	}
}

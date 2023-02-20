const greatingText = {
	утро: 'Доброе утро',
	день: 'Добрый день',
	вечер: 'Добрый вечер',
	ночь: 'Доброй ночи',
	morning: 'Good morning',
	afternoon: 'Good afternoon',
	evening: ' Good evening',
	night: ' Good night',
};

type TDayTimeEng = 'morning' | 'afternoon' | 'evening' | 'night';

export default class Time {
	#name: string | null = '';
	#timeContainer: HTMLDivElement;
	#dayContainer: HTMLDivElement;
	#greetingContainer: HTMLDivElement;
	#input: HTMLInputElement;
	#hour!: number;
	observer!: { (t: TDayTimeEng): void } | null;
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
		if (this.#hour !== date.getHours()) {
			this.#hour = date.getHours();
			this.#greeting();
		}
	}
	#greeting() {
		this.#hour = new Date().getHours();
		let datePart: keyof typeof greatingText = this.getDayPart(this.#hour, { rus: 'rus' });
		this.#greetingContainer.firstElementChild!.textContent = greatingText[datePart];
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
	getDayPart(hour: number, o?: { rus?: 'rus' }) {
		const rus = o?.rus;

		let partOfDay: keyof typeof greatingText;
		if (6 < hour && hour < 12) {
			partOfDay = rus ? 'утро' : 'morning';
		}
		if (12 <= hour && hour < 18) {
			partOfDay = rus ? 'день' : 'afternoon';
		}
		if (18 <= hour && hour < 24) {
			partOfDay = rus ? 'вечер' : 'evening';
		}
		if (0 <= hour && hour < 6) {
			partOfDay = rus ? 'ночь' : 'night';
		}
		if (this.observer) {
			this.observer(partOfDay! as TDayTimeEng);
		}
		return partOfDay!;
	}
	init() {
		this.#time();
	}
}

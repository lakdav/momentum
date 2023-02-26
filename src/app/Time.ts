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
	name: string | null = '';
	timeContainer: HTMLDivElement;
	dayContainer: HTMLDivElement;
	greetingContainer: HTMLDivElement;
	input: HTMLInputElement;
	hour!: number;
	observer!: { (t: TDayTimeEng): void } | null;
	lang = 'ru';
	options: Intl.DateTimeFormatOptions = {
		month: 'long',
		weekday: 'long',
		day: 'numeric',
	};
	constructor(container: HTMLDivElement, dayContainer: HTMLDivElement, greetingContainer: HTMLDivElement) {
		this.timeContainer = container;
		this.dayContainer = dayContainer;
		this.greetingContainer = greetingContainer;
		this.input = this.greetingContainer.querySelector('input') as HTMLInputElement;
		this.getLocalStorage();
		this.setLocalStorage();
		this.setName();
	}

	setLang = (val: string) => {
		this.lang = val;
	};
	time = () => {
		const date = new Date();
		const local = this.lang === 'ru' ? 'ru-RU' : 'en-EN';
		this.timeContainer.textContent = date.toLocaleTimeString();
		this.dayContainer.textContent = date.toLocaleDateString(local, this.options);
		if (this.hour !== date.getHours()) {
			this.hour = date.getHours();
			this.greeting();
		}
	};
	greeting = () => {
		this.hour = new Date().getHours();
		let datePart: keyof typeof greatingText = this.getDayPart(new Date().getHours());
		this.greetingContainer.firstElementChild!.textContent = greatingText[datePart];
		if (this.name) {
			this.input.value = this.name
				.split('')
				.map((char, i) => {
					return i === 0 ? char.toUpperCase() : char;
				})
				.join('');
		}
	};
	setLocalStorage() {
		document.addEventListener('visibilitychange', () => {
			if (document.visibilityState === 'hidden' && this.name) {
				localStorage.setItem('name', this.name);
			}
		});
	}
	setName() {
		this.input.addEventListener('input', () => {
			this.name = this.input.value;
		});
	}
	getLocalStorage() {
		this.name = localStorage.getItem('name') ? localStorage.getItem('name') : this.name;
		this.greeting();
	}
	getDayPart = (hour: number) => {
		let partOfDay: keyof typeof greatingText;
		if (6 < hour && hour < 12) {
			partOfDay = this.lang === 'ru' ? 'утро' : 'morning';
		}
		if (12 <= hour && hour < 18) {
			partOfDay = this.lang === 'ru' ? 'день' : 'afternoon';
		}
		if (18 <= hour && hour < 24) {
			partOfDay = this.lang === 'ru' ? 'вечер' : 'evening';
		}
		if (0 <= hour && hour < 6) {
			partOfDay = this.lang === 'ru' ? 'ночь' : 'night';
		}
		if (this.observer) {
			this.observer(Time.serialize(partOfDay!));
		}
		return partOfDay!;
	};
	init() {
		this.time();
	}
	static serialize(val: keyof typeof greatingText) {
		let result: TDayTimeEng = val as any;
		if (val === 'утро') {
			result = 'morning';
		}
		if (val === 'день') {
			result = 'afternoon';
		}
		if (val === 'вечер') {
			result = 'evening';
		}
		if (val === 'ночь') {
			result = 'night';
		}
		return result!;
	}
}

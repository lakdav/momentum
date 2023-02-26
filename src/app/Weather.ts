interface IWeatherData {
	coord: {
		lon: number;
		lat: number;
	};
	weather: {
		id: number;
		main: string;
		description: string;
		icon: string;
	}[];
	base: string;
	main: {
		temp: number;
		feels_like: number;
		temp_min: number;
		temp_max: number;
		pressure: number;
		humidity: number;
		sea_level: number;
		grnd_level: number;
		visibility: number;
	};
	wind: {
		speed: number;
		deg: number;
		gust: number;
	};
	rain: {
		'1h': number;
	};
	clouds: {
		all: number;
	};
	dt: number;
	sys: {
		type: number;
		id: number;
		country: string;
		sunrise: number;
		sunset: number;
	};
	timezone: number;
	id: number;
	name: string;
	cod: number;
}

class Weather {
	#url = 'https://api.openweathermap.org/data/2.5/weather';
	#apiKey = '747cc22cb8ac02246b97751fa6e43d6f';
	city!: string;
	#lang = 'ru';
	#container!: HTMLDivElement;

	data!: IWeatherData | null;
	constructor(container: string) {
		this.setCity();
		this.getWether();
		this.#container = document.querySelector(container) as HTMLDivElement;
		this.#container.querySelector('input')!.value = this.city;
		this.#container.querySelector('input')?.addEventListener('change', this.changeSity);
	}
	setCity() {
		const defaultCity = this.#lang === 'ru' ? 'Минск' : 'Minsk';
		this.city = localStorage.getItem('city') ? (localStorage.getItem('city') as string) : defaultCity;
	}
	get lang() {
		return this.#lang;
	}
	set lang(val) {
		this.#lang = val;
		this.getWether();
	}
	async getWether() {
		try {
			const response = await fetch(
				`${this.#url}/?q=${this.city}&lang=${this.#lang}&appid=${this.#apiKey}&units=metric`,
			);
			if (!response.ok) {
				const msg =
					this.#lang === 'ru'
						? `Ошибка !!!.Город ${this.city} не найденo !!!`
						: `Error !!!.City ${this.city} not found !!!`;
				throw new Error(msg);
			}
			this.data = await response.json();
			this.init();
		} catch (error) {
			throw error;
		}
	}
	changeSity = async (e: Event) => {
		const target = e.target as HTMLInputElement;
		const value = target.value;
		this.city = value;
		try {
			await this.getWether();
			localStorage.setItem('city', this.city);
		} catch (error) {
			if (error instanceof Error) {
				this.#container.querySelector('.weather-error')!.textContent = error.message;
				this.reset();
			}
		}
	};
	init() {
		const { humidity, temperature, speed, weatherDescription, weatherIcon, error } = this.views();
		error.textContent = '';
		weatherIcon.className = 'weather-icon owf';
		weatherIcon.classList.add(`owf-${this.data?.weather[0].id}`);
		temperature.textContent = `${this.data?.main.temp} °C`;
		weatherDescription.textContent = this.data?.weather[0].description as string;
		speed.textContent = `${this.#lang === 'ru' ? 'Cкорость ветра' : 'Wind speed'}: ${this.data?.wind.speed.toFixed()} ${
			this.#lang === 'ru' ? 'м/c' : 'm/s'
		}`;
		humidity.textContent = `${this.#lang === 'ru' ? 'Bлажность' : 'humidity'}: ${this.data?.main.humidity}%`;
	}
	views() {
		const weatherIcon = this.#container.querySelector('.weather-icon')!;
		const temperature = this.#container.querySelector('.temperature')!;
		const weatherDescription = this.#container.querySelector('.weather-description')!;
		const speed = this.#container.querySelector('.speed')!;
		const humidity = this.#container.querySelector('.humidity')!;
		const error = this.#container.querySelector('.weather-error')!;
		return { weatherIcon, temperature, weatherDescription, speed, humidity, error };
	}
	reset() {
		const { humidity, temperature, speed, weatherDescription, weatherIcon } = this.views();
		weatherIcon.className = 'weather-icon owf';
		temperature.textContent = ``;
		weatherDescription.textContent = '';
		speed.textContent = ``;
		humidity.textContent = ``;
	}
}
export default Weather;

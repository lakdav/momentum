import Time from './Time';
import Slide from './Slide';
import { view } from './view';
import Weather from './Weather';
import Quotes from './Quotes';
import { qoutes } from './qoutes';
import Sound from './Sound';
import audio1 from '../assets/sounds/Aqua_Caelestis.mp3';
import audio2 from '../assets/sounds/Ennio_Morricone.mp3';
import audio3 from '../assets/sounds/River_Flows_In_You.mp3';
import audio4 from '../assets/sounds/Summer_Wind.mp3';
const app = () => {
	interface IApi_Otions {
		weatherApi: boolean;
		timeApi: boolean;
		musicApi: boolean;
		qouteApi: boolean;
	}
	type ILang = 'ru' | 'en';
	const api_Otions = localStorage.getItem('options')
		? (JSON.parse(localStorage.getItem('options')!) as IApi_Otions)
		: {
				weatherApi: true,
				timeApi: true,
				musicApi: true,
				qouteApi: true,
		  };

	const Lang = localStorage.getItem('lang') ? (localStorage.getItem('lang') as ILang) : 'ru';

	view.checkboies.forEach((checkboies) => {
		checkboies.checked = api_Otions[checkboies.name as keyof IApi_Otions];
		const api = document.getElementById(checkboies.name) as HTMLDivElement;
		if (api_Otions[checkboies.name as keyof IApi_Otions]) {
			api!.style.display = 'flex';
		} else {
			api!.style.display = 'none';
		}
	});

	const { dayContainer, greetingContainer, timeContainer } = view;
	const time = new Time(timeContainer, dayContainer, greetingContainer);
	const showTime = () => {
		time.init();
		setTimeout(showTime, 1000);
	};
	showTime();
	const slide = new Slide(Time.serialize(time.getDayPart(new Date().getHours())));
	time.observer = slide.setTag;
	slide.setBg();
	slide.ms = 6000 * 30;
	slide.animateSLide();

	const wether = new Weather('.weather');

	const qouteAPi = new Quotes(qoutes, Lang || 'ru');

	const audioUrl = [audio1, audio2, audio3, audio4] as string[];

	const sound = new Sound(audioUrl);
	view.play?.addEventListener('click', () => {
		sound.switch();
		if (!sound.paused) {
			view.play.classList.add('pause');
		} else {
			view.play.classList.remove('pause');
		}
	});
	view.next?.addEventListener('click', () => {
		sound.next();
	});
	view.prev?.addEventListener('click', () => {
		sound.prev();
	});
	const activeListName = (index: number) => {
		const ListNameArr = Array.from(view.listName);
		ListNameArr.forEach((el, i) => {
			if (i !== index) {
				el.classList.remove('active');
				el.classList.remove('playactive');
			}
			if (i === index) {
				view.title.textContent = el.textContent;
				el.classList.add('active');
				if (!sound.paused) {
					el.classList.add('playactive');
				} else {
					el.classList.remove('playactive');
				}
			}
		});
	};

	view.listName.forEach((el, i) => {
		el.addEventListener('click', () => {
			sound.create(i);
			view.play.classList.add('pause');
			sound.play();
		});
	});

	activeListName(sound.index);
	sound.observe = activeListName;

	view.muted.addEventListener('click', () => {
		if (sound.muted) {
			sound.muted = false;
			view.muted.classList.remove('muted');
		} else {
			sound.muted = true;
			view.muted.classList.add('muted');
		}
	});
	view.volume.addEventListener('input', () => {
		const volume = +view.volume.value / 100;
		sound.volume = volume;
	});

	const duration = () => {
		if (sound.paused) {
		} else {
			if (sound.audio && isFinite(sound.audio?.duration)) {
				console.log('work');
				(view.duration.lastElementChild as HTMLSpanElement).textContent = `${Math.floor(
					sound.audio?.duration / 60,
				)}:${Math.ceil(sound.audio?.duration % 60)}`;
				(view.duration.firstElementChild as HTMLSpanElement).textContent = `${Math.floor(
					sound.audio?.currentTime / 60,
				)}:${Math.ceil(sound.audio?.currentTime % 60)
					.toString()
					.padStart(2, '0')}`;
				const progress = (sound.audio.currentTime / sound.audio.duration) * 100;
				view.progress.value = progress;
			}
		}

		requestAnimationFrame(duration);
	};

	duration();

	sound.ended = () => view.next.click();

	view.progress.addEventListener('click', (e) => {
		const w = view.progress.getBoundingClientRect().width;
		const l = view.progress.getBoundingClientRect().left;
		const val = ((e.clientX - l) / w) * 100;
		if (sound.audio && isFinite(sound.audio?.duration)) {
			const currentTime = (sound.audio?.duration / 100) * val;
			sound.audio.currentTime = currentTime;
			view.progress.value = val;
		}
	});
	const optionsTitle = (val: boolean) => {
		view.apiOPtions.querySelector('.api-lang > .api-title')!.textContent = val ? 'Язык' : 'Language';
		view.apiOPtions.querySelector('.api-node > #weather')!.textContent = val ? 'Погода' : 'Weather';
		view.apiOPtions.querySelector('.api-node > #time')!.textContent = val ? 'Время' : 'Time';
		view.apiOPtions.querySelector('.api-node > #music')!.textContent = val ? 'Музыка' : 'Music';
		view.apiOPtions.querySelector('.api-node > #qoute')!.textContent = val ? 'Цитата' : 'Qoute';
	};
	const setLang = (val: string) => {
		wether.lang = val;
		time.setLang(val);
		time.greeting();
	};
	const isRu = (val: string) => {
		return val === 'ru';
	};

	const setLanguage = (val: string) => {
		setLang(val);
		optionsTitle(isRu(val));
		qouteAPi.lang = val;
		qouteAPi.init();
	};
	setLanguage(Lang);

	view.langs.forEach((lang) => {
		if (lang.value === Lang) {
			lang.checked = true;
		}
	});

	view.langs.forEach((lang) => {
		lang.addEventListener('change', (e) => {
			const val = (e.target as HTMLInputElement).value;
			setLanguage(val);
			localStorage.setItem('lang', val);
		});
	});
	view.checkboies.forEach((checkbox) => {
		checkbox.addEventListener('change', (e) => {
			const api = document.getElementById(checkbox.name);
			if (checkbox.checked) {
				api!.style.display = 'flex';
			} else {
				api!.style.display = 'none';
				if (checkbox.name === 'musicApi') {
					sound.audio?.pause();
				}
			}
			api_Otions[checkbox.name as keyof IApi_Otions] = checkbox.checked;
			localStorage.setItem('options', JSON.stringify(api_Otions));
		});
	});
	view.toggle.addEventListener('click', () => {
		view.apiOPtions.classList.toggle('active');
	});
	document.addEventListener('click', (e) => {
		const target = e.target as HTMLElement;
		if (target.closest('.optionsToggle') || target.closest('.api-option')) {
			return;
		}
		view.apiOPtions.classList.remove('active');
	});
};

export default app;

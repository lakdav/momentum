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
	const { dayContainer, greetingContainer, timeContainer } = view;
	const time = new Time(timeContainer, dayContainer, greetingContainer);
	const showTime = () => {
		time.init();
		setTimeout(showTime, 1000);
	};
	showTime();
	const slide = new Slide(time.getDayPart(new Date().getHours()));
	time.observer = slide.setTag;
	slide.setBg();
	slide.ms = 6000 * 30;
	slide.animateSLide();

	new Weather('.weather');

	new Quotes(qoutes);

	//mp3
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
			view.play.classList.add('pause');
			sound.create(i);
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
	duration();
	sound.ended = () => view.next.click();
};

export default app;

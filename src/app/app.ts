import Time from './Time';
import Slide from './Slide';
import { view } from './view';
import Weather from './Weather';

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

	const weather = new Weather('.weather');
};

export default app;

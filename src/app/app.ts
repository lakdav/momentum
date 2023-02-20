import Time from './Time';
const app = () => {
	const timeContainer = document.querySelector('.time') as HTMLDivElement;
	const dayContainer = document.querySelector('.date') as HTMLDivElement;
	const greetingContainer = document.querySelector('.greeting-container > input') as HTMLInputElement;
	const time = new Time(timeContainer, dayContainer, greetingContainer);
	const showTime = () => {
		time.init();
		setTimeout(showTime, 1000);
	};
	showTime();
};

export default app;

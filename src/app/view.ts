export const view = {
	timeContainer: document.querySelector('.time') as HTMLDivElement,
	dayContainer: document.querySelector('.date') as HTMLDivElement,
	greetingContainer: document.querySelector('.greeting-container') as HTMLDivElement,

	play: document.querySelector('.play') as HTMLButtonElement,
	prev: document.querySelector('.play-prev') as HTMLButtonElement,
	next: document.querySelector('.play-next') as HTMLButtonElement,
	listName: document.querySelectorAll('.play-list_name > button') as NodeListOf<HTMLButtonElement>,
	title: document.querySelector('.controls__title') as HTMLTitleElement,
	muted: document.querySelector('.voice > .voice__btn') as HTMLButtonElement,
	volume: document.querySelector('.voice > .voice__volume') as HTMLInputElement,
	duration: document.querySelector('.controls__progress-duration') as HTMLParagraphElement,
	progress: document.querySelector('.controls__progress > progress') as HTMLProgressElement,
};

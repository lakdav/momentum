import translate from 'translate';

export interface IQuotes {
	author: string;
	text: string;
}
class Quotes {
	quotes: IQuotes[];
	author: HTMLDivElement;
	changeBtn: HTMLButtonElement;
	text: HTMLDivElement;
	length: number;
	timer!: number;
	lang!: string;
	currentQuoteIndx!: number;
	constructor(quotes: IQuotes[], lang: string) {
		this.quotes = quotes;
		this.author = document.querySelector('.author') as HTMLDivElement;
		this.changeBtn = document.querySelector('.change-quote') as HTMLButtonElement;
		this.text = document.querySelector('.quote') as HTMLDivElement;
		this.length = quotes.length;
		this.init();
		this.lang = lang;
		this.changeBtn.addEventListener('click', this.init);
	}
	getRandomQuote = () => {
		this.currentQuoteIndx = Math.floor(Math.random() * (this.length - 0 + 1)) + 0;
	};
	selectQuote = () => {
		return this.quotes[this.currentQuoteIndx];
	};
	init = () => {
		clearTimeout(this.timer);
		this.animate();
	};
	start = async () => {
		this.getRandomQuote();
		const qoute = this.selectQuote();
		this.author.textContent = `${qoute.author}`;
		if (this.lang === 'ru') {
			this.text.textContent = `" ${await translate(qoute.text, 'rus')} "`;
		} else {
			this.text.textContent = `" ${qoute.text} "`;
		}
	};
	animate = () => {
		this.start();
		this.timer = window.setTimeout(() => this.animate(), 20000);
	};
}
export default Quotes;

function getRndInteger(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
export default class Slide {
	#_tag: string;
	index: number;
	#timer!: number;
	ms = 5000;
	constructor(tag: string) {
		this.#_tag = tag;
		this.index = getRndInteger(1, 20);
		document.getElementById('prev')?.addEventListener('click', this.prev);
		document.getElementById('next')?.addEventListener('click', this.next);
	}
	animateSLide() {
		this.next();
		this.#timer = window.setTimeout(() => {
			this.animateSLide();
		}, this.ms);
	}
	setBg = (animate = false) => {
		const img = new Image();
		img.src = `https://github.com/lakdav/stage1-tasks/blob/main/images/${this.#_tag}/${this.index
			.toString()
			.padStart(2, '0')}.jpg?raw=true`;
		img.addEventListener('load', (e) => {
			document.body.style.setProperty(
				'--bg',
				`URL(https://github.com/lakdav/stage1-tasks/blob/main/images/${this.#_tag}/${this.index
					.toString()
					.padStart(2, '0')}.jpg?raw=true)`,
			);
			if (animate) {
				document.documentElement.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, fill: 'forwards' });
			}
		});
		return img;
	};
	prev = () => {
		this.index++;
		if (this.index > 20) {
			this.index = 1;
		}
		this.setBg(true);
	};
	next = () => {
		this.index--;
		if (this.index < 1) {
			this.index = 20;
		}
		this.setBg(true);
	};
	setTag(val: string) {
		this.#_tag = val;
	}
}

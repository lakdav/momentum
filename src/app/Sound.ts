export default class Sound {
	list: string[];
	index = 0;
	audio!: HTMLAudioElement | null;
	#muted = false;
	#volum = 0.5;
	paused = true;
	observe!: (index: number) => void;
	ended!: () => void;
	constructor(list: string[]) {
		this.list = list;
		this.create();
	}
	create = (index?: number) => {
		if (index != null) {
			this.index = index;
		}
		if (this.audio) {
			this.audio.pause();
		}
		this.audio?.removeEventListener('ended', this.endedHandler);
		this.audio = new Audio(this.list[this.index]);
		this.audio.muted = this.#muted;
		this.audio.volume = this.#volum;
		this.audio.addEventListener('ended', this.endedHandler);
		if (this.observe) {
			this.observe(this.index);
		}
	};
	endedHandler = () => {
		this.ended();
	};
	get muted() {
		return this.#muted;
	}
	set muted(val) {
		if (this.audio) {
			this.audio.muted = val;
			this.#muted = val;
		}
	}
	get volume() {
		return this.#volum;
	}
	set volume(val) {
		if (this.audio) {
			this.audio.volume = val;
			this.#volum = val;
		}
	}
	switch() {
		this.play();
		if (this.observe) {
			this.observe(this.index);
		}
	}
	play = () => {
		if (!this.audio) throw new Error('Error');
		if (this.audio.paused) {
			this.audio.play();
			this.paused = false;
		} else {
			this.audio.pause();
			this.paused = true;
		}
		if (this.observe) {
			this.observe(this.index);
		}
	};
	prev = () => {
		this.index = this.index - 1 < 0 ? this.list.length - 1 : this.index - 1;
		this.create();
		this.on();
	};
	next = () => {
		this.index = this.index + 1 > this.list.length - 1 ? 0 : this.index + 1;
		this.create();
		this.on();
	};
	on = () => {
		if (!this.paused) {
			this.play();
		}
	};
}

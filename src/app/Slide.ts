import bg from '../assets/img/bg.jpg';
function getRndInteger(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
export default class Slide {
	_tag: string;
	index: number;
	timer!: number;
	ms = 10000;
	api: string;
	flickr!: string[];
	flickrTag?: string;
	length = 20;
	iT!: number;
	constructor(tag: string, api = 'github', flickrTag?: string) {
		this._tag = tag;
		this.api = api;
		if (flickrTag) {
			this.flickrTag = flickrTag;
		}

		this.index = getRndInteger(1, 20);
		document.getElementById('prev')?.addEventListener('click', this.prev);
		document.getElementById('next')?.addEventListener('click', this.next);
	}
	init = () => {
		clearTimeout(this.timer);
		this.setBg();
		setTimeout(() => {
			this.animateSLide();
		}, this.ms);
	};
	animateSLide = () => {
		this.index++;
		if (this.index > this.length) {
			this.index = 1;
		}
		this.setBg(true);
		this.timer = window.setTimeout(() => {
			this.animateSLide();
		}, this.ms);
	};
	setBg = async (animate = false) => {
		let url: string;
		if (this.api === 'github') {
			url = `https://github.com/lakdav/stage1-tasks/blob/main/images/${this._tag}/${this.index
				.toString()
				.padStart(2, '0')}.jpg?raw=true`;
		} else {
			if (!this.flickr) {
				await this.flickrFetch();
			}
			url = this.flickr[this.index];
		}
		const img = this.createImage(url);
		return img;
	};
	createImage = (url: string) => {
		const img = new Image();
		img.src = url!;
		img.addEventListener('load', (e) => {
			(document.querySelector('.bg') as HTMLDivElement).style.setProperty('--bg', `URL(${url})`);
			(document.querySelector('.bg') as HTMLDivElement).animate(
				[
					{ opacity: 0.85, scale: 1.2 },
					{ opacity: 1, scale: 1 },
				],
				{
					duration: 500,
					fill: 'forwards',
				},
			);
		});
		img.addEventListener('error', () => {
			(document.querySelector('.bg') as HTMLDivElement).style.setProperty('--bg', `URL(${bg})`);
		});
		return img;
	};
	setNewflickrTag = async (tag: string) => {
		this.flickrTag = tag;
		await this.flickrFetch();
	};
	flickrFetch = async () => {
		await fetch(
			`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=1dac4d56a9a393f76094d14472f13a89&tags=${
				this.flickrTag ? this.flickrTag : this._tag
			}&extras=url_h&format=json&nojsoncallback=1`,
		)
			.then((res) => res.json())
			.then((data) => {
				this.flickr = data.photos.photo.map((o: any) => {
					if (o.url_h) {
						return o.url_h;
					}
				});
				this.length = this.flickr.length;
			})
			.catch(() => {
				document.body.style.setProperty('--bg', `URL(${bg})`);
			});
	};
	prev = () => {
		this.index++;
		if (this.index > this.length) {
			this.index = 1;
		}
		window.clearTimeout(this.timer);
		window.clearTimeout(this.iT);
		this.setBg();
		this.iT = window.setTimeout(() => {
			this.animateSLide();
		}, this.ms);
	};
	next = () => {
		this.index--;
		if (this.index < 1) {
			this.index = 20;
		}
		window.clearTimeout(this.timer);
		window.clearTimeout(this.iT);
		this.setBg();
		this.iT = window.setTimeout(() => {
			this.animateSLide();
		}, this.ms);
	};
	setTag(val: string) {
		this._tag = val;
	}
}

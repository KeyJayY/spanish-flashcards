const list = document.querySelector(".cards-list");

class Card {
	constructor(elem) {
		this.elem = elem;
		this.offsetLeft = elem.offsetLeft;
		this.offsetTop = elem.offsetTop;
		this.fliped = false;
		this.init();
	}

	init() {
		this.elem.addEventListener("click", (e) => {});

		this.elem.addEventListener("mousedown", (e) => this.handleDown(e));
		this.elem.addEventListener("touchstart", (e) => this.handleDown(e));

		document.addEventListener("mouseup", (e) => this.handleUp(e));
		document.addEventListener("touchend", (e) => this.handleUp(e));

		document.addEventListener("mousemove", (e) => this.handleMove(e));
		document.addEventListener("touchmove", (e) => this.handleMove(e));
	}

	handleDown(e) {
		e.preventDefault();
		const clientX = e.type == "touchstart" ? e.touches[0].clientX : e.clientX;

		this.active = true;
		this.elem.style.transition = "none";
		this.offsetLeft = clientX - this.elem.offsetLeft;
	}

	handleUp(e) {
		if (this.active) {
			this.elem.style.transition = "all 0.5s";
			this.elem.style.transform = this.fliped
				? "translate3d(0, 0, 1000px) rotateX(180deg)"
				: "";

			if (!this.dragging) {
				this.fliped = !this.fliped;
				this.elem.style.transform = this.fliped
					? "translate3d(0, 0, 1000px) rotateX(180deg)"
					: "";
			} else {
				const clientX =
					e.type == "touchend" ? e.changedTouches[0].clientX : e.clientX;

				if (
					clientX - this.offsetLeft <
					this.elem.offsetLeft - this.elem.offsetWidth / 2
				) {
					this.elem.remove();
					if (list.querySelectorAll("li").length > 1)
						new Card(document.querySelector(".card"));
				} else if (
					clientX - this.offsetLeft >
					this.elem.offsetLeft + this.elem.offsetWidth / 2
				) {
					this.elem.remove();
					if (list.querySelectorAll("li").length > 1)
						new Card(document.querySelector(".card"));
				}

				this.changeOpacity(0);
			}

			this.dragging = false;
			this.active = false;
		}
	}

	handleMove(e) {
		if (this.active) {
			this.dragging = true;

			const clientX = e.type == "touchmove" ? e.touches[0].clientX : e.clientX;
			const translate = clientX - this.offsetLeft - this.elem.offsetLeft;

			this.changeOpacity(translate / this.elem.offsetWidth / 3);
			this.elem.style.transform = `translate3d(${translate}px, 0, 1000px) ${
				this.fliped ? "translate3d(0, 0, 1000px) rotateX(180deg)" : ""
			}`;
		}
	}

	changeOpacity(value) {
		const absValue = Math.abs(value);
		if (value > 0) {
			this.elem.querySelector(
				".front"
			).style.border = `5px solid rgba(0, 255, 0, ${absValue * 8})`;
			this.elem.querySelector(
				".back"
			).style.border = `5px solid rgba(0, 255, 0, ${absValue * 8})`;
		} else {
			this.elem.querySelector(
				".front"
			).style.border = `5px solid rgba(255, 0, 0, ${absValue * 8})`;
			this.elem.querySelector(
				".back"
			).style.border = `5px solid rgba(255, 0, 0, ${absValue * 8})`;
		}

		this.elem.querySelector(".front").style.opacity = 1 - absValue;
		this.elem.querySelector(".back").style.opacity = 1 - absValue;
	}
}

function createCard(frontText, backText) {
	const card = document.createElement("li");
	card.className = "card";
	card.innerHTML = `<div class="front">${frontText}</div>
					  <div class="back">${backText}</div>`;
	return card;
}

function getWords() {
	return fetch("http://localhost:80/api/words", {
		method: "GET",
	})
		.then((response) => response.json())
		.then((data) => data.words);
}

function appendList() {
	getWords()
		.then((words) => {
			words.forEach((element) => {
				list.prepend(createCard(element.esp, element.en));
			});
		})
		.then(() => {
			new Card(document.querySelector(".card"));
		});
}

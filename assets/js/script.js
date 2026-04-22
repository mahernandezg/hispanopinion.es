class Marquee {
  constructor(marquee, options) {
    if (marquee == null) {
      return;
    }

    const defaultOptions = {
      direction: "left",
      speed: 0.5
    };

    this.options = {
      ...defaultOptions,
      ...options
    };

    this.marquee = marquee;
    this.marqueeHTML = this.marquee.innerHTML;

    this.build();

    if (window.matchMedia("(prefers-reduced-motion)").matches) {
      return;
    }

    this.animate();

    let resizeEndCounter;
    let prevWinWidth = window.innerWidth;

    window.addEventListener("resize", () => {
      if (prevWinWidth === window.innerWidth) {
        return;
      }

      prevWinWidth = window.innerWidth;
      this.marquee.style.opacity = 0;

      clearTimeout(resizeEndCounter);

      resizeEndCounter = setTimeout(() => {
        this.startingX = this.newX;
        clearInterval(this.animateInterval);
        this.build();
        this.animate();
        this.startingX = null;
        this.marquee.style.opacity = 1;
      }, 500);
    });
  }

  build() {
    const marqueeWidth = this.marquee.getBoundingClientRect().width;

    this.marquee.innerHTML = `<div class="slider">${this.marqueeHTML} </div>`;
    const slider = this.marquee.children[0];

    const newInnerHTML = `<div>${this.marqueeHTML}&nbsp;</div>`;
    slider.innerHTML = newInnerHTML;

    let sliderWidth = 0;

    while (sliderWidth < marqueeWidth) {
      sliderWidth = slider.getBoundingClientRect().width;
      slider.innerHTML += newInnerHTML;
    }

    this.marquee.classList.add("marquee-initialized");
  }

  animate() {
    const direction = this.options.direction;
    const speed = direction === "left" ? this.options.speed : -1 * this.options.speed;
    const slider = this.marquee.querySelector(".slider");
    const children = slider.children;

    this.newX = this.startingX != null ? this.startingX : 0;

    this.animateInterval = setInterval(() => {
      const childWidth = children[0].getBoundingClientRect().width;

      if (direction === "left") {
        this.newX += speed;

        if (this.newX > childWidth) {
          this.newX = 0;
        }
      } else {
        this.newX -= speed;

        if (this.newX > 0) {
          this.newX = -1 * childWidth;
        }
      }

      const translateX = direction === "left" ? -1 * this.newX : this.newX;
      slider.style.transform = `translateX(${translateX}px)`;
    }, 0);
  }
}

window.addEventListener("load", () => {
  const marquees = document.querySelectorAll('[class*="is-style-vermeer-marquee"]');

  marquees.forEach((marquee) => {
    new Marquee(marquee, {
      direction: marquee.classList.contains("is-style-vermeer-marquee-left") ? "left" : "right"
    });
  });
});

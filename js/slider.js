class Slider {
  constructor(selector, options = {}) {
    const defaultOptions = {
      autoPlay: false,
      infinity: false,
      interval: 3000,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrowClass: "slider-btn",
      prevArrowClass: "slider-prev",
      nextArrowClass: "slider-next",
      paginationType: "dots",
      dotsClass: "slider-dots",
      dotClass: "dot",
      paginationClass: "slider-number-pagination",
      responsive: [],
      gap: 0,
    };

    this.options = { ...defaultOptions, ...options };
    this.slider = document.querySelector(selector);
    this.container = this.slider.querySelector(".slider-container");
    this.slides = this.slider.querySelectorAll(".slide");
    this.sliderWidth = this.slider.offsetWidth;

    this.createControls();
    this.prevBtn = document.querySelector(`.${this.options.prevArrowClass}`);
    this.prevBtn.classList.add("slider-prev");
    this.nextBtn = document.querySelector(`.${this.options.nextArrowClass}`);
    this.nextBtn.classList.add("slider-next");
    this.dotsContainer = document.querySelector(`.${this.options.dotsClass}`);
    this.pagination = document.querySelector(
      `.${this.options.paginationClass}`
    );

    if (this.options.infinity) {
      this.cloneSlides();
    }

    this.currentIndex = this.options.infinity ? this.options.slidesToShow : 0;
    this.slidesToShow = this.options.slidesToShow;
    this.slidesToScroll = this.options.slidesToScroll;
    this.intervalId = null;
    this.windowWidth = window.innerWidth;
    this.isTransitioning = false;
    this.originalSlidesCount = this.slides.length;
    this.gap = this.options.gap;
    this.initSlider();
    this.setupEventListeners();
    this.handleResponsive();
    if (this.options.autoPlay) {
      this.startAutoPlay();
    }
    window.addEventListener("resize", () => {
      this.sliderWidth = this.slider.offsetWidth;
      this.updateSlidesWidth();
      this.updateSlider();
    });
  }

  createControls() {
    if (!document.querySelector(`.${this.options.prevArrowClass}`)) {
      const prevBtn = document.createElement("button");
      prevBtn.className = `${this.options.arrowClass} ${this.options.prevArrowClass}`;
      prevBtn.innerHTML = "❮";
      this.slider.appendChild(prevBtn);
    }

    if (!document.querySelector(`.${this.options.nextArrowClass}`)) {
      const nextBtn = document.createElement("button");
      nextBtn.className = `${this.options.arrowClass} ${this.options.nextArrowClass}`;
      nextBtn.innerHTML = "❯";
      this.slider.appendChild(nextBtn);
    }

    if (this.options.paginationType === "dots") {
      if (!document.querySelector(`.${this.options.dotsClass}`)) {
        const dotsContainer = document.createElement("div");
        dotsContainer.className = this.options.dotsClass;
        this.slider.appendChild(dotsContainer);
      }

      if (document.querySelector(`.${this.options.paginationClass}`)) {
        document.querySelector(
          `.${this.options.paginationClass}`
        ).style.display = "none";
      }
    } else if (this.options.paginationType === "numbers") {
      if (!document.querySelector(`.${this.options.paginationClass}`)) {
        const pagination = document.createElement("div");
        pagination.className = this.options.paginationClass;
        this.slider.appendChild(pagination);
      }

      if (document.querySelector(`.${this.options.dotsClass}`)) {
        document.querySelector(`.${this.options.dotsClass}`).style.display =
          "none";
      }
    }
  }

  cloneSlides() {
    const oldClones = this.container.querySelectorAll(".clone");
    oldClones.forEach((clone) => clone.remove());
    this.slides = this.container.querySelectorAll(".slide:not(.clone)");

    const lastSlides = Array.from(this.slides).slice(-this.slidesToShow);
    lastSlides.forEach((slide) => {
      const clone = slide.cloneNode(true);
      clone.classList.add("clone");
      this.container.insertBefore(clone, this.slides[0]);
    });

    const firstSlides = Array.from(this.slides).slice(0, this.slidesToShow);
    firstSlides.forEach((slide) => {
      const clone = slide.cloneNode(true);
      clone.classList.add("clone");
      this.container.appendChild(clone);
    });

    this.slides = this.container.querySelectorAll(".slide");
    this.originalSlidesCount = this.slides.length - 2 * this.slidesToShow;
  }

  initSlider() {
    this.updateSlidesWidth();
    if (this.options.paginationType === "dots") {
      this.createDots();
    } else if (this.options.paginationType === "numbers") {
      this.updatePagination();
    }
    this.container.style.transition = "none";
    this.updateSlider();
    void this.container.offsetWidth;
    this.container.style.transition = "transform 0.5s ease";
    this.updateButtonStates();
  }

  setupEventListeners() {
    this.prevBtn.addEventListener("click", () => this.prevSlide());
    this.nextBtn.addEventListener("click", () => this.nextSlide());
    this.container.addEventListener("transitionend", () => {
      this.isTransitioning = false;
      if (this.options.infinity) {
        this.checkSlidePosition();
      }
    });

    if (this.options.autoPlay) {
      this.slider.addEventListener("mouseenter", () => this.stopAutoPlay());
      this.slider.addEventListener("mouseleave", () => this.startAutoPlay());
    }
    window.addEventListener("resize", () => {
      if (this.windowWidth !== window.innerWidth) {
        this.windowWidth = window.innerWidth;
        this.handleResponsive();
      }
    });
  }

  checkSlidePosition() {
    if (!this.options.infinity) return;
    const totalSlides = this.slides.length;
    const realSlides = totalSlides - 2 * this.slidesToShow;
    if (this.currentIndex < this.slidesToShow) {
      this.container.style.transition = "none";
      this.currentIndex = realSlides + this.currentIndex;
      this.updateSlider();
      void this.container.offsetWidth;
      this.container.style.transition = "transform 0.5s ease";
    } else if (this.currentIndex >= realSlides + this.slidesToShow) {
      this.container.style.transition = "none";
      this.currentIndex = this.currentIndex - realSlides;
      this.updateSlider();
      void this.container.offsetWidth;
      this.container.style.transition = "transform 0.5s ease";
    }
    if (this.options.paginationType === "dots") {
      this.updateDots();
    } else if (this.options.paginationType === "numbers") {
      this.updatePagination();
    }
  }

  handleResponsive() {
    if (!this.options.responsive) return;
    const originalSettings = {
      slidesToShow: this.options.slidesToShow,
      slidesToScroll: this.options.slidesToScroll,
      gap: this.options.gap,
    };
    let activeSettings = { ...originalSettings };
    const sortedBreakpoints = [...this.options.responsive].sort(
      (a, b) => b.breakpoint - a.breakpoint
    );
    for (let breakpoint of sortedBreakpoints) {
      if (window.innerWidth >= breakpoint.breakpoint) {
        activeSettings = {
          ...activeSettings,
          ...breakpoint.settings,
        };
        break;
      }
    }

    this.slidesToShow = activeSettings.slidesToShow;
    this.slidesToScroll = activeSettings.slidesToScroll;
    this.gap = activeSettings.gap || 0;
    if (this.options.infinity) {
      this.cloneSlides();
    }
    this.updateSlidesWidth();
    this.originalSlidesCount = this.options.infinity
      ? this.slides.length - 2 * this.slidesToShow
      : this.slides.length;
    if (this.options.paginationType === "dots") {
      this.createDots();
    } else if (this.options.paginationType === "numbers") {
      this.updatePagination();
    }
    this.currentIndex = this.currentIndex = this.options.infinity
      ? this.slidesToShow
      : 0;

    this.container.style.transition = "none";
    this.updateSlider();
    void this.container.offsetWidth;
    this.container.style.transition = "transform 0.5s ease";
  }

  updateSlidesWidth() {
    const slideWidth =
      (this.sliderWidth - this.gap * (this.slidesToShow - 1)) /
      this.slidesToShow;
    this.slides.forEach((slide) => {
      slide.style.flex = `0 0 ${slideWidth}px`;
      slide.style.marginRight = `${this.gap}px`;
    });
    if (this.slides.length > 0) {
      this.slides[this.slides.length - 1].style.marginRight = "0";
    }
  }

  createDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = "";
    const dotsCount = Math.ceil(this.originalSlidesCount / this.slidesToShow);
    for (let i = 0; i < dotsCount; i++) {
      const dot = document.createElement("div");
      dot.classList.add(this.options.dotClass);

      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => {
        this.goToSlide(
          i * this.slidesToShow +
            (this.options.infinity ? this.slidesToShow : 0)
        );
      });
      this.dotsContainer.appendChild(dot);
    }
  }

  updateDots() {
    if (!this.dotsContainer) return;

    const dots = this.dotsContainer.querySelectorAll(
      `.${this.options.dotClass}`
    );
    let activeIndex;
    if (this.options.infinity) {
      if (this.currentIndex < this.slidesToShow) {
        activeIndex = Math.floor(
          (this.originalSlidesCount - 1) / this.slidesToShow
        );
      } else if (
        this.currentIndex >=
        this.originalSlidesCount + this.slidesToShow
      ) {
        activeIndex = 0;
      } else {
        activeIndex = Math.floor(
          (this.currentIndex - this.slidesToShow) / this.slidesToShow
        );
      }
    } else {
      activeIndex = Math.floor(this.currentIndex / this.slidesToShow);
    }

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === activeIndex);
    });
  }

  updatePagination() {
    if (!this.pagination) return;
    if (this.options.infinity) {
      if (this.currentIndex === 1) {
        this.pagination.textContent = `${this.slidesToShow} / ${this.originalSlidesCount}`;
      } else {
        this.pagination.textContent = `${this.currentIndex} / ${this.originalSlidesCount}`;
      }
    } else {
      this.pagination.textContent = `${
        this.currentIndex + this.slidesToShow
      } / ${this.originalSlidesCount}`;
    }
  }

  updateSlider() {
    const slideWidth =
      (this.sliderWidth - this.gap * (this.slidesToShow - 1)) /
      this.slidesToShow;
    const translateValue = -this.currentIndex * (slideWidth + this.gap);
    this.container.style.transform = `translateX(${translateValue}px)`;
  }

  prevSlide() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    if (this.options.infinity) {
      this.currentIndex -= this.slidesToScroll;
    } else {
      this.currentIndex = Math.max(0, this.currentIndex - this.slidesToScroll);
    }
    this.updateSlider();
    this.updateButtonStates();
    if (!this.options.infinity) {
      setTimeout(() => {
        this.isTransitioning = false;
        if (this.options.paginationType === "dots") {
          this.updateDots();
        } else if (this.options.paginationType === "numbers") {
          this.updatePagination();
        }
      }, 500);
    }
  }

  updateButtonStates() {
    if (!this.options.infinity) {
      if (this.currentIndex <= 0) {
        this.prevBtn.classList.add("disable");
      } else {
        this.prevBtn.classList.remove("disable");
      }
      const maxIndex = this.originalSlidesCount - this.slidesToShow;
      if (this.currentIndex >= maxIndex) {
        this.nextBtn.classList.add("disable");
      } else {
        this.nextBtn.classList.remove("disable");
      }
    }
  }

  nextSlide() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    if (this.options.infinity) {
      this.currentIndex += this.slidesToScroll;
    } else {
      const maxIndex = this.originalSlidesCount - this.slidesToShow;
      this.currentIndex = Math.min(
        maxIndex,
        this.currentIndex + this.slidesToScroll
      );
    }
    this.updateButtonStates();
    this.updateSlider();
    if (!this.options.infinity) {
      setTimeout(() => {
        this.isTransitioning = false;
        if (this.options.paginationType === "dots") {
          this.updateDots();
        } else if (this.options.paginationType === "numbers") {
          this.updatePagination();
        }
      }, 500);
    }
  }

  goToSlide(index) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    if (this.options.infinity) {
      const maxIndex = this.originalSlidesCount + this.slidesToShow - 1;
      this.currentIndex = Math.max(
        this.slidesToShow,
        Math.min(index, maxIndex)
      );
    } else {
      const maxIndex = this.originalSlidesCount - this.slidesToShow;
      this.currentIndex = Math.max(0, Math.min(index, maxIndex));
    }
    this.updateSlider();

    setTimeout(() => {
      this.isTransitioning = false;
    }, 500);
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.intervalId = setInterval(
      () => this.nextSlide(),
      this.options.interval
    );
  }

  stopAutoPlay() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

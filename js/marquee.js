
class Marquee {
  constructor(containerId, content, speed = 50) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.wrapper = this.container.querySelector(".marquee-wrapper");
    this.content = content;
    this.speed = speed;
    this.totalContentWidth = 0;
    this.containerWidth = this.container.offsetWidth;
    this.init();
  }

  init() {
    this.createMarqueeItems();
    this.startMonitoring();
    window.addEventListener("resize", () => this.handleResize());
  }

  createMarqueeItems() {
    this.wrapper.innerHTML = "";
    this.totalContentWidth = 0;
    const itemsCount = Math.ceil(this.containerWidth / 200) * 2 + 2;
    for (let i = 0; i < itemsCount; i++) {
      this.addMarqueeItem(i);
    }
    this.updateAnimationSpeed();
  }

  addMarqueeItem(index) {
    const contentIndex = index % this.content.length;
    const item = document.createElement("div");
    item.className = "marquee-item";
    item.textContent = this.content[contentIndex];
    this.wrapper.appendChild(item);
    this.totalContentWidth += item.offsetWidth;
  }

  updateAnimationSpeed() {
    const duration = this.totalContentWidth / this.speed;
    this.wrapper.style.animationDuration = `${duration}s`;
  }

  handleResize() {
    this.containerWidth = this.container.offsetWidth;
    this.createMarqueeItems();
  }

  startMonitoring() {
    this.monitorInterval = setInterval(() => {
      const wrapperRect = this.wrapper.getBoundingClientRect();
      const containerRect = this.container.getBoundingClientRect();
      if (wrapperRect.right < containerRect.right + 500) {
        const index = this.wrapper.children.length;
        this.addMarqueeItem(index);
        this.updateAnimationSpeed();
      }
    }, 1000);
  }

  destroy() {
    clearInterval(this.monitorInterval);
    window.removeEventListener("resize", () => this.handleResize());
  }
}


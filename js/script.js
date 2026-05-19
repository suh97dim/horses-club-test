let sliderStage;
this.stageSliderControl = document.querySelector(".stage__slider-control");
function checkScreenSize() {
  let container = document.querySelector(".stage-wrapper");
  const breakpoint = 900;
  const currentWidth = window.innerWidth;
  if (currentWidth < breakpoint) {
    container.classList.add("slider-container");
    sliderStage = new Slider("#stage-slider", {
      autoPlay: false,
      interval: 3000,
      infinity: false,
      arrowClass: "slider-arrow",
      prevArrowClass: "stage-prev",
      nextArrowClass: "stage-next",
      paginationType: "dots",
      dotsClass: "stage-dots",
      dotClass: "dot",
      paginationClass: "stage-number-pagination",
      gap: 0,
      responsive: [
        {
          breakpoint: 320,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            gap: 0,
          },
        },
      ],
    });
    stageSliderControl.style.display = "flex";
  } else {
    container.classList.remove("slider-container");
    if (sliderStage) {
      stageSliderControl.style.display = "none";
    }
  }
}

window.addEventListener("resize", checkScreenSize);

window.addEventListener("load", checkScreenSize);

const slider = new Slider("#participant-slider", {
  autoPlay: true,
  interval: 4000,
  infinity: true,
  arrowClass: "custom-arrow",
  prevArrowClass: "custom-prev",
  nextArrowClass: "custom-next",
  paginationType: "numbers",
  paginationClass: "number-pagination",
  gap: 0,
  responsive: [
    {
      breakpoint: 1000,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        gap: 20,
      },
    },

    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        gap: 10,
      },
    },
    {
      breakpoint: 320,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        gap: 10,
      },
    },
  ],
});

const marquee = new Marquee(
  "marqueeContainer1",
  [
    "Дело помощи утопающим — дело рук самих утопающих!",
    "Шахматы двигают вперёд не только культуру, но и экономику!",
    "Лёд тронулся, господа присяжные заседатели!",
  ],
  50
);

const marquee1 = new Marquee(
  "marqueeContainer2",
  [
    "Дело помощи утопающим — дело рук самих утопающих!",
    "Шахматы двигают вперёд не только культуру, но и экономику!",
    "Лёд тронулся, господа присяжные заседатели!",
  ],
  50
);

const layers = document.querySelectorAll(".paralax-layer");
document.addEventListener("mousemove", (e) => {
  const mouseX = (e.clientX - window.innerWidth / 2) / 100;
  const mouseY = (e.clientY - window.innerHeight / 2) / 100;
  layers.forEach((layer) => {
    const speed = layer.getAttribute("data-speed");
    const x = mouseX * speed;
    const y = mouseY * speed;
    layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });
});

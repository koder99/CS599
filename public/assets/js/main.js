// SELECTING ELEMENTS
let randomButton = document.querySelector(".btn-getstarted");
let searchForm = document.querySelector(".form-search");
let formInput = document.querySelector(".form-control");
let instruction_heading = document.querySelector(".heading-secondary");
let instruction_heading_text = document.querySelector(
  ".heading-secondary-text"
);
let api_sample = document.getElementById("api-sample");

// DECLARING FUNCTIONS
const greeting = function () {
  let message = `This web application was not built for mobile viewing. You are advised to use the desktop view mode for a better experience.`;
  window.alert(message);
};

const updateUI = function (type, location, data) {
  instruction_heading.textContent = `Request Status`;
  if (type === "success" && location == "random") {
    instruction_heading_text.textContent =
      "Data retrieved successfully! You would be redirected to your requested content shortly......";
  }
  if (type === "success" && location == "search") {
    instruction_heading_text.textContent = `Data for ${data} ${
      data == "Abuja" ? "" : "state"
    } retrieved successfully! You would be redirected to your requested content shortly.....`;
  }
  if (type === "failure" && location == "random") {
    instruction_heading_text.textContent = `Something went wrong with your request....`;
  }
  if (type === "failure" && location == "search") {
    instruction_heading_text.textContent = `Something went wrong with your request...Please check if the state name is correctly typed into the search bar and try again!`;
  }
};

const sampleObject = {
  status: "success",
  data: {
    state: {
      _id: "668d50be3b995018e06080f3",
      name: "Bauchi",
      capital: "Bauchi",
      slogan: "Pearl of Tourism",
      geopoliticalZone: "North East",
      localGovernmentAreas: [
        "Alkaleri",
        "Bauchi",
        "Bogoro",
        "Dambam",
        "Darazo",
        "Dass",
        "Gamawa",
        "Ganjuwa",
        "Giade",
        "Gadau",
        "Jama’are",
        "Katagum",
        "Kirfi",
        "Misau",
        "Ningi",
        "Shira",
        "Tafawa Balewa",
        "Toro",
        "Warji",
        "Zaki",
      ],
      topFiveCities: ["Bauchi", "Katagum", "Misau", "Katagum", "Tafawa Balewa"],
      ethnicities: [
        "Hausa",
        "Fulani",
        "Gerawa",
        "Sayawa",
        "Jarawa",
        "Bolewa",
        "Karekare",
        "Kanuri",
        "Fa’awa",
        "Butawa",
        "Warjawa",
        "Zulawa",
        "Badawa",
      ],
      createdOn: "1976-02-02T23:00:00.000Z",
      governor: {
        _id: "666d7815c6bd60616bcbfef1",
        firstName: "Bala",
        lastName: "Muhammad",
        middleName: "Abdulkadir",
        gender: "Male",
        age: 65,
        officePortrait: "Bala-Muhammad's official portrait.png",
      },
      coordinates: {
        latitude: 10.314159,
        longitude: 9.846282,
        _id: "668d50be3b995018e06080f4",
      },
      area: {
        total: 18965,
        elevation: 616,
        _id: "668d50be3b995018e06080f5",
      },
      population: {
        density: 1800,
        rank: 7,
        total: 8308800,
        _id: "668d50be3b995018e06080f6",
      },
      website: "https://bauchistate.gov.ng/",
      timeZone: "UTC+01",
      postalCode: 740001,
      gdp: {
        year: 2021,
        total: "$17.01 billion",
        perCapita: "$2194",
        _id: "668d50be3b995018e06080f7",
      },
      tertiaryInstitutions: {
        universities: [
          {
            name: "Abubakar Tafawa Balewa University",
            founded: "1980-09-30T23:00:00.000Z",
            _id: "668d50be3b995018e06080f9",
          },
          {
            name: "Sa'adu Zangur University",
            founded: "2010-12-31T23:00:00.000Z",
            _id: "668d50be3b995018e06080fa",
          },
          {
            name: "Federal University Of Health Sciences",
            founded: "1962-10-03T23:00:00.000Z",
            _id: "668d50be3b995018e06080fb",
          },
        ],
        collegesOfEducation: [
          {
            name: "Bilyaminu Othman College Of Education",
            founded: "2012-12-31T23:00:00.000Z",
            _id: "668d50be3b995018e06080fc",
          },
          {
            name: "College Of Agriculture",
            founded: "2013-06-12T23:00:00.000Z",
            _id: "668d50be3b995018e06080fd",
          },
          {
            name: "Aliko Dangote College Of Nursing Science",
            founded: "2011-01-29T23:00:00.000Z",
            _id: "668d50be3b995018e06080fe",
          },
          {
            name: "Aminu Saleh College Of Education",
            founded: "1976-12-31T23:00:00.000Z",
            _id: "668d50be3b995018e06080ff",
          },
          {
            name: "Adamu Tafawa Balewa College Of Education",
            founded: "2014-09-21T23:00:00.000Z",
            _id: "668d50be3b995018e0608100",
          },
        ],
        polytechnics: [
          {
            name: "Federal Polytechnic Bauchi",
            founded: "1979-06-30T23:00:00.000Z",
            _id: "668d50be3b995018e0608101",
          },
          {
            name: "Abubakar Tatari Ali Polytechnic",
            founded: "1987-12-31T23:00:00.000Z",
            _id: "668d50be3b995018e0608102",
          },
        ],
        _id: "668d50be3b995018e06080f8",
      },
      images: [
        "bauchi-state-1",
        "bauchi-state-2",
        "bauchi-state-3",
        "bauchi-state-4",
        "bauchi-state-5",
      ],
      locationOnMap: "Bauchi's-location.jpg",
      __v: 0,
    },
  },
};

const stringifiedObject = JSON.stringify(sampleObject);

const loadRandomState = async function () {
  try {
    const res = await fetch(`/api/v1/states/random`);
    const response = await res.json();
    if (response.status === "success") {
      // Notify the user of the successfull API Call
      updateUI("success", "random");
      // Load the page with the randomly generated state name\
      let url = `/s/${response.data.state.name.toLowerCase()}`;
      window.setTimeout(function () {
        window.location.assign(url);
      }, 500);
    } else if (res.status === "fail") {
      updateUI("failure", "random");
    }
  } catch (error) {}
};

const fetchState = async function () {
  if (!formInput.value) {
    window.alert(`Your search bar cannot be empty`);
  }
  let state = formInput.value;
  formInput.blur();

  try {
    const res = await fetch(`/api/v1/states/${state}`);
    const response = await res.json();
    if (response.status == "success") {
      let name = response.data.state.name;
      updateUI("success", "search", name);
      const url = `/s/${name.toLowerCase()}`;
      window.setTimeout(function () {
        window.location.assign(url);
      }, 2000);
    }
    if (response.status === "fail") {
      updateUI("failure", "search");
    }
  } catch (error) {
    console.log(`There was an error!`);
    console.log(error);
  }
};

window.addEventListener("DOMContentLoaded", function () {
  this.setTimeout(greeting, 500);
});

(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector("body");
    const selectHeader = document.querySelector("#header");
    if (
      !selectHeader.classList.contains("scroll-up-sticky") &&
      !selectHeader.classList.contains("sticky-top") &&
      !selectHeader.classList.contains("fixed-top")
    )
      return;
    window.scrollY > 100
      ? selectBody.classList.add("scrolled")
      : selectBody.classList.remove("scrolled");
  }

  document.addEventListener("scroll", toggleScrolled);
  window.addEventListener("load", toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");

  function mobileNavToogle() {
    document.querySelector("body").classList.toggle("mobile-nav-active");
    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
  }
  mobileNavToggleBtn.addEventListener("click", mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll("#navmenu a").forEach((navmenu) => {
    navmenu.addEventListener("click", () => {
      if (document.querySelector(".mobile-nav-active")) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll(".navmenu .toggle-dropdown").forEach((navmenu) => {
    navmenu.addEventListener("click", function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle("active");
      this.parentNode.nextElementSibling.classList.toggle("dropdown-active");
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector(".scroll-top");

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100
        ? scrollTop.classList.add("active")
        : scrollTop.classList.remove("active");
    }
  }
  scrollTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("load", toggleScrollTop);
  document.addEventListener("scroll", toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }
  window.addEventListener("load", aosInit);

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: ".glightbox",
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Frequently Asked Questions Toggle
   */
  document
    .querySelectorAll(".faq-item h3, .faq-item .faq-toggle")
    .forEach((faqItem) => {
      faqItem.addEventListener("click", () => {
        faqItem.parentNode.classList.toggle("faq-active");
      });
    });
})();

if (randomButton && searchForm)
  randomButton.addEventListener("click", loadRandomState);

if (searchForm)
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    fetchState();
  });

if (api_sample) {
  api_sample.textContent = stringifiedObject;
}

/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
*/

/**
 * Define Global Variables
 *
*/

const navBar = document.querySelector('#navbar__list');
const sections = document.querySelectorAll('section');
const scrollToTop = document.querySelector('.to-top');

/**
 * End Global Variables
 * Start Helper Functions
 *
*/

//helper function to add or remove active class for a passed section element
function setActive(elem, active) {
  if (active) {
    elem.classList.add('your-active-class');
  } else {
    elem.classList.remove('your-active-class');
  }
}

// helper to hide or show the nav / back to top when scrolling
function hideAndShow() {
  //hide the nav bar when scrolling
  navBar.parentElement.classList.remove('navbar_show');
  navBar.parentElement.classList.add('navbar_hide');
  //check to see if user is scrolling and unhide navbar
  setTimeout(() => {
    navBar.parentElement.classList.remove('navbar_hide');
    navBar.parentElement.classList.add('navbar_show');
  }, 800);

  //show or hide scroll to top button
  if (window.scrollY > (document.body.clientHeight)/4) {
    scrollToTop.setAttribute('style', 'display: block');
  } else {
    scrollToTop.removeAttribute('style');
  }
}

// helper to re-style the nav items if active or not
function highlightActiveNav(elem) {
  const navItems = document.querySelectorAll('.menu__link');

  for (let navItem of navItems) {
    if (navItem.dataset.anchor === elem) {
      navItem.setAttribute('style', 'background: #cc1');
    } else {
      navItem.removeAttribute('style');
    }
  }
}

// helper which makes sure all active styling is removed from nav if no
//section is active
function deActivateAll() {
  const navItems = document.querySelectorAll('.menu__link');

  navItems.forEach((elem) => {
    elem.removeAttribute('style');
  });
}

/**
 * End Helper Functions
 * Begin Main Functions
 *
*/

//collapse / open section text
function collapseSection(evt) {
  const targetImg = evt.target;
  //make sure you clicked on the collapse arrow
  if (!targetImg.classList.contains('collapse-arrow')) {
    return;
  }

  const textTarget = evt.target.parentElement.nextElementSibling;
  //grab the section tag to reduce in height
  const containerTarget = textTarget.parentElement.parentElement;
  //change collapse image via css when clicked
  targetImg.classList.toggle('open-section');
  targetImg.classList.toggle('close-section');
  //if section has been collapsed already then open up and display text else
  // collapse and hide text
  if (containerTarget.hasAttribute('style')) {
    containerTarget.removeAttribute('style');
    textTarget.style.cssText = 'display: block';
  } else {
    textTarget.style.cssText = 'display: none';
    containerTarget.setAttribute('style', 'min-height: 20vh');
  }
}

// build the nav
function buildNav() {
  const navFrag = document.createDocumentFragment();

  for (const section of sections) {
    let navItem = document.createElement('li');
    navItem.setAttribute('data-anchor', section.id);
    navItem.innerText = section.dataset.nav;
    navItem.className = 'menu__link';

    navFrag.appendChild(navItem);
  }

  navBar.appendChild(navFrag);

}

// Add class 'active' to section when near top of viewport
function checkActive() {
  const topBound = navBar.offsetHeight;
  let numOfHits = 0;
  //checks each section bounding to see if it's the one being viewed = active section
  for (const section of sections) {
    const bounding = section.getBoundingClientRect();

    if (bounding.bottom > topBound && bounding.top <= topBound) {
      setActive(section, true);
      highlightActiveNav(section.id);
      numOfHits++;
    } else {
      setActive(section, false);
    }
  }
  //if no section is active turn off any active state for the nav
  if (numOfHits === 0) {
    deActivateAll();
  }
  //show or hide the nav based on scrolling
  hideAndShow();
}

// Scroll to anchor ID using scrollTO event
function navClick(evt) {
  if (evt.target.nodeName.toLowerCase() === 'li') {
    //get elements yPos to scroll to, '+ 1' is for chrome phone browser to make
    //sure section bound hits
    const scrollPos = document.getElementById(evt.target.dataset.anchor).offsetTop + 1;
    window.scrollTo({top: scrollPos - navBar.offsetHeight, left: 0, behavior: 'smooth'});
  }
}

/**
 * End Main Functions
 * Begin Events
 *
*/

// Build menu
document.addEventListener('DOMContentLoaded', buildNav);

// Scroll to section on link click
navBar.addEventListener('click', navClick);

// Set sections as active
document.addEventListener('scroll', checkActive);

//listen for click to collapse section
document.querySelector('main').addEventListener('click', collapseSection);

//set up scroll to top button
scrollToTop.addEventListener('click', () => {
  window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
});

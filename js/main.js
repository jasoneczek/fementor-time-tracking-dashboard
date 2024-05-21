'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('[role="tab"]');
  const panel = document.querySelector('[role="tabpanel"]');
  let data;

  console.log(tabs);

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const period = tab.getAttribute('data-period');
      console.log(period);
    });
  });
});

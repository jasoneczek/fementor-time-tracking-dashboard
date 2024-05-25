'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('[role="tab"]');
  const tabList = document.querySelector('[role="tablist"]');
  const panelList = document.querySelector('.stats');
  let data;

  fetch('data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(jsonData => {
      data = jsonData;
      updatePanel('daily');
      setActiveTab(tabs[0]);
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });

  tabs.forEach(tab => {
    tab.addEventListener('click', e => {
      e.preventDefault();
      const period = tab.getAttribute('data-period');
      updatePanel(period);
      setActiveTab(tab);
    });

    tab.addEventListener('keydown', e => {
      const index = Array.prototype.indexOf.call(tabs, e.currentTarget);
      let dir = null;

      switch (e.which) {
        case 37:
          dir = 'left';
          break;
        case 38:
          dir = 'up';
          break;
        case 39:
          dir = 'right';
          break;
        case 40:
          dir = 'down';
          break;
      }

      if (dir !== null) {
        e.preventDefault();
        if (dir === 'down' || dir === 'up') {
          const nextTabIndex =
            dir === 'down'
              ? (index + 1) % tabs.length
              : (index - 1 + tabs.length) % tabs.length;
          tabs[nextTabIndex].focus();
          const period = tabs[nextTabIndex].getAttribute('data-period');
          updatePanel(period);
          setActiveTab(tabs[nextTabIndex]);
        } else {
          const newIndex =
            dir === 'left'
              ? (index - 1 + tabs.length) % tabs.length
              : (index + 1) % tabs.length;
          const newTab = tabs[newIndex];
          newTab.focus();
          const period = newTab.getAttribute('data-period');
          updatePanel(period);
          setActiveTab(newTab);
        }
      }
    });
  });

  function updatePanel(period) {
    panelList.innerHTML = '';
    data.forEach(item => {
      const formattedTitle = item.title.toLowerCase().replace(/ /g, '-');
      const li = document.createElement('li');
      li.classList.add('activity');
      li.classList.add(`activity-${formattedTitle}`);

      let previousText;
      switch (period) {
        case 'daily':
          previousText = `Yesterday - ${item.timeframes[period].previous}hrs`;
          break;
        case 'weekly':
          previousText = `Last week - ${item.timeframes[period].previous}hrs`;
          break;
        case 'monthly':
          previousText = `Last month - ${item.timeframes[period].previous}hrs`;
          break;
      }

      li.innerHTML = `
        <img src="./images/icon-${formattedTitle}.svg" class="activity-icon" alt="">
        <div class="activity-content">
          <div class="activity-header">
            <h3 class="activity-title">
              <a href="#" class="activity-link">
                ${item.title}
              </a>
            </h3>
            <img src="../images/icon-ellipsis.svg" alt="ellipsis icon">
          </div>
          <div class="activity-stats">
            <p class="current">${item.timeframes[period].current}hrs</p>
            <p class="previous">${previousText}</p>
          </div>
        </div>
        `;
      panelList.appendChild(li);
    });
  }

  function setActiveTab(activeTab) {
    tabs.forEach(tab => {
      tab.setAttribute('aria-selected', tab === activeTab ? 'true' : 'false');
      tab.setAttribute('tabindex', tab === activeTab ? '0' : '-1');
    });
  }

  function updateTabListOrientation() {
    if (window.innerWidth >= 576) {
      tabList.setAttribute('aria-orientation', 'vertical');
    } else {
      tabList.setAttribute('aria-orientation', 'horizontal');
    }
  }

  updateTabListOrientation();

  window.addEventListener('resize', updateTabListOrientation);
});

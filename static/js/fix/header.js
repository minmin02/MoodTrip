document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector('header.header');
  const leftNav = header.querySelector('.left-nav');
  const dropdown = header.querySelector('.dropdown-nav-container');
  let openTimeout, closeTimeout;

  // 드롭다운 실제 높이 계산
  function getDropdownHeight() {
    dropdown.style.maxHeight = 'none';
    const height = dropdown.scrollHeight;
    dropdown.style.maxHeight = '0px';
    return height;
  }

  function openDropdown() {
    dropdown.style.maxHeight = getDropdownHeight() + 'px';
    dropdown.style.overflow = 'visible';
  }

  function closeDropdown() {
    dropdown.style.maxHeight = '0px';
    dropdown.style.overflow = 'hidden';
  }

  leftNav.addEventListener('mouseenter', function () {
    clearTimeout(closeTimeout);
    openTimeout = setTimeout(openDropdown, 180); // 180ms 딜레이 후 열림
  });

  leftNav.addEventListener('mouseleave', function () {
    clearTimeout(openTimeout);
    closeTimeout = setTimeout(() => {
      if (!dropdown.matches(':hover')) closeDropdown();
    }, 180);
  });

  dropdown.addEventListener('mouseenter', function () {
    clearTimeout(closeTimeout);
  });

  dropdown.addEventListener('mouseleave', function () {
    closeTimeout = setTimeout(closeDropdown, 180);
  });
});

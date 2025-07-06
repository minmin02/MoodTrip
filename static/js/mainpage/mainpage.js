document.addEventListener("DOMContentLoaded", function () {
  const rollingList = document.querySelector('.rolling-title');
  const items = rollingList.querySelectorAll('li');
  const itemHeight = items[0].offsetHeight;
  const itemCount = items.length;
  let currentIndex = 0;

  // 롤링 함수
  function rollNext() {
    currentIndex++;
    // 마지막 다음엔 처음으로
    if (currentIndex >= itemCount) {
      currentIndex = 0;
    }
    rollingList.style.transition = 'margin-top 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    rollingList.style.marginTop = `-${itemHeight * currentIndex}px`;
  }

  // transition 끝나고, 마지막에서 처음으로 자연스럽게 점프
  rollingList.addEventListener('transitionend', function () {
    if (currentIndex === 0) {
      rollingList.style.transition = 'none';
      rollingList.style.marginTop = '0px';
    }
  });

  // 일정 시간마다 롤링
  setInterval(rollNext, 2000); // 2초마다 롤링
});









document.addEventListener('DOMContentLoaded', function() {
  const weatherBoxes = document.querySelectorAll('.weather-box');
  const weatherBlock = document.querySelector('.weather-block');
  const rollingSection = document.querySelector('.rolling-weather-section');
  const rollingWeather = document.querySelector('.rolling-weather');
  const rollingList = document.querySelector('.rolling-list');
  const bdFilterLeft = document.querySelector('.bd-filter.left');
  const bdFilterRight = document.querySelector('.bd-filter.right');
  const rollingWeatherContentActive = document.querySelector('.rolling-weather-content.active');
  const weatherInfoSections = document.querySelectorAll('.weather-info-section');
  const container = document.querySelector('.container');

  // 날씨별 배경색 매핑
  const weatherColors = {
    '맑음': '#d4edda',  // 연두
    '흐림': '#fff3cd',  // 노란
    '비': '#d1ecf1',    // 하늘
    '눈': '#f0f0f0',    // 연한 회색
    '눈/비': '#cce5ff'  // 연한 파랑
  };

  // weather-icon 스타일로 날씨 타입 추출
  function getWeatherType(box) {
    const icon = box.querySelector('.weather-icon');
    if (!icon) return null;
    const bg = window.getComputedStyle(icon).backgroundImage || window.getComputedStyle(icon).backgroundColor;
    if (bg.indexOf('#ffe066') !== -1) return '맑음';
    if (bg.indexOf('linear-gradient') !== -1 && bg.indexOf('#b2f0ff') !== -1) return '비';
    // 필요시 추가 조건(눈 등) 추가
    return '흐림'; // 기본값
  }

  weatherBoxes.forEach(box => {
    box.addEventListener('mouseenter', () => {
      const weatherType = getWeatherType(box);
      const color = weatherColors[weatherType] || '#fff';

      if (weatherBlock) weatherBlock.style.backgroundColor = color;
      if (rollingSection) rollingSection.style.backgroundColor = color;
      if (rollingWeather) rollingWeather.style.backgroundColor = color;
      if (rollingList) rollingList.style.backgroundColor = color;
      if (bdFilterLeft) bdFilterLeft.style.background = 'linear-gradient(90deg, ' + color + ' 90%, rgba(255,255,255,0) 100%)';
      if (bdFilterRight) bdFilterRight.style.background = 'linear-gradient(270deg, ' + color + ' 90%, rgba(255,255,255,0) 100%)';
      if (rollingWeatherContentActive) rollingWeatherContentActive.style.backgroundColor = color;
      if (container) container.style.backgroundColor = color;

      // weather-info-section와 weather-box 모두 흰색으로 고정
      weatherInfoSections.forEach(section => {
        section.style.backgroundColor = '#fff';
      });
      weatherBoxes.forEach(wb => {
        wb.style.backgroundColor = '#fff';
      });
    });
    box.addEventListener('mouseleave', () => {
      if (weatherBlock) weatherBlock.style.backgroundColor = '#fff';
      if (rollingSection) rollingSection.style.backgroundColor = '';
      if (rollingWeather) rollingWeather.style.backgroundColor = '';
      if (rollingList) rollingList.style.backgroundColor = '';
      if (bdFilterLeft) bdFilterLeft.style.background = '';
      if (bdFilterRight) bdFilterRight.style.background = '';
      if (rollingWeatherContentActive) rollingWeatherContentActive.style.backgroundColor = '';
      if (container) container.style.backgroundColor = '';

      // weather-info-section와 weather-box 모두 흰색으로 고정
      weatherInfoSections.forEach(section => {
        section.style.backgroundColor = '#fff';
      });
      weatherBoxes.forEach(wb => {
        wb.style.backgroundColor = '#fff';
      });
    });
  });
});

// 날씨 여행 슬라이드(좌우 이동) JS 예제
document.addEventListener('DOMContentLoaded', function () {
  const rollingInner = document.getElementById('rollingPortfolio');
  const weatherContent = rollingInner.querySelector('.rolling-weather-content.active');
  const weatherBoxes = weatherContent.querySelectorAll('.weather-box');
  const boxWidth = 344 + 24; // weather-box width + gap(24px)
  const visibleCount = Math.floor(rollingInner.offsetWidth / boxWidth) || 3; // 한 번에 보이는 카드 수(예: 3)
  const maxIndex = weatherBoxes.length - visibleCount;
  let currentIndex = 0;

  function updateSlide() {
    // margin-left를 음수로 이동
    rollingInner.style.marginLeft = `-${currentIndex * boxWidth}px`;
  }

  document.getElementById('arrowLeft').addEventListener('click', function () {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlide();
    }
  });

  document.getElementById('arrowRight').addEventListener('click', function () {
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateSlide();
    }
  });
});

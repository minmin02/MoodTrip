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

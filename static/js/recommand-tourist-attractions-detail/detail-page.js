document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.querySelector('.toggle-btn');
  const extraInfo = document.querySelector('.place-detail-info-2');

  toggleBtn.addEventListener('click', () => {
    const isHidden = extraInfo.classList.contains('hidden');
    extraInfo.classList.toggle('hidden');
    toggleBtn.textContent = isHidden ? '▲ 내용 닫기' : '▼ 내용 더보기';
  });
});

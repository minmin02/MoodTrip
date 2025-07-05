function initInputLabelEffect() {
    const inputContainers = document.querySelectorAll('[data-testid="design-system--text-field-container"]');

    inputContainers.forEach(container => {
        const input = container.querySelector('input');
        const label = container.querySelector('[data-testid="design-system--lable-text"]');
        const wrapper = container.querySelector('[data-testid="design-system--lable-input"]');

        if (!input || !label || !wrapper) return;

        // 초기 클래스 세팅
        wrapper.classList.add('input-container-fix');
        input.classList.add('input-textbox-padding');

        // 라벨 플로팅 토글 함수
        const toggleLabel = () => {
            if (input.value.trim() !== '' || document.activeElement === input) {
                label.classList.add('label-float');
            } else {
                label.classList.remove('label-float');
            }
        };

        toggleLabel(); // 초기 상태

        input.addEventListener('focus', () => {
            container.classList.add('input-hover-focus');
            toggleLabel();
        });

        input.addEventListener('blur', () => {
            container.classList.remove('input-hover-focus');
            toggleLabel();
        });

        input.addEventListener('input', toggleLabel);
    });
}

// DOMContentLoaded 또는 이미 로드된 경우 실행
if (document.readyState !== 'loading') {
    initInputLabelEffect();
} else {
    document.addEventListener('DOMContentLoaded', initInputLabelEffect);
}




function initHoverEffect() {
    // 1. 인풋 컨테이너 hover 효과
    document.querySelectorAll('[data-testid="design-system--text-field-container"]').forEach(container => {
        const label = container.querySelector('[data-testid="design-system--lable-text"]');

        container.addEventListener('mouseenter', () => {
            container.classList.add('input-hover-focus');
            if (label) label.classList.add('label-float-hover');
        });
        container.addEventListener('mouseleave', () => {
            container.classList.remove('input-hover-focus');
            if (label) label.classList.remove('label-float-hover');
        });
    });

    // 2. 버튼 hover 효과 (회원가입, 구글, 페이스북 등)
    document.querySelectorAll(
        '.box-border.flex.cursor-pointer.right-items-center.right-justify-center.border'
    ).forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.classList.add('button-hover-focus');
        });
        btn.addEventListener('mouseleave', () => {
            btn.classList.remove('button-hover-focus');
        });
    });
}

if (document.readyState !== 'loading') {
    initHoverEffect();
} else {
    document.addEventListener('DOMContentLoaded', initHoverEffect);
}

document.addEventListener('DOMContentLoaded', function() {
  const rememberCheckbox = document.querySelector('input[type="checkbox"][name="remember"]');
  const svgIcon = rememberCheckbox.nextElementSibling.querySelector('svg');

  // 페이지 로드시 체크 상태에 따라 표시
  if (rememberCheckbox.checked) {
    svgIcon.style.visibility = 'visible';
  } else {
    svgIcon.style.visibility = 'hidden';
  }

  // 체크 상태 변경 시 SVG 표시 제어
  rememberCheckbox.addEventListener('change', function() {
    if (this.checked) {
      svgIcon.style.visibility = 'visible';
    } else {
      svgIcon.style.visibility = 'hidden';
    }
  });
});

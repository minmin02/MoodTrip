    document.querySelectorAll('.custom-switch').forEach((switchEl) => {
        const bg = switchEl.querySelector('.switch-bg');
        const handle = switchEl.querySelector('.switch-handle');
        const input = switchEl.querySelector('input[type="checkbox"]');

        switchEl.addEventListener('click', () => {
            const isChecked = input.getAttribute('aria-checked') === 'true';

            if (isChecked) {
                // OFF 상태
                input.setAttribute('aria-checked', 'false');
                input.checked = false;
                bg.style.background = 'rgb(200, 202, 210)';
                handle.style.transform = 'translateX(2px)';
            } else {
                // ON 상태
                input.setAttribute('aria-checked', 'true');
                input.checked = true;
                bg.style.background = 'rgb(33, 34, 36)';
                handle.style.transform = 'translateX(20px)';
            }
        });
    });
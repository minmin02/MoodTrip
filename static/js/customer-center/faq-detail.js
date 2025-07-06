// faq-detail.js

document.addEventListener('DOMContentLoaded', function() {
    
    // 도움됨/도움안됨 버튼 기능
    const helpfulYesButton = document.getElementById('helpful-yes');
    const helpfulNoButton = document.getElementById('helpful-no');
    
    helpfulYesButton.addEventListener('click', function() {
        handleHelpfulClick('yes', this);
    });
    
    helpfulNoButton.addEventListener('click', function() {
        handleHelpfulClick('no', this);
    });
    
    function handleHelpfulClick(type, button) {
        // 다른 버튼 비활성화
        const otherButton = type === 'yes' ? helpfulNoButton : helpfulYesButton;
        otherButton.classList.remove('active');
        
        // 현재 버튼 토글
        button.classList.toggle('active');
        
        if (button.classList.contains('active')) {
            // 버튼 애니메이션
            button.style.transform = 'scale(1.05)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 200);
            
            // 피드백 메시지
            const message = type === 'yes' ? '피드백이 전송되었습니다.' : '피드백이 전송되었습니다. 더 나은 답변을 위해 노력하겠습니다.';
            showToast(message);
            
            console.log(`도움됨 피드백: ${type}`);
        }
    }
    
    // 토스트 메시지 표시
    function showToast(message) {
        // 기존 토스트 제거
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(to bottom right, #005792, #001A2C);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 87, 146, 0.3);
            z-index: 1000;
            animation: slideUp 0.3s ease;
        `;
        
        // 애니메이션 추가
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(toast);
        
        // 3초 후 제거
        setTimeout(() => {
            toast.style.animation = 'slideDown 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
                if (style.parentNode) {
                    style.remove();
                }
            }, 300);
        }, 3000);
    }
    
    // 이전/다음 FAQ 버튼 기능
    const prevButton = document.querySelector('.prev-btn');
    const nextButton = document.querySelector('.next-btn');
    
    prevButton.addEventListener('click', function() {
        // 실제로는 이전 FAQ URL로 이동
        console.log('이전 FAQ로 이동');
        this.style.transform = 'translateX(-2px)';
        setTimeout(() => {
            this.style.transform = 'translateX(0)';
        }, 200);
    });
    
    nextButton.addEventListener('click', function() {
        // 실제로는 다음 FAQ URL로 이동
        console.log('다음 FAQ로 이동');
        this.style.transform = 'translateX(2px)';
        setTimeout(() => {
            this.style.transform = 'translateX(0)';
        }, 200);
    });
    
    // 관련 FAQ 클릭 애니메이션
    document.querySelectorAll('.related-faq-item').forEach(item => {
        item.addEventListener('click', function(e) {
            // href가 # 인 경우 기본 동작 방지
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                
                // 클릭 애니메이션
                this.style.transform = 'translateX(8px) scale(0.98)';
                setTimeout(() => {
                    this.style.transform = 'translateX(4px) scale(1)';
                }, 150);
                
                console.log('관련 FAQ 클릭:', this.querySelector('.related-question').textContent);
            }
        });
    });
    
    // 도움 옵션 클릭 애니메이션
    document.querySelectorAll('.help-option').forEach(item => {
        item.addEventListener('click', function(e) {
            // 전화번호가 아닌 경우 기본 동작 방지 (데모용)
            if (!this.getAttribute('href').startsWith('tel:')) {
                e.preventDefault();
                
                // 클릭 애니메이션
                this.style.transform = 'translateX(8px) scale(0.98)';
                setTimeout(() => {
                    this.style.transform = 'translateX(4px) scale(1)';
                }, 150);
                
                console.log('도움 옵션 클릭:', this.querySelector('strong').textContent);
            }
        });
    });
    
    // 프로세스 플로우 스텝 호버 시 연결된 스텝 하이라이트
    const flowSteps = document.querySelectorAll('.flow-step');
    
    flowSteps.forEach((step, index) => {
        step.addEventListener('mouseenter', function() {
            // 현재 스텝과 다음 스텝 하이라이트
            flowSteps.forEach((s, i) => {
                if (i <= index) {
                    s.style.background = 'linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%)';
                    s.style.borderColor = '#005792';
                } else {
                    s.style.background = 'white';
                    s.style.borderColor = '#e2e8f0';
                }
            });
        });
        
        step.addEventListener('mouseleave', function() {
            // 모든 스텝 원상복구
            flowSteps.forEach(s => {
                s.style.background = 'white';
                s.style.borderColor = '#e2e8f0';
            });
        });
    });
    
    // 서브 FAQ 아이템 클릭 시 확장/축소 효과
    document.querySelectorAll('.sub-faq-item').forEach(item => {
        item.addEventListener('click', function() {
            this.style.background = '#e0f2fe';
            this.style.borderLeftColor = '#0369a1';
            
            setTimeout(() => {
                this.style.background = '#f8fafc';
                this.style.borderLeftColor = '#005792';
            }, 300);
        });
    });
    
    // 스크롤 시 상단 고정 네비게이션
    let lastScrollY = window.scrollY;
    const breadcrumbNav = document.querySelector('.breadcrumb-nav');
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            breadcrumbNav.style.position = 'sticky';
            breadcrumbNav.style.top = '0';
            breadcrumbNav.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            breadcrumbNav.style.backdropFilter = 'blur(8px)';
            breadcrumbNav.style.zIndex = '100';
        } else {
            breadcrumbNav.style.position = 'static';
            breadcrumbNav.style.backgroundColor = 'transparent';
            breadcrumbNav.style.backdropFilter = 'none';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // 키보드 네비게이션
    document.addEventListener('keydown', function(e) {
        // ESC 키로 뒤로 가기
        if (e.key === 'Escape') {
            history.back();
        }
        
        // 좌우 화살표로 이전/다음 FAQ 이동
        if (e.key === 'ArrowLeft') {
            prevButton.click();
        } else if (e.key === 'ArrowRight') {
            nextButton.click();
        }
        
        // Y 키로 도움됨 표시
        if (e.key === 'y' || e.key === 'Y') {
            helpfulYesButton.click();
        }
        
        // N 키로 도움안됨 표시
        if (e.key === 'n' || e.key === 'N') {
            helpfulNoButton.click();
        }
    });
    
    // 페이지 로드 시 애니메이션
    function animateOnLoad() {
        const elements = [
            '.faq-header',
            '.content-summary',
            '.content-body',
            '.faq-footer',
            '.related-faqs'
        ];
        
        elements.forEach((selector, index) => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    element.style.transition = 'all 0.6s ease';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 150);
            }
        });
    }
    
    // 페이지 로드 완료 후 애니메이션 실행
    setTimeout(animateOnLoad, 100);
    
    // 장점 카드 순차 애니메이션
    const benefitCards = document.querySelectorAll('.benefit-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    benefitCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
        observer.observe(card);
    });
    
    // URL 해시가 있는 경우 해당 섹션으로 스크롤
    if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    }
    
    // 텍스트 복사 기능 (Ctrl+C로 FAQ 제목 복사)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !window.getSelection().toString()) {
            const faqTitle = document.querySelector('.faq-title').textContent;
            navigator.clipboard.writeText(faqTitle).then(() => {
                showToast('FAQ 제목이 복사되었습니다.');
            });
        }
    });
});
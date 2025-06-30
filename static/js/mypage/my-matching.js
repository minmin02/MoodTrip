// 매칭 정보 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 탭 기능 초기화
    initializeTabs();
    
    // 버튼 이벤트 초기화
    initializeButtons();
    
    // 페이지네이션 초기화
    initializePagination();
});

/**
 * 탭 기능 초기화
 */
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // 모든 탭 버튼에서 active 클래스 제거
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // 클릭된 탭 버튼에 active 클래스 추가
            this.classList.add('active');
            
            // 모든 탭 콘텐츠 숨기기
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // 선택된 탭 콘텐츠 보이기
            const targetContent = document.getElementById(targetTab + '-tab');
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            // 탭 전환 애니메이션 효과
            addTabSwitchAnimation(targetContent);
        });
    });
}

/**
 * 탭 전환 애니메이션 효과
 */
function addTabSwitchAnimation(targetContent) {
    if (targetContent) {
        targetContent.style.opacity = '0';
        targetContent.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            targetContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            targetContent.style.opacity = '1';
            targetContent.style.transform = 'translateY(0)';
        }, 50);
    }
}

/**
 * 버튼 이벤트 초기화
 */
function initializeButtons() {
    // 채팅하기 버튼 이벤트
    const chatButtons = document.querySelectorAll('.btn-chat');
    chatButtons.forEach(button => {
        button.addEventListener('click', function() {
            const matchingItem = this.closest('.matching-item');
            const roomTitle = matchingItem.querySelector('.matching-title').textContent;
            const hostName = matchingItem.querySelector('.host-name').textContent;
            
            handleChatButtonClick(roomTitle, hostName);
        });
    });
    
    // 방 나가기 버튼 이벤트
    const exitButtons = document.querySelectorAll('.btn-exit-room');
    exitButtons.forEach(button => {
        button.addEventListener('click', function() {
            const matchingItem = this.closest('.matching-item');
            const roomTitle = matchingItem.querySelector('.matching-title').textContent;
            
            handleExitRoomClick(roomTitle, matchingItem);
        });
    });
}

/**
 * 채팅하기 버튼 클릭 처리
 */
function handleChatButtonClick(roomTitle, hostName) {
    // 로딩 효과 추가
    const button = event.target.closest('.btn-chat');
    const originalText = button.textContent;
    
    button.disabled = true;
    button.textContent = '접속 중...';
    button.style.opacity = '0.7';
    
    // 실제 채팅방 이동 로직 (예시)
    setTimeout(() => {
        // 채팅방 페이지로 이동
        // window.location.href = `/chat/room?title=${encodeURIComponent(roomTitle)}`;
        
        // 개발용 알림
        showNotification('success', `"${roomTitle}" 채팅방에 입장합니다.`);
        
        // 버튼 상태 복원
        button.disabled = false;
        button.textContent = originalText;
        button.style.opacity = '1';
    }, 1000);
}

/**
 * 방 나가기 버튼 클릭 처리
 */
function handleExitRoomClick(roomTitle, matchingItem) {
    // 확인 모달 표시
    showConfirmModal(
        '방 나가기',
        `"${roomTitle}" 방에서 나가시겠습니까?\n나간 후에는 다시 입장하려면 방장의 승인이 필요할 수 있습니다.`,
        () => {
            // 확인 버튼 클릭 시
            exitRoom(roomTitle, matchingItem);
        },
        () => {
            // 취소 버튼 클릭 시
            console.log('방 나가기 취소');
        }
    );
}

/**
 * 방 나가기 실행
 */
function exitRoom(roomTitle, matchingItem) {
    // 로딩 효과
    matchingItem.style.opacity = '0.5';
    matchingItem.style.pointerEvents = 'none';
    
    // 실제 API 호출 (예시)
    setTimeout(() => {
        // 방 나가기 애니메이션
        matchingItem.style.transform = 'translateX(-100%)';
        matchingItem.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            matchingItem.remove();
            showNotification('success', `"${roomTitle}" 방에서 나갔습니다.`);
            
            // 남은 항목이 없으면 메시지 표시
            checkEmptyState();
        }, 500);
    }, 1000);
}

/**
 * 빈 상태 확인 및 메시지 표시
 */
function checkEmptyState() {
    const activeTab = document.querySelector('.tab-content.active');
    const matchingItems = activeTab.querySelectorAll('.matching-item');
    
    if (matchingItems.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-state';
        emptyMessage.innerHTML = `
            <div style="text-align: center; padding: 4rem 2rem; color: #64748b;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="margin-bottom: 1rem; opacity: 0.5;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                </svg>
                <h3 style="margin-bottom: 0.5rem; color: #475569;">참여 중인 매칭이 없습니다</h3>
                <p style="color: #64748b;">새로운 여행 매칭을 찾아보세요!</p>
            </div>
        `;
        
        activeTab.querySelector('.matching-list-wrapper').appendChild(emptyMessage);
    }
}

/**
 * 페이지네이션 초기화
 */
function initializePagination() {
    const pageButtons = document.querySelectorAll('.page-btn:not(.prev):not(.next)');
    const prevButtons = document.querySelectorAll('.page-btn.prev');
    const nextButtons = document.querySelectorAll('.page-btn.next');
    
    // 페이지 번호 버튼 이벤트
    pageButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled && !this.classList.contains('active')) {
                const pageNumber = this.textContent;
                changePage(pageNumber);
            }
        });
    });
    
    // 이전 페이지 버튼 이벤트
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled) {
                const currentPage = document.querySelector('.page-btn.active');
                const currentPageNum = parseInt(currentPage.textContent);
                
                if (this.textContent.includes('‹‹') || this.querySelector('svg')) {
                    // 첫 페이지로 또는 이전 페이지로
                    const targetPage = this.textContent.includes('‹‹') ? 1 : currentPageNum - 1;
                    changePage(targetPage);
                }
            }
        });
    });
    
    // 다음 페이지 버튼 이벤트
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.disabled) {
                const currentPage = document.querySelector('.page-btn.active');
                const currentPageNum = parseInt(currentPage.textContent);
                
                if (this.textContent.includes('››') || this.querySelector('svg')) {
                    // 마지막 페이지로 또는 다음 페이지로
                    const isLastPage = this.textContent.includes('››');
                    const targetPage = isLastPage ? getLastPageNumber() : currentPageNum + 1;
                    changePage(targetPage);
                }
            }
        });
    });
}

/**
 * 페이지 변경
 */
function changePage(pageNumber) {
    // 현재 활성 페이지 버튼에서 active 클래스 제거
    const currentActive = document.querySelector('.page-btn.active');
    if (currentActive) {
        currentActive.classList.remove('active');
    }
    
    // 새 페이지 버튼에 active 클래스 추가
    const newActiveButton = Array.from(document.querySelectorAll('.page-btn')).find(btn => 
        btn.textContent.trim() === pageNumber.toString() && 
        !btn.classList.contains('prev') && 
        !btn.classList.contains('next')
    );
    
    if (newActiveButton) {
        newActiveButton.classList.add('active');
    }
    
    // 페이지 로딩 효과
    const activeTab = document.querySelector('.tab-content.active');
    const matchingList = activeTab.querySelector('.matching-list-wrapper');
    
    matchingList.style.opacity = '0.5';
    
    // 실제 페이지 데이터 로드 (예시)
    setTimeout(() => {
        // 새 데이터 로드 완료 후
        matchingList.style.opacity = '1';
        showNotification('info', `${pageNumber}페이지로 이동했습니다.`);
        
        // 페이지 상단으로 스크롤
        document.querySelector('.main-wrapper').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }, 500);
    
    // 이전/다음 버튼 상태 업데이트
    updatePaginationButtons(pageNumber);
}

/**
 * 페이지네이션 버튼 상태 업데이트
 */
function updatePaginationButtons(currentPage) {
    const prevButtons = document.querySelectorAll('.page-btn.prev');
    const nextButtons = document.querySelectorAll('.page-btn.next');
    const lastPage = getLastPageNumber();
    
    // 이전 버튼 상태
    prevButtons.forEach(button => {
        button.disabled = currentPage <= 1;
    });
    
    // 다음 버튼 상태
    nextButtons.forEach(button => {
        button.disabled = currentPage >= lastPage;
    });
}

/**
 * 마지막 페이지 번호 가져오기
 */
function getLastPageNumber() {
    const pageButtons = document.querySelectorAll('.page-btn:not(.prev):not(.next)');
    const lastButton = Array.from(pageButtons).pop();
    return lastButton ? parseInt(lastButton.textContent) : 1;
}

/**
 * 확인 모달 표시
 */
function showConfirmModal(title, message, onConfirm, onCancel) {
    // 기존 모달이 있다면 제거
    const existingModal = document.querySelector('.confirm-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 모달 HTML 생성
    const modal = document.createElement('div');
    modal.className = 'confirm-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <h3 class="modal-title">${title}</h3>
                <p class="modal-message">${message}</p>
                <div class="modal-buttons">
                    <button class="modal-btn cancel-btn">취소</button>
                    <button class="modal-btn confirm-btn">확인</button>
                </div>
            </div>
        </div>
    `;
    
    // 모달 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        .confirm-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 26, 44, 0.6);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-content {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
            backdrop-filter: blur(20px);
            padding: 2rem;
            border-radius: 16px;
            box-shadow: 0 25px 50px rgba(0, 26, 44, 0.15);
            border: 1px solid rgba(0, 87, 146, 0.1);
            max-width: 400px;
            width: 90%;
            text-align: center;
        }
        
        .modal-title {
            color: #001A2C;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 1rem;
        }
        
        .modal-message {
            color: #475569;
            line-height: 1.5;
            margin-bottom: 2rem;
            white-space: pre-line;
        }
        
        .modal-buttons {
            display: flex;
            gap: 12px;
            justify-content: center;
        }
        
        .modal-btn {
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
            font-size: 14px;
        }
        
        .cancel-btn {
            background: rgba(255, 255, 255, 0.9);
            color: #64748b;
            border: 1px solid rgba(0, 87, 146, 0.2);
        }
        
        .cancel-btn:hover {
            background: rgba(248, 250, 252, 0.9);
            color: #475569;
        }
        
        .confirm-btn {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            color: white;
        }
        
        .confirm-btn:hover {
            background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
            transform: translateY(-1px);
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // 이벤트 리스너 추가
    const cancelBtn = modal.querySelector('.cancel-btn');
    const confirmBtn = modal.querySelector('.confirm-btn');
    
    cancelBtn.addEventListener('click', () => {
        modal.remove();
        style.remove();
        if (onCancel) onCancel();
    });
    
    confirmBtn.addEventListener('click', () => {
        modal.remove();
        style.remove();
        if (onConfirm) onConfirm();
    });
    
    // 오버레이 클릭 시 모달 닫기
    modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            modal.remove();
            style.remove();
            if (onCancel) onCancel();
        }
    });
}

/**
 * 알림 메시지 표시
 */
function showNotification(type, message) {
    // 기존 알림이 있다면 제거
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 알림 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 12px;
            color: white;
            font-weight: 600;
            z-index: 1001;
            animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s;
            box-shadow: 0 8px 24px rgba(0, 26, 44, 0.15);
            backdrop-filter: blur(10px);
        }
        
        .notification-success {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
        
        .notification-error {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        }
        
        .notification-info {
            background: linear-gradient(135deg, #005792 0%, #001A2C 100%);
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
            style.remove();
        }
    }, 3000);
}

/**
 * 키보드 이벤트 처리
 */
document.addEventListener('keydown', function(e) {
    // ESC 키로 모달 닫기
    if (e.key === 'Escape') {
        const modal = document.querySelector('.confirm-modal');
        if (modal) {
            modal.remove();
        }
    }
    
    // 방향키로 페이지네이션 제어
    if (e.key === 'ArrowLeft') {
        const prevButton = document.querySelector('.page-btn.prev:not(:disabled)');
        if (prevButton) {
            prevButton.click();
        }
    }
    
    if (e.key === 'ArrowRight') {
        const nextButton = document.querySelector('.page-btn.next:not(:disabled)');
        if (nextButton) {
            nextButton.click();
        }
    }
});
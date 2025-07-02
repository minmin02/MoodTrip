// 관리자 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 초기화
    initializeAdminPanel();
});

// 초기화 함수
function initializeAdminPanel() {
    setupMenuNavigation();
    setupButtonEvents();
    setupFormValidation();
    setupTabNavigation();
    setupFilterButtons();
    setupSearchFunctionality();
    setupModals();
    setupTableActions();
    initializeCharts();
    setupMobileMenu();
}

// 1. 메뉴 네비게이션
function setupMenuNavigation() {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            // 모든 메뉴 아이템에서 active 클래스 제거
            document.querySelectorAll('.menu-item').forEach(menu => menu.classList.remove('active'));
            // 클릭된 메뉴에 active 클래스 추가
            this.classList.add('active');
            
            // 모든 섹션 숨기기
            document.querySelectorAll('.content-section').forEach(section => section.style.display = 'none');
            
            // 선택된 섹션 보이기
            const menuType = this.getAttribute('data-menu');
            const targetSection = document.getElementById(menuType + '-section');
            if (targetSection) {
                targetSection.style.display = 'block';
            }
            
            // 페이지 제목 변경
            const titles = {
                'dashboard': '대시보드',
                'users': '회원 관리',
                'content': '콘텐츠 관리',
                'matching': '매칭 관리',
                'locations': '관광지 관리',
                'reports': '신고 관리',
                'notices': '공지사항',
                'settings': '설정'
            };
            
            const pageTitle = document.getElementById('page-title');
            const pageSubtitle = document.getElementById('page-subtitle');
            
            if (pageTitle) {
                pageTitle.textContent = titles[menuType] || '관리자';
            }
            
            if (pageSubtitle) {
                const subtitles = {
                    'dashboard': '전체 현황을 확인하세요',
                    'users': '회원 정보를 관리하세요',
                    'content': '콘텐츠를 관리하세요',
                    'matching': '매칭 현황을 확인하세요',
                    'locations': '관광지 정보를 관리하세요',
                    'reports': '신고 내역을 처리하세요',
                    'notices': '공지사항을 관리하세요',
                    'settings': '시스템 설정을 변경하세요'
                };
                pageSubtitle.textContent = subtitles[menuType] || '';
            }
            
            // 모바일에서 메뉴 닫기
            if (window.innerWidth <= 1200) {
                document.querySelector('.sidebar').classList.remove('open');
            }
        });
    });
}

// 2. 버튼 이벤트 설정
function setupButtonEvents() {
    // 공지사항 발행 버튼
    const publishBtn = document.querySelector('#notices-section .btn-primary');
    if (publishBtn) {
        publishBtn.addEventListener('click', function() {
            handleNoticePublish();
        });
    }
    
    // 임시저장 버튼
    const draftBtn = document.querySelector('#notices-section .btn-secondary');
    if (draftBtn) {
        draftBtn.addEventListener('click', function() {
            handleNoticeDraft();
        });
    }
    
    // 동적 버튼 이벤트 처리 (이벤트 위임 사용)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-small')) {
            const action = e.target.textContent.trim();
            const row = e.target.closest('tr');
            
            if (action === '정지') {
                handleUserSuspension(row);
            } else if (action === '활성화') {
                handleUserActivation(row);
            } else if (action === '상세') {
                handleUserDetail(row);
            } else if (action === '수정') {
                handleContentEdit(row);
            } else if (action === '삭제') {
                handleContentDelete(row);
            } else if (action === '상세보기') {
                handleMatchingDetail(e.target);
            } else if (action === '강제종료') {
                handleMatchingTerminate(e.target);
            } else if (action === '복구') {
                handleMatchingRestore(e.target);
            } else if (action === '경고') {
                handleReportWarning(e.target);
            } else if (action === '계정정지') {
                handleReportSuspension(e.target);
            } else if (action === '처리취소') {
                handleReportCancel(e.target);
            } else if (action === '승인') {
                handleReviewApproval(e.target);
            } else if (action === '거부') {
                handleReviewRejection(e.target);
            } else if (action === '비활성화') {
                handleTagDeactivation(e.target);
            }
        }
    });
    
    // 새 콘텐츠/관광지 추가 버튼
    document.querySelectorAll('.btn-primary').forEach(btn => {
        if (btn.textContent.includes('새 콘텐츠 추가')) {
            btn.addEventListener('click', () => showAddContentForm());
        } else if (btn.textContent.includes('새 관광지 추가')) {
            btn.addEventListener('click', () => showAddLocationForm());
        } else if (btn.textContent.includes('새 공지사항 작성')) {
            btn.addEventListener('click', () => showNoticeForm());
        } else if (btn.textContent.includes('새 태그 추가')) {
            btn.addEventListener('click', () => showAddTagForm());
        }
    });
    
    // 설정 저장 버튼
    const settingSaveBtn = document.querySelector('#settings-section .btn-primary');
    if (settingSaveBtn) {
        settingSaveBtn.addEventListener('click', handleSettingsSave);
    }
    
    // 설정 초기화 버튼
    const settingResetBtn = document.querySelector('#settings-section .btn-secondary');
    if (settingResetBtn) {
        settingResetBtn.addEventListener('click', handleSettingsReset);
    }
}

// 3. 폼 유효성 검사
function setupFormValidation() {
    // 공지사항 폼 유효성 검사
    const noticeForm = document.querySelector('#notices-section .notice-form');
    if (noticeForm) {
        const inputs = noticeForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
    
    // 관광지 폼 유효성 검사
    const locationForm = document.querySelector('#locations-section .location-form');
    if (locationForm) {
        const inputs = locationForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
}

// 4. 탭 네비게이션
function setupTabNavigation() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // 같은 그룹의 탭들에서 active 제거
            const tabGroup = this.parentElement;
            tabGroup.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            
            // 클릭된 탭에 active 추가
            this.classList.add('active');
            
            // 탭 콘텐츠 표시
            const tabId = this.getAttribute('data-tab');
            handleTabChange(tabId);
        });
    });
}

// 5. 필터 버튼 설정
function setupFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // 같은 그룹의 필터 버튼들에서 active 제거
            const filterGroup = this.parentElement;
            filterGroup.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            
            // 클릭된 버튼에 active 추가
            this.classList.add('active');
            
            // 필터 적용
            const filterType = this.textContent.trim();
            applyFilter(filterType);
        });
    });
}

// 6. 검색 기능
function setupSearchFunctionality() {
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const section = this.closest('.content-section');
            performSearch(searchTerm, section);
        });
    });
    
    // 검색 버튼
    document.querySelectorAll('.btn-primary').forEach(btn => {
        if (btn.textContent.includes('검색')) {
            btn.addEventListener('click', function() {
                const searchInput = this.parentElement.querySelector('.search-input');
                if (searchInput) {
                    const searchTerm = searchInput.value.toLowerCase();
                    const section = this.closest('.content-section');
                    performSearch(searchTerm, section);
                }
            });
        }
    });
}

// 7. 모달 설정
function setupModals() {
    // 모달 배경 클릭 시 닫기
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-backdrop')) {
            closeModal();
        }
    });
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// 8. 테이블 액션 설정
function setupTableActions() {
    // 테이블 행 클릭 이벤트
    document.querySelectorAll('.data-table tbody tr').forEach(row => {
        row.addEventListener('click', function(e) {
            // 버튼 클릭이 아닌 경우에만 행 선택
            if (!e.target.closest('button')) {
                selectTableRow(this);
            }
        });
    });
}

// 9. 차트 초기화
function initializeCharts() {
    // Chart.js가 로드된 경우에만 실행
    if (typeof Chart !== 'undefined') {
        initUserChart();
        initEmotionChart();
    }
}

// 10. 모바일 메뉴 설정
function setupMobileMenu() {
    // 모바일 메뉴 토글 버튼 생성
    if (window.innerWidth <= 1200) {
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '☰';
        document.body.appendChild(menuToggle);
        
        menuToggle.addEventListener('click', function() {
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.toggle('open');
        });
    }
    
    // 창 크기 변경 시 메뉴 상태 업데이트
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1200) {
            document.querySelector('.sidebar').classList.remove('open');
            const menuToggle = document.querySelector('.menu-toggle');
            if (menuToggle) {
                menuToggle.remove();
            }
        } else if (!document.querySelector('.menu-toggle')) {
            const menuToggle = document.createElement('button');
            menuToggle.className = 'menu-toggle';
            menuToggle.innerHTML = '☰';
            document.body.appendChild(menuToggle);
            
            menuToggle.addEventListener('click', function() {
                document.querySelector('.sidebar').classList.toggle('open');
            });
        }
    });
}

// === 핸들러 함수들 ===

// 공지사항 발행 처리
function handleNoticePublish() {
    const form = document.querySelector('#notices-section .notice-form');
    const formData = collectFormData(form);
    
    if (validateNoticeForm(formData)) {
        showConfirmModal('공지사항을 발행하시겠습니까?', function() {
            // 실제 발행 로직 (백엔드 연동 시 API 호출)
            console.log('공지사항 발행:', formData);
            showSuccessMessage('공지사항이 성공적으로 발행되었습니다.');
            clearForm(form);
        });
    }
}

// 공지사항 임시저장 처리
function handleNoticeDraft() {
    const form = document.querySelector('#notices-section .notice-form');
    const formData = collectFormData(form);
    
    // 임시저장 로직
    console.log('공지사항 임시저장:', formData);
    showSuccessMessage('공지사항이 임시저장되었습니다.');
}

// 회원 정지 처리
function handleUserSuspension(row) {
    const userName = row.cells[1].textContent;
    showConfirmModal(`${userName} 회원을 정지하시겠습니까?`, function() {
        // 정지 로직
        console.log('회원 정지:', userName);
        const statusCell = row.querySelector('.status');
        statusCell.textContent = '정지';
        statusCell.className = 'status suspended';
        updateUserButtons(row);
        showSuccessMessage('회원이 정지되었습니다.');
    });
}

// 회원 활성화 처리
function handleUserActivation(row) {
    const userName = row.cells[1].textContent;
    showConfirmModal(`${userName} 회원을 활성화하시겠습니까?`, function() {
        // 활성화 로직
        console.log('회원 활성화:', userName);
        const statusCell = row.querySelector('.status');
        statusCell.textContent = '활성';
        statusCell.className = 'status active';
        updateUserButtons(row);
        showSuccessMessage('회원이 활성화되었습니다.');
    });
}

// 회원 상세 보기
function handleUserDetail(row) {
    const userId = row.cells[0].textContent;
    // 상세 정보 모달 표시
    showUserDetailModal(userId);
}

// 콘텐츠 수정
function handleContentEdit(row) {
    const contentTitle = row.cells[0].textContent;
    console.log('콘텐츠 수정:', contentTitle);
    // 수정 폼 표시
}

// 콘텐츠 삭제
function handleContentDelete(row) {
    const contentTitle = row.cells[0].textContent;
    showConfirmModal(`'${contentTitle}'을(를) 삭제하시겠습니까?`, function() {
        row.remove();
        showSuccessMessage('콘텐츠가 삭제되었습니다.');
    });
}

// 매칭 상세 보기
function handleMatchingDetail(btn) {
    const matchingCard = btn.closest('.matching-card');
    const title = matchingCard.querySelector('h4').textContent;
    console.log('매칭 상세 보기:', title);
}

// 매칭 강제 종료
function handleMatchingTerminate(btn) {
    const matchingCard = btn.closest('.matching-card');
    const title = matchingCard.querySelector('h4').textContent;
    showConfirmModal(`'${title}' 매칭을 강제 종료하시겠습니까?`, function() {
        const status = matchingCard.querySelector('.matching-status');
        status.textContent = '강제종료';
        status.className = 'matching-status terminated';
        updateMatchingButtons(matchingCard);
        showSuccessMessage('매칭이 강제 종료되었습니다.');
    });
}

// 매칭 복구
function handleMatchingRestore(btn) {
    const matchingCard = btn.closest('.matching-card');
    const title = matchingCard.querySelector('h4').textContent;
    showConfirmModal(`'${title}' 매칭을 복구하시겠습니까?`, function() {
        const status = matchingCard.querySelector('.matching-status');
        status.textContent = '진행중';
        status.className = 'matching-status active';
        updateMatchingButtons(matchingCard);
        showSuccessMessage('매칭이 복구되었습니다.');
    });
}

// 신고 경고 처리
function handleReportWarning(btn) {
    const reportItem = btn.closest('.report-item');
    showConfirmModal('경고 처리하시겠습니까?', function() {
        const status = reportItem.querySelector('.report-status');
        status.textContent = '경고처리';
        status.className = 'report-status warning-issued';
        updateReportButtons(reportItem);
        showSuccessMessage('경고 처리되었습니다.');
    });
}

// 신고 계정정지 처리
function handleReportSuspension(btn) {
    const reportItem = btn.closest('.report-item');
    showConfirmModal('계정을 정지하시겠습니까?', function() {
        const status = reportItem.querySelector('.report-status');
        status.textContent = '계정정지';
        status.className = 'report-status suspended';
        updateReportButtons(reportItem);
        showSuccessMessage('계정이 정지되었습니다.');
    });
}

// 신고 처리 취소
function handleReportCancel(btn) {
    const reportItem = btn.closest('.report-item');
    showConfirmModal('신고 처리를 취소하시겠습니까?', function() {
        const status = reportItem.querySelector('.report-status');
        status.textContent = '미처리';
        status.className = 'report-status pending';
        updateReportButtons(reportItem);
        showSuccessMessage('신고 처리가 취소되었습니다.');
    });
}

// 리뷰 승인 처리
function handleReviewApproval(btn) {
    const row = btn.closest('tr');
    const review = row.cells[3].textContent;
    showConfirmModal('리뷰를 승인하시겠습니까?', function() {
        const statusCell = row.querySelector('.status');
        statusCell.textContent = '승인완료';
        statusCell.className = 'status active';
        updateReviewButtons(row);
        showSuccessMessage('리뷰가 승인되었습니다.');
    });
}

// 리뷰 거부 처리
function handleReviewRejection(btn) {
    const row = btn.closest('tr');
    showConfirmModal('리뷰를 거부하시겠습니까?', function() {
        const statusCell = row.querySelector('.status');
        statusCell.textContent = '거부';
        statusCell.className = 'status suspended';
        updateReviewButtons(row);
        showSuccessMessage('리뷰가 거부되었습니다.');
    });
}

// 태그 비활성화 처리
function handleTagDeactivation(btn) {
    const row = btn.closest('tr');
    const tagName = row.cells[0].textContent;
    showConfirmModal(`'${tagName}' 태그를 비활성화하시겠습니까?`, function() {
        const statusCell = row.querySelector('.status');
        statusCell.textContent = '비활성';
        statusCell.className = 'status suspended';
        updateTagButtons(row);
        showSuccessMessage('태그가 비활성화되었습니다.');
    });
}

// 설정 저장
function handleSettingsSave() {
    const settingsData = collectSettingsData();
    console.log('설정 저장:', settingsData);
    showSuccessMessage('설정이 저장되었습니다.');
}

// 설정 초기화
function handleSettingsReset() {
    showConfirmModal('설정을 초기화하시겠습니까?', function() {
        resetSettingsForm();
        showSuccessMessage('설정이 초기화되었습니다.');
    });
}

// === 유틸리티 함수들 ===

// 회원 상태에 따른 버튼 업데이트
function updateUserButtons(row) {
    const statusCell = row.querySelector('.status');
    const actionCell = row.querySelector('td:last-child');
    const isActive = statusCell.textContent.includes('활성');
    
    actionCell.innerHTML = `
        <button class="btn-small">상세</button>
        ${isActive ? 
            '<button class="btn-small danger">정지</button>' : 
            '<button class="btn-small success">활성화</button>'
        }
    `;
}

// 매칭 상태에 따른 버튼 업데이트
function updateMatchingButtons(matchingCard) {
    const status = matchingCard.querySelector('.matching-status');
    const actionButtons = matchingCard.querySelector('.matching-actions');
    const isTerminated = status.textContent.includes('강제종료');
    
    actionButtons.innerHTML = `
        <button class="btn-small">상세보기</button>
        ${isTerminated ? 
            '<button class="btn-small success">복구</button>' : 
            '<button class="btn-small danger">강제종료</button>'
        }
    `;
}

// 신고 상태에 따른 버튼 업데이트
function updateReportButtons(reportItem) {
    const status = reportItem.querySelector('.report-status');
    const actionButtons = reportItem.querySelector('.report-actions');
    const statusText = status.textContent;
    
    if (statusText.includes('미처리')) {
        actionButtons.innerHTML = `
            <button class="btn-small">상세보기</button>
            <button class="btn-small warning">경고</button>
            <button class="btn-small danger">계정정지</button>
        `;
    } else if (statusText.includes('경고처리') || statusText.includes('계정정지')) {
        actionButtons.innerHTML = `
            <button class="btn-small">상세보기</button>
            <button class="btn-small success">처리취소</button>
        `;
    } else {
        actionButtons.innerHTML = `
            <button class="btn-small">상세보기</button>
        `;
    }
}

// 리뷰 상태에 따른 버튼 업데이트
function updateReviewButtons(row) {
    const statusCell = row.querySelector('.status');
    const actionCell = row.querySelector('td:last-child');
    const status = statusCell.textContent;
    
    if (status.includes('승인대기')) {
        actionCell.innerHTML = `
            <button class="btn-small success">승인</button>
            <button class="btn-small danger">거부</button>
        `;
    } else {
        actionCell.innerHTML = `
            <button class="btn-small">상세</button>
            <button class="btn-small danger">삭제</button>
        `;
    }
}

// 태그 상태에 따른 버튼 업데이트
function updateTagButtons(row) {
    const statusCell = row.querySelector('.status');
    const actionCell = row.querySelector('td:last-child');
    const isActive = statusCell.textContent.includes('활성');
    
    actionCell.innerHTML = `
        <button class="btn-small">수정</button>
        ${isActive ? 
            '<button class="btn-small danger">비활성화</button>' : 
            '<button class="btn-small success">활성화</button>'
        }
    `;
}

// 폼 데이터 수집
function collectFormData(form) {
    const formData = {};
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        formData[input.name || input.id] = input.value;
    });
    return formData;
}

// 설정 데이터 수집
function collectSettingsData() {
    const settingsData = {};
    document.querySelectorAll('#settings-section input').forEach(input => {
        settingsData[input.previousElementSibling.textContent] = input.value;
    });
    return settingsData;
}

// 공지사항 폼 유효성 검사
function validateNoticeForm(formData) {
    const title = formData.title || '';
    const content = formData.content || '';
    
    if (title.trim() === '') {
        showErrorMessage('제목을 입력해주세요.');
        return false;
    }
    
    if (content.trim() === '') {
        showErrorMessage('내용을 입력해주세요.');
        return false;
    }
    
    return true;
}

// 필드 유효성 검사
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    
    // 기본 유효성 검사
    if (field.hasAttribute('required') && value === '') {
        showFieldError(field, '필수 입력 항목입니다.');
        return false;
    }
    
    // 이메일 유효성 검사
    if (fieldType === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, '올바른 이메일 형식이 아닙니다.');
            return false;
        }
    }
    
    // 숫자 유효성 검사
    if (fieldType === 'number' && value !== '') {
        if (isNaN(value) || Number(value) < 0) {
            showFieldError(field, '올바른 숫자를 입력해주세요.');
            return false;
        }
    }
    
    clearFieldError(field);
    return true;
}

// 탭 변경 처리
function handleTabChange(tabId) {
    console.log('탭 변경:', tabId);
    
    // 콘텐츠 관리 탭 전환
    if (document.getElementById('content-section').style.display === 'block') {
        // 모든 탭 콘텐츠 숨기기
        document.querySelectorAll('#content-section .tab-content').forEach(content => {
            content.style.display = 'none';
            content.classList.remove('active');
        });
        
        // 선택된 탭 콘텐츠 보이기
        const targetTab = document.getElementById(tabId + '-tab');
        if (targetTab) {
            targetTab.style.display = 'block';
            targetTab.classList.add('active');
        }
    }
}

// 필터 적용
function applyFilter(filterType) {
    console.log('필터 적용:', filterType);
    
    // 매칭 관리 필터
    if (document.getElementById('matching-section').style.display === 'block') {
        const matchingCards = document.querySelectorAll('.matching-card');
        matchingCards.forEach(card => {
            const status = card.querySelector('.matching-status').textContent;
            if (filterType === '전체' || status.includes(filterType)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // 신고 관리 필터
    if (document.getElementById('reports-section').style.display === 'block') {
        const reportItems = document.querySelectorAll('.report-item');
        reportItems.forEach(item => {
            const status = item.querySelector('.report-status').textContent;
            if (filterType === '전체' || status.includes(filterType)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // 리뷰 관리 필터
    if (document.getElementById('reviews-tab').style.display === 'block') {
        const reviewRows = document.querySelectorAll('#reviews-tab .data-table tbody tr');
        reviewRows.forEach(row => {
            const status = row.querySelector('.status').textContent;
            if (filterType === '전체' || status.includes(filterType)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
}

// 검색 수행
function performSearch(searchTerm, section) {
    if (!section) return;
    
    const searchableElements = section.querySelectorAll('.data-table tbody tr, .matching-card, .report-item');
    
    searchableElements.forEach(element => {
        const text = element.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            element.style.display = '';
        } else {
            element.style.display = 'none';
        }
    });
}

// 테이블 행 선택
function selectTableRow(row) {
    // 기존 선택 해제
    document.querySelectorAll('.data-table tbody tr.selected').forEach(r => {
        r.classList.remove('selected');
    });
    
    // 새로운 행 선택
    row.classList.add('selected');
}

// 모달 표시
function showModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
        <div class="modal-content">
            ${content}
        </div>
    `;
    document.body.appendChild(modal);
}

// 확인 모달 표시
function showConfirmModal(message, onConfirm) {
    const content = `
        <h3>확인</h3>
        <p>${message}</p>
        <div class="modal-actions">
            <button class="btn-secondary" onclick="closeModal()">취소</button>
            <button class="btn-primary" onclick="confirmAction()">확인</button>
        </div>
    `;
    
    showModal(content);
    
    // 확인 버튼 클릭 시 실행할 함수 저장
    window.confirmAction = function() {
        closeModal();
        onConfirm();
        delete window.confirmAction;
    };
}

// 사용자 상세 모달
function showUserDetailModal(userId) {
    const content = `
        <h3>회원 상세 정보</h3>
        <div class="user-detail">
            <p><strong>ID:</strong> ${userId}</p>
            <p><strong>가입일:</strong> 2024-06-15</p>
            <p><strong>최근 로그인:</strong> 2024-07-01</p>
            <p><strong>매칭 참여 횟수:</strong> 5회</p>
            <p><strong>신고 접수:</strong> 0건</p>
            <p><strong>리뷰 작성:</strong> 12건</p>
        </div>
        <div class="modal-actions">
            <button class="btn-secondary" onclick="closeModal()">닫기</button>
        </div>
    `;
    showModal(content);
}

// 모달 닫기
function closeModal() {
    const modal = document.querySelector('.modal-backdrop');
    if (modal) {
        modal.remove();
    }
}

// 성공 메시지 표시
function showSuccessMessage(message) {
    showToast(message, 'success');
}

// 에러 메시지 표시
function showErrorMessage(message) {
    showToast(message, 'error');
}

// 토스트 메시지 표시
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // 애니메이션을 위한 지연
    setTimeout(() => toast.classList.add('show'), 100);
    
    // 3초 후 제거
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 필드 에러 표시
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
    field.classList.add('error');
}

// 필드 에러 제거
function clearFieldError(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    field.classList.remove('error');
}

// 폼 초기화
function clearForm(form) {
    form.reset();
    // 에러 메시지 제거
    form.querySelectorAll('.field-error').forEach(error => error.remove());
    form.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
}

// 설정 폼 초기화
function resetSettingsForm() {
    document.querySelectorAll('#settings-section input').forEach(input => {
        if (input.type === 'text') {
            input.value = input.getAttribute('data-default') || '';
        } else if (input.type === 'number') {
            input.value = input.getAttribute('data-default') || '0';
        } else if (input.type === 'email') {
            input.value = input.getAttribute('data-default') || '';
        }
    });
}

// 폼 표시 함수들
function showAddContentForm() {
    console.log('새 콘텐츠 추가 폼 표시');
    showSuccessMessage('콘텐츠 추가 기능이 준비 중입니다.');
}

function showAddLocationForm() {
    console.log('새 관광지 추가 폼 표시');
    showSuccessMessage('관광지 추가 기능이 준비 중입니다.');
}

function showNoticeForm() {
    console.log('새 공지사항 작성 폼 표시');
    showSuccessMessage('공지사항 작성 기능이 준비 중입니다.');
}

function showAddTagForm() {
    console.log('새 태그 추가 폼 표시');
    showSuccessMessage('태그 추가 기능이 준비 중입니다.');
}

// 차트 초기화 함수들
function initUserChart() {
    const ctx = document.getElementById('userChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
            datasets: [{
                label: '월별 가입자',
                data: [120, 150, 200, 280, 350, 420],
                borderColor: '#005792',
                backgroundColor: 'rgba(0, 87, 146, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 87, 146, 0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 87, 146, 0.1)'
                    }
                }
            }
        }
    });
}

function initEmotionChart() {
    const ctx = document.getElementById('emotionChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['휴식', '모험', '로맨틱', '체험', '자연'],
            datasets: [{
                data: [30, 25, 20, 15, 10],
                backgroundColor: [
                    '#005792',
                    '#0066A1',
                    '#0075B0',
                    '#0084BF',
                    '#0093CE'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

// 데이터 내보내기 함수 (추가 기능)
function exportData(type) {
    console.log(`${type} 데이터 내보내기`);
    showSuccessMessage(`${type} 데이터 내보내기가 시작되었습니다.`);
}

// 백업 및 복원 함수 (추가 기능)
function backupData() {
    console.log('데이터 백업 시작');
    showSuccessMessage('데이터 백업이 시작되었습니다.');
}

function restoreData() {
    showConfirmModal('데이터를 복원하시겠습니까? 현재 데이터가 손실될 수 있습니다.', function() {
        console.log('데이터 복원 시작');
        showSuccessMessage('데이터 복원이 시작되었습니다.');
    });
}

// 시스템 상태 확인 함수
function checkSystemStatus() {
    console.log('시스템 상태 확인');
    
    // 가상의 시스템 상태 데이터
    const systemStatus = {
        server: '정상',
        database: '정상',
        storage: '87% 사용중',
        lastBackup: '2024-07-01 02:00'
    };
    
    const content = `
        <h3>시스템 상태</h3>
        <div class="system-status">
            <p><strong>서버 상태:</strong> <span class="status-good">${systemStatus.server}</span></p>
            <p><strong>데이터베이스:</strong> <span class="status-good">${systemStatus.database}</span></p>
            <p><strong>저장공간:</strong> <span class="status-warning">${systemStatus.storage}</span></p>
            <p><strong>마지막 백업:</strong> ${systemStatus.lastBackup}</p>
        </div>
        <div class="modal-actions">
            <button class="btn-secondary" onclick="closeModal()">닫기</button>
        </div>
    `;
    showModal(content);
}

// 알림 설정 함수
function setupNotifications() {
    // 브라우저 알림 권한 요청
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(function(permission) {
            if (permission === 'granted') {
                showSuccessMessage('알림 권한이 허용되었습니다.');
            }
        });
    }
}

// 실시간 업데이트 시뮬레이션
function simulateRealTimeUpdates() {
    setInterval(function() {
        // 랜덤으로 새로운 활동 추가
        const activities = [
            '새로운 회원이 가입했습니다',
            '매칭이 성사되었습니다',
            '새로운 리뷰가 등록되었습니다',
            '신고가 접수되었습니다'
        ];
        
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        const activityList = document.querySelector('.activity-list');
        
        if (activityList) {
            const newActivity = document.createElement('div');
            newActivity.className = 'activity-item';
            newActivity.innerHTML = `
                <span class="activity-time">방금 전</span>
                <span class="activity-text">${randomActivity}</span>
            `;
            
            activityList.insertBefore(newActivity, activityList.firstChild);
            
            // 최대 10개 활동만 유지
            const activities = activityList.querySelectorAll('.activity-item');
            if (activities.length > 10) {
                activityList.removeChild(activityList.lastChild);
            }
        }
    }, 30000); // 30초마다 실행
}

// 초기화 완료 후 추가 설정
document.addEventListener('DOMContentLoaded', function() {
    // 알림 설정
    setupNotifications();
    
    // 실시간 업데이트 시작 (데모용)
    // simulateRealTimeUpdates();
});

// 전역 에러 핸들러
window.addEventListener('error', function(e) {
    console.error('JavaScript 에러:', e.error);
    showErrorMessage('시스템 오류가 발생했습니다. 새로고침 후 다시 시도해주세요.');
});

// 네트워크 상태 감지
window.addEventListener('online', function() {
    showSuccessMessage('네트워크가 연결되었습니다.');
});

window.addEventListener('offline', function() {
    showErrorMessage('네트워크 연결이 끊어졌습니다.');
});

console.log('관리자 페이지 JavaScript 로딩 완료');
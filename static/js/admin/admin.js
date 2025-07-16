// 관리자 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 초기화
    initializeAdminPanel();
});

// 초기화 함수
function initializeAdminPanel() {
    setupMenuNavigation();
    setupTabNavigation();
    setupFilterButtons();
    setupSearchFunctionality();
    setupMobileMenu();
    initializeCharts();
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
            updatePageTitle(menuType);
            
            // 모바일에서 메뉴 닫기
            if (window.innerWidth <= 1200) {
                document.querySelector('.sidebar').classList.remove('open');
            }
        });
    });
}

function updatePageTitle(menuType) {
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
    
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
    
    if (pageTitle) {
        pageTitle.textContent = titles[menuType] || '관리자';
    }
    
    if (pageSubtitle) {
        pageSubtitle.textContent = subtitles[menuType] || '';
    }
}

// 2. 탭 네비게이션
function setupTabNavigation() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabGroup = this.parentElement;
            tabGroup.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const tabId = this.getAttribute('data-tab');
            handleTabChange(tabId);
        });
    });
}

function handleTabChange(tabId) {
    // 콘텐츠 관리 탭 전환
    if (document.getElementById('content-section').style.display === 'block') {
        document.querySelectorAll('#content-section .tab-content').forEach(content => {
            content.style.display = 'none';
            content.classList.remove('active');
        });
        
        const targetTab = document.getElementById(tabId + '-tab');
        if (targetTab) {
            targetTab.style.display = 'block';
            targetTab.classList.add('active');
        }
    }
}

// 3. 필터 버튼 설정
function setupFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filterGroup = this.parentElement;
            filterGroup.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filterType = this.textContent.trim();
            applyFilter(filterType);
        });
    });
}

function applyFilter(filterType) {
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

// 4. 검색 기능
function setupSearchFunctionality() {
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const section = this.closest('.content-section');
            performSearch(searchTerm, section);
        });
    });
}

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

// 5. 모바일 메뉴 설정
function setupMobileMenu() {
    if (window.innerWidth <= 1200) {
        createMobileMenuToggle();
    }
    
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1200) {
            document.querySelector('.sidebar').classList.remove('open');
            const menuToggle = document.querySelector('.menu-toggle');
            if (menuToggle) {
                menuToggle.remove();
            }
        } else if (!document.querySelector('.menu-toggle')) {
            createMobileMenuToggle();
        }
    });
}

function createMobileMenuToggle() {
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '☰';
    document.body.appendChild(menuToggle);
    
    menuToggle.addEventListener('click', function() {
        document.querySelector('.sidebar').classList.toggle('open');
    });
}

// 6. 차트 초기화
function initializeCharts() {
    if (typeof Chart !== 'undefined') {
        initUserChart();
        initEmotionChart();
    }
}

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

// === 모달 관련 함수들 ===

function showModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
        <div class="modal-content">
            ${content}
        </div>
    `;
    document.body.appendChild(modal);
    
    // 배경 클릭으로 모달 닫기
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
}

function closeModal() {
    const modal = document.querySelector('.modal-backdrop');
    if (modal) {
        modal.remove();
        document.removeEventListener('keydown', handleEscapeKey);
    }
}

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
    
    window.confirmAction = function() {
        closeModal();
        onConfirm();
        delete window.confirmAction;
    };
}

// === 감정 태그 관련 함수들 ===

function showAddEmotionTagModal() {
    const content = `
        <h3>새 감정 태그 추가</h3>
        <div class="form-group">
            <label>태그명</label>
            <input type="text" id="tag-name" placeholder="감정 태그명을 입력하세요" maxlength="20">
        </div>
        <div class="form-group">
            <label>설명</label>
            <textarea id="tag-description" placeholder="태그에 대한 설명을 입력하세요" rows="3"></textarea>
        </div>
        <div class="form-group">
            <label>색상</label>
            <select id="tag-color">
                <option value="#005792">파랑</option>
                <option value="#10b981">초록</option>
                <option value="#f59e0b">노랑</option>
                <option value="#ef4444">빨강</option>
                <option value="#8b5cf6">보라</option>
                <option value="#f97316">주황</option>
            </select>
        </div>
        <div class="modal-actions">
            <button class="btn-secondary" onclick="closeModal()">취소</button>
            <button class="btn-primary" onclick="saveEmotionTag()">저장</button>
        </div>
    `;
    showModal(content);
    
    // 포커스 설정
    setTimeout(() => {
        const input = document.getElementById('tag-name');
        if (input) input.focus();
    }, 100);
}

function saveEmotionTag() {
    const tagName = document.getElementById('tag-name').value.trim();
    const tagDescription = document.getElementById('tag-description').value.trim();
    const tagColor = document.getElementById('tag-color').value;
    
    if (!tagName) {
        showErrorMessage('태그명을 입력해주세요.');
        return;
    }
    
    // 중복 태그명 확인
    const existingTags = document.querySelectorAll('#emotions-tab .data-table tbody tr');
    let isDuplicate = false;
    existingTags.forEach(row => {
        if (row.cells[0].textContent.toLowerCase() === tagName.toLowerCase()) {
            isDuplicate = true;
        }
    });
    
    if (isDuplicate) {
        showErrorMessage('이미 존재하는 태그명입니다.');
        return;
    }
    
    // 실제로는 서버에 저장 요청
    console.log('감정 태그 저장:', { tagName, tagDescription, tagColor });
    
    // 테이블에 새 행 추가
    addEmotionTagToTable(tagName, tagDescription, tagColor);
    
    closeModal();
    showSuccessMessage('감정 태그가 성공적으로 추가되었습니다.');
}

function addEmotionTagToTable(tagName, description, color) {
    const tbody = document.querySelector('#emotions-tab .data-table tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${tagName}</td>
        <td>0회</td>
        <td>${new Date().toLocaleDateString()}</td>
        <td><span class="status active">활성</span></td>
        <td>
            <button class="btn-small" onclick="handleEmotionTagEdit(this)">수정</button>
            <button class="btn-small danger" onclick="handleEmotionTagDeactivation(this)">비활성화</button>
        </td>
    `;
    tbody.appendChild(newRow);
}

function handleEmotionTagEdit(btn) {
    const row = btn.closest('tr');
    const tagName = row.cells[0].textContent;
    const usageCount = row.cells[1].textContent;
    const createdDate = row.cells[2].textContent;
    const status = row.querySelector('.status').textContent;
    
    const content = `
        <h3>감정 태그 수정</h3>
        <div class="form-group">
            <label>태그명</label>
            <input type="text" id="edit-tag-name" value="${tagName}" maxlength="20">
        </div>
        <div class="form-group">
            <label>설명</label>
            <textarea id="edit-tag-description" placeholder="태그에 대한 설명을 입력하세요" rows="3">감정을 표현하는 태그입니다.</textarea>
        </div>
        <div class="form-group">
            <label>색상</label>
            <select id="edit-tag-color">
                <option value="#005792">파랑</option>
                <option value="#10b981">초록</option>
                <option value="#f59e0b">노랑</option>
                <option value="#ef4444">빨강</option>
                <option value="#8b5cf6">보라</option>
                <option value="#f97316">주황</option>
            </select>
        </div>
        <div class="form-group">
            <label>상태 정보</label>
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 10px 0;">
                <p><strong>사용 횟수:</strong> ${usageCount}</p>
                <p><strong>생성일:</strong> ${createdDate}</p>
                <p><strong>현재 상태:</strong> ${status}</p>
            </div>
        </div>
        <div class="modal-actions">
            <button class="btn-secondary" onclick="closeModal()">취소</button>
            <button class="btn-primary" onclick="saveEmotionTagEdit('${tagName}')">저장</button>
        </div>
    `;
    showModal(content);
}

function saveEmotionTagEdit(originalTagName) {
    const newTagName = document.getElementById('edit-tag-name').value.trim();
    const tagDescription = document.getElementById('edit-tag-description').value.trim();
    const tagColor = document.getElementById('edit-tag-color').value;
    
    if (!newTagName) {
        showErrorMessage('태그명을 입력해주세요.');
        return;
    }
    
    // 다른 태그와 중복 확인 (자기 자신 제외)
    const existingTags = document.querySelectorAll('#emotions-tab .data-table tbody tr');
    let isDuplicate = false;
    existingTags.forEach(row => {
        const existingTagName = row.cells[0].textContent;
        if (existingTagName !== originalTagName && existingTagName.toLowerCase() === newTagName.toLowerCase()) {
            isDuplicate = true;
        }
    });
    
    if (isDuplicate) {
        showErrorMessage('이미 존재하는 태그명입니다.');
        return;
    }
    
    // 실제로는 서버에 수정 요청
    console.log('감정 태그 수정:', { originalTagName, newTagName, tagDescription, tagColor });
    
    // 테이블에서 태그명 업데이트
    updateEmotionTagInTable(originalTagName, newTagName);
    
    closeModal();
    showSuccessMessage('감정 태그가 성공적으로 수정되었습니다.');
}

function updateEmotionTagInTable(originalTagName, newTagName) {
    const rows = document.querySelectorAll('#emotions-tab .data-table tbody tr');
    rows.forEach(row => {
        if (row.cells[0].textContent === originalTagName) {
            row.cells[0].textContent = newTagName;
        }
    });
}

function handleEmotionTagDeactivation(btn) {
    const row = btn.closest('tr');
    const tagName = row.cells[0].textContent;
    const usageCount = row.cells[1].textContent;
    const statusCell = row.querySelector('.status');
    const isActive = statusCell.textContent.includes('활성');
    
    const action = isActive ? '비활성화' : '활성화';
    const warningMessage = isActive && parseInt(usageCount) > 0 ? 
        `\n\n⚠️ 주의: 이 태그는 ${usageCount} 사용되고 있습니다. 비활성화하면 기존 콘텐츠에서 더 이상 표시되지 않을 수 있습니다.` : '';
    
    showConfirmModal(`'${tagName}' 태그를 ${action}하시겠습니까?${warningMessage}`, function() {
        if (isActive) {
            statusCell.textContent = '비활성';
            statusCell.className = 'status suspended';
            btn.textContent = '활성화';
            btn.className = 'btn-small success';
        } else {
            statusCell.textContent = '활성';
            statusCell.className = 'status active';
            btn.textContent = '비활성화';
            btn.className = 'btn-small danger';
        }
        
        // 실제로는 서버에 상태 변경 요청
        console.log(`감정 태그 ${action}:`, tagName);
        
        showSuccessMessage(`태그가 ${action}되었습니다.`);
    });
}

function handleEmotionTagDelete(btn) {
    const row = btn.closest('tr');
    const tagName = row.cells[0].textContent;
    const usageCount = row.cells[1].textContent;
    
    const warningMessage = parseInt(usageCount) > 0 ? 
        `\n\n⚠️ 경고: 이 태그는 ${usageCount} 사용되고 있습니다. 삭제하면 관련된 모든 데이터가 영향을 받을 수 있습니다.` : '';
    
    showConfirmModal(`'${tagName}' 태그를 완전히 삭제하시겠습니까?${warningMessage}`, function() {
        // 실제로는 서버에 삭제 요청
        console.log('감정 태그 삭제:', tagName);
        
        row.remove();
        showSuccessMessage('태그가 삭제되었습니다.');
    });
}

// 감정 태그 통계 보기
function showEmotionTagStats(tagName) {
    const content = `
        <h3>'${tagName}' 태그 통계</h3>
        <div class="tag-stats">
            <p><strong>총 사용 횟수:</strong> 1,234회</p>
            <p><strong>이번 달 사용:</strong> 156회</p>
            <p><strong>관련 관광지:</strong> 45개</p>
            <p><strong>관련 리뷰:</strong> 234개</p>
            <p><strong>인기도 순위:</strong> 3위/24개</p>
            <p><strong>최근 30일 증감:</strong> <span style="color: #10b981;">+12%</span></p>
            
            <h4 style="margin-top: 20px;">주요 연관 태그</h4>
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px;">
                <span style="background: #f1f5f9; padding: 4px 8px; border-radius: 6px; font-size: 12px;">자연</span>
                <span style="background: #f1f5f9; padding: 4px 8px; border-radius: 6px; font-size: 12px;">힐링</span>
                <span style="background: #f1f5f9; padding: 4px 8px; border-radius: 6px; font-size: 12px;">평온</span>
            </div>
        </div>
        <div class="modal-actions">
            <button class="btn-secondary" onclick="closeModal()">닫기</button>
            <button class="btn-primary" onclick="exportTagStats('${tagName}')">통계 내보내기</button>
        </div>
    `;
    showModal(content);
}

function exportTagStats(tagName) {
    console.log(`${tagName} 태그 통계 내보내기`);
    showSuccessMessage('태그 통계 데이터를 준비하고 있습니다...');
    closeModal();
}

// === 관광지 관리 함수들 ===

function handleLocationEditFromList(btn) {
    const row = btn.closest('tr');
    const locationName = row.cells[0].textContent;
    const region = row.cells[1].textContent;
    const category = row.cells[2].textContent;
    const tags = row.cells[3].textContent;
    const date = row.cells[4].textContent;
    const status = row.querySelector('.status').textContent;
    
    const content = `
        <h3>관광지 정보 수정</h3>
        <div class="form-row">
            <div class="form-group">
                <label>관광지명</label>
                <input type="text" id="edit-location-name" value="${locationName}">
            </div>
            <div class="form-group">
                <label>지역</label>
                <select id="edit-location-region">
                    <option ${region === '서울' ? 'selected' : ''}>서울</option>
                    <option ${region === '부산' ? 'selected' : ''}>부산</option>
                    <option ${region === '제주' ? 'selected' : ''}>제주</option>
                    <option ${region === '경기' ? 'selected' : ''}>경기</option>
                    <option ${region === '강원' ? 'selected' : ''}>강원</option>
                    <option ${region === '경남' ? 'selected' : ''}>경남</option>
                    <option ${region === '전남' ? 'selected' : ''}>전남</option>
                    <option ${region === '충남' ? 'selected' : ''}>충남</option>
                </select>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>카테고리</label>
                <select id="edit-location-category">
                    <option ${category === '역사/문화' ? 'selected' : ''}>역사/문화</option>
                    <option ${category === '자연/휴양' ? 'selected' : ''}>자연/휴양</option>
                    <option ${category === '체험/액티비티' ? 'selected' : ''}>체험/액티비티</option>
                    <option ${category === '맛집/쇼핑' ? 'selected' : ''}>맛집/쇼핑</option>
                </select>
            </div>
            <div class="form-group">
                <label>감정태그</label>
                <input type="text" id="edit-location-tags" value="${tags}" placeholder="쉼표로 구분하여 입력">
            </div>
        </div>
        <div class="form-group">
            <label>상태</label>
            <select id="edit-location-status">
                <option ${status === '공개' ? 'selected' : ''}>공개</option>
                <option ${status === '비공개' ? 'selected' : ''}>비공개</option>
                <option ${status === '검토중' ? 'selected' : ''}>검토중</option>
            </select>
        </div>
        <div class="form-group">
            <label>설명</label>
            <textarea id="edit-location-description" placeholder="관광지에 대한 설명을 입력하세요" rows="4">아름다운 관광지입니다.</textarea>
        </div>
        <div class="form-group">
            <label>등록 정보</label>
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 10px 0;">
                <p><strong>등록일:</strong> ${date}</p>
                <p><strong>최근 수정:</strong> 2024-07-10</p>
                <p><strong>조회수:</strong> 1,234회</p>
                <p><strong>리뷰수:</strong> 45개</p>
            </div>
        </div>
        <div class="modal-actions">
            <button class="btn-secondary" onclick="closeModal()">취소</button>
            <button class="btn-primary" onclick="saveLocationEditFromList('${locationName}')">저장</button>
        </div>
    `;
    showModal(content);
}

function saveLocationEditFromList(originalName) {
    const newName = document.getElementById('edit-location-name').value.trim();
    const region = document.getElementById('edit-location-region').value;
    const category = document.getElementById('edit-location-category').value;
    const tags = document.getElementById('edit-location-tags').value.trim();
    const status = document.getElementById('edit-location-status').value;
    const description = document.getElementById('edit-location-description').value.trim();
    
    if (!newName) {
        showErrorMessage('관광지명을 입력해주세요.');
        return;
    }
    
    if (!description) {
        showErrorMessage('설명을 입력해주세요.');
        return;
    }
    
    // 다른 관광지와 중복 확인 (자기 자신 제외)
    const existingLocations = document.querySelectorAll('#location-list-view .data-table tbody tr');
    let isDuplicate = false;
    existingLocations.forEach(row => {
        const existingName = row.cells[0].textContent;
        if (existingName !== originalName && existingName.toLowerCase() === newName.toLowerCase()) {
            isDuplicate = true;
        }
    });
    
    if (isDuplicate) {
        showErrorMessage('이미 존재하는 관광지명입니다.');
        return;
    }
    
    // 실제로는 서버에 수정 요청
    console.log('관광지 수정:', { originalName, newName, region, category, tags, status, description });
    
    // 테이블에서 정보 업데이트
    updateLocationInTable(originalName, newName, region, category, tags, status);
    
    closeModal();
    showSuccessMessage('관광지 정보가 성공적으로 수정되었습니다.');
}

function updateLocationInTable(originalName, newName, region, category, tags, status) {
    const rows = document.querySelectorAll('#location-list-view .data-table tbody tr');
    rows.forEach(row => {
        if (row.cells[0].textContent === originalName) {
            row.cells[0].textContent = newName;
            row.cells[1].textContent = region;
            row.cells[2].textContent = category;
            row.cells[3].textContent = tags;
            
            const statusCell = row.querySelector('.status');
            statusCell.textContent = status;
            statusCell.className = status === '공개' ? 'status active' : 
                                  status === '비공개' ? 'status suspended' : 'status pending';
        }
    });
}

function handleLocationDeleteFromList(btn) {
    const row = btn.closest('tr');
    const locationName = row.cells[0].textContent;
    const region = row.cells[1].textContent;
    
    showConfirmModal(`'${locationName} (${region})'을(를) 삭제하시겠습니까?\n\n⚠️ 삭제된 관광지와 관련된 모든 리뷰와 데이터가 함께 삭제됩니다.`, function() {
        // 실제로는 서버에 삭제 요청
        console.log('관광지 삭제:', locationName);
        
        row.remove();
        showSuccessMessage('관광지가 삭제되었습니다.');
    });
}

function handleLocationDetail(btn) {
    const row = btn.closest('tr');
    const locationName = row.cells[0].textContent;
    const region = row.cells[1].textContent;
    const category = row.cells[2].textContent;
    const tags = row.cells[3].textContent;
    const date = row.cells[4].textContent;
    const status = row.querySelector('.status').textContent;
    
    const content = `
        <h3>관광지 상세 정보</h3>
        <div class="location-detail">
            <p><strong>관광지명:</strong> ${locationName}</p>
            <p><strong>지역:</strong> ${region}</p>
            <p><strong>카테고리:</strong> ${category}</p>
            <p><strong>감정태그:</strong> ${tags}</p>
            <p><strong>등록일:</strong> ${date}</p>
            <p><strong>상태:</strong> ${status}</p>
            <p><strong>조회수:</strong> 1,234회</p>
            <p><strong>즐겨찾기:</strong> 89명</p>
            <p><strong>리뷰수:</strong> 45개</p>
            <p><strong>평균평점:</strong> 4.3/5.0</p>
            <p><strong>최근 업데이트:</strong> 2024-07-10</p>
            <p><strong>관리자:</strong> 관리자</p>
        </div>
        <div class="modal-actions">
            <button class="btn-secondary" onclick="closeModal()">닫기</button>
            <button class="btn-primary" onclick="viewLocationReviews('${locationName}')">리뷰 보기</button>
            <button class="btn-primary" onclick="exportLocationData('${locationName}')">데이터 내보내기</button>
        </div>
    `;
    showModal(content);
}

function viewLocationReviews(locationName) {
    console.log(`${locationName} 관광지 리뷰 보기`);
    closeModal();
    showSuccessMessage(`${locationName}의 리뷰 목록을 조회하고 있습니다...`);
    // 실제로는 리뷰 관리 탭으로 이동하고 해당 관광지로 필터링
}

function exportLocationData(locationName) {
    console.log(`${locationName} 관광지 데이터 내보내기`);
    closeModal();
    showSuccessMessage('관광지 데이터 내보내기가 시작되었습니다.');
}

function showLocationForm() {
    document.getElementById('location-list-view').style.display = 'none';
    document.getElementById('location-form-view').style.display = 'block';
    
    // 폼 초기화
    document.getElementById('location-name').value = '';
    document.getElementById('location-tags').value = '';
    document.getElementById('location-description').value = '';
}

function cancelLocationForm() {
    document.getElementById('location-form-view').style.display = 'none';
    document.getElementById('location-list-view').style.display = 'block';
}

function saveLocation() {
    const name = document.getElementById('location-name').value.trim();
    const region = document.getElementById('location-region').value;
    const category = document.getElementById('location-category').value;
    const tags = document.getElementById('location-tags').value.trim();
    const description = document.getElementById('location-description').value.trim();
    
    if (!name) {
        showErrorMessage('관광지명을 입력해주세요.');
        return;
    }
    
    if (!description) {
        showErrorMessage('설명을 입력해주세요.');
        return;
    }
    
    // 실제로는 서버에 저장 요청
    console.log('관광지 저장:', { name, region, category, tags, description });
    
    // 테이블에 새 행 추가
    addLocationToTable(name, region, category, tags);
    
    // 폼 숨기고 목록 보기
    cancelLocationForm();
    showSuccessMessage('관광지가 성공적으로 추가되었습니다.');
}

function addLocationToTable(name, region, category, tags) {
    const tbody = document.querySelector('#location-list-view .data-table tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${name}</td>
        <td>${region}</td>
        <td>${category}</td>
        <td>${tags}</td>
        <td>${new Date().toLocaleDateString()}</td>
        <td><span class="status active">공개</span></td>
        <td>
            <button class="btn-small">수정</button>
            <button class="btn-small danger">삭제</button>
        </td>
    `;
    tbody.appendChild(newRow);
}



// === 매칭 관리 함수들 ===

function handleMatchingDetail(btn) {
    const matchingCard = btn.closest('.matching-card');
    const title = matchingCard.querySelector('h4').textContent;
    const status = matchingCard.querySelector('.matching-status').textContent;
    const info = matchingCard.querySelectorAll('.matching-info p');
    
    let creator = '';
    let participants = '';
    let travelDate = '';
    let location = '';
    
    info.forEach(p => {
        const text = p.textContent;
        if (text.includes('생성자:')) creator = text.split(':')[1].trim();
        if (text.includes('참여자:')) participants = text.split(':')[1].trim();
        if (text.includes('여행일:')) travelDate = text.split(':')[1].trim();
        if (text.includes('지역:')) location = text.split(':')[1].trim();
    });
    
    const content = `
        <h3>매칭 상세 정보</h3>
        <div class="matching-detail">
            <p><strong>매칭명:</strong> ${title}</p>
            <p><strong>상태:</strong> ${status}</p>
            <p><strong>생성자:</strong> ${creator}</p>
            <p><strong>참여자:</strong> ${participants}</p>
            <p><strong>여행일:</strong> ${travelDate}</p>
            <p><strong>지역:</strong> ${location}</p>
            <p><strong>생성일:</strong> 2024-07-10 14:30</p>
            <p><strong>마지막 활동:</strong> 2024-07-12 09:15</p>
            <p><strong>채팅 메시지:</strong> 47개</p>
            <p><strong>참여자 목록:</strong></p>
            <ul style="margin-left: 20px; margin-top: 8px;">
                <li>홍길동 (생성자)</li>
                <li>김영희</li>
                <li>이민수</li>
            </ul>
        </div>
        <div class="modal-actions">
            <button class="btn-secondary" onclick="closeModal()">닫기</button>
            <button class="btn-primary" onclick="exportMatchingData('${title}')">데이터 내보내기</button>
        </div>
    `;
    showModal(content);
}

function handleMatchingTerminate(btn) {
    const matchingCard = btn.closest('.matching-card');
    const title = matchingCard.querySelector('h4').textContent;
    
    showConfirmModal(`'${title}' 매칭을 강제 종료하시겠습니까?`, function() {
        const status = matchingCard.querySelector('.matching-status');
        status.textContent = '강제종료';
        status.className = 'matching-status terminated';
        
        // 버튼 업데이트
        const actionButtons = matchingCard.querySelector('.matching-actions');
        actionButtons.innerHTML = `
            <button class="btn-small" onclick="handleMatchingDetail(this)">상세보기</button>
            <button class="btn-small success" onclick="handleMatchingRestore(this)">복구</button>
        `;
        
        showSuccessMessage('매칭이 강제 종료되었습니다.');
    });
}

function handleMatchingRestore(btn) {
    const matchingCard = btn.closest('.matching-card');
    const title = matchingCard.querySelector('h4').textContent;
    
    showConfirmModal(`'${title}' 매칭을 복구하시겠습니까?`, function() {
        const status = matchingCard.querySelector('.matching-status');
        status.textContent = '진행중';
        status.className = 'matching-status active';
        
        // 버튼 업데이트
        const actionButtons = matchingCard.querySelector('.matching-actions');
        actionButtons.innerHTML = `
            <button class="btn-small" onclick="handleMatchingDetail(this)">상세보기</button>
            <button class="btn-small danger" onclick="handleMatchingTerminate(this)">강제종료</button>
        `;
        
        showSuccessMessage('매칭이 복구되었습니다.');
    });
}

function exportMatchingData(title) {
    console.log(`${title} 매칭 데이터 내보내기`);
    showSuccessMessage('매칭 데이터 내보내기가 시작되었습니다.');
    closeModal();
}

// === 공지사항 관리 함수들 ===

function showNoticeForm() {
    // notice-form-view가 HTML에 없으므로 모달로 공지사항 작성 폼 표시
    const content = `
        <h3>새 공지사항 작성</h3>
        <div class="notice-form">
            <div class="form-row">
                <div class="form-group">
                    <label>제목</label>
                    <input type="text" id="notice-title" placeholder="공지사항 제목을 입력하세요" maxlength="100">
                </div>
                <div class="form-group">
                    <label>분류</label>
                    <select id="notice-category">
                        <option value="일반공지">일반공지</option>
                        <option value="긴급공지">긴급공지</option>
                        <option value="업데이트">업데이트</option>
                        <option value="이벤트">이벤트</option>
                        <option value="점검안내">점검안내</option>
                        <option value="정책변경">정책변경</option>
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>공개 설정</label>
                    <select id="notice-visibility">
                        <option value="public">전체 공개</option>
                        <option value="members">회원 전용</option>
                        <option value="draft">임시저장</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>중요도</label>
                    <select id="notice-priority">
                        <option value="normal">일반</option>
                        <option value="important">중요</option>
                        <option value="urgent">긴급</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label>내용</label>
                <textarea id="notice-content" rows="8" placeholder="공지사항 내용을 입력하세요"></textarea>
            </div>
            
            <div class="form-group">
                <label>첨부파일</label>
                <input type="file" id="notice-attachment" accept=".pdf,.doc,.docx,.jpg,.png,.gif" multiple>
                <small>최대 5개 파일, 파일당 10MB 이하</small>
            </div>
            
            <div class="form-group">
                <label>
                    <input type="checkbox" id="notice-push"> 
                    앱 푸시 알림 발송
                </label>
                <label>
                    <input type="checkbox" id="notice-email"> 
                    이메일 알림 발송
                </label>
                <label>
                    <input type="checkbox" id="notice-pinned"> 
                    상단 고정
                </label>
            </div>
        </div>
        
        <div class="modal-actions">
            <button class="btn-secondary" onclick="closeModal()">취소</button>
            <button class="btn-secondary" onclick="draftNotice()">임시저장</button>
            <button class="btn-primary" onclick="publishNotice()">발행</button>
        </div>
    `;
    
    showModal(content);
    
    // 포커스 설정
    setTimeout(() => {
        const titleInput = document.getElementById('notice-title');
        if (titleInput) titleInput.focus();
    }, 100);
}

function cancelNoticeForm() {
    closeModal();
}

function publishNotice() {
    const title = document.getElementById('notice-title').value.trim();
    const category = document.getElementById('notice-category').value;
    const visibility = document.getElementById('notice-visibility').value;
    const priority = document.getElementById('notice-priority').value;
    const content = document.getElementById('notice-content').value.trim();
    const pushNotification = document.getElementById('notice-push').checked;
    const emailNotification = document.getElementById('notice-email').checked;
    const pinned = document.getElementById('notice-pinned').checked;
    
    // 유효성 검사
    if (!title) {
        showErrorMessage('제목을 입력해주세요.');
        return;
    }
    
    if (title.length < 5) {
        showErrorMessage('제목은 5자 이상 입력해주세요.');
        return;
    }
    
    if (!content) {
        showErrorMessage('내용을 입력해주세요.');
        return;
    }
    
    if (content.length < 10) {
        showErrorMessage('내용은 10자 이상 입력해주세요.');
        return;
    }
    
    // 긴급공지나 중요 공지의 경우 추가 확인
    if (priority === 'urgent' || category === '긴급공지') {
        showConfirmModal(
            '긴급공지로 발행하시겠습니까?\n\n긴급공지는 모든 사용자에게 즉시 알림이 발송됩니다.',
            function() {
                executePublishNotice({ title, category, visibility, priority, content, pushNotification, emailNotification, pinned });
            }
        );
    } else {
        showConfirmModal('공지사항을 발행하시겠습니까?', function() {
            executePublishNotice({ title, category, visibility, priority, content, pushNotification, emailNotification, pinned });
        });
    }
}

function executePublishNotice(noticeData) {
    // 실제로는 서버에 저장 요청
    console.log('공지사항 발행:', noticeData);
    
    // 테이블에 새 행 추가
    addNoticeToTable(noticeData.title, noticeData.category, noticeData.priority);
    
    // 알림 발송 처리
    if (noticeData.pushNotification) {
        console.log('푸시 알림 발송 요청');
    }
    if (noticeData.emailNotification) {
        console.log('이메일 알림 발송 요청');
    }
    
    closeModal();
    showSuccessMessage('공지사항이 성공적으로 발행되었습니다.');
}

function draftNotice() {
    const title = document.getElementById('notice-title').value.trim();
    const category = document.getElementById('notice-category').value;
    const content = document.getElementById('notice-content').value.trim();
    
    if (!title && !content) {
        showErrorMessage('제목이나 내용 중 하나는 입력해주세요.');
        return;
    }
    
    // 실제로는 서버에 임시저장 요청
    console.log('공지사항 임시저장:', { title, category, content });
    
    closeModal();
    showSuccessMessage('공지사항이 임시저장되었습니다.');
}

function addNoticeToTable(title, category, priority = 'normal') {
    const tbody = document.querySelector('#notice-list-view .data-table tbody');
    const newRow = document.createElement('tr');
    
    // 중요도에 따른 스타일 클래스 추가
    if (priority === 'urgent') {
        newRow.classList.add('urgent-notice');
    } else if (priority === 'important') {
        newRow.classList.add('important-notice');
    }
    
    newRow.innerHTML = `
        <td>
            ${priority === 'urgent' ? '<span class="priority-badge urgent">긴급</span> ' : ''}
            ${priority === 'important' ? '<span class="priority-badge important">중요</span> ' : ''}
            ${title}
        </td>
        <td>${category}</td>
        <td>관리자</td>
        <td>${new Date().toLocaleDateString()}</td>
        <td>0</td>
        <td><span class="status active">공개</span></td>
        <td>
            <button class="btn-small" onclick="handleNoticeEdit(this)">수정</button>
            <button class="btn-small danger" onclick="handleNoticeDelete(this)">삭제</button>
        </td>
    `;
    tbody.insertBefore(newRow, tbody.firstChild);
}

// 공지사항 수정 함수
function handleNoticeEdit(btn) {
    const row = btn.closest('tr');
    const titleCell = row.cells[0];
    const title = titleCell.textContent.trim();
    const category = row.cells[1].textContent;
    const author = row.cells[2].textContent;
    const date = row.cells[3].textContent;
    const views = row.cells[4].textContent;
    const status = row.querySelector('.status').textContent;
    
    // 제목에서 우선순위 배지 제거
    const cleanTitle = title.replace(/^(긴급|중요)\s*/, '');
    
    const content = `
        <h3>공지사항 수정</h3>
        <div class="notice-edit-form">
            <div class="form-row">
                <div class="form-group">
                    <label>제목</label>
                    <input type="text" id="edit-notice-title" value="${cleanTitle}" maxlength="100">
                </div>
                <div class="form-group">
                    <label>분류</label>
                    <select id="edit-notice-category">
                        <option value="일반공지" ${category === '일반공지' ? 'selected' : ''}>일반공지</option>
                        <option value="긴급공지" ${category === '긴급공지' ? 'selected' : ''}>긴급공지</option>
                        <option value="업데이트" ${category === '업데이트' ? 'selected' : ''}>업데이트</option>
                        <option value="이벤트" ${category === '이벤트' ? 'selected' : ''}>이벤트</option>
                        <option value="점검안내" ${category === '점검안내' ? 'selected' : ''}>점검안내</option>
                        <option value="정책변경" ${category === '정책변경' ? 'selected' : ''}>정책변경</option>
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>공개 설정</label>
                    <select id="edit-notice-visibility">
                        <option value="public" ${status === '공개' ? 'selected' : ''}>전체 공개</option>
                        <option value="members">회원 전용</option>
                        <option value="private" ${status === '비공개' ? 'selected' : ''}>비공개</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>중요도</label>
                    <select id="edit-notice-priority">
                        <option value="normal">일반</option>
                        <option value="important" ${title.includes('중요') ? 'selected' : ''}>중요</option>
                        <option value="urgent" ${title.includes('긴급') ? 'selected' : ''}>긴급</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label>내용</label>
                <textarea id="edit-notice-content" rows="8" placeholder="공지사항 내용을 입력하세요">${getNoticeContent(cleanTitle)}</textarea>
            </div>
            
            <div class="form-group">
                <label>기존 정보</label>
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 10px 0;">
                    <p><strong>작성자:</strong> ${author}</p>
                    <p><strong>작성일:</strong> ${date}</p>
                    <p><strong>조회수:</strong> ${views}회</p>
                    <p><strong>현재 상태:</strong> ${status}</p>
                    <p><strong>최근 수정:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
            </div>
            
            <div class="form-group">
                <label>
                    <input type="checkbox" id="edit-notice-pinned"> 
                    상단 고정
                </label>
                <label>
                    <input type="checkbox" id="edit-send-notification"> 
                    수정 알림 발송
                </label>
            </div>
        </div>
        
        <div class="modal-actions">
            <button class="btn-secondary" onclick="closeModal()">취소</button>
            <button class="btn-secondary" onclick="previewNotice()">미리보기</button>
            <button class="btn-primary" onclick="saveNoticeEdit('${cleanTitle}')">수정 완료</button>
        </div>
    `;
    
    showModal(content);
}

// 공지사항 수정 저장
function saveNoticeEdit(originalTitle) {
    const newTitle = document.getElementById('edit-notice-title').value.trim();
    const category = document.getElementById('edit-notice-category').value;
    const visibility = document.getElementById('edit-notice-visibility').value;
    const priority = document.getElementById('edit-notice-priority').value;
    const content = document.getElementById('edit-notice-content').value.trim();
    const pinned = document.getElementById('edit-notice-pinned').checked;
    const sendNotification = document.getElementById('edit-send-notification').checked;
    
    if (!newTitle) {
        showErrorMessage('제목을 입력해주세요.');
        return;
    }
    
    if (!content) {
        showErrorMessage('내용을 입력해주세요.');
        return;
    }
    
    // 중복 제목 확인 (자기 자신 제외)
    const existingTitles = Array.from(document.querySelectorAll('#notice-list-view .data-table tbody tr'))
        .map(row => row.cells[0].textContent.replace(/^(긴급|중요)\s*/, '').trim())
        .filter(title => title !== originalTitle);
    
    if (existingTitles.includes(newTitle)) {
        showErrorMessage('이미 존재하는 제목입니다.');
        return;
    }
    
    showConfirmModal('공지사항을 수정하시겠습니까?', function() {
        // 실제로는 서버에 수정 요청
        console.log('공지사항 수정:', { originalTitle, newTitle, category, visibility, priority, content, pinned, sendNotification });
        
        // 테이블에서 해당 행 업데이트
        updateNoticeInTable(originalTitle, newTitle, category, priority, visibility);
        
        // 수정 알림 발송
        if (sendNotification) {
            console.log('수정 알림 발송 요청');
        }
        
        closeModal();
        showSuccessMessage('공지사항이 성공적으로 수정되었습니다.');
    });
}

// 테이블에서 공지사항 업데이트
function updateNoticeInTable(originalTitle, newTitle, category, priority, visibility) {
    const rows = document.querySelectorAll('#notice-list-view .data-table tbody tr');
    
    rows.forEach(row => {
        const titleCell = row.cells[0];
        const currentTitle = titleCell.textContent.replace(/^(긴급|중요)\s*/, '').trim();
        
        if (currentTitle === originalTitle) {
            // 우선순위 배지와 함께 제목 업데이트
            let displayTitle = newTitle;
            if (priority === 'urgent') {
                displayTitle = '<span class="priority-badge urgent">긴급</span> ' + newTitle;
                row.classList.add('urgent-notice');
            } else if (priority === 'important') {
                displayTitle = '<span class="priority-badge important">중요</span> ' + newTitle;
                row.classList.add('important-notice');
            } else {
                row.classList.remove('urgent-notice', 'important-notice');
            }
            
            titleCell.innerHTML = displayTitle;
            row.cells[1].textContent = category;
            
            // 상태 업데이트
            const statusCell = row.querySelector('.status');
            if (visibility === 'public') {
                statusCell.textContent = '공개';
                statusCell.className = 'status active';
            } else if (visibility === 'private') {
                statusCell.textContent = '비공개';
                statusCell.className = 'status suspended';
            }
        }
    });
}

// 공지사항 삭제 함수
function handleNoticeDelete(btn) {
    const row = btn.closest('tr');
    const titleCell = row.cells[0];
    const title = titleCell.textContent.replace(/^(긴급|중요)\s*/, '').trim();
    const category = row.cells[1].textContent;
    const date = row.cells[3].textContent;
    const views = row.cells[4].textContent;
    
    const warningMessage = parseInt(views) > 100 ? 
        `\n\n⚠️ 주의: 이 공지사항은 ${views}회 조회되었습니다. 삭제하면 사용자들이 더 이상 확인할 수 없습니다.` : '';
    
    showConfirmModal(
        `'${title}' 공지사항을 삭제하시겠습니까?${warningMessage}\n\n삭제된 공지사항은 복구할 수 없습니다.`,
        function() {
            // 실제로는 서버에 삭제 요청
            console.log('공지사항 삭제:', { title, category, date, views });
            
            // 테이블에서 행 제거
            row.remove();
            
            showSuccessMessage('공지사항이 삭제되었습니다.');
            
            // 삭제 로그 기록
            console.log(`공지사항 삭제 로그: ${title} (${date}) - 관리자`);
        }
    );
}

// 공지사항 미리보기
function previewNotice() {
    const title = document.getElementById('edit-notice-title').value.trim();
    const category = document.getElementById('edit-notice-category').value;
    const content = document.getElementById('edit-notice-content').value.trim();
    const priority = document.getElementById('edit-notice-priority').value;
    
    if (!title || !content) {
        showErrorMessage('제목과 내용을 입력해주세요.');
        return;
    }
    
    const previewContent = `
        <h3>공지사항 미리보기</h3>
        <div class="notice-preview">
            <div class="preview-header">
                <h4>
                    ${priority === 'urgent' ? '<span class="priority-badge urgent">긴급</span> ' : ''}
                    ${priority === 'important' ? '<span class="priority-badge important">중요</span> ' : ''}
                    ${title}
                </h4>
                <div class="preview-meta">
                    <span class="category-badge">${category}</span>
                    <span class="date">${new Date().toLocaleDateString()}</span>
                    <span class="author">관리자</span>
                </div>
            </div>
            <div class="preview-content">
                ${content.replace(/\n/g, '<br>')}
            </div>
        </div>
        <div class="modal-actions">
            <button class="btn-primary" onclick="closeModal()">확인</button>
        </div>
    `;
    
    // 새로운 모달로 미리보기 표시
    setTimeout(() => {
        showModal(previewContent);
    }, 300);
}

// 헬퍼 함수들
function getNoticeContent(title) {
    // 실제로는 서버에서 가져오지만, 예시로 더미 데이터 반환
    const dummyContents = {
        '시스템 점검 안내': '서비스 안정성을 위해 시스템 점검을 실시합니다.\n\n점검 일시: 2024년 7월 15일 (월) 02:00 ~ 06:00\n점검 내용: 서버 안정화 작업\n\n점검 시간 동안 서비스 이용이 일시 중단됩니다.\n이용에 불편을 드려 죄송합니다.',
        '새로운 기능 업데이트': '더욱 향상된 서비스를 위해 새로운 기능을 업데이트했습니다.\n\n주요 업데이트 내용:\n- 매칭 시스템 개선\n- 채팅 기능 향상\n- UI/UX 개선\n\n자세한 내용은 앱에서 확인해보세요!'
    };
    
    return dummyContents[title] || '공지사항 내용을 입력하세요.';
}

// 공지사항 테이블 초기화 시 버튼에 이벤트 추가
function initializeNoticeTable() {
    // 기존 테이블의 버튼들에 이벤트 리스너 추가
    document.querySelectorAll('#notice-list-view .data-table tbody tr').forEach(row => {
        const editBtn = row.querySelector('button:not(.danger)');
        const deleteBtn = row.querySelector('button.danger');
        
        if (editBtn && !editBtn.onclick) {
            editBtn.onclick = function() { handleNoticeEdit(this); };
        }
        
        if (deleteBtn && !deleteBtn.onclick) {
            deleteBtn.onclick = function() { handleNoticeDelete(this); };
        }
    });
}

// 페이지 로드 시 공지사항 테이블 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeNoticeTable();
});


// === 신고 관리 함수들 ===

function handleReportDetail(btn) {
    const reportItem = btn.closest('.report-item');
    const title = reportItem.querySelector('h4').textContent;
    const status = reportItem.querySelector('.report-status').textContent;
    const info = reportItem.querySelectorAll('.report-info p');
    
    let reporter = '';
    let reported = '';
    let reportDate = '';
    let content = '';
    let result = '';
    
    info.forEach(p => {
        const text = p.textContent;
        if (text.includes('신고자:')) reporter = text.split(':')[1].trim();
        if (text.includes('피신고자:')) reported = text.split(':')[1].trim();
        if (text.includes('신고일:')) reportDate = text.split(':')[1].trim();
        if (text.includes('내용:')) content = text.split(':')[1].trim();
        if (text.includes('처리결과:')) result = text.split(':')[1].trim();
    });
    
    // 신고 상세 정보 표시
    const detailContent = `
        <h3>신고 상세 정보</h3>
        <div class="report-detail">
            <div class="detail-section">
                <h4>기본 정보</h4>
                <p><strong>신고 유형:</strong> ${title}</p>
                <p><strong>처리 상태:</strong> <span class="status-badge ${getStatusClass(status)}">${status}</span></p>
                <p><strong>신고 접수일:</strong> ${reportDate}</p>
                <p><strong>처리 담당자:</strong> 관리자</p>
            </div>
            
            <div class="detail-section">
                <h4>당사자 정보</h4>
                <p><strong>신고자:</strong> ${reporter}</p>
                <p><strong>피신고자:</strong> ${reported}</p>
                <p><strong>관련 채팅방:</strong> ${getRelatedChatRoom(title)}</p>
            </div>
            
            <div class="detail-section">
                <h4>신고 내용</h4>
                <div class="report-content">
                    <p><strong>신고 사유:</strong></p>
                    <div class="content-box">${content || '상세한 신고 내용이 여기에 표시됩니다.'}</div>
                    <p><strong>증거 자료:</strong> ${getEvidenceInfo(title)}</p>
                </div>
            </div>
            
            ${result ? `
                <div class="detail-section">
                    <h4>처리 결과</h4>
                    <p><strong>처리 결과:</strong> ${result}</p>
                    <p><strong>처리일:</strong> ${getProcessedDate(status)}</p>
                    <p><strong>처리 사유:</strong> ${getProcessReason(title)}</p>
                </div>
            ` : ''}
            
            <div class="detail-section">
                <h4>추가 정보</h4>
                <p><strong>이전 신고 이력:</strong> ${getPreviousReports(reported)}</p>
                <p><strong>유사 신고:</strong> ${getSimilarReports(title)}</p>
                <p><strong>신고자 신뢰도:</strong> ${getReporterCredibility(reporter)}</p>
            </div>
        </div>
        
        <div class="modal-actions">
            <button class="btn-secondary" onclick="closeModal()">닫기</button>
            ${getDetailModalActions(status, title, reported)}
        </div>
    `;
    
    showModal(detailContent);
}

function handleReportWarning(btn) {
    const reportItem = btn.closest('.report-item');
    const title = reportItem.querySelector('h4').textContent;
    const reported = getReportedUser(reportItem);
    
    const warningContent = `
        <h3>경고 처리</h3>
        <div class="warning-form">
            <p><strong>신고 유형:</strong> ${title}</p>
            <p><strong>피신고자:</strong> ${reported}</p>
            
            <div class="form-group">
                <label>경고 사유</label>
                <select id="warning-reason">
                    <option value="inappropriate_language">부적절한 언어 사용</option>
                    <option value="spam">스팸 행위</option>
                    <option value="harassment">괴롭힘</option>
                    <option value="false_info">허위 정보</option>
                    <option value="other">기타</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>경고 메시지</label>
                <textarea id="warning-message" rows="4" placeholder="사용자에게 전달할 경고 메시지를 입력하세요">커뮤니티 가이드라인을 위반하는 행위가 확인되어 경고를 발송합니다. 계속해서 문제가 될 경우 계정 제재가 있을 수 있습니다.</textarea>
            </div>
            
            <div class="warning-info">
                <p><strong>이전 경고 횟수:</strong> ${getPreviousWarnings(reported)}회</p>
                <p><strong>경고 누적 시 조치:</strong> 3회 누적 시 계정 정지</p>
            </div>
        </div>
        
        <div class="modal-actions">
            <button class="btn-secondary" onclick="closeModal()">취소</button>
            <button class="btn-warning" onclick="confirmWarning('${title}', '${reported}')">경고 발송</button>
        </div>
    `;
    
    showModal(warningContent);
}

function handleReportSuspension(btn) {
    const reportItem = btn.closest('.report-item');
    const title = reportItem.querySelector('h4').textContent;
    const reported = getReportedUser(reportItem);
    
    const suspensionContent = `
        <h3>계정 정지 처리</h3>
        <div class="suspension-form">
            <p><strong>신고 유형:</strong> ${title}</p>
            <p><strong>피신고자:</strong> ${reported}</p>
            
            <div class="form-group">
                <label>정지 기간</label>
                <select id="suspension-period">
                    <option value="1">1일</option>
                    <option value="3">3일</option>
                    <option value="7">7일</option>
                    <option value="14">14일</option>
                    <option value="30">30일</option>
                    <option value="permanent">영구정지</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>정지 사유</label>
                <select id="suspension-reason">
                    <option value="severe_harassment">심각한 괴롭힘</option>
                    <option value="hate_speech">혐오 발언</option>
                    <option value="repeated_violations">반복적 위반</option>
                    <option value="fraud">사기 행위</option>
                    <option value="spam">악성 스팸</option>
                    <option value="other">기타</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>정지 통지 메시지</label>
                <textarea id="suspension-message" rows="4" placeholder="사용자에게 전달할 정지 통지 메시지를 입력하세요">커뮤니티 가이드라인을 심각하게 위반하여 계정이 정지되었습니다.</textarea>
            </div>
            
            <div class="suspension-warning">
                <p><strong>⚠️ 주의사항:</strong></p>
                <ul>
                    <li>계정 정지 시 모든 서비스 이용이 제한됩니다</li>
                    <li>진행 중인 매칭은 자동으로 종료됩니다</li>
                    <li>정지 기간 중에는 로그인이 불가능합니다</li>
                </ul>
            </div>
        </div>
        
        <div class="modal-actions">
            <button class="btn-secondary" onclick="closeModal()">취소</button>
            <button class="btn-danger" onclick="confirmSuspension('${title}', '${reported}')">계정 정지</button>
        </div>
    `;
    
    showModal(suspensionContent);
}

function handleReportCancel(btn) {
    const reportItem = btn.closest('.report-item');
    const title = reportItem.querySelector('h4').textContent;
    const reported = getReportedUser(reportItem);
    const status = reportItem.querySelector('.report-status').textContent;
    
    const action = status.includes('경고') ? '경고 처리' : '계정 정지';
    
    showConfirmModal(
        `${reported}님에 대한 "${title}" 신고의 ${action}를 취소하시겠습니까?\n\n취소 시 해당 처리가 철회되고 계정 상태가 복구됩니다.`,
        function() {
            // 신고 상태를 미처리로 변경
            const statusElement = reportItem.querySelector('.report-status');
            statusElement.textContent = '미처리';
            statusElement.className = 'report-status pending';
            
            // 버튼 상태 변경
            const actionsContainer = reportItem.querySelector('.report-actions');
            actionsContainer.innerHTML = `
                <button class="btn-small" onclick="handleReportDetail(this)">상세보기</button>
                <button class="btn-small warning" onclick="handleReportWarning(this)">경고</button>
                <button class="btn-small danger" onclick="handleReportSuspension(this)">계정정지</button>
            `;
            
            // 실제로는 서버에 처리 취소 요청
            console.log(`신고 처리 취소: ${title} - ${reported}`);
            
            showSuccessMessage(`${action}가 취소되었습니다. 계정 상태가 복구되었습니다.`);
        }
    );
}

// 경고 처리 확인
function confirmWarning(title, reported) {
    const reason = document.getElementById('warning-reason').value;
    const message = document.getElementById('warning-message').value.trim();
    
    if (!message) {
        showErrorMessage('경고 메시지를 입력해주세요.');
        return;
    }
    
    showConfirmModal(
        `${reported}님에게 경고를 발송하시겠습니까?`,
        function() {
            // 실제로는 서버에 경고 처리 요청
            console.log('경고 처리:', { title, reported, reason, message });
            
            // 신고 아이템 상태 업데이트
            updateReportStatus(title, reported, 'warning-issued', '경고처리');
            
            closeModal();
            showSuccessMessage('경고가 발송되었습니다.');
        }
    );
}

// 계정 정지 처리 확인
function confirmSuspension(title, reported) {
    const period = document.getElementById('suspension-period').value;
    const reason = document.getElementById('suspension-reason').value;
    const message = document.getElementById('suspension-message').value.trim();
    
    if (!message) {
        showErrorMessage('정지 통지 메시지를 입력해주세요.');
        return;
    }
    
    const periodText = period === 'permanent' ? '영구정지' : `${period}일 정지`;
    
    showConfirmModal(
        `${reported}님의 계정을 ${periodText} 처리하시겠습니까?\n\n이 작업은 즉시 적용되며, 사용자는 해당 기간 동안 서비스를 이용할 수 없습니다.`,
        function() {
            // 실제로는 서버에 계정 정지 요청
            console.log('계정 정지 처리:', { title, reported, period, reason, message });
            
            // 신고 아이템 상태 업데이트
            updateReportStatus(title, reported, 'suspended', '계정정지');
            
            closeModal();
            showSuccessMessage(`계정이 ${periodText} 처리되었습니다.`);
        }
    );
}

// 신고 상태 업데이트 함수
function updateReportStatus(title, reported, statusClass, statusText) {
    const reportItems = document.querySelectorAll('.report-item');
    
    reportItems.forEach(item => {
        const itemTitle = item.querySelector('h4').textContent;
        const itemReported = getReportedUser(item);
        
        if (itemTitle === title && itemReported === reported) {
            const statusElement = item.querySelector('.report-status');
            statusElement.textContent = statusText;
            statusElement.className = `report-status ${statusClass}`;
            
            // 버튼 상태 변경
            const actionsContainer = item.querySelector('.report-actions');
            actionsContainer.innerHTML = `
                <button class="btn-small" onclick="handleReportDetail(this)">상세보기</button>
                <button class="btn-small success" onclick="handleReportCancel(this)">처리취소</button>
            `;
        }
    });
}

// 헬퍼 함수들
function getReportedUser(reportItem) {
    const info = reportItem.querySelectorAll('.report-info p');
    for (let p of info) {
        if (p.textContent.includes('피신고자:')) {
            return p.textContent.split(':')[1].trim();
        }
    }
    return '';
}

function getStatusClass(status) {
    if (status.includes('미처리')) return 'pending';
    if (status.includes('처리완료')) return 'resolved';
    if (status.includes('경고')) return 'warning-issued';
    if (status.includes('정지')) return 'suspended';
    return 'pending';
}

function getRelatedChatRoom(title) {
    const chatRooms = {
        '부적절한 언어 사용': '부산 힐링 여행',
        '스팸성 게시물': '전체 공지방',
        '허위 정보 유포': '제주도 맛집 투어',
        '사기 행위': '서울 당일치기',
        '괴롭힘 및 혐오 발언': '강원도 겨울여행'
    };
    return chatRooms[title] || '일반 채팅방';
}

function getEvidenceInfo(title) {
    const evidence = {
        '부적절한 언어 사용': '스크린샷 3장, 채팅 로그',
        '스팸성 게시물': '게시물 캡처 5장',
        '허위 정보 유포': '관련 링크 2개, 스크린샷 4장',
        '사기 행위': '결제 내역, 대화 기록',
        '괴롭힘 및 혐오 발언': '채팅 로그, 신고자 진술서'
    };
    return evidence[title] || '관련 자료 첨부됨';
}

function getProcessedDate(status) {
    if (status.includes('처리완료') || status.includes('경고') || status.includes('정지')) {
        return new Date().toLocaleDateString();
    }
    return '-';
}

function getProcessReason(title) {
    const reasons = {
        '부적절한 언어 사용': '커뮤니티 가이드라인 위반 확인',
        '스팸성 게시물': '반복적인 광고성 게시물 확인',
        '허위 정보 유포': '사실과 다른 정보 유포 확인',
        '사기 행위': '금전적 피해 발생 우려',
        '괴롭힘 및 혐오 발언': '지속적인 괴롭힘 행위 확인'
    };
    return reasons[title] || '신고 내용 확인 후 조치';
}

function getPreviousReports(reported) {
    // 실제로는 데이터베이스에서 조회
    const reportCounts = {
        '박철수': '1건',
        '광고계정1': '15건',
        '최민호': '0건',
        '이상훈': '2건',
        '강동욱': '3건'
    };
    return reportCounts[reported] || '0건';
}

function getSimilarReports(title) {
    const similar = {
        '부적절한 언어 사용': '최근 30일 내 5건',
        '스팸성 게시물': '최근 7일 내 12건',
        '허위 정보 유포': '최근 30일 내 2건',
        '사기 행위': '최근 30일 내 1건',
        '괴롭힘 및 혐오 발언': '최근 30일 내 3건'
    };
    return similar[title] || '최근 30일 내 0건';
}

function getReporterCredibility(reporter) {
    const credibility = {
        '김영희': '높음 (정확한 신고 이력)',
        '이민수': '매우 높음 (모범 회원)',
        '정수진': '보통 (일반 회원)',
        '한지민': '높음 (신뢰할 만한 신고)',
        '윤서연': '높음 (상세한 증거 제공)'
    };
    return credibility[reporter] || '보통';
}

function getPreviousWarnings(reported) {
    const warnings = {
        '박철수': 0,
        '광고계정1': 2,
        '최민호': 0,
        '이상훈': 1,
        '강동욱': 2
    };
    return warnings[reported] || 0;
}

function getDetailModalActions(status, title, reported) {
    if (status.includes('미처리')) {
        return `
            <button class="btn-warning" onclick="processReportWarning('${title}', '${reported}')">경고 처리</button>
            <button class="btn-danger" onclick="processReportSuspension('${title}', '${reported}')">계정 정지</button>
        `;
    } else if (status.includes('경고') || status.includes('정지')) {
        return `
            <button class="btn-success" onclick="processReportCancel('${title}', '${reported}')">처리 취소</button>
        `;
    } else {
        return `
            <button class="btn-primary" onclick="exportReportData('${title}', '${reported}')">데이터 내보내기</button>
        `;
    }
}

// 모달에서 신고 처리 함수들
function processReportWarning(title, reported) {
    closeModal();
    // 해당 신고 아이템 찾아서 경고 처리 모달 표시
    const reportItems = document.querySelectorAll('.report-item');
    reportItems.forEach(item => {
        const itemTitle = item.querySelector('h4').textContent;
        const itemReported = getReportedUser(item);
        if (itemTitle === title && itemReported === reported) {
            const warningBtn = item.querySelector('.report-actions button.warning');
            if (warningBtn) {
                handleReportWarning(warningBtn);
            }
        }
    });
}

function processReportSuspension(title, reported) {
    closeModal();
    // 해당 신고 아이템 찾아서 계정정지 처리 모달 표시
    const reportItems = document.querySelectorAll('.report-item');
    reportItems.forEach(item => {
        const itemTitle = item.querySelector('h4').textContent;
        const itemReported = getReportedUser(item);
        if (itemTitle === title && itemReported === reported) {
            const suspensionBtn = item.querySelector('.report-actions button.danger');
            if (suspensionBtn) {
                handleReportSuspension(suspensionBtn);
            }
        }
    });
}

function processReportCancel(title, reported) {
    closeModal();
    // 해당 신고 아이템 찾아서 처리취소
    const reportItems = document.querySelectorAll('.report-item');
    reportItems.forEach(item => {
        const itemTitle = item.querySelector('h4').textContent;
        const itemReported = getReportedUser(item);
        if (itemTitle === title && itemReported === reported) {
            const cancelBtn = item.querySelector('.report-actions button.success');
            if (cancelBtn) {
                handleReportCancel(cancelBtn);
            }
        }
    });
}

function exportReportData(title, reported) {
    console.log(`신고 데이터 내보내기: ${title} - ${reported}`);
    closeModal();
    showSuccessMessage('신고 데이터 내보내기가 시작되었습니다.');
}

// 신고 필터링 함수 (기존 applyFilter 함수에서 분리)
function applyReportFilter(filterType) {
    const reportItems = document.querySelectorAll('.report-item');
    reportItems.forEach(item => {
        const status = item.querySelector('.report-status').textContent;
        let shouldShow = false;
        
        switch(filterType) {
            case '전체':
                shouldShow = true;
                break;
            case '미처리':
                shouldShow = status.includes('미처리');
                break;
            case '처리완료':
                shouldShow = status.includes('처리완료') || status.includes('경고') || status.includes('정지');
                break;
            default:
                shouldShow = status.includes(filterType);
        }
        
        item.style.display = shouldShow ? 'block' : 'none';
    });
}

// === 리뷰 관리 함수들 ===

function handleReviewApproval(btn) {
    const row = btn.closest('tr');
    const location = row.cells[0].textContent;
    const author = row.cells[1].textContent;
    const content = row.cells[3].textContent;
    
    showConfirmModal(`${author}님의 ${location} 리뷰를 승인하시겠습니까?`, function() {
        const statusCell = row.querySelector('.status');
        statusCell.textContent = '승인완료';
        statusCell.className = 'status active';
        
        // 버튼 업데이트
        const actionCell = row.querySelector('td:last-child');
        actionCell.innerHTML = `
            <button class="btn-small" onclick="handleReviewDetail(this)">상세</button>
            <button class="btn-small danger" onclick="handleReviewDelete(this)">삭제</button>
        `;
        
        showSuccessMessage('리뷰가 승인되었습니다.');
    });
}

function handleReviewRejection(btn) {
    const row = btn.closest('tr');
    const location = row.cells[0].textContent;
    const author = row.cells[1].textContent;
    
    showConfirmModal(`${author}님의 ${location} 리뷰를 거부하시겠습니까?`, function() {
        const statusCell = row.querySelector('.status');
        statusCell.textContent = '거부';
        statusCell.className = 'status suspended';
        
        // 버튼 업데이트
        const actionCell = row.querySelector('td:last-child');
        actionCell.innerHTML = `
            <button class="btn-small" onclick="handleReviewDetail(this)">상세</button>
            <button class="btn-small success" onclick="handleReviewReapproval(this)">재승인</button>
        `;
        
        showSuccessMessage('리뷰가 거부되었습니다.');
    });
}

function handleReviewDetail(btn) {
    const row = btn.closest('tr');
    const location = row.cells[0].textContent;
    const author = row.cells[1].textContent;
    const rating = row.cells[2].textContent;
    const content = row.cells[3].textContent;
    const date = row.cells[4].textContent;
    const status = row.querySelector('.status').textContent;
    
    const detailContent = `
        <h3>리뷰 상세 정보</h3>
        <div class="review-detail">
            <p><strong>관광지:</strong> ${location}</p>
            <p><strong>작성자:</strong> ${author}</p>
            <p><strong>평점:</strong> ${rating}</p>
            <p><strong>작성일:</strong> ${date}</p>
            <p><strong>상태:</strong> ${status}</p>
            <p><strong>리뷰 내용:</strong></p>
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #005792;">
                ${content.length > 20 ? content : '정말 아름다운 곳이었습니다. 역사적인 가치도 높고 건축물도 웅장해서 감동받았어요. 특히 경회루 연못의 풍경이 인상적이었습니다. 가족들과 함께 방문하기 좋은 곳이라고 생각합니다. 다음에도 또 오고 싶네요!'}
            </div>
            <p><strong>첨부 이미지:</strong> 3장</p>
            <p><strong>신고 횟수:</strong> 0건</p>
            <p><strong>도움이 됨:</strong> 15명</p>
            <p><strong>작성자 총 리뷰:</strong> 12개</p>
            <p><strong>작성자 평균 평점:</strong> 4.2/5.0</p>
            ${status === '거부' ? '<p><strong>거부 사유:</strong> 부적절한 내용 포함</p>' : ''}
        </div>
        <div class="modal-actions">
            <button class="btn-secondary" onclick="closeModal()">닫기</button>
            ${status.includes('승인대기') ? `
                <button class="btn-small success" onclick="approveReviewFromModal('${author}', '${location}')">승인</button>
                <button class="btn-small danger" onclick="rejectReviewFromModal('${author}', '${location}')">거부</button>
            ` : status === '거부' ? `
                <button class="btn-small success" onclick="approveReviewFromModal('${author}', '${location}')">재승인</button>
            ` : `
                <button class="btn-small danger" onclick="deleteReviewFromModal('${author}', '${location}')">삭제</button>
            `}
        </div>
    `;
    showModal(detailContent);
}

function handleReviewDelete(btn) {
    const row = btn.closest('tr');
    const location = row.cells[0].textContent;
    const author = row.cells[1].textContent;
    
    showConfirmModal(`${author}님의 ${location} 리뷰를 삭제하시겠습니까?`, function() {
        row.remove();
        showSuccessMessage('리뷰가 삭제되었습니다.');
    });
}

function handleReviewReapproval(btn) {
    const row = btn.closest('tr');
    const location = row.cells[0].textContent;
    const author = row.cells[1].textContent;
    
    showConfirmModal(`${author}님의 ${location} 리뷰를 재승인하시겠습니까?`, function() {
        const statusCell = row.querySelector('.status');
        statusCell.textContent = '승인완료';
        statusCell.className = 'status active';
        
        // 버튼 업데이트
        const actionCell = row.querySelector('td:last-child');
        actionCell.innerHTML = `
            <button class="btn-small" onclick="handleReviewDetail(this)">상세</button>
            <button class="btn-small danger" onclick="handleReviewDelete(this)">삭제</button>
        `;
        
        showSuccessMessage('리뷰가 재승인되었습니다.');
    });
}

// 모달에서 리뷰 처리 함수들
function approveReviewFromModal(author, location) {
    console.log(`리뷰 승인: ${author} - ${location}`);
    closeModal();
    showSuccessMessage('리뷰가 승인되었습니다.');
    // 실제로는 해당 행을 찾아서 상태 업데이트
    updateReviewStatusInTable(author, location, 'approved');
}

function rejectReviewFromModal(author, location) {
    const rejectReason = prompt('거부 사유를 입력하세요:');
    if (rejectReason && rejectReason.trim()) {
        console.log(`리뷰 거부: ${author} - ${location}, 사유: ${rejectReason}`);
        closeModal();
        showSuccessMessage('리뷰가 거부되었습니다.');
        // 실제로는 해당 행을 찾아서 상태 업데이트
        updateReviewStatusInTable(author, location, 'rejected');
    }
}

function deleteReviewFromModal(author, location) {
    showConfirmModal(`${author}님의 ${location} 리뷰를 삭제하시겠습니까?`, function() {
        console.log(`리뷰 삭제: ${author} - ${location}`);
        closeModal();
        showSuccessMessage('리뷰가 삭제되었습니다.');
        // 실제로는 해당 행을 찾아서 삭제
        deleteReviewFromTable(author, location);
    });
}

function updateReviewStatusInTable(author, location, status) {
    const rows = document.querySelectorAll('#reviews-tab .data-table tbody tr');
    rows.forEach(row => {
        const rowAuthor = row.cells[1].textContent;
        const rowLocation = row.cells[0].textContent;
        
        if (rowAuthor === author && rowLocation === location) {
            const statusCell = row.querySelector('.status');
            const actionCell = row.querySelector('td:last-child');
            
            if (status === 'approved') {
                statusCell.textContent = '승인완료';
                statusCell.className = 'status active';
                actionCell.innerHTML = `
                    <button class="btn-small" onclick="handleReviewDetail(this)">상세</button>
                    <button class="btn-small danger" onclick="handleReviewDelete(this)">삭제</button>
                `;
            } else if (status === 'rejected') {
                statusCell.textContent = '거부';
                statusCell.className = 'status suspended';
                actionCell.innerHTML = `
                    <button class="btn-small" onclick="handleReviewDetail(this)">상세</button>
                    <button class="btn-small success" onclick="handleReviewReapproval(this)">재승인</button>
                `;
            }
        }
    });
}

function deleteReviewFromTable(author, location) {
    const rows = document.querySelectorAll('#reviews-tab .data-table tbody tr');
    rows.forEach(row => {
        const rowAuthor = row.cells[1].textContent;
        const rowLocation = row.cells[0].textContent;
        
        if (rowAuthor === author && rowLocation === location) {
            row.remove();
        }
    });
}

// === 회원 관리 함수들 ===

function handleUserDetail(btn) {
    const row = btn.closest('tr');
    const userId = row.cells[0].textContent;
    const userName = row.cells[1].textContent;
    const userEmail = row.cells[2].textContent;
    const joinDate = row.cells[3].textContent;
    const status = row.querySelector('.status').textContent;
    
    const content = `
        <h3>회원 상세 정보</h3>
        <div class="user-detail">
            <p><strong>ID:</strong> ${userId}</p>
            <p><strong>이름:</strong> ${userName}</p>
            <p><strong>이메일:</strong> ${userEmail}</p>
            <p><strong>가입일:</strong> ${joinDate}</p>
            <p><strong>상태:</strong> ${status}</p>
            <p><strong>최근 로그인:</strong> 2024-07-12 14:30</p>
            <p><strong>매칭 참여 횟수:</strong> 5회</p>
            <p><strong>매칭 생성 횟수:</strong> 2회</p>
            <p><strong>신고 접수:</strong> 0건</p>
            <p><strong>리뷰 작성:</strong> 12건</p>
            <p><strong>평균 평점:</strong> 4.5/5.0</p>
        </div>
        <div class="modal-actions">
            <button class="btn-secondary" onclick="closeModal()">닫기</button>
            <button class="btn-primary" onclick="exportUserData('${userId}')">활동 내역 보기</button>
        </div>
    `;
    showModal(content);
}

function handleUserSuspension(btn) {
    const row = btn.closest('tr');
    const userName = row.cells[1].textContent;
    const statusCell = row.querySelector('.status');
    const isActive = statusCell.textContent.includes('활성');
    
    const action = isActive ? '정지' : '활성화';
    showConfirmModal(`${userName} 회원을 ${action}하시겠습니까?`, function() {
        if (isActive) {
            statusCell.textContent = '정지';
            statusCell.className = 'status suspended';
            btn.textContent = '활성화';
            btn.className = 'btn-small success';
        } else {
            statusCell.textContent = '활성';
            statusCell.className = 'status active';
            btn.textContent = '정지';
            btn.className = 'btn-small danger';
        }
        showSuccessMessage(`회원이 ${action}되었습니다.`);
    });
}

function exportUserData(userId) {
    console.log(`회원 ${userId} 활동 내역 내보내기`);
    showSuccessMessage('회원 활동 내역을 조회하고 있습니다...');
    closeModal();
}


// === 설정 관리 함수들 ===
// === 설정 관리 함수들 (수정된 버전) ===

// 설정 저장 함수
function saveSettings() {
    try {
        // 모든 설정 값 수집
        const settings = collectAllSettings();
        
        // 유효성 검사
        const validation = validateSettings(settings);
        if (!validation.isValid) {
            showErrorMessage(validation.message);
            return;
        }
        
        // 중요한 설정 변경 시 추가 확인
        if (hasSecurityChanges(settings)) {
            showConfirmModal(
                '보안 설정을 변경하시겠습니까?\n\n변경 시 모든 사용자의 세션이 초기화되고 재로그인이 필요할 수 있습니다.',
                function() {
                    executeSaveSettings(settings);
                }
            );
        } else {
            showConfirmModal('설정을 저장하시겠습니까?', function() {
                executeSaveSettings(settings);
            });
        }
    } catch (error) {
        console.error('설정 저장 중 오류:', error);
        showErrorMessage('설정을 읽는 중 오류가 발생했습니다. 페이지를 새로고침 후 다시 시도해주세요.');
    }
}

// 설정 값 수집 함수 (안전하게 수정)
function collectAllSettings() {
    const settingsSection = document.getElementById('settings-section');
    if (!settingsSection) {
        throw new Error('설정 섹션을 찾을 수 없습니다.');
    }
    
    // 더 안전한 선택자 사용
    const siteNameInput = settingsSection.querySelector('input[type="text"]');
    const adminEmailInput = settingsSection.querySelector('input[type="email"]');
    const numberInputs = settingsSection.querySelectorAll('input[type="number"]');
    
    // 요소 존재 확인
    if (!siteNameInput) {
        throw new Error('사이트명 입력 필드를 찾을 수 없습니다.');
    }
    if (!adminEmailInput) {
        throw new Error('관리자 이메일 입력 필드를 찾을 수 없습니다.');
    }
    if (numberInputs.length < 4) {
        throw new Error('숫자 입력 필드를 모두 찾을 수 없습니다.');
    }
    
    return {
        general: {
            siteName: siteNameInput.value.trim(),
            adminEmail: adminEmailInput.value.trim()
        },
        matching: {
            maxParticipants: parseInt(numberInputs[0].value) || 6,
            validityPeriod: parseInt(numberInputs[1].value) || 30
        },
        security: {
            loginAttemptLimit: parseInt(numberInputs[2].value) || 5,
            sessionTimeout: parseInt(numberInputs[3].value) || 30
        }
    };
}

// 설정 유효성 검사
function validateSettings(settings) {
    // 일반 설정 검사
    if (!settings.general.siteName) {
        return { isValid: false, message: '사이트명을 입력해주세요.' };
    }
    
    if (settings.general.siteName.length < 2) {
        return { isValid: false, message: '사이트명은 2자 이상 입력해주세요.' };
    }
    
    if (!settings.general.adminEmail) {
        return { isValid: false, message: '관리자 이메일을 입력해주세요.' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(settings.general.adminEmail)) {
        return { isValid: false, message: '올바른 이메일 형식을 입력해주세요.' };
    }
    
    // 매칭 설정 검사
    if (isNaN(settings.matching.maxParticipants) || settings.matching.maxParticipants < 2) {
        return { isValid: false, message: '최대 매칭 인원은 2명 이상이어야 합니다.' };
    }
    
    if (settings.matching.maxParticipants > 20) {
        return { isValid: false, message: '최대 매칭 인원은 20명을 초과할 수 없습니다.' };
    }
    
    if (isNaN(settings.matching.validityPeriod) || settings.matching.validityPeriod < 1) {
        return { isValid: false, message: '매칭 유효기간은 1일 이상이어야 합니다.' };
    }
    
    if (settings.matching.validityPeriod > 365) {
        return { isValid: false, message: '매칭 유효기간은 365일을 초과할 수 없습니다.' };
    }
    
    // 보안 설정 검사
    if (isNaN(settings.security.loginAttemptLimit) || settings.security.loginAttemptLimit < 3) {
        return { isValid: false, message: '로그인 시도 제한은 3회 이상이어야 합니다.' };
    }
    
    if (settings.security.loginAttemptLimit > 10) {
        return { isValid: false, message: '로그인 시도 제한은 10회를 초과할 수 없습니다.' };
    }
    
    if (isNaN(settings.security.sessionTimeout) || settings.security.sessionTimeout < 5) {
        return { isValid: false, message: '세션 유지시간은 5분 이상이어야 합니다.' };
    }
    
    if (settings.security.sessionTimeout > 1440) {
        return { isValid: false, message: '세션 유지시간은 24시간(1440분)을 초과할 수 없습니다.' };
    }
    
    return { isValid: true };
}

// 보안 설정 변경 여부 확인
function hasSecurityChanges(newSettings) {
    const currentSettings = getCurrentSettings();
    
    return (
        newSettings.security.loginAttemptLimit !== currentSettings.security.loginAttemptLimit ||
        newSettings.security.sessionTimeout !== currentSettings.security.sessionTimeout
    );
}

// 현재 설정 값 가져오기 (기본값 또는 저장된 값)
function getCurrentSettings() {
    // 실제로는 서버나 로컬 스토리지에서 가져오지만, 여기서는 기본값 반환
    return {
        general: {
            siteName: '여행 플랫폼',
            adminEmail: 'admin@travel.com'
        },
        matching: {
            maxParticipants: 6,
            validityPeriod: 30
        },
        security: {
            loginAttemptLimit: 5,
            sessionTimeout: 30
        }
    };
}

// 설정 저장 실행
function executeSaveSettings(settings) {
    try {
        // 로딩 상태 표시
        showLoadingMessage('설정을 저장하고 있습니다...');
        
        // 실제로는 서버에 저장 요청
        console.log('설정 저장:', settings);
        
        // 시뮬레이션을 위한 지연
        setTimeout(() => {
            // 설정 변경 사항 적용
            applySettingsChanges(settings);
            
            // 설정 변경 로그 기록
            logSettingsChange(settings);
            
            hideLoadingMessage();
            showSuccessMessage('설정이 성공적으로 저장되었습니다.');
            
            // 보안 설정이 변경된 경우 추가 안내
            if (hasSecurityChanges(settings)) {
                setTimeout(() => {
                    showInfoMessage('보안 설정이 변경되었습니다. 일부 변경사항은 다음 로그인부터 적용됩니다.');
                }, 1000);
            }
        }, 1500);
        
    } catch (error) {
        hideLoadingMessage();
        showErrorMessage('설정 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
        console.error('설정 저장 오류:', error);
    }
}

// 설정 변경사항 적용
function applySettingsChanges(settings) {
    // 사이트명 변경 시 페이지 타이틀 업데이트
    if (settings.general.siteName) {
        document.title = `관리자 패널 - ${settings.general.siteName}`;
        
        // 헤더의 사이트명도 업데이트 (존재하는 경우)
        const siteTitleElement = document.querySelector('.site-title, .brand-name');
        if (siteTitleElement) {
            siteTitleElement.textContent = settings.general.siteName;
        }
    }
    
    // 실제 환경에서는 여기서 시스템 설정을 동적으로 적용
    console.log('설정 변경사항 적용 완료');
}

// 설정 변경 로그 기록
function logSettingsChange(settings) {
    const changeLog = {
        timestamp: new Date().toISOString(),
        admin: '관리자', // 실제로는 현재 로그인한 관리자 정보
        changes: settings,
        ip: '192.168.1.1', // 실제로는 실제 IP 주소
        userAgent: navigator.userAgent
    };
    
    console.log('설정 변경 로그:', changeLog);
    
    // 실제로는 서버에 로그 전송
    // 보안상 중요한 변경사항은 별도 알림 발송
}

// 설정 초기화 함수
function resetSettings() {
    showConfirmModal(
        '모든 설정을 기본값으로 초기화하시겠습니까?\n\n이 작업은 되돌릴 수 없으며, 현재 설정된 모든 값이 기본값으로 변경됩니다.',
        function() {
            executeResetSettings();
        }
    );
}

// 설정 초기화 실행
function executeResetSettings() {
    try {
        showLoadingMessage('설정을 초기화하고 있습니다...');
        
        // 기본 설정값
        const defaultSettings = {
            general: {
                siteName: '여행 플랫폼',
                adminEmail: 'admin@travel.com'
            },
            matching: {
                maxParticipants: 6,
                validityPeriod: 30
            },
            security: {
                loginAttemptLimit: 5,
                sessionTimeout: 30
            }
        };
        
        // 시뮬레이션을 위한 지연
        setTimeout(() => {
            // UI에 기본값 적용
            applySettingsToUI(defaultSettings);
            
            // 초기화 로그 기록
            console.log('설정 초기화 완료:', defaultSettings);
            
            hideLoadingMessage();
            showSuccessMessage('설정이 기본값으로 초기화되었습니다.');
            
            // 초기화 후 안내
            setTimeout(() => {
                showInfoMessage('변경된 설정을 적용하려면 "설정 저장" 버튼을 클릭해주세요.');
            }, 1000);
        }, 1000);
        
    } catch (error) {
        hideLoadingMessage();
        showErrorMessage('설정 초기화 중 오류가 발생했습니다.');
        console.error('설정 초기화 오류:', error);
    }
}

// UI에 설정값 적용 (안전하게 수정)
function applySettingsToUI(settings) {
    try {
        const settingsSection = document.getElementById('settings-section');
        if (!settingsSection) {
            throw new Error('설정 섹션을 찾을 수 없습니다.');
        }
        
        const siteNameInput = settingsSection.querySelector('input[type="text"]');
        const adminEmailInput = settingsSection.querySelector('input[type="email"]');
        const numberInputs = settingsSection.querySelectorAll('input[type="number"]');
        
        // 일반 설정
        if (siteNameInput) {
            siteNameInput.value = settings.general.siteName;
        }
        if (adminEmailInput) {
            adminEmailInput.value = settings.general.adminEmail;
        }
        
        // 매칭 설정 및 보안 설정
        if (numberInputs.length >= 4) {
            numberInputs[0].value = settings.matching.maxParticipants;
            numberInputs[1].value = settings.matching.validityPeriod;
            numberInputs[2].value = settings.security.loginAttemptLimit;
            numberInputs[3].value = settings.security.sessionTimeout;
        }
        
    } catch (error) {
        console.error('UI 업데이트 오류:', error);
        showErrorMessage('설정 UI 업데이트 중 오류가 발생했습니다.');
    }
}

// 유틸리티 함수들
function showLoadingMessage(message) {
    const existingToast = document.getElementById('loading-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const loadingToast = document.createElement('div');
    loadingToast.className = 'toast toast-loading';
    loadingToast.innerHTML = `
        <div class="loading-spinner"></div>
        <span>${message}</span>
    `;
    loadingToast.id = 'loading-toast';
    
    document.body.appendChild(loadingToast);
    setTimeout(() => loadingToast.classList.add('show'), 100);
}

function hideLoadingMessage() {
    const loadingToast = document.getElementById('loading-toast');
    if (loadingToast) {
        loadingToast.classList.remove('show');
        setTimeout(() => loadingToast.remove(), 300);
    }
}

function showInfoMessage(message) {
    showToast(message, 'info');
}

// 설정 섹션 초기화
function initializeSettingsSection() {
    const settingsSection = document.getElementById('settings-section');
    if (!settingsSection) {
        console.warn('설정 섹션을 찾을 수 없습니다.');
        return;
    }
    
    // 설정 저장 버튼에 이벤트 리스너 추가
    const saveButton = settingsSection.querySelector('.btn-primary');
    if (saveButton) {
        // 기존 이벤트 제거 후 새로 추가
        saveButton.removeEventListener('click', saveSettings);
        saveButton.addEventListener('click', saveSettings);
        
        // onclick도 설정 (HTML에서 직접 호출하는 경우를 위해)
        saveButton.onclick = saveSettings;
    }
    
    // 초기화 버튼에 이벤트 리스너 추가
    const resetButton = settingsSection.querySelector('.btn-secondary');
    if (resetButton) {
        // 기존 이벤트 제거 후 새로 추가
        resetButton.removeEventListener('click', resetSettings);
        resetButton.addEventListener('click', resetSettings);
        
        // onclick도 설정 (HTML에서 직접 호출하는 경우를 위해)
        resetButton.onclick = resetSettings;
    }
    
    // 입력 필드에 실시간 유효성 검사 추가
    const inputs = settingsSection.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateSingleSetting(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    console.log('설정 섹션 초기화 완료');
}

// 개별 설정 유효성 검사
function validateSingleSetting(input) {
    const value = input.value.trim();
    const type = input.type;
    
    clearFieldError(input);
    
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(input, '올바른 이메일 형식을 입력해주세요.');
            return false;
        }
    }
    
    if (type === 'number' && value) {
        const numValue = parseInt(value);
        const label = input.parentNode.querySelector('label');
        
        if (label) {
            const labelText = label.textContent;
            
            if (labelText.includes('최대 매칭 인원')) {
                if (numValue < 2 || numValue > 20) {
                    showFieldError(input, '2명 이상 20명 이하로 입력해주세요.');
                    return false;
                }
            } else if (labelText.includes('유효기간')) {
                if (numValue < 1 || numValue > 365) {
                    showFieldError(input, '1일 이상 365일 이하로 입력해주세요.');
                    return false;
                }
            } else if (labelText.includes('로그인 시도')) {
                if (numValue < 3 || numValue > 10) {
                    showFieldError(input, '3회 이상 10회 이하로 입력해주세요.');
                    return false;
                }
            } else if (labelText.includes('세션 유지시간')) {
                if (numValue < 5 || numValue > 1440) {
                    showFieldError(input, '5분 이상 1440분 이하로 입력해주세요.');
                    return false;
                }
            }
        }
    }
    
    return true;
}

// 설정 디버그 함수 (개발용)
function debugSettings() {
    try {
        const settings = collectAllSettings();
        console.log('현재 설정 값:', settings);
        
        const validation = validateSettings(settings);
        console.log('유효성 검사 결과:', validation);
        
        showSuccessMessage('설정 디버그 정보가 콘솔에 출력되었습니다.');
    } catch (error) {
        console.error('설정 디버그 오류:', error);
        showErrorMessage('설정 디버그 중 오류가 발생했습니다.');
    }
}

// 페이지 로드 시 설정 섹션 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 약간의 지연을 두고 초기화 (다른 스크립트들이 로드된 후)
    setTimeout(() => {
        initializeSettingsSection();
    }, 500);
});

// 설정 관련 전역 함수들을 window 객체에 등록 (HTML에서 직접 호출 가능하도록)
window.saveSettings = saveSettings;
window.resetSettings = resetSettings;
window.debugSettings = debugSettings;

// === 유틸리티 함수들 ===

function showSuccessMessage(message) {
    showToast(message, 'success');
}

function showErrorMessage(message) {
    showToast(message, 'error');
}

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

// === 추가 기능 함수들 ===

function showAddContentForm() {
    showSuccessMessage('콘텐츠 추가 기능이 준비 중입니다.');
}

// 폼 유효성 검사
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    
    if (field.hasAttribute('required') && value === '') {
        showFieldError(field, '필수 입력 항목입니다.');
        return false;
    }
    
    if (fieldType === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, '올바른 이메일 형식이 아닙니다.');
            return false;
        }
    }
    
    if (fieldType === 'number' && value !== '') {
        if (isNaN(value) || Number(value) < 0) {
            showFieldError(field, '올바른 숫자를 입력해주세요.');
            return false;
        }
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
    field.classList.add('error');
}

function clearFieldError(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    field.classList.remove('error');
}

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
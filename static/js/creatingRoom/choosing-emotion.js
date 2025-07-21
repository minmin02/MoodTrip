// 선택된 감정들을 저장할 배열
let selectedEmotions = [];

// 카테고리별 감정 데이터
const categoryEmotions = {
    'healing': [
        { id: 'peace', text: '평온' },
        { id: 'stable', text: '안정' },
        { id: 'rest', text: '휴식' },
        { id: 'freedom', text: '자유' },
        { id: 'meditation', text: '명상' },
        { id: 'quiet', text: '고요' },
        { id: 'tired', text: '힘듦' },
        { id: 'leisure', text: '여유' },
        { id: 'calm', text: '차분함' },
        { id: 'comfort', text: '편안함' }
    ],
    'romance': [
        { id: 'excitement', text: '설렘' },
        { id: 'romance', text: '낭만' },
        { id: 'love', text: '사랑' },
        { id: 'affection', text: '애정' },
        { id: 'sweet', text: '달콤함' },
        { id: 'tender', text: '애틋함' },
        { id: 'longing', text: '그리움' },
        { id: 'sentiment', text: '감성' },
        { id: 'romantic', text: '로맨틱' },
        { id: 'passionate', text: '열정적' }
    ],
    'adventure': [
        { id: 'adventure', text: '모험' },
        { id: 'thrill', text: '스릴' },
        { id: 'challenge', text: '도전' },
        { id: 'exciting', text: '짜릿함' },
        { id: 'courage', text: '용기' },
        { id: 'bold', text: '대담함' },
        { id: 'dynamic', text: '역동성' },
        { id: 'energetic', text: '활기참' },
        { id: 'daring', text: '과감함' },
        { id: 'wild', text: '거침없음' }
    ],
    'freedom': [
        { id: 'free', text: '자유로움' },
        { id: 'liberation', text: '해방' },
        { id: 'independence', text: '독립' },
        { id: 'openness', text: '개방' },
        { id: 'unbound', text: '무구속' },
        { id: 'escape', text: '탈출' },
        { id: 'refreshing', text: '시원함' },
        { id: 'release', text: '해소' },
        { id: 'spacious', text: '넓은마음' },
        { id: 'limitless', text: '무한함' }
    ],
    'joy': [
        { id: 'joy', text: '기쁨' },
        { id: 'fun', text: '즐거움' },
        { id: 'happiness', text: '행복' },
        { id: 'satisfaction', text: '만족' },
        { id: 'ecstasy', text: '희열감' },
        { id: 'joyful', text: '즐거운' },
        { id: 'excitement2', text: '흥겨움' },
        { id: 'cheerful', text: '유쾌함' },
        { id: 'bliss', text: '황홀함' },
        { id: 'delight', text: '기뻐함' }
    ],
    'artistic': [
        { id: 'emotion', text: '감성적' },
        { id: 'inspiration', text: '영감' },
        { id: 'creativity', text: '창조성' },
        { id: 'artistic', text: '예술적' },
        { id: 'beauty', text: '아름다움' },
        { id: 'elegance', text: '우아함' },
        { id: 'aesthetic', text: '미적감각' },
        { id: 'poetic', text: '시적' },
        { id: 'dreamy', text: '몽환적' },
        { id: 'sophisticated', text: '세련됨' }
    ]
};

// DOM 로드 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeCategoryButtons();
    initializeCustomEmotionInput();
    restoreTemporaryEmotions();
    initializeNextButton();
});

// 카테고리 버튼 초기화
function initializeCategoryButtons() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const closeBtn = document.getElementById('closeTagsBtn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            showCategoryEmotions(category, this);
        });
    });
    
    // 닫기 버튼
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            hideCategoryEmotions();
        });
    }
}

// 카테고리 감정 표시
function showCategoryEmotions(category, button) {
    const displayArea = document.getElementById('emotionTagsDisplay');
    const titleElement = document.getElementById('selectedCategoryTitle');
    const gridElement = document.getElementById('emotionTagsGrid');
    
    // 모든 버튼 비활성화
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 선택된 버튼 활성화
    button.classList.add('active');
    
    // 제목 설정
    const categoryIcon = button.querySelector('.category-icon').textContent;
    const categoryName = button.querySelector('.category-name').textContent;
    titleElement.innerHTML = `${categoryIcon} ${categoryName}`;
    
    // 감정 태그들 생성
    gridElement.innerHTML = '';
    const emotions = categoryEmotions[category] || [];
    
    emotions.forEach(emotion => {
        const tagItem = createEmotionTagItem(emotion, category);
        gridElement.appendChild(tagItem);
    });
    
    // 표시 영역 보이기
    displayArea.style.display = 'block';
    
    // 부드러운 스크롤
    displayArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 감정 태그 아이템 생성
function createEmotionTagItem(emotion, category) {
    const tagItem = document.createElement('div');
    tagItem.className = 'emotion-tag-item';
    tagItem.setAttribute('data-emotion', emotion.text);
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `emotion-${emotion.id}`;
    checkbox.name = 'emotions';
    checkbox.value = emotion.text;
    checkbox.className = 'emotion-checkbox';
    
    // 이미 선택된 감정인지 확인
    if (isEmotionAlreadySelected(emotion.text)) {
        checkbox.checked = true;
    }
    
    const label = document.createElement('label');
    label.setAttribute('for', checkbox.id);
    label.className = 'emotion-label';
    label.textContent = emotion.text;
    
    // 체크박스 이벤트
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            addEmotionTag(emotion.text, 'preset');
        } else {
            removeEmotionTag(emotion.text);
        }
    });
    
    tagItem.appendChild(checkbox);
    tagItem.appendChild(label);
    
    return tagItem;
}

// 카테고리 감정 숨기기
function hideCategoryEmotions() {
    const displayArea = document.getElementById('emotionTagsDisplay');
    
    // 모든 버튼 비활성화
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 표시 영역 숨기기
    displayArea.style.display = 'none';
}

// 커스텀 감정 입력 초기화 (검색 기능 제거)
function initializeCustomEmotionInput() {
    const customInput = document.getElementById('customEmotionInput');
    
    customInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const emotion = this.value.trim();
            
            if (emotion && !isEmotionAlreadySelected(emotion)) {
                addEmotionTag(emotion, 'custom');
                this.value = ''; // 입력창 비우기
            } else if (isEmotionAlreadySelected(emotion)) {
                alert('이미 선택된 감정 태그입니다.');
                this.value = '';
            }
        }
    });
}

// 감정 태그 추가
function addEmotionTag(emotion, type) {
    // 중복 체크
    if (isEmotionAlreadySelected(emotion)) {
        return;
    }
    
    // 배열에 추가
    selectedEmotions.push({
        text: emotion,
        type: type
    });
    
    // UI 업데이트
    updateSelectedEmotionsDisplay();
    updateCategoryButtonBadges();
}

// 감정 태그 제거
function removeEmotionTag(emotion) {
    // 배열에서 제거
    selectedEmotions = selectedEmotions.filter(item => item.text !== emotion);
    
    // UI 업데이트
    updateSelectedEmotionsDisplay();
    updateCategoryButtonBadges();
}

// 이미 선택된 감정인지 확인
function isEmotionAlreadySelected(emotion) {
    return selectedEmotions.some(item => item.text === emotion);
}

// 선택된 감정 태그 UI 업데이트
function updateSelectedEmotionsDisplay() {
    const container = document.getElementById('selectedEmotionsContainer');
    const list = document.getElementById('selectedEmotionsList');
    
    // 리스트 비우기
    list.innerHTML = '';
    
    // 선택된 감정이 없으면 컨테이너 숨기기
    if (selectedEmotions.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    // 컨테이너 보이기
    container.style.display = 'block';
    
    // 각 감정 태그 생성
    selectedEmotions.forEach(emotion => {
        const tagElement = createEmotionTagElement(emotion);
        list.appendChild(tagElement);
    });
}

// 감정 태그 엘리먼트 생성
function createEmotionTagElement(emotion) {
    const tag = document.createElement('div');
    tag.className = `selected-emotion-tag ${emotion.type}`;
    tag.setAttribute('data-emotion', emotion.text);
    
    // 태그 텍스트
    const tagText = document.createElement('span');
    tagText.textContent = `# ${emotion.text}`;
    tag.appendChild(tagText);
    
    // 삭제 버튼
    const removeBtn = document.createElement('button');
    removeBtn.className = 'emotion-tag-remove';
    removeBtn.innerHTML = '×';
    removeBtn.setAttribute('type', 'button');
    removeBtn.setAttribute('aria-label', `${emotion.text} 태그 삭제`);
    
    // 삭제 버튼 클릭 이벤트
    removeBtn.addEventListener('click', function() {
        removeEmotionTag(emotion.text);
        
        // 현재 표시된 카테고리에서 해당 체크박스 해제
        const checkbox = document.querySelector(`input[value="${emotion.text}"]`);
        if (checkbox) {
            checkbox.checked = false;
        }
    });
    
    tag.appendChild(removeBtn);
    
    return tag;
}

// 카테고리 버튼 뱃지 업데이트
function updateCategoryButtonBadges() {
    Object.keys(categoryEmotions).forEach(category => {
        const button = document.querySelector(`[data-category="${category}"]`);
        if (!button) return;
        
        // 기존 뱃지 제거
        const existingBadge = button.querySelector('.emotion-count-badge');
        if (existingBadge) {
            existingBadge.remove();
        }
        
        // 해당 카테고리의 선택된 감정 개수 계산
        const categoryEmotionTexts = categoryEmotions[category].map(e => e.text);
        const selectedCount = selectedEmotions.filter(emotion => 
            categoryEmotionTexts.includes(emotion.text)
        ).length;
        
        // 선택된 감정이 있으면 뱃지 추가
        if (selectedCount > 0) {
            const badge = document.createElement('span');
            badge.className = 'emotion-count-badge';
            badge.textContent = selectedCount;
            button.appendChild(badge);
        }
    });
}

// 임시 저장된 감정 복원
function restoreTemporaryEmotions() {
    const tempEmotions = localStorage.getItem('temp_selected_emotions');
    if (tempEmotions) {
        try {
            const emotions = JSON.parse(tempEmotions);
            
            emotions.forEach(emotion => {
                addEmotionTag(emotion.text, emotion.type);
            });
            
            // 임시 저장 데이터 삭제
            localStorage.removeItem('temp_selected_emotions');
        } catch (e) {
            console.error('임시 저장된 감정 데이터 복원 실패:', e);
        }
    }
}

// 폼 제출 시 선택된 감정들을 hidden input에 추가
function prepareFormSubmission() {
    const form = document.getElementById('temporary_room_phase_1');
    
    // 기존 hidden input들 제거
    const existingInputs = form.querySelectorAll('input[name="selected_emotions"]');
    existingInputs.forEach(input => input.remove());
    
    // 선택된 감정들을 hidden input으로 추가
    selectedEmotions.forEach(emotion => {
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'selected_emotions';
        hiddenInput.value = emotion.text;
        form.appendChild(hiddenInput);
    });
}

// 폼 유효성 검사
function validationPhase(form) {
    // 선택된 감정이 없으면 경고
    if (selectedEmotions.length === 0) {
        alert('최소 하나의 감정 태그를 선택해주세요.');
        return false;
    }
    
    // 폼 제출 준비
    prepareFormSubmission();
    
    // 선택된 감정들을 다음 페이지로 전달하기 위해 저장
    saveEmotionsForNextPage();
    
    return true;
}

// 뒤로가기 함수
function exitWithSubmit(formId, canSubmit) {
    // 현재 선택된 감정들을 로컬 스토리지에 저장
    if (selectedEmotions.length > 0) {
        localStorage.setItem('temp_selected_emotions', JSON.stringify(selectedEmotions));
    }
    
    // 이전 페이지로 이동
    window.location.href = '/templates/creatingRoom/creatingRoom-detail.html';
}

// 뒤로가기 함수 (대안)
function goToPreviousPage() {
    // 현재 선택된 감정들을 로컬 스토리지에 저장
    if (selectedEmotions.length > 0) {
        localStorage.setItem('temp_selected_emotions', JSON.stringify(selectedEmotions));
    }
    
    // 이전 페이지로 이동
    window.location.href = '/templates/creatingRoom/creatingRoom-detail.html';
}

// 다음 버튼 초기화
function initializeNextButton() {
    const nextButton = document.getElementById('nextButton');
    if (nextButton) {
        nextButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 유효성 검사
            if (selectedEmotions.length === 0) {
                alert('최소 하나의 감정 태그를 선택해주세요.');
                return;
            }
            
            // 선택된 감정들 저장
            saveEmotionsForNextPage();
            
            // 다음 페이지로 이동
            goToNextPage();
        });
    }
}

// 다음 페이지로 전달할 감정 데이터 저장
function saveEmotionsForNextPage() {
    localStorage.setItem('selected_emotions_step2', JSON.stringify(selectedEmotions));
    sessionStorage.setItem('selected_emotions_step2', JSON.stringify(selectedEmotions));
    console.log('다음 페이지로 전달할 감정 데이터 저장 완료:', selectedEmotions);
}

// 다음 페이지로 이동
function goToNextPage() {
    window.location.href = "/templates/creatingRoom/choosing-tour.html"; 
}

// 저장된 감정 데이터 불러오기
function getSelectedEmotionsFromPreviousPage() {
    try {
        let emotions = localStorage.getItem('selected_emotions_step2');
        if (emotions) {
            return JSON.parse(emotions);
        }
        
        emotions = sessionStorage.getItem('selected_emotions_step2');
        if (emotions) {
            return JSON.parse(emotions);
        }
        
        return [];
    } catch (e) {
        console.error('저장된 감정 데이터 불러오기 실패:', e);
        return [];
    }
}

// 감정 데이터 정리
function clearEmotionData() {
    localStorage.removeItem('selected_emotions_step2');
    sessionStorage.removeItem('selected_emotions_step2');
    localStorage.removeItem('temp_selected_emotions');
}

// 도움말 모달 관련 함수들
function openHelpModal() {
    const modal = document.getElementById('helpModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeHelpModal() {
    const modal = document.getElementById('helpModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeHelpModal();
        // 카테고리 감정 표시 영역도 닫기
        hideCategoryEmotions();
    }
});

// 빠른 선택 기능 (도움말 모달에서 사용)
function selectQuickEmotions(type) {
    const emotionSets = {
        'positive': ['기쁨', '즐거움', '행복', '만족'],
        'healing': ['평온', '안정', '휴식', '여유'],
        'adventure': ['모험', '스릴', '도전', '짜릿함'],
        'comfort': ['평온', '안정', '감성적', '아름다움']
    };

    // 기존 선택 해제
    selectedEmotions = [];
    updateSelectedEmotionsDisplay();
    updateCategoryButtonBadges();

    // 새로운 감정들 선택
    if (emotionSets[type]) {
        emotionSets[type].forEach(emotion => {
            addEmotionTag(emotion, 'preset');
        });
    }

    // 모달 닫기
    closeHelpModal();
}

// 전체 카테고리의 감정 개수 가져오기
function getAllEmotionCounts() {
    const counts = {};
    
    Object.keys(categoryEmotions).forEach(category => {
        const categoryEmotionTexts = categoryEmotions[category].map(e => e.text);
        const selectedCount = selectedEmotions.filter(emotion => 
            categoryEmotionTexts.includes(emotion.text)
        ).length;
        counts[category] = selectedCount;
    });
    
    return counts;
}

// 감정 통계 정보
function getEmotionStats() {
    const counts = getAllEmotionCounts();
    const total = selectedEmotions.length;
    const custom = selectedEmotions.filter(e => e.type === 'custom').length;
    
    return {
        total: total,
        preset: total - custom,
        custom: custom,
        byCategory: counts
    };
}

// 키보드 단축키 지원
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter: 다음 버튼 클릭
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const nextButton = document.getElementById('nextButton');
        if (nextButton) {
            nextButton.click();
        }
    }
    
    // 숫자키 1-6: 각 카테고리 버튼 클릭
    if (e.key >= '1' && e.key <= '6') {
        const categoryButtons = document.querySelectorAll('.category-btn');
        const index = parseInt(e.key) - 1;
        if (categoryButtons[index]) {
            categoryButtons[index].click();
        }
    }
});

// 카테고리 이름 매핑
const categoryNames = {
    'healing': '평온 & 힐링',
    'romance': '사랑 & 로맨스',
    'adventure': '모험 & 스릴',
    'freedom': '자유 & 해방',
    'joy': '기쁨 & 즐거움',
    'artistic': '감성 & 예술'
};

// 선택된 감정의 카테고리 분포 분석
function getCategoryDistribution() {
    const distribution = {};
    
    selectedEmotions.forEach(emotion => {
        for (const [category, emotions] of Object.entries(categoryEmotions)) {
            const emotionTexts = emotions.map(e => e.text);
            if (emotionTexts.includes(emotion.text)) {
                distribution[category] = (distribution[category] || 0) + 1;
                break;
            }
        }
    });
    
    return distribution;
}

// 감정 균형 체크
function checkEmotionBalance() {
    const distribution = getCategoryDistribution();
    const totalEmotions = selectedEmotions.length;
    
    if (totalEmotions === 0) return { balanced: true, message: '' };
    
    const maxCount = Math.max(...Object.values(distribution));
    const dominanceRatio = maxCount / totalEmotions;
    
    if (dominanceRatio > 0.7) {
        const dominantCategory = Object.keys(distribution).find(
            key => distribution[key] === maxCount
        );
        
        return {
            balanced: false,
            message: `${categoryNames[dominantCategory]} 감정이 많이 선택되었습니다. 다른 카테고리의 감정도 고려해보세요!`
        };
    }
    
    return { balanced: true, message: '감정이 균형있게 선택되었습니다!' };
}

// 추천 감정 시스템
function getRecommendedEmotions() {
    const currentCategories = Object.keys(getCategoryDistribution());
    const allCategories = Object.keys(categoryEmotions);
    const missingCategories = allCategories.filter(cat => !currentCategories.includes(cat));
    
    if (missingCategories.length === 0) return [];
    
    // 빈 카테고리에서 인기 감정 추천
    const recommendations = [];
    missingCategories.forEach(category => {
        const popularEmotions = categoryEmotions[category].slice(0, 2); // 상위 2개
        recommendations.push(...popularEmotions.map(e => ({
            ...e,
            category: category,
            categoryName: categoryNames[category]
        })));
    });
    
    return recommendations;
}

// 감정 태그 검색 기능 (전체 감정에서 검색)
function searchAllEmotions(searchTerm) {
    if (!searchTerm) return [];
    
    const results = [];
    
    Object.entries(categoryEmotions).forEach(([category, emotions]) => {
        emotions.forEach(emotion => {
            if (emotion.text.includes(searchTerm)) {
                results.push({
                    ...emotion,
                    category: category,
                    categoryName: categoryNames[category]
                });
            }
        });
    });
    
    return results;
}

// 감정 내보내기/가져오기
function exportSelectedEmotions() {
    const data = {
        emotions: selectedEmotions,
        stats: getEmotionStats(),
        timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `mood_trip_emotions_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 페이지 언로드 시 임시 저장
window.addEventListener('beforeunload', function() {
    if (selectedEmotions.length > 0) {
        localStorage.setItem('temp_selected_emotions', JSON.stringify(selectedEmotions));
    }
});

// 성능 최적화를 위한 디바운스 함수
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// 브라우저 호환성 체크
function checkBrowserCompatibility() {
    const features = {
        localStorage: typeof(Storage) !== "undefined",
        flexbox: CSS.supports('display', 'flex'),
        grid: CSS.supports('display', 'grid'),
        animations: CSS.supports('animation-name', 'test')
    };
    
    const unsupportedFeatures = Object.keys(features).filter(key => !features[key]);
    
    if (unsupportedFeatures.length > 0) {
        console.warn('일부 브라우저 기능이 지원되지 않습니다:', unsupportedFeatures);
        // 필요시 폴백 또는 경고 메시지 표시
    }
    
    return features;
}

// 디버그 정보 (개발용)
function getDebugInfo() {
    return {
        selectedEmotions: selectedEmotions,
        stats: getEmotionStats(),
        distribution: getCategoryDistribution(),
        balance: checkEmotionBalance(),
        recommendations: getRecommendedEmotions()
    };
}

// 감정 조합 검증 (선택사항)
function validateEmotionCombination() {
    const conflictingPairs = [
        ['행복', '슬픔'],
        ['차분함', '흥겨움'],
        ['편안함', '스릴']
    ];
    
    const selectedTexts = selectedEmotions.map(e => e.text);
    
    for (let pair of conflictingPairs) {
        if (selectedTexts.includes(pair[0]) && selectedTexts.includes(pair[1])) {
            return {
                valid: false,
                message: `"${pair[0]}"과 "${pair[1]}"는 상반된 감정입니다. 정말 함께 선택하시겠습니까?`
            };
        }
    }
    
    return { valid: true };
}

// 감정 태그 추천 시스템 (선택사항)
function recommendEmotions() {
    // 현재 선택된 감정에 따라 추천
    const recommendations = {
        '행복': ['즐거움', '설렘'],
        '슬픔': ['위로', '연대감'],
        '스트레스': ['편안함', '차분함'],
        '지침': ['힐링', '여유로움']
    };
    
    // 현재 선택된 감정들을 기반으로 추천
    const currentEmotions = selectedEmotions.map(e => e.text);
    const suggested = [];
    
    currentEmotions.forEach(emotion => {
        if (recommendations[emotion]) {
            recommendations[emotion].forEach(rec => {
                if (!currentEmotions.includes(rec) && !suggested.includes(rec)) {
                    suggested.push(rec);
                }
            });
        }
    });
    
    return suggested;
}
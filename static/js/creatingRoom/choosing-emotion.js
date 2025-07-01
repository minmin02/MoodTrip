// 선택된 감정들을 저장할 배열
let selectedEmotions = [];

// DOM 로드 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeEmotionTags();
    initializeCustomEmotionInput();
    restoreTemporaryEmotions(); // 임시 저장된 감정 복원
    initializeNextButton(); // 다음 버튼 초기화
});

// 감정 태그 초기화
function initializeEmotionTags() {
    const emotionCheckboxes = document.querySelectorAll('.emotion-checkbox');
    
    emotionCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const emotion = this.value;
            
            if (this.checked) {
                addEmotionTag(emotion, 'preset');
            } else {
                removeEmotionTag(emotion);
            }
        });
    });
}

// 커스텀 감정 입력 초기화
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
}

// 감정 태그 제거
function removeEmotionTag(emotion) {
    // 배열에서 제거
    selectedEmotions = selectedEmotions.filter(item => item.text !== emotion);
    
    // 체크박스도 해제 (preset 태그인 경우)
    const checkbox = document.querySelector(`input[value="${emotion}"]`);
    if (checkbox) {
        checkbox.checked = false;
    }
    
    // UI 업데이트
    updateSelectedEmotionsDisplay();
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
    });
    
    tag.appendChild(removeBtn);
    
    return tag;
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

// 임시 저장 함수 (기존 exitWithSubmit 함수 대체/보완)
function exitWithSubmit(formId, canSubmit) {
    // 현재 선택된 감정들을 로컬 스토리지에 저장 (임시 저장용)
    if (selectedEmotions.length > 0) {
        localStorage.setItem('temp_selected_emotions', JSON.stringify(selectedEmotions));
    }
    
    // 기존 로직 실행 (있다면)
    console.log('임시 저장:', selectedEmotions);
}

// 페이지 로드 시 임시 저장된 감정들 복원
function restoreTemporaryEmotions() {
    const tempEmotions = localStorage.getItem('temp_selected_emotions');
    if (tempEmotions) {
        try {
            const emotions = JSON.parse(tempEmotions);
            emotions.forEach(emotion => {
                addEmotionTag(emotion.text, emotion.type);
                
                // preset 태그인 경우 체크박스도 체크
                if (emotion.type === 'preset') {
                    const checkbox = document.querySelector(`input[value="${emotion.text}"]`);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                }
            });
            
            // 임시 저장 데이터 삭제
            localStorage.removeItem('temp_selected_emotions');
        } catch (e) {
            console.error('임시 저장된 감정 데이터 복원 실패:', e);
        }
    }
}

// 다음 버튼 초기화
function initializeNextButton() {
    const nextButton = document.getElementById('nextButton');
    if (nextButton) {
        nextButton.addEventListener('click', function(e) {
            e.preventDefault(); // 기본 폼 제출 방지
            
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
    // 로컬 스토리지에 선택된 감정들 저장
    localStorage.setItem('selected_emotions_step2', JSON.stringify(selectedEmotions));
    
    // 세션 스토리지에도 백업 저장
    sessionStorage.setItem('selected_emotions_step2', JSON.stringify(selectedEmotions));
    
    console.log('다음 페이지로 전달할 감정 데이터 저장 완료:', selectedEmotions);
}

// 다음 페이지로 이동
function goToNextPage() {
    // 실제 다음 페이지 URL로 변경해주세요
    window.location.href = "/templates/creatingRoom/choosing-tour.html"; 
}

// 다른 페이지에서 저장된 감정 데이터 불러오기 (다음 페이지에서 사용)
function getSelectedEmotionsFromPreviousPage() {
    try {
        // 로컬 스토리지에서 먼저 시도
        let emotions = localStorage.getItem('selected_emotions_step2');
        if (emotions) {
            return JSON.parse(emotions);
        }
        
        // 세션 스토리지에서 백업 데이터 시도
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

// 감정 데이터 정리 (최종 제출 시 호출)
function clearEmotionData() {
    localStorage.removeItem('selected_emotions_step2');
    sessionStorage.removeItem('selected_emotions_step2');
    localStorage.removeItem('temp_selected_emotions');
}

// 도움말 모달 열기
function openHelpModal() {
    const modal = document.getElementById('helpModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
}

// 도움말 모달 닫기
function closeHelpModal() {
    const modal = document.getElementById('helpModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // 배경 스크롤 복원
}

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeHelpModal();
    }
});

// 빠른 선택 기능
function selectQuickEmotions(type) {
    const emotionSets = {
        'positive': ['행복', '즐거움', '설렘', '자신감'],
        'healing': ['편안함', '차분함', '감동'],
        'adventure': ['설렘', '자신감', '놀람'],
        'comfort': ['연대감', '편안함', '감동']
    };

    // 기존 선택 해제
    document.querySelectorAll('.emotion-checkbox:checked').forEach(checkbox => {
        checkbox.checked = false;
        removeEmotionTag(checkbox.value);
    });

    // 선택된 감정들 배열 초기화
    selectedEmotions = [];

    // 새로운 감정들 선택
    if (emotionSets[type]) {
        emotionSets[type].forEach(emotion => {
            const checkbox = document.querySelector(`input[value="${emotion}"]`);
            if (checkbox) {
                checkbox.checked = true;
                addEmotionTag(emotion, 'preset');
            }
        });
    }

    // UI 업데이트
    updateSelectedEmotionsDisplay();
    
    // 모달 닫기
    closeHelpModal();
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

// 입력 도우미 기능 (선택사항)
function initializeInputHelper() {
    const customInput = document.getElementById('customEmotionInput');
    
    // 인기 키워드 제안
    const popularKeywords = [
        '여유로움', '자유로움', '모험심', '호기심', 
        '성취감', '만족감', '기대감', '설레임'
    ];
    
    customInput.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        if (value.length > 1) {
            const suggestions = popularKeywords.filter(keyword => 
                keyword.toLowerCase().includes(value)
            );
            
            // 여기에 자동완성 UI를 추가할 수 있습니다
            console.log('추천 키워드:', suggestions);
        }
    });
}

// 감정 통계 (선택사항)
function getEmotionStats() {
    const stats = {
        total: selectedEmotions.length,
        positive: selectedEmotions.filter(e => 
            ['행복', '즐거움', '설렘', '자신감'].includes(e.text)
        ).length,
        healing: selectedEmotions.filter(e => 
            ['편안함', '차분함', '감동'].includes(e.text)
        ).length,
        custom: selectedEmotions.filter(e => e.type === 'custom').length
    };
    
    return stats;
}

// 감정 조합 검증 (선택사항)
function validateEmotionCombination() {
    const conflictingPairs = [
        ['행복', '슬픔'],
        ['차분함', '흥분'],
        ['편안함', '스트레스']
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
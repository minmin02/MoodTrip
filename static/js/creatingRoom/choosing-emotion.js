// 선택된 감정들을 저장할 배열
let selectedEmotions = [];

// DOM 로드 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeEmotionTags();
    initializeCustomEmotionInput();
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
    
    return true;
}

// 임시 저장 함수 (기존 exitWithSubmit 함수 대체/보완)
function exitWithSubmit(formId, canSubmit) {
    // 현재 선택된 감정들을 로컬 스토리지에 저장 (임시 저장용)
    if (selectedEmotions.length > 0) {
        localStorage.setItem('temp_selected_emotions', JSON.stringify(selectedEmotions));
    }
    
    // 기존 로직 실행 (있다면)
    // 여기에 기존의 임시 저장 로직을 추가할 수 있습니다
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
            console.error('임시 저장된 감정 데이터')
        }
    }
}
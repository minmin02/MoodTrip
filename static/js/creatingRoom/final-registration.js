// 최종 방 생성 데이터를 저장할 객체
let finalRoomData = {};

// DOM 로드 후 실행
document.addEventListener('DOMContentLoaded', function() {
    loadAllPreviousData();
    initializeInputFields();
    initializeCharacterCount();
    initializeSubmitButton();
});

// 이전 단계들의 모든 데이터 불러오기
function loadAllPreviousData() {
    try {
        // 통합 데이터 먼저 시도
        let roomCreationData = localStorage.getItem('room_creation_data');
        if (roomCreationData) {
            finalRoomData = JSON.parse(roomCreationData);
        } else {
            // 개별 데이터 수집
            finalRoomData = {
                emotions: getEmotionsData(),
                destination: getDestinationData(),
                schedule: getScheduleData(),
                people: getPeopleData(),
                roomName: getRoomNameData(),
                roomIntro: getRoomIntroData()
            };
        }
        
        console.log('불러온 최종 데이터:', finalRoomData);
        
        // UI에 데이터 표시
        displayAllData();
        
    } catch (error) {
        console.error('이전 데이터 불러오기 실패:', error);
        showErrorMessage('이전 단계의 데이터를 불러오는데 실패했습니다. 처음부터 다시 시작해주세요.');
    }
}

// 개별 데이터 불러오기 함수들
function getEmotionsData() {
    try {
        let emotions = localStorage.getItem('selected_emotions_step2');
        if (emotions) return JSON.parse(emotions);
        
        emotions = sessionStorage.getItem('selected_emotions_step2');
        if (emotions) return JSON.parse(emotions);
        
        return [];
    } catch (e) {
        return [];
    }
}

function getDestinationData() {
    try {
        let destination = localStorage.getItem('selected_destination_step3');
        if (destination) return JSON.parse(destination);
        
        destination = sessionStorage.getItem('selected_destination_step3');
        if (destination) return JSON.parse(destination);
        
        return null;
    } catch (e) {
        return null;
    }
}

function getScheduleData() {
    try {
        let schedule = localStorage.getItem('selected_schedule_step4');
        if (schedule) return JSON.parse(schedule);
        
        schedule = sessionStorage.getItem('selected_schedule_step4');
        if (schedule) return JSON.parse(schedule);
        
        return null;
    } catch (e) {
        return null;
    }
}

function getPeopleData() {
    return localStorage.getItem('selected_people') || '2명';
}

function getRoomNameData() {
    return localStorage.getItem('room_name') || '';
}

function getRoomIntroData() {
    return localStorage.getItem('room_intro') || '';
}

// 모든 데이터를 UI에 표시
function displayAllData() {
    displayPeopleInfo();
    displayRoomNameAndIntro();
    displayEmotionTags();
    displayDestination();
    displaySchedule();
}

// 인원 정보 표시
function displayPeopleInfo() {
    const peopleText = document.getElementById('peopleText');
    const peopleIcon = document.getElementById('peopleIcon');
    
    const people = finalRoomData.people || getPeopleData();
    
    if (peopleText) {
        peopleText.textContent = people;
    }
    
    // 인원에 따라 아이콘 변경
    if (peopleIcon) {
        const iconImg = peopleIcon.querySelector('img');
        if (people === '4명') {
            iconImg.src = '/static/image/creatingRoom/fourpeople.svg';
            iconImg.alt = '4명';
        } else {
            iconImg.src = '/static/image/creatingRoom/twopeople.svg';
            iconImg.alt = '2명';
        }
    }
}

// 방 이름과 소개 표시
function displayRoomNameAndIntro() {
    const roomNameInput = document.getElementById('roomNameInput');
    const roomIntroTextarea = document.getElementById('roomIntroTextarea');
    
    if (roomNameInput) {
        roomNameInput.value = finalRoomData.roomName || getRoomNameData();
        updateCharCount('roomNameInput', 'currentLength', 30);
    }
    
    if (roomIntroTextarea) {
        roomIntroTextarea.value = finalRoomData.roomIntro || getRoomIntroData();
        updateCharCount('roomIntroTextarea', 'introCurrentLength', 200);
    }
}

// 감정 태그 표시
function displayEmotionTags() {
    const emotionsList = document.getElementById('selectedEmotionsList');
    
    if (!emotionsList) return;
    
    const emotions = finalRoomData.emotions || getEmotionsData();
    
    if (!emotions || emotions.length === 0) {
        emotionsList.innerHTML = '<p style="color: #bdbdbd; text-align: center; padding: 20px;">선택된 감정 태그가 없습니다.</p>';
        return;
    }
    
    emotionsList.innerHTML = emotions.map(emotion => {
        const emotionText = typeof emotion === 'string' ? emotion : emotion.text;
        const emotionType = typeof emotion === 'object' ? emotion.type : 'preset';
        
        return `<span class="emotion-tag ${emotionType}">${emotionText}</span>`;
    }).join('');
}

// 관광지 정보 표시
function displayDestination() {
    const destinationDisplay = document.getElementById('destinationCardDisplay');
    
    if (!destinationDisplay) return;
    
    const destination = finalRoomData.destination || getDestinationData();
    
    if (!destination) {
        destinationDisplay.innerHTML = '<p style="color: #bdbdbd; text-align: center; padding: 20px;">선택된 관광지가 없습니다.</p>';
        return;
    }
    
    destinationDisplay.innerHTML = `
        <div class="destination-card">
            <div class="destination-image">
                <img src="${destination.image || '/static/image/creatingRoom/default-destination.png'}" alt="${destination.name}">
            </div>
            <div class="destination-details">
                <div class="destination-category">${destination.category || '관광지'}</div>
                <div class="destination-name">${destination.name}</div>
                <div class="destination-description">${destination.description || '설명이 없습니다.'}</div>
            </div>
        </div>
    `;
}

// 일정 정보 표시
function displaySchedule() {
    const scheduleDisplay = document.getElementById('scheduleDisplay');
    
    if (!scheduleDisplay) return;
    
    const schedule = finalRoomData.schedule || getScheduleData();
    
    if (!schedule || !schedule.dateRanges || schedule.dateRanges.length === 0) {
        scheduleDisplay.innerHTML = '<p style="color: #bdbdbd; text-align: center; padding: 20px;">선택된 일정이 없습니다.</p>';
        return;
    }
    
    const rangesHTML = schedule.dateRanges.map((range, index) => {
        const startDate = range.startDateFormatted || formatDate(new Date(range.startDate));
        const endDate = range.endDateFormatted || formatDate(new Date(range.endDate));
        const dateText = startDate === endDate ? startDate : `${startDate} ~ ${endDate}`;
        
        return `
            <div class="schedule-range-item">
                <span class="schedule-icon">📅</span>
                <span class="schedule-date-text">${dateText}</span>
            </div>
        `;
    }).join('');
    
    scheduleDisplay.innerHTML = `
        <div class="schedule-ranges">
            ${rangesHTML}
        </div>
        <div class="schedule-summary">
            총 ${schedule.rangeCount || schedule.dateRanges.length}개 구간, ${schedule.totalDays || calculateTotalDays(schedule.dateRanges)}일
        </div>
    `;
}

// 입력 필드 초기화
function initializeInputFields() {
    const roomNameInput = document.getElementById('roomNameInput');
    const roomIntroTextarea = document.getElementById('roomIntroTextarea');
    
    // 실시간 데이터 업데이트
    if (roomNameInput) {
        roomNameInput.addEventListener('input', function() {
            finalRoomData.roomName = this.value.trim();
            updateCharCount('roomNameInput', 'currentLength', 30);
        });
        
        roomNameInput.addEventListener('blur', function() {
            localStorage.setItem('room_name', this.value.trim());
        });
    }
    
    if (roomIntroTextarea) {
        roomIntroTextarea.addEventListener('input', function() {
            finalRoomData.roomIntro = this.value.trim();
            updateCharCount('roomIntroTextarea', 'introCurrentLength', 200);
        });
        
        roomIntroTextarea.addEventListener('blur', function() {
            localStorage.setItem('room_intro', this.value.trim());
        });
    }
}

// 글자 수 카운트 초기화
function initializeCharacterCount() {
    updateCharCount('roomNameInput', 'currentLength', 30);
    updateCharCount('roomIntroTextarea', 'introCurrentLength', 200);
}

// 글자 수 업데이트
function updateCharCount(inputId, countId, maxLength) {
    const input = document.getElementById(inputId);
    const counter = document.getElementById(countId);
    
    if (input && counter) {
        const currentLength = input.value.length;
        counter.textContent = currentLength;
        
        // 글자 수에 따른 색상 변경
        const countElement = counter.closest('.char-count');
        if (currentLength > maxLength * 0.9) {
            countElement.style.color = '#f44336';
        } else if (currentLength > maxLength * 0.7) {
            countElement.style.color = '#ff9800';
        } else {
            countElement.style.color = '#616161';
        }
    }
}

// 제출 버튼 초기화
function initializeSubmitButton() {
    const submitButton = document.getElementById('submitButton');
    
    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            e.preventDefault();
            submitRoom();
        });
    }
}

// 방 등록 제출
function submitRoom() {
    // 유효성 검사
    if (!validateFinalData()) {
        return;
    }
    
    // 제출 중 상태로 변경
    setSubmitButtonLoading(true);
    
    // 최종 데이터 준비
    const submitData = prepareFinalSubmitData();
    
    console.log('제출할 최종 데이터:', submitData);
    
    // 실제 서버 제출 (시뮬레이션)
    simulateServerSubmission(submitData)
        .then(response => {
            console.log('서버 응답:', response);
            showSuccessModal();
            clearAllStoredData();
        })
        .catch(error => {
            console.error('제출 실패:', error);
            showErrorMessage('방 등록에 실패했습니다. 다시 시도해주세요.');
        })
        .finally(() => {
            setSubmitButtonLoading(false);
        });
}

// 최종 데이터 유효성 검사
function validateFinalData() {
    const roomName = document.getElementById('roomNameInput').value.trim();
    const roomIntro = document.getElementById('roomIntroTextarea').value.trim();
    
    if (!roomName) {
        alert('방 이름을 입력해주세요.');
        document.getElementById('roomNameInput').focus();
        return false;
    }
    
    if (roomName.length < 2) {
        alert('방 이름은 2자 이상 입력해주세요.');
        document.getElementById('roomNameInput').focus();
        return false;
    }
    
    if (!roomIntro) {
        alert('방 소개를 입력해주세요.');
        document.getElementById('roomIntroTextarea').focus();
        return false;
    }
    
    if (roomIntro.length < 10) {
        alert('방 소개는 10자 이상 입력해주세요.');
        document.getElementById('roomIntroTextarea').focus();
        return false;
    }
    
    // 이전 단계 데이터 확인
    if (!finalRoomData.emotions || finalRoomData.emotions.length === 0) {
        alert('감정 태그가 선택되지 않았습니다. 이전 단계로 돌아가서 선택해주세요.');
        return false;
    }
    
    if (!finalRoomData.destination) {
        alert('여행지가 선택되지 않았습니다. 이전 단계로 돌아가서 선택해주세요.');
        return false;
    }
    
    if (!finalRoomData.schedule || !finalRoomData.schedule.dateRanges || finalRoomData.schedule.dateRanges.length === 0) {
        alert('일정이 선택되지 않았습니다. 이전 단계로 돌아가서 선택해주세요.');
        return false;
    }
    
    return true;
}

// 최종 제출 데이터 준비
function prepareFinalSubmitData() {
    const roomName = document.getElementById('roomNameInput').value.trim();
    const roomIntro = document.getElementById('roomIntroTextarea').value.trim();
    
    const submitData = {
        ...finalRoomData,
        roomName: roomName,
        roomIntro: roomIntro,
        submittedAt: new Date().toISOString(),
        version: '1.0'
    };
    
    // 최종 데이터 저장
    localStorage.setItem('final_room_submission', JSON.stringify(submitData));
    
    return submitData;
}

// 서버 제출 시뮬레이션
function simulateServerSubmission(data) {
    return new Promise((resolve, reject) => {
        // 2초 지연으로 서버 제출 시뮬레이션
        setTimeout(() => {
            // 90% 확률로 성공
            if (Math.random() > 0.1) {
                resolve({
                    success: true,
                    roomId: 'room_' + Date.now(),
                    message: '방이 성공적으로 등록되었습니다!'
                });
            } else {
                reject(new Error('서버 오류가 발생했습니다.'));
            }
        }, 2000);
    });
}

// 제출 버튼 로딩 상태 변경
function setSubmitButtonLoading(isLoading) {
    const submitButton = document.getElementById('submitButton');
    
    if (submitButton) {
        if (isLoading) {
            submitButton.classList.add('loading');
            submitButton.disabled = true;
        } else {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    }
}

// 성공 모달 표시
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// 에러 메시지 표시
function showErrorMessage(message) {
    alert(message); // 실제로는 더 예쁜 토스트나 모달을 사용
}

// 수정하기 버튼
function editRoom() {
    if (confirm('이전 단계로 돌아가서 수정하시겠습니까?\n현재 입력한 방 이름과 소개는 저장됩니다.')) {
        // 현재 입력 내용 저장
        const roomName = document.getElementById('roomNameInput').value.trim();
        const roomIntro = document.getElementById('roomIntroTextarea').value.trim();
        
        if (roomName) localStorage.setItem('room_name', roomName);
        if (roomIntro) localStorage.setItem('room_intro', roomIntro);
        
        // 이전 단계로 이동
        window.location.href = '/templates/creatingRoom/choosing-schedule.html';
    }
}

// 이전 페이지로 돌아가기
function goToPreviousPage() {
    // 현재 입력 내용 임시 저장
    const roomName = document.getElementById('roomNameInput').value.trim();
    const roomIntro = document.getElementById('roomIntroTextarea').value.trim();
    
    if (roomName) localStorage.setItem('temp_room_name', roomName);
    if (roomIntro) localStorage.setItem('temp_room_intro', roomIntro);
    
    // 이전 페이지로 이동
    window.location.href = '/templates/creatingRoom/choosing-schedule.html';
}

// 내 방 보기로 이동
function goToMyRooms() {
    window.location.href = '/my-rooms'; // 실제 내 방 목록 페이지로 이동
}

// 새 방 만들기
function createNewRoom() {
    if (confirm('새로운 방을 만드시겠습니까?')) {
        clearAllStoredData();
        window.location.href = '/templates/creatingRoom/creating-room-detail.html';
    }
}

// 모든 저장된 데이터 정리
function clearAllStoredData() {
    // 각 단계별 데이터 삭제
    const keysToRemove = [
        'selected_people',
        'room_name',
        'room_intro',
        'selected_emotions_step2',
        'selected_destination_step3',
        'selected_schedule_step4',
        'room_creation_data',
        'final_room_submission',
        'temp_room_name',
        'temp_room_intro',
        'temp_selected_emotions',
        'temp_selected_destination',
        'temp_selected_schedule'
    ];
    
    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
    });
    
    console.log('모든 저장된 데이터가 정리되었습니다.');
}

// 도움말 모달 열기
function openHelpModal() {
    const modal = document.getElementById('helpModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// 도움말 모달 닫기
function closeHelpModal() {
    const modal = document.getElementById('helpModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeHelpModal();
    }
});

// 유틸리티 함수들

// 날짜 포맷팅
function formatDate(date) {
    if (!date) return '';
    
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}.${month}.${day}`;
}

// 총 일수 계산
function calculateTotalDays(dateRanges) {
    if (!dateRanges || dateRanges.length === 0) return 0;
    
    return dateRanges.reduce((total, range) => {
        const startDate = new Date(range.startDate);
        const endDate = new Date(range.endDate);
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        return total + days;
    }, 0);
}

// 페이지 떠날 때 데이터 저장
window.addEventListener('beforeunload', function() {
    const roomNameInput = document.getElementById('roomNameInput');
    const roomIntroTextarea = document.getElementById('roomIntroTextarea');
    
    if (roomNameInput && roomNameInput.value.trim()) {
        localStorage.setItem('temp_room_name', roomNameInput.value.trim());
    }
    
    if (roomIntroTextarea && roomIntroTextarea.value.trim()) {
        localStorage.setItem('temp_room_intro', roomIntroTextarea.value.trim());
    }
});

// 페이지 로드 시 임시 저장된 데이터 복원
function restoreTemporaryData() {
    const tempRoomName = localStorage.getItem('temp_room_name');
    const tempRoomIntro = localStorage.getItem('temp_room_intro');
    
    const roomNameInput = document.getElementById('roomNameInput');
    const roomIntroTextarea = document.getElementById('roomIntroTextarea');
    
    if (tempRoomName && roomNameInput && !roomNameInput.value) {
        roomNameInput.value = tempRoomName;
        finalRoomData.roomName = tempRoomName;
        updateCharCount('roomNameInput', 'currentLength', 30);
        localStorage.removeItem('temp_room_name');
    }
    
    if (tempRoomIntro && roomIntroTextarea && !roomIntroTextarea.value) {
        roomIntroTextarea.value = tempRoomIntro;
        finalRoomData.roomIntro = tempRoomIntro;
        updateCharCount('roomIntroTextarea', 'introCurrentLength', 200);
        localStorage.removeItem('temp_room_intro');
    }
}

// 입력 필드 유효성 검사 실시간 피드백
function initializeRealTimeValidation() {
    const roomNameInput = document.getElementById('roomNameInput');
    const roomIntroTextarea = document.getElementById('roomIntroTextarea');
    
    if (roomNameInput) {
        roomNameInput.addEventListener('input', function() {
            validateRoomNameRealTime(this);
        });
        
        roomNameInput.addEventListener('blur', function() {
            validateRoomNameFinal(this);
        });
    }
    
    if (roomIntroTextarea) {
        roomIntroTextarea.addEventListener('input', function() {
            validateRoomIntroRealTime(this);
        });
        
        roomIntroTextarea.addEventListener('blur', function() {
            validateRoomIntroFinal(this);
        });
    }
}

// 방 이름 실시간 유효성 검사
function validateRoomNameRealTime(input) {
    const value = input.value;
    const length = value.length;
    
    // 글자 수에 따른 시각적 피드백
    if (length === 0) {
        input.style.borderColor = '#e0e0e0';
    } else if (length < 2) {
        input.style.borderColor = '#ffa726'; // 주황색 - 더 입력 필요
    } else if (length >= 2 && length <= 25) {
        input.style.borderColor = '#66bb6a'; // 초록색 - 적절
    } else if (length > 25) {
        input.style.borderColor = '#ef5350'; // 빨간색 - 너무 길음
    }
}

// 방 이름 최종 유효성 검사
function validateRoomNameFinal(input) {
    const value = input.value.trim();
    
    if (value.length === 0) {
        input.style.borderColor = '#ef5350';
        return false;
    } else if (value.length < 2) {
        input.style.borderColor = '#ef5350';
        return false;
    } else {
        input.style.borderColor = '#66bb6a';
        return true;
    }
}

// 방 소개 실시간 유효성 검사
function validateRoomIntroRealTime(textarea) {
    const value = textarea.value;
    const length = value.length;
    
    // 글자 수에 따른 시각적 피드백
    if (length === 0) {
        textarea.style.borderColor = '#e0e0e0';
    } else if (length < 10) {
        textarea.style.borderColor = '#ffa726'; // 주황색 - 더 입력 필요
    } else if (length >= 10 && length <= 180) {
        textarea.style.borderColor = '#66bb6a'; // 초록색 - 적절
    } else if (length > 180) {
        textarea.style.borderColor = '#ef5350'; // 빨간색 - 너무 길음
    }
}

// 방 소개 최종 유효성 검사
function validateRoomIntroFinal(textarea) {
    const value = textarea.value.trim();
    
    if (value.length === 0) {
        textarea.style.borderColor = '#ef5350';
        return false;
    } else if (value.length < 10) {
        textarea.style.borderColor = '#ef5350';
        return false;
    } else {
        textarea.style.borderColor = '#66bb6a';
        return true;
    }
}

// 데이터 무결성 검사
function validateDataIntegrity() {
    const issues = [];
    
    if (!finalRoomData.emotions || finalRoomData.emotions.length === 0) {
        issues.push('감정 태그 데이터가 없습니다.');
    }
    
    if (!finalRoomData.destination) {
        issues.push('여행지 데이터가 없습니다.');
    }
    
    if (!finalRoomData.schedule || !finalRoomData.schedule.dateRanges || finalRoomData.schedule.dateRanges.length === 0) {
        issues.push('일정 데이터가 없습니다.');
    }
    
    if (issues.length > 0) {
        console.warn('데이터 무결성 문제:', issues);
        return false;
    }
    
    return true;
}

// 추천 텍스트 자동 완성 (선택사항)
function initializeTextSuggestions() {
    const roomNameInput = document.getElementById('roomNameInput');
    const roomIntroTextarea = document.getElementById('roomIntroTextarea');
    
    // 감정과 여행지에 기반한 추천 방 이름
    const suggestedNames = generateSuggestedRoomNames();
    const suggestedIntros = generateSuggestedRoomIntros();
    
    // 실제로는 datalist나 자동완성 UI를 구현할 수 있음
    console.log('추천 방 이름:', suggestedNames);
    console.log('추천 방 소개:', suggestedIntros);
}

// 추천 방 이름 생성
function generateSuggestedRoomNames() {
    const emotions = finalRoomData.emotions || [];
    const destination = finalRoomData.destination;
    
    const suggestions = [];
    
    if (destination) {
        const destName = destination.name.split(' ')[0]; // 첫 단어만 사용
        
        emotions.forEach(emotion => {
            const emotionText = typeof emotion === 'string' ? emotion : emotion.text;
            suggestions.push(`${destName}에서 ${emotionText}하기`);
            suggestions.push(`${emotionText}한 ${destName} 여행`);
        });
        
        suggestions.push(`${destName} 동행 구해요`);
        suggestions.push(`함께 가요 ${destName}`);
    }
    
    return suggestions.slice(0, 5); // 최대 5개
}

// 추천 방 소개 생성
function generateSuggestedRoomIntros() {
    const emotions = finalRoomData.emotions || [];
    const destination = finalRoomData.destination;
    const schedule = finalRoomData.schedule;
    
    const suggestions = [];
    
    if (destination && emotions.length > 0) {
        const mainEmotion = emotions[0];
        const emotionText = typeof mainEmotion === 'string' ? mainEmotion : mainEmotion.text;
        
        suggestions.push(
            `${destination.name}에서 ${emotionText}한 시간을 보내고 싶어요! 함께 여행할 동행자를 찾고 있습니다. 새로운 추억을 만들어봐요! 😊`
        );
        
        if (schedule && schedule.totalDays) {
            suggestions.push(
                `${schedule.totalDays}일간 ${destination.name}에서 ${emotionText}한 여행을 계획하고 있어요. 같이 즐거운 시간 보낼 분들 환영합니다!`
            );
        }
    }
    
    return suggestions;
}

// DOM 로드 완료 후 추가 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 기존 초기화 함수들 실행 후
    setTimeout(() => {
        restoreTemporaryData();
        initializeRealTimeValidation();
        initializeTextSuggestions();
        
        // 데이터 무결성 검사
        if (!validateDataIntegrity()) {
            console.warn('일부 데이터가 누락되었습니다. 사용자에게 알림을 표시해야 할 수 있습니다.');
        }
    }, 100);
});
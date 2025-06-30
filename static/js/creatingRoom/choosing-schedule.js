// 현재 날짜 기준 3개월 표시 초기화
function initializeCurrentMonthView() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // 0부터 시작하므로 +1
    const currentYear = currentDate.getFullYear();
    
    // 현재 월부터 3개월 계산 (예: 현재가 7월이면 7,8,9월)
    const months = [];
    for (let i = 0; i < 3; i++) {
        const targetMonth = currentMonth + i;
        const targetYear = currentYear + Math.floor((targetMonth - 1) / 12);
        const adjustedMonth = ((targetMonth - 1) % 12) + 1;
        
        months.push({
            year: targetYear,
            month: adjustedMonth,
            monthValue: `${targetYear}-${String(adjustedMonth).padStart(2, '0')}`
        });
    }
    
    // 드롭다운 옵션 업데이트
    updateMonthSelectOptions(months);
    
    // 달력 그리드 업데이트
    updateCalendarGrid(months);
}

// 월 선택 드롭다운 옵션 업데이트
function updateMonthSelectOptions(months) {
    const monthSelect = document.getElementById('monthSelect');
    const monthNames = [
        '', '1월', '2월', '3월', '4월', '5월', '6월',
        '7월', '8월', '9월', '10월', '11월', '12월'
    ];
    
    // 기본 옵션은 유지하고 현재 월 기준으로 추가
    let optionsHTML = '<option value="">3개월 보기</option>';
    
    // 현재 월부터 6개월 정도 옵션 추가
    for (let i = 0; i < 6; i++) {
        const targetMonth = months[0].month + i;
        const targetYear = months[0].year + Math.floor((targetMonth - 1) / 12);
        const adjustedMonth = ((targetMonth - 1) % 12) + 1;
        const monthValue = `${targetYear}-${String(adjustedMonth).padStart(2, '0')}`;
        
        optionsHTML += `<option value="${monthValue}">${targetYear}년 ${monthNames[adjustedMonth]}</option>`;
    }
    
    monthSelect.innerHTML = optionsHTML;
}

// 달력 그리드 업데이트 (현재 날짜 기준 3개월)
function updateCalendarGrid(months) {
    const calendarGrid = document.getElementById('calendarGrid');
    let gridHTML = '';
    
    months.forEach(monthInfo => {
        gridHTML += generateMonthCalendarHTML(monthInfo);
    });
    
    calendarGrid.innerHTML = gridHTML;
}

// 월별 달력 HTML 생성
function generateMonthCalendarHTML(monthInfo) {
    const { year, month, monthValue } = monthInfo;
    const monthNames = [
        '', '1월', '2월', '3월', '4월', '5월', '6월',
        '7월', '8월', '9월', '10월', '11월', '12월'
    ];
    
    // 해당 월의 정보 계산
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // 이전 달 마지막 날들
    const prevMonth = new Date(year, month - 2, 0);
    const prevMonthDays = prevMonth.getDate();
    
    let calendarHTML = `
        <div class="calendar-month" data-month="${monthValue}">
            <div class="calendar-header">${monthNames[month]}</div>
            <div class="calendar-weekdays">
                <div class="weekday">일</div>
                <div class="weekday">월</div>
                <div class="weekday">화</div>
                <div class="weekday">수</div>
                <div class="weekday">목</div>
                <div class="weekday">금</div>
                <div class="weekday">토</div>
            </div>
            <div class="calendar-days">
    `;
    
    // 이전 달 날짜들 (회색)
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        calendarHTML += `<div class="day prev-month">${prevMonthDays - i}</div>`;
    }
    
    // 현재 달 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
        calendarHTML += `<div class="day">${day}</div>`;
    }
    
    // 다음 달 날짜들 (회색) - 총 42칸(6주)이 되도록
    const totalCells = 42;
    const usedCells = startingDayOfWeek + daysInMonth;
    const remainingCells = totalCells - usedCells;
    
    for (let day = 1; day <= remainingCells; day++) {
        calendarHTML += `<div class="day next-month">${day}</div>`;
    }
    
    calendarHTML += `
            </div>
        </div>
    `;
    
    return calendarHTML;
}// 선택된 날짜 범위를 저장할 변수
let selectedStartDate = null;
let selectedEndDate = null;
let previousData = {};

// DOM 로드 후 실행
document.addEventListener('DOMContentLoaded', function() {
    loadPreviousData();
    initializeCurrentMonthView(); // 현재 날짜 기준 3개월 표시
    initializeDateSelection();
    initializeMonthSelector();
    initializeNextButton();
    initializeBackButton();
    
    // 기본 날짜 범위 설정 제거 - 사용자가 직접 선택하도록
    // setDefaultDateRange();
});

// 이전 페이지들에서 선택된 데이터 불러오기
function loadPreviousData() {
    try {
        // 전체 방 생성 데이터 불러오기
        let roomData = localStorage.getItem('room_creation_data');
        if (roomData) {
            previousData = JSON.parse(roomData);
            console.log('이전 단계 데이터:', previousData);
            return;
        }
        
        // 개별 데이터 불러오기
        const emotions = localStorage.getItem('selected_emotions_step2');
        const destination = localStorage.getItem('selected_destination_step3');
        
        if (emotions) previousData.emotions = JSON.parse(emotions);
        if (destination) previousData.destination = JSON.parse(destination);
        
        console.log('이전 단계 데이터 (개별):', previousData);
    } catch (e) {
        console.error('이전 데이터 불러오기 실패:', e);
    }
}

// 날짜 선택 초기화
function initializeDateSelection() {
    const days = document.querySelectorAll('.day:not(.prev-month):not(.next-month)');
    
    days.forEach(day => {
        day.addEventListener('click', function() {
            const dayNumber = parseInt(this.textContent);
            const monthElement = this.closest('.calendar-month');
            const monthValue = monthElement.getAttribute('data-month');
            const [year, month] = monthValue.split('-');
            
            const clickedDate = new Date(year, month - 1, dayNumber);
            
            handleDateSelection(clickedDate, this);
        });
    });
}

// 날짜 선택 처리
function handleDateSelection(clickedDate, dayElement) {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
        // 새로운 선택 시작
        clearDateSelection();
        selectedStartDate = clickedDate;
        selectedEndDate = null;
        dayElement.classList.add('range-start', 'selected');
    } else if (selectedStartDate && !selectedEndDate) {
        // 종료 날짜 선택
        if (clickedDate < selectedStartDate) {
            // 시작일보다 이른 날짜를 선택한 경우 시작일로 설정
            clearDateSelection();
            selectedStartDate = clickedDate;
            selectedEndDate = null;
            dayElement.classList.add('range-start', 'selected');
        } else {
            // 정상적인 종료일 선택
            selectedEndDate = clickedDate;
            dayElement.classList.add('range-end', 'selected');
            
            // 범위 표시
            highlightDateRange();
        }
    }
    
    updateSelectedDateDisplay();
}

// 날짜 선택 초기화
function clearDateSelection() {
    const allDays = document.querySelectorAll('.day');
    allDays.forEach(day => {
        day.classList.remove('selected', 'in-range', 'range-start', 'range-end');
    });
}

// 날짜 범위 하이라이트
function highlightDateRange() {
    if (!selectedStartDate || !selectedEndDate) return;
    
    const allDays = document.querySelectorAll('.day:not(.prev-month):not(.next-month)');
    
    allDays.forEach(day => {
        const dayNumber = parseInt(day.textContent);
        const monthElement = day.closest('.calendar-month');
        const monthValue = monthElement.getAttribute('data-month');
        const [year, month] = monthValue.split('-');
        
        const dayDate = new Date(year, month - 1, dayNumber);
        
        if (dayDate > selectedStartDate && dayDate < selectedEndDate) {
            day.classList.add('in-range');
        }
    });
}

// 월 선택 드롭다운 초기화
function initializeMonthSelector() {
    const monthSelect = document.getElementById('monthSelect');
    
    monthSelect.addEventListener('change', function() {
        const selectedMonth = this.value;
        
        if (selectedMonth === '' || selectedMonth === '3month') {
            // 3개월 보기로 전환
            showThreeMonthView();
        } else {
            // 단일 월 보기로 전환
            showSingleMonthView(selectedMonth);
        }
    });
}

// 3개월 보기 표시
function showThreeMonthView() {
    const calendarGrid = document.getElementById('calendarGrid');
    const singleCalendarContainer = document.getElementById('singleCalendarContainer');
    
    calendarGrid.style.display = 'grid';
    singleCalendarContainer.style.display = 'none';
    
    // 기존 이벤트 리스너 재연결
    initializeDateSelection();
}

// 단일 월 보기 표시
function showSingleMonthView(monthValue) {
    const calendarGrid = document.getElementById('calendarGrid');
    const singleCalendarContainer = document.getElementById('singleCalendarContainer');
    
    calendarGrid.style.display = 'none';
    singleCalendarContainer.style.display = 'block';
    
    // 선택된 월의 달력 생성
    generateSingleMonthCalendar(monthValue, singleCalendarContainer);
}

// 단일 월 달력 생성
function generateSingleMonthCalendar(monthValue, container) {
    const [year, month] = monthValue.split('-');
    const monthNames = {
        '01': '1월', '02': '2월', '03': '3월', '04': '4월', '05': '5월', '06': '6월',
        '07': '7월', '08': '8월', '09': '9월', '10': '10월', '11': '11월', '12': '12월'
    };
    
    // 해당 월의 정보 계산
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // 이전 달 마지막 날들
    const prevMonth = new Date(year, month - 2, 0);
    const prevMonthDays = prevMonth.getDate();
    
    let calendarHTML = `
        <div class="calendar-month" data-month="${monthValue}">
            <div class="calendar-header">${monthNames[month]}</div>
            <div class="calendar-weekdays">
                <div class="weekday">일</div>
                <div class="weekday">월</div>
                <div class="weekday">화</div>
                <div class="weekday">수</div>
                <div class="weekday">목</div>
                <div class="weekday">금</div>
                <div class="weekday">토</div>
            </div>
            <div class="calendar-days">
    `;
    
    // 이전 달 날짜들 (회색)
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        calendarHTML += `<div class="day prev-month">${prevMonthDays - i}</div>`;
    }
    
    // 현재 달 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
        calendarHTML += `<div class="day">${day}</div>`;
    }
    
    // 다음 달 날짜들 (회색) - 42칸 채우기
    const totalCells = 42;
    const filledCells = startingDayOfWeek + daysInMonth;
    const remainingCells = totalCells - filledCells;
    
    for (let day = 1; day <= remainingCells; day++) {
        calendarHTML += `<div class="day next-month">${day}</div>`;
    }
    
    calendarHTML += `
            </div>
        </div>
    `;
    
    container.innerHTML = calendarHTML;
    
    // 새로 생성된 달력에 이벤트 리스너 추가
    initializeDateSelection();
}

// 기본 날짜 범위 설정 (예시)
function setDefaultDateRange() {
    // 2025년 7월 21일 ~ 31일로 기본 설정
    selectedStartDate = new Date(2025, 6, 21); // 월은 0부터 시작
    selectedEndDate = new Date(2025, 6, 31);
    
    // UI에 반영
    const startDay = document.querySelector('[data-month="2025-07"] .day:nth-child(24)'); // 21일
    const endDay = document.querySelector('[data-month="2025-07"] .day:nth-child(34)'); // 31일
    
    if (startDay && endDay) {
        clearDateSelection();
        startDay.classList.add('range-start', 'selected');
        endDay.classList.add('range-end', 'selected');
        highlightDateRange();
    }
    
    updateSelectedDateDisplay();
}

// 선택된 날짜 표시 업데이트
function updateSelectedDateDisplay() {
    const dateRangeText = document.getElementById('dateRangeText');
    const dateInfoText = document.getElementById('dateInfoText');
    const selectedDateSection = document.getElementById('selectedDateSection');
    
    if (selectedStartDate && selectedEndDate) {
        const startFormatted = formatDate(selectedStartDate);
        const endFormatted = formatDate(selectedEndDate);
        const startInfo = formatDateInfo(selectedStartDate);
        const endInfo = formatDateInfo(selectedEndDate);
        
        dateRangeText.textContent = `${startFormatted} ~ ${endFormatted}`;
        dateRangeText.style.color = '#005792';
        dateRangeText.style.fontWeight = '600';
        dateInfoText.textContent = `${startInfo}에서 ${endInfo} 사이가 선택되었습니다!`;
        selectedDateSection.style.display = 'block'; // 날짜 확인 섹션 표시
    } else if (selectedStartDate) {
        const startFormatted = formatDate(selectedStartDate);
        const startInfo = formatDateInfo(selectedStartDate);
        
        dateRangeText.textContent = `${startFormatted} ~`;
        dateRangeText.style.color = '#005792';
        dateRangeText.style.fontWeight = '600';
        dateInfoText.textContent = `${startInfo}부터 선택되었습니다. 종료일을 선택해주세요.`;
        selectedDateSection.style.display = 'block'; // 날짜 확인 섹션 표시
    } else {
        selectedDateSection.style.display = 'none'; // 날짜 확인 섹션 숨김
    }
}

// 날짜 포맷팅 (YYYY.MM.DD)
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
}

// 날짜 정보 포맷팅 (YY년 M월 D일)
function formatDateInfo(date) {
    const year = String(date.getFullYear()).slice(-2);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
}

// 다음 버튼 초기화
function initializeNextButton() {
    const nextButton = document.getElementById('nextButton');
    if (nextButton) {
        nextButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 유효성 검사
            if (!selectedStartDate || !selectedEndDate) {
                alert('여행 시작일과 종료일을 모두 선택해주세요.');
                return;
            }
            
            // 데이터 저장 및 다음 페이지로 이동
            saveScheduleForNextPage();
            goToNextPage();
        });
    }
}

// 뒤로 가기 버튼 초기화
function initializeBackButton() {
    // 뒤로 가기 버튼은 HTML에서 onclick으로 처리됨
}

// 뒤로 가기 함수
function goToPreviousPage() {
    // 현재 선택된 일정 임시 저장
    if (selectedStartDate && selectedEndDate) {
        localStorage.setItem('temp_selected_schedule', JSON.stringify({
            startDate: selectedStartDate.toISOString(),
            endDate: selectedEndDate.toISOString()
        }));
    }
    
    // 이전 페이지로 이동
    window.location.href = 'choosing-tour.html';
}

// 다음 페이지로 전달할 일정 데이터 저장
function saveScheduleForNextPage() {
    const scheduleData = {
        startDate: selectedStartDate.toISOString(),
        endDate: selectedEndDate.toISOString(),
        startDateFormatted: formatDate(selectedStartDate),
        endDateFormatted: formatDate(selectedEndDate)
    };
    
    const combinedData = {
        ...previousData,
        schedule: scheduleData,
        timestamp: new Date().toISOString()
    };
    
    // 로컬 스토리지에 저장
    localStorage.setItem('selected_schedule_step4', JSON.stringify(scheduleData));
    localStorage.setItem('room_creation_data', JSON.stringify(combinedData));
    
    // 세션 스토리지에도 백업 저장
    sessionStorage.setItem('selected_schedule_step4', JSON.stringify(scheduleData));
    sessionStorage.setItem('room_creation_data', JSON.stringify(combinedData));
    
    console.log('최종 방 생성 데이터 저장 완료:', combinedData);
}

// 다음 페이지로 이동 (최종 완료 페이지)
function goToNextPage() {
    // 실제 완료 페이지 URL로 변경해주세요
    window.location.href = 'room-creation-complete.html';
    
    // 또는 최종 등록 처리
    // submitRoomCreation();
}

// 폼 유효성 검사 (HTML에서 onsubmit으로 호출됨)
function validationPhase(form) {
    if (!selectedStartDate || !selectedEndDate) {
        alert('여행 시작일과 종료일을 모두 선택해주세요.');
        return false;
    }
    
    // 폼 제출 준비
    prepareFormSubmission();
    saveScheduleForNextPage();
    
    return true;
}

// 폼 제출 시 선택된 데이터를 hidden input에 추가
function prepareFormSubmission() {
    const form = document.getElementById('temporary_room_phase_4');
    
    // 기존 hidden input들 제거
    const existingInputs = form.querySelectorAll('input[name="selected_schedule"], input[name="room_creation_data"]');
    existingInputs.forEach(input => input.remove());
    
    // 선택된 일정을 hidden input으로 추가
    if (selectedStartDate && selectedEndDate) {
        const scheduleInput = document.createElement('input');
        scheduleInput.type = 'hidden';
        scheduleInput.name = 'selected_schedule';
        scheduleInput.value = JSON.stringify({
            startDate: selectedStartDate.toISOString(),
            endDate: selectedEndDate.toISOString()
        });
        form.appendChild(scheduleInput);
    }
    
    // 전체 방 생성 데이터도 hidden input으로 추가
    const roomDataInput = document.createElement('input');
    roomDataInput.type = 'hidden';
    roomDataInput.name = 'room_creation_data';
    roomDataInput.value = JSON.stringify(previousData);
    form.appendChild(roomDataInput);
}

// 다른 페이지에서 저장된 일정 데이터 불러오기
function getSelectedScheduleFromPreviousPage() {
    try {
        let schedule = localStorage.getItem('selected_schedule_step4');
        if (schedule) {
            return JSON.parse(schedule);
        }
        
        schedule = sessionStorage.getItem('selected_schedule_step4');
        if (schedule) {
            return JSON.parse(schedule);
        }
        
        return null;
    } catch (e) {
        console.error('저장된 일정 데이터 불러오기 실패:', e);
        return null;
    }
}

// 최종 방 생성 데이터 불러오기
function getFinalRoomCreationData() {
    try {
        let data = localStorage.getItem('room_creation_data');
        if (data) {
            return JSON.parse(data);
        }
        
        data = sessionStorage.getItem('room_creation_data');
        if (data) {
            return JSON.parse(data);
        }
        
        return null;
    } catch (e) {
        console.error('최종 방 생성 데이터 불러오기 실패:', e);
        return null;
    }
}

// 임시 저장된 일정 복원
function restoreTemporarySchedule() {
    const tempSchedule = localStorage.getItem('temp_selected_schedule');
    if (tempSchedule) {
        try {
            const schedule = JSON.parse(tempSchedule);
            selectedStartDate = new Date(schedule.startDate);
            selectedEndDate = new Date(schedule.endDate);
            
            // UI 업데이트
            updateCalendarDisplay();
            updateSelectedDateDisplay();
            
            localStorage.removeItem('temp_selected_schedule');
        } catch (e) {
            console.error('임시 저장된 일정 데이터 복원 실패:', e);
        }
    }
}

// 달력 표시 업데이트
function updateCalendarDisplay() {
    if (!selectedStartDate || !selectedEndDate) return;
    
    clearDateSelection();
    
    const allDays = document.querySelectorAll('.day:not(.prev-month):not(.next-month)');
    
    allDays.forEach(day => {
        const dayNumber = parseInt(day.textContent);
        const monthElement = day.closest('.calendar-month');
        const monthValue = monthElement.getAttribute('data-month');
        const [year, month] = monthValue.split('-');
        
        const dayDate = new Date(year, month - 1, dayNumber);
        
        if (dayDate.getTime() === selectedStartDate.getTime()) {
            day.classList.add('range-start', 'selected');
        } else if (dayDate.getTime() === selectedEndDate.getTime()) {
            day.classList.add('range-end', 'selected');
        } else if (dayDate > selectedStartDate && dayDate < selectedEndDate) {
            day.classList.add('in-range');
        }
    });
}

// 최종 방 생성 제출
function submitRoomCreation() {
    const finalData = getFinalRoomCreationData();
    
    if (!finalData) {
        alert('방 생성 데이터가 없습니다. 처음부터 다시 시작해주세요.');
        return;
    }
    
    console.log('방 생성 제출:', finalData);
    
    // 실제 서버 제출 로직
    // fetch('/api/rooms/create', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(finalData)
    // });
    
    // 성공 후 데이터 정리
    clearAllData();
}

// 모든 저장된 데이터 정리
function clearAllData() {
    localStorage.removeItem('selected_emotions_step2');
    localStorage.removeItem('selected_destination_step3');
    localStorage.removeItem('selected_schedule_step4');
    localStorage.removeItem('room_creation_data');
    localStorage.removeItem('temp_selected_schedule');
    
    sessionStorage.removeItem('selected_emotions_step2');
    sessionStorage.removeItem('selected_destination_step3');
    sessionStorage.removeItem('selected_schedule_step4');
    sessionStorage.removeItem('room_creation_data');
}
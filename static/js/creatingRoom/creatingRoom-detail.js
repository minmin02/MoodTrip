//체크 박스 눌렀을 때 배경 색 및 체크박스 활성화
document.addEventListener("DOMContentLoaded", function () {
    const categoryCards = document.querySelectorAll(".category-card");
    
    categoryCards.forEach(card => {
        card.addEventListener("click", function () {
            // 1. 모든 카드의 체크이미지를 unchecked로 변경
            categoryCards.forEach(c => {
                const checkImg = c.querySelector(".check-mark img");
                checkImg.src = "/static/image/creatingRoom/checkbox.svg";
                c.classList.remove("selected"); // 선택 표시 클래스 제거
            });
            
            // 2. 현재 클릭된 카드에만 체크이미지 변경
            const checkImg = this.querySelector(".check-mark img");
            checkImg.src = "/static/image/creatingRoom/checkbox-checked.svg";
            this.classList.add("selected");
            
            // 3. 선택된 인원 값을 hidden input 등에 저장
            const selectedValue = this.getAttribute("data-target");
            console.log("선택된 인원:", selectedValue);
            
            // 예: 숨겨진 input에 값 저장 (필요하면 HTML에 추가)
            const hiddenInput = document.querySelector('input[name="selected_people"]');
            if (hiddenInput) {
                hiddenInput.value = selectedValue;
            }
        });
    });
});

// 다음 버튼 눌렀을 경우, 1. 인원 선택 여부, 방 이름 여부, 방 소개 여부 유효성 검사
function validationPhase(form) {
    const selectedPeople = form.querySelector('input[name="selected_people"]').value;
    const roomNameInput = form.querySelector('.roomName-search-typing-input');
    const roomIntroInput = form.querySelector('.roomName-search-typing-input2');
    
    if (!selectedPeople) {
        alert("인원을 선택해주세요.");
        return false;
    }
    
    if (!roomNameInput || roomNameInput.value.trim() === "") {
        alert("방 이름을 입력해주세요.");
        roomNameInput.focus();
        return false;
    }
    
    if (!roomIntroInput || roomIntroInput.value.trim() === "") {
        alert("방 소개를 입력해주세요.");
        roomIntroInput.focus();
        return false;
    }
    
    // localStorage 저장
    localStorage.setItem("selected_people", selectedPeople);
    localStorage.setItem("room_name", roomNameInput.value.trim());
    localStorage.setItem("room_intro", roomIntroInput.value.trim());
    
    window.location.href = "/templates/creatingRoom/choosing-emotion.html";
    
    return false; // form 제출 막기
}

// 다음 버튼을 눌렀을 때 해당 정보들을 가지고 다음 페이지로 넘어가는 JS 코드
window.addEventListener("DOMContentLoaded", function () {
    const selected = localStorage.getItem("selected_people");
    const name = localStorage.getItem("room_name");
    const intro = localStorage.getItem("room_intro");
    
    // 예시: 화면에 표시
    const previewName = document.getElementById("preview-name");
    const previewIntro = document.getElementById("preview-intro");
    
    if (previewName && name) {
        previewName.textContent = name;
    }
    if (previewIntro && intro) {
        previewIntro.textContent = intro;
    }
});

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

// 입력 필드 실시간 가이드 (선택사항)
document.addEventListener('DOMContentLoaded', function() {
    const roomNameInput = document.querySelector('.roomName-search-typing-input');
    const roomIntroInput = document.querySelector('.roomName-search-typing-input2');
    
    // 방 이름 입력 가이드
    if (roomNameInput) {
        roomNameInput.addEventListener('input', function() {
            const value = this.value.trim();
            const length = value.length;
            
            // 글자 수에 따른 시각적 피드백
            if (length > 0 && length < 5) {
                this.style.borderColor = '#ffa726'; // 주황색 - 더 입력 필요
            } else if (length >= 5 && length <= 20) {
                this.style.borderColor = '#66bb6a'; // 초록색 - 적절
            } else if (length > 20) {
                this.style.borderColor = '#ef5350'; // 빨간색 - 너무 길음
            } else {
                this.style.borderColor = '#e0e0e0'; // 기본색
            }
        });
    }
    
    // 방 소개 입력 가이드
    if (roomIntroInput) {
        roomIntroInput.addEventListener('input', function() {
            const value = this.value.trim();
            const length = value.length;
            
            // 글자 수에 따른 시각적 피드백
            if (length > 0 && length < 10) {
                this.style.borderColor = '#ffa726'; // 주황색 - 더 입력 필요
            } else if (length >= 10 && length <= 100) {
                this.style.borderColor = '#66bb6a'; // 초록색 - 적절
            } else if (length > 100) {
                this.style.borderColor = '#ef5350'; // 빨간색 - 너무 길음
            } else {
                this.style.borderColor = '#e0e0e0'; // 기본색
            }
        });
    }
});

// 추천 문구 자동 완성 기능 (선택사항)
function insertSampleText(type) {
    const sampleTexts = {
        roomName: [
            "제주도 힐링 여행",
            "부산 바다 투어",
            "고양시로 가는고양",
            "떠나자! 여행멘토들",
            "힐링이 필요해"
        ],
        roomIntro: [
            "안녕하세요! 함께 여행할 동행자를 찾고 있어요. 힐링과 맛집 투어가 목적입니다. 새로운 친구들과 즐거운 추억 만들어요! 🌟",
            "20대 직장인입니다! 스트레스 해소차 여행 떠나려고 해요. 사진 찍기 좋아하고 맛집 탐방 좋아하는 분들 환영!",
            "혼자 여행도 좋지만 함께 하면 더 재밌잖아요? 계획보단 즉흥적인 여행 스타일이에요. 편하게 대화하며 여행해요! 😊"
        ]
    };
    
    const randomIndex = Math.floor(Math.random() * sampleTexts[type].length);
    const sampleText = sampleTexts[type][randomIndex];
    
    if (type === 'roomName') {
        const input = document.querySelector('.roomName-search-typing-input');
        if (input) {
            input.value = sampleText;
            input.dispatchEvent(new Event('input')); // 실시간 가이드 트리거
        }
    } else if (type === 'roomIntro') {
        const input = document.querySelector('.roomName-search-typing-input2');
        if (input) {
            input.value = sampleText;
            input.dispatchEvent(new Event('input')); // 실시간 가이드 트리거
        }
    }
}

// 폼 제출 전 최종 확인
function finalValidation() {
    const selectedPeople = document.querySelector('input[name="selected_people"]').value;
    const roomName = document.querySelector('.roomName-search-typing-input').value.trim();
    const roomIntro = document.querySelector('.roomName-search-typing-input2').value.trim();
    
    // 최종 확인 메시지
    const confirmMessage = `
입력하신 정보를 확인해주세요:

• 인원: ${getSelectedPeopleText(selectedPeople)}
• 방 이름: ${roomName}
• 방 소개: ${roomIntro.length > 50 ? roomIntro.substring(0, 50) + '...' : roomIntro}

이대로 진행하시겠습니까?
    `;
    
    return confirm(confirmMessage);
}

// 선택된 인원 텍스트 변환
function getSelectedPeopleText(value) {
    const peopleMap = {
        'twopeople': '2명',
        'fourpeople': '4명',
        'etc': '기타'
    };
    return peopleMap[value] || '선택되지 않음';
}

// exitWithSubmit 함수 (기존 코드와 호환성을 위해)
function exitWithSubmit(formId, value) {
    // 뒤로 가기 로직
    if (confirm('입력 중인 내용이 사라집니다. 정말 나가시겠습니까?')) {
        // 임시 저장된 데이터 정리
        localStorage.removeItem("selected_people");
        localStorage.removeItem("room_name");
        localStorage.removeItem("room_intro");
        
        // 이전 페이지로 이동
        window.history.back();
    }
}
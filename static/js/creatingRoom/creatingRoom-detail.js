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

    window.location.href = "/templates/creatingRoom/choosing-emotion.html";  // 예시
    return false; // form 제출 막기
}

// 다음 버튼을 눌렀을 때 해당 정보들을 가지고 다음 페이지로 넘어가는 JS 코드

window.addEventListener("DOMContentLoaded", function () {
    const selected = localStorage.getItem("selected_people");
    const name = localStorage.getItem("room_name");
    const intro = localStorage.getItem("room_intro");

    // 예시: 화면에 표시
    document.getElementById("preview-name").textContent = name;
    document.getElementById("preview-intro").textContent = intro;
});
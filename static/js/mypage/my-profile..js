let originalNickname = ''; // 전역 변수로 원래 닉네임 저장
let originalSelfIntro = ''; // 원래 자기소개 저장용

// 수정 버튼 클릭 시
document.querySelector('.modify-nickname').addEventListener('click', function() {
    document.querySelector('.modify-nickname-wrapper').hidden = true;
    document.querySelector('.complete-nickname-wrapper').hidden = false;

    // input 활성화 및 스타일 변경
    const inputSection = document.querySelector('.name-input-section');
    const input = document.querySelector('#username');

    //현재 이름 저장
    originalNickname = input.value;

    inputSection.style.backgroundColor = '#ffffff';
    input.disabled = false;
    input.style.color = '#000000';
    
});

 // 취소 버튼 클릭 시
document.querySelector('.modify-nickname-cancel').addEventListener('click', function () {
    // input 다시 비활성화 + 스타일 원래대로 복구
    const inputSection = document.querySelector('.name-input-section');
    inputSection.style.backgroundColor = '';
    
    const input = document.querySelector('#username');
    input.disabled = false;
    input.style.color = '';

    // 원래 닉네임 복원
    input.value = originalNickname;

    document.querySelector('.modify-nickname-wrapper').hidden = false;
    document.querySelector('.complete-nickname-wrapper').hidden = true;
    
});

document.querySelector('.save-nickname').addEventListener('click', function () {
    const input = document.querySelector('#username');
    const inputSection = document.querySelector('.name-input-section');
    const newNickname = input.value.trim();

    // 유효성 검사
    const nicknameRegex = /^[가-힣a-zA-Z0-9]+$/;
    if (!nicknameRegex.test(newNickname)) {
        alert('닉네임은 한글, 영문, 숫자만 입력 가능합니다.');
        return;
    }

    // 저장 완료 UI 전환
    input.disabled = true;
    inputSection.style.backgroundColor = '';
    input.style.color = '';
    document.querySelector('.modify-nickname-wrapper').hidden = false;
    document.querySelector('.complete-nickname-wrapper').hidden = true;

    // 원래 닉네임 갱신
    originalNickname = newNickname;

     // 나중에 이 부분에 fetch 붙이면 됨
// fetch('/nickname/update', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ nickname: newNickname })
// }).then(...);
});



// 자기소개 수정 버튼 클릭
document.querySelector('.edit-self-introduction').addEventListener('click', function () {
    const textarea = document.querySelector('#selfIntroduction');
    const completeWrapper = document.querySelector('.complete-self-introduction-wrapper');
    const editWrapper = document.querySelector('.edit-self-introduction-wrapper');

    originalSelfIntro = textarea.value; // 현재 내용 저장
    textarea.disabled = false;
    textarea.style.backgroundColor = '#ffffff';
    textarea.style.color = '#000000';
    textarea.style.border = '1px solid #cccccc';
    textarea.focus();

    editWrapper.hidden = true;
    completeWrapper.hidden = false;
});

// 자기소개 취소 버튼 클릭
document.querySelector('.complete-self-introduction-wrapper .modify-nickname-cancel').addEventListener('click', function () {
    const textarea = document.querySelector('#selfIntroduction');
    const completeWrapper = document.querySelector('.complete-self-introduction-wrapper');
    const editWrapper = document.querySelector('.edit-self-introduction-wrapper');

    textarea.value = originalSelfIntro; // 원래대로 복원
    textarea.disabled = true;
    textarea.style.backgroundColor = '';
    textarea.style.color = '';
    textarea.style.border = '';

    editWrapper.hidden = false;
    completeWrapper.hidden = true;
});

// 저장 버튼 클릭
document.querySelector('.complete-self-introduction-wrapper .save-nickname').addEventListener('click', function () {
    const textarea = document.querySelector('#selfIntroduction');
    const newSelfIntro = textarea.value.trim();

    // 간단한 유효성 검사
    if (newSelfIntro.length === 0) {
        alert("자기소개를 입력해주세요.");
        return;
    }

    if (newSelfIntro.length > 1000) {
        alert("자기소개는 1000자 이내로 입력해주세요.");
        return;
    }

    // 저장 완료 처리
    textarea.disabled = true;
    textarea.style.backgroundColor = '';
    textarea.style.color = '';
    textarea.style.border = '';

    document.querySelector('.edit-self-introduction-wrapper').hidden = false;
    document.querySelector('.complete-self-introduction-wrapper').hidden = true;

    originalSelfIntro = newSelfIntro;

    alert("자기소개가 임시로 저장되었습니다. (백엔드 연결 예정)");

    // 나중에 fetch API로 전송 (백엔드 연결 시)
    /*
    fetch('/api/self-introduction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ selfIntroduction: newSelfIntro })
    }).then(response => {
        if (response.ok) {
            alert("자기소개가 저장되었습니다.");
        } else {
            alert("저장 실패. 다시 시도해주세요.");
        }
    }).catch(error => {
        console.error(error);
        alert("서버 오류가 발생했습니다.");
    });
    */
});
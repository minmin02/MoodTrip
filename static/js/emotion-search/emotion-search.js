// 선택된 태그들을 저장할 배열
let selectedTags = [];

function toggleEmotionCategories() {
    const categories = document.getElementById('emotionCategories');
    const toggleBtn = document.querySelector('.category-toggle-btn');
    const toggleText = document.querySelector('.toggle-text');
    const toggleIcon = document.querySelector('.toggle-icon');
    
    if (categories.classList.contains('show')) {
        categories.classList.remove('show');
        toggleText.textContent = '감정 카테고리 보기';
        toggleIcon.style.transform = 'rotate(0deg)';
    } else {
        categories.classList.add('show');
        toggleText.textContent = '감정 카테고리 숨기기';
        toggleIcon.style.transform = 'rotate(180deg)';
    }
}

// 정렬 드롭다운 토글
function toggleSortDropdown() {
    const dropdown = document.querySelector('.sort-dropdown');
    dropdown.classList.toggle('active');
}

// 정렬 옵션 선택
function selectSortOption(option, text) {
    const sortText = document.querySelector('.sort-text');
    const dropdown = document.querySelector('.sort-dropdown');
    const allOptions = document.querySelectorAll('.sort-option');
    
    // 현재 선택된 옵션 업데이트
    sortText.textContent = text;
    
    // active 클래스 업데이트
    allOptions.forEach(opt => opt.classList.remove('active'));
    event.target.classList.add('active');
    
    // 드롭다운 닫기
    dropdown.classList.remove('active');
    
    // 여기에 실제 정렬 로직 추가 가능
    console.log('정렬 기준:', option, text);
}

// 태그 추가 함수
function addTag(tagText) {
    // 이미 존재하는 태그인지 확인
    if (selectedTags.includes(tagText)) {
        return;
    }
    
    // 태그 배열에 추가
    selectedTags.push(tagText);
    
    // UI 업데이트
    renderTags();
    
    // 입력창 클리어
    const inputArea = document.getElementById('emotionInput');
    inputArea.value = '';
}

// 태그 제거 함수
function removeTag(tagText) {
    const index = selectedTags.indexOf(tagText);
    if (index > -1) {
        selectedTags.splice(index, 1);
        renderTags();
    }
}

// 태그들을 화면에 렌더링
function renderTags() {
    const selectedTagsContainer = document.getElementById('selectedTags');
    selectedTagsContainer.innerHTML = '';
    
    selectedTags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = 'tag-item';
        tagElement.innerHTML = `
            <span class="tag-text">${tag}</span>
            <button class="tag-remove" onclick="removeTag('${tag}')" title="태그 제거">×</button>
        `;
        selectedTagsContainer.appendChild(tagElement);
    });
    
    // placeholder 업데이트
    const inputArea = document.getElementById('emotionInput');
    if (selectedTags.length > 0) {
        inputArea.placeholder = '추가할 감정을 입력하세요...';
    } else {
        inputArea.placeholder = '원하는 감정을 선택해보세요 (예: 힐링, 설렘, 평온)';
    }
}

// 입력창에서 엔터 입력 처리
function handleInputKeyPress(event) {
    if (event.key === 'Enter') {
        const inputValue = event.target.value.trim();
        if (inputValue) {
            addTag(inputValue);
        }
    }
}

// 감정 태그 클릭 시 추가
function addEmotionTag(emotion) {
    addTag(emotion);
}

// 인기 태그에서 # 제거하고 추가
function addPopularTag(tagText) {
    // # 제거하고 태그 추가
    const emotion = tagText.replace('#', '');
    addTag(emotion);
}

// 하트 버튼 토글 기능
function toggleLike(button) {
    button.classList.toggle('liked');
    
    if (button.classList.contains('liked')) {
        button.innerHTML = '♥'; // 채워진 하트
        button.style.color = '#ff4757'; // 빨간색
        button.style.background = 'rgba(255, 255, 255, 0.95)';
    } else {
        button.innerHTML = '♡'; // 빈 하트
        button.style.color = '#005792'; // 원래 색상
        button.style.background = 'rgba(255, 255, 255, 0.9)';
    }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    // 감정 태그 클릭 시 추가
    const emotionTags = document.querySelectorAll('.emotion-tag');
    
    emotionTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const emotion = this.textContent.trim();
            addEmotionTag(emotion);
            
            // 선택된 태그 시각적 피드백
            this.style.background = 'linear-gradient(135deg, #005792 0%, #001A2C 100%)';
            this.style.color = 'white';
            
            // 2초 후 원래 스타일로 복원
            setTimeout(() => {
                this.style.background = '';
                this.style.color = '';
            }, 2000);
        });
    });

    // 인기 태그 클릭 시 추가
    const popularTags = document.querySelectorAll('.popular-tag');
    popularTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const tagText = this.textContent.trim();
            addPopularTag(tagText);
            
            // 선택된 태그 시각적 피드백
            this.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)';
            this.style.color = '#001A2C';
            
            // 2초 후 원래 스타일로 복원
            setTimeout(() => {
                this.style.background = '';
                this.style.color = '';
            }, 2000);
        });
    });
    
    // 입력창 엔터 키 이벤트
    const inputArea = document.getElementById('emotionInput');
    inputArea.addEventListener('keypress', handleInputKeyPress);
    
    // 하트 버튼 이벤트 리스너 추가
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleLike(this);
        });
    });
    
    // 정렬 옵션 클릭 이벤트
    const sortOptions = document.querySelectorAll('.sort-option');
    sortOptions.forEach(option => {
        option.addEventListener('click', function() {
            const sortValue = this.getAttribute('data-sort');
            const sortText = this.textContent;
            selectSortOption(sortValue, sortText);
        });
    });
    
    // 드롭다운 외부 클릭 시 닫기
    document.addEventListener('click', function(e) {
        const dropdown = document.querySelector('.sort-dropdown');
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
    
    // 검색 버튼 클릭 이벤트
    const searchBtn = document.querySelector('.search-btn');
    searchBtn.addEventListener('click', function() {
        const inputValue = inputArea.value.trim();
        if (inputValue) {
            addTag(inputValue);
        }
        // 여기에 실제 검색 로직 추가
        if (selectedTags.length > 0) {
            console.log('검색할 태그들:', selectedTags);
            // 실제 검색 API 호출 등
        }
    });
});
document.addEventListener("DOMContentLoaded", () => {
});
window.onload = function(){
    document.getElementById('postCodeBtn').addEventListener('click', getPostCode);
    initKakaoMap();
}


function getPostCode(){
    new daum.Postcode({
        oncomplete: function(data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.
            // 예제를 참고하여 다양한 활용법을 확인해 보세요.
            console.log(data);
            const target = document.getElementById('postCodeData');
            target.innerHTML = '';
            const span = document.createElement('span');
            span.setAttribute('data-postcode', data.address);
            span.innerText = data.address;
            target.appendChild(span);
        }
    }).open();
}

function initKakaoMap(){
    
    axios.get('/getKakaoMap')
    .then((result)=>{
        let data = result.data.data;
        document.getElementById('kakaoMapScript').innerText = data;

        var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
        var options = { //지도를 생성할 때 필요한 기본 옵션
            center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
            level: 3 //지도의 레벨(확대, 축소 정도)
        };

        var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
    }).catch((error)=>{
        if (error.response) {
        console.log(error.response.data);
        const data = {success : false};
        res.json(data);
        }
    });
    
}

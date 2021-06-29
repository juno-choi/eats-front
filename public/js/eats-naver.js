document.addEventListener("DOMContentLoaded", () => {
});
window.onload = function(){
    document.getElementById('postCodeBtn').addEventListener('click', getPostCode);
    document.getElementById('foodSearchBtn').addEventListener('click', getNaverSearch);
    //initKakaoMap();
}


function getPostCode(){
    new daum.Postcode({
        oncomplete: function(data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.
            // 예제를 참고하여 다양한 활용법을 확인해 보세요.
            console.log(data);
            const address = data.address;

            const region = data.sigungu +' '+ data.bname;
            const target = document.getElementById('postCodeData');
            target.innerHTML = '';
            const span = document.createElement('span');
            span.setAttribute('data-postcode', region);
            span.innerText = region;
            target.appendChild(span);
        }
    }).open();
}
/* 
function initKakaoMap(){
    
    var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
    var options = { //지도를 생성할 때 필요한 기본 옵션
        center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
        level: 3 //지도의 레벨(확대, 축소 정도)
    };

    var map = new kakao.maps.Map(container, options);
    
} */

let map = null;
let points= [];
let markers = [];
let infoWindows = [];
//네이버 맵 API
function initNaverMap() {
    map = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(37.3595704, 127.105399),
        zoom: 10
    });
}


//네이버 검색 API 결과
function getNaverSearch(){
    
    const local = document.querySelector('#postCodeData').firstElementChild.dataset.postcode;
    const keyword = document.getElementById('keyword').value;
    let sort = 'random';
    document.querySelectorAll('input[name=sort]').forEach((item)=>{
        if(item.checked){
            sort = item.value;
        }
    });
    axios.post('/naver/search', {
        local : local,
        keyword : keyword,
        sort : sort
    }).then((result)=>{
        const data = result.data;
        const items = data.items;
        infoWindows.length=0;
        items.forEach((item)=>{
            searchAddressToCoordinate(item.address);
        });
        
        const idx = getRandomInt(0,items.length);

        window.setTimeout(function(){
            map = new naver.maps.Map('map', {
                center: new naver.maps.LatLng(points[idx].y, points[idx].x),
                zoom: 16
            });
        },1000);

        window.setTimeout(excutionMarker(items),1000);

        points.length=0;

    }).catch((error)=>{
        console.log(error);
    });
}

//주소를 좌표로 변환
function searchAddressToCoordinate(address) {
    naver.maps.Service.geocode({
        query: address
    }, function(status, response) {
        if (status === naver.maps.Service.Status.ERROR) {
        if (!address) {
            return alert('Geocode Error, Please check address');
        }
            return alert('Geocode Error, address:' + address);
        }

        if (response.v2.meta.totalCount === 0) {
            return alert('No result.');
        }
        
        var htmlAddresses = [],
        item = response.v2.addresses[0],
        point = new naver.maps.Point(item.x, item.y);
        points.push(point);
    });
}

//marker 정보 만들기
function makeNaverMarker(x,y,item){
    let marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(y, x),
        map: map
    });
    let infoWindow = new naver.maps.InfoWindow({
        content: '<div style="width:150px;text-align:center;padding:10px;">The Letter is <b>"'+item.title+'"</b>.</div>'
    });

    markers.push(marker);
    infoWindows.push(infoWindow);
}

//market 만들기 실행
function excutionMarker(items){
    let i=0;
    points.forEach((point)=>{
        makeNaverMarker(point.x, point.y, items[i]);
        i++;
    });
    addMarkerEvent();
}

//랜덤수 얻기
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

//마커에 클릭 이벤트 넣어주기
function addMarkerEvent(){
    for (var i=0, ii=markers.length; i<ii; i++) {
        naver.maps.Event.addListener(markers[i], 'click', getClickHandler(i));
    }
}

//마커 클릭 이벤트
function getClickHandler(seq) {
    return function(e) {
        var marker = markers[seq],
            infoWindow = infoWindows[seq];

        if (infoWindow.getMap()) {
            infoWindow.close();
        } else {
            infoWindow.open(map, marker);
        }
    }
}
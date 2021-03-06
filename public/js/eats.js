window.onload = function(){
    document.getElementById('postCodeBtn').addEventListener('click', getPostCode);
    document.getElementById('foodSearchBtn').addEventListener('click', searchRestaurant);
    initGoogleMap();
}

let post = {lat:37.3784524525527, lon:127.114295370128};

function getPostCode(){
    new daum.Postcode({
        oncomplete: function(data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.
            // 예제를 참고하여 다양한 활용법을 확인해 보세요.
            const address = data.address;

            const region = data.sigungu +' '+ data.bname;
            const target = document.getElementById('postCodeData');
            target.innerHTML = '';
            const span = document.createElement('span');
            span.setAttribute('data-postcode', region);
            span.innerText = region;
            target.appendChild(span);
            Promise.resolve(data).then(o => {
              const { address } = data;
              return new Promise((resolve, reject) => {
                  const geocoder = new daum.maps.services.Geocoder();
                  geocoder.addressSearch(address, (result, status) =>{
                      if(status === daum.maps.services.Status.OK){
                          const { x, y } = result[0];
                          resolve({ lat: y, lon: x })
                      }else{
                          reject();
                      }
                  });
              });
            }).then(postCode => {
                // 위, 경도 결과 값
                //{lat: "37.3784524525527", lon: "127.114295370128"} 수내역
                //makeGoogleMap(postCode);
                post.lat = postCode.lat;
                post.lon = postCode.lon;
            });
        }
    }).open();
}

let map;

function initGoogleMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 16,
    center: new google.maps.LatLng(37.3968925296743, 127.111925428711)
  });
}

function makeGoogleMap(postCode){
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 16,
    center: new google.maps.LatLng(postCode.lat, postCode.lon)
  });
}

//google marker 만들기
function makeGoogleMarker(results){
    const data = results.data.results;
    const postCode = {lat : post.lat, lon : post.lon}
    makeGoogleMap(postCode);
    const dataLength = data.length;
    const random = getRandomInt(0,dataLength);

    for (let i = 0; i < dataLength; i++) {
    const coords = data[i].geometry.location;
    const latLng = new google.maps.LatLng(coords.lat, coords.lng);

    const marker = new google.maps.Marker({
      position: latLng,
      map: map,
      title : data[i].name
    });
    const contentString =
    '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    '<h1 id="firstHeading" class="firstHeading">'+data[i].name+'</h1>' +
    '<div id="bodyContent">' +
    "<p>"+
    "별점 = "+data[i].rating+
    "</p>" +
    "<p>"+
    "가격대 = "+data[i].price_level+
    "</p>" +
    "</div>" +
    "</div>";
    const infowindow = new google.maps.InfoWindow({
      content: contentString,
    });
    marker.addListener("click", () => {
      infowindow.open({
        anchor: marker,
        map,
        shouldFocus: true,
      });
    });
    if(random==i) google.maps.event.trigger(marker, 'click');
    }
};

//음식점 찾기 버튼 클릭
function searchRestaurant(){
    //유효성 검사
    if(!searchRestaurantValidation()){
        return ;
    }
    getGooleSearch();
}

//음식점 찾기 validation 체크
function searchRestaurantValidation(){
    const target1 = document.getElementById('postCodeData').firstElementChild;
    const postcode = target1.dataset.postcode;
    if(typeof postcode == 'undefined'){
        alert('위치 정보를 먼저 입력해주세요!');
        getPostCode();
        return false;
    }
    const target2 = document.getElementById('keyword');
    if(target2.value == ''){
        alert('음식 종류를 선택해주세요!');
        target2.focus();
        return false;
    }

    return true;
}
//Google place API 결과
function getGooleSearch(){
    $('#modal').modal('show');
    const keyword = document.getElementById('keyword').value;
    const radius = document.querySelector('input[name=radius]:checked').value;
    const opennow = document.querySelector('input[name=opennow]:checked').value;
    window.setTimeout(()=>{
        axios.post('/google/search', {
            lat : post.lat,
            lon : post.lon,
            keyword : keyword,
            radius : radius,
            opennow : opennow
        }).then(async (result)=>{
            //음식점의 정보를 가져오는 코드
            console.log(result);
            await makeGoogleMarker(result);
            $('#modal').modal('hide');
        }).catch((error)=>{
            console.log(error);
        });
    },1000);
}
//랜덤수 얻기
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}
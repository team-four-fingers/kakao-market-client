/*global kakao*/
import { useEffect, useRef } from "react"

const getMyGps = () => {
    const gpsOptions = {
      enableHighAccuracy: true,
      timeout: 5000
    };

    return new Promise((resolve) => {
      if(!navigator.geolocation) {
        resolve({ lat: 33.450701, lon: 126.570667 })
      }

      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude; // 위도
        const lon = position.coords.longitude; // 경도

        resolve({ lat: lat, lon: lon });
      }, () => {
        resolve({ lat: 33.450701, lon: 126.570667 })
      }, gpsOptions);
    });
};

function App() {
  const mapRef = useRef(null);

  const initMap = () =>{
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3
    };

    var map = new kakao.maps.Map(container, options);
    mapRef.current = map;
  }

  useEffect(()=>{
    kakao.maps.load(()=>initMap());
  },[mapRef])

  const toCurrentLocation = async () => {
    const location = await getMyGps();
    console.log('location', location);

    const map = mapRef.current;
    const moveLatLon = new kakao.maps.LatLng(location.lat, location.lon);
    map.setCenter(moveLatLon);

    // 마커 만들기
    const marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(location.lat, location.lon)
    });
    marker.setMap(map);
  };

  const setThreeSpots = async () => {
    const map = mapRef.current;
    const bounds = new kakao.maps.LatLngBounds();

    SPOTS.forEach((location, index) => {
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(location.lat, location.lon)
      });
      marker.setMap(map);

      const moveLatLon = new kakao.maps.LatLng(location.lat, location.lon);
      bounds.extend(moveLatLon);

      if (index === SPOTS.length - 1) {
        return;
      }

      const nextLocation = SPOTS[index + 1];

      const linePath = [
        new kakao.maps.LatLng(location.lat, location.lon),
        new kakao.maps.LatLng(nextLocation.lat, nextLocation.lon),
      ];

      const polyline = new kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 5,
        strokeColor: '#FFAE00',
        strokeOpacity: 0.7,
        strokeStyle: 'solid'
      });

      polyline.setMap(map);
    });

    map.setBounds(bounds);
  }

  return (
    <>
      <div id='map' style={{ width: '100%', height: '600px' }}/>
      <button onClick={toCurrentLocation}>현 위치로</button>
      <button onClick={setThreeSpots}>세개의 장소</button>

      <div className='App'>포핑거스</div>
    </>
  )
}

export default App

const SPOTS = [{lat: 37.5403831, lon: 126.9463611}, {lat: 37.5413831, lon: 126.9473611}, {lat: 37.5513831, lon: 126.9573611}];
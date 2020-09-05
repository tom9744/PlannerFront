import axios from "axios";

const OPENWEATHER_KEY = "d720160791cfa3196f3426382ffa3d0a";
const KAKAO_KEY = "0813b6696dceefd83c96d56e4d4e4c6a";

const state = {
  // 비동기 처리 완료여부 플래그
  isLoading: true,

  // 좌표 데이터
  addressName: null,
  latitude: null,
  longitude: null,

  // 날씨 데이터
  location: "Unknown",
  temp: null,
  humidity: null,
  feels_like: null,
  description: null,
  iconId: null
};

const mutations = {
  fetchCoords(state, payload) {
    state.addressName = payload.addressName;
    state.latitude = payload.latitude;
    state.longitude = payload.longitude;
  },
  fetchWeather(state, payload) {
    // state.location = payload.location;
    state.temp = payload.temp;
    state.humidity = payload.humidity;
    state.feels_like = payload.feels_like;
    state.description = payload.description;
    state.iconId = payload.iconId;
    state.isLoading = false;
  },
  fetchLocation(state, payload) {
    state.location = payload;
  }
};

const actions = {
  // 주어진 위도, 경도값으로 해당 지역의 날씨 정보를 가져온다.
  getWeather({ commit, dispatch }, payload) {
    const latitude = payload.latitude;
    const longitude = payload.longitude;

    // 위치 정보를 한글로 표현하기 위해 추가적인 메소드를 호출한다.
    dispatch("coordsToLocation", { latitude: latitude, longitude: longitude });

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_KEY}&units=metric`
      )
      .then(async response => {
        const celcius = response.data.main;
        const weather = response.data.weather.pop();

        const payload = {
          // location: response.data.name,
          temp: celcius.temp,
          humidity: celcius.humidity,
          feels_like: celcius.feels_like,
          description: weather.main,
          iconId: weather.icon
        };

        commit("fetchWeather", payload);
      })
      .catch(error => {
        console.log(error);
        alert("날씨 정보를 불러오는데 실패했습니다!");
      });
  },
  // 입력받은 지역명 정보에 해당하는 위도, 경도를 구한다.
  getCoords({ commit }, payload) {
    axios
      .get(
        `https://dapi.kakao.com/v2/local/search/address.json?page=1&size=1&query=${payload}`,
        { headers: { Authorization: `KakaoAK ${KAKAO_KEY}` } }
      )
      .then(response => {
        // 입력된 값이 잘못된 경우, documents 배열의 길이가 0임을 이용한다.
        const data = response.data.documents.length;

        // 배열의 길이가 0보다 크면, 정보가 정상적으로 받아진 것이다.
        if (data != 0) {
          const location = response.data.documents.pop();
          // 데이터로부터 필요한 정보를 추출해 State에 반영한다.
          commit("fetchCoords", {
            latitude: location.y,
            longitude: location.x,
            addressName: location.address_name
          });
        }
        // 정보를 받아오지 못한 경우, 경고창을 출력한다.
        else {
          alert("입력한 지역에 대한 위치 정보를 가져오는데 실패했습니다!");
        }
      })
      .catch(error => {
        console.log(error.response);
      });
  },
  // 주어진 위도, 경도로부터 주소를 반환한다.
  coordsToLocation({ commit }, payload) {
    axios
      .get(
        `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?output_coord=WGS84&x=${payload.longitude}&y=${payload.latitude}&input_coord=WGS84"`,
        { headers: { Authorization: `KakaoAK ${KAKAO_KEY}` } }
      )
      .then(response => {
        commit("fetchLocation", response.data.documents.pop().address_name);
      })
      .catch(error => {
        console.log(error);
        alert("좌표를 주소로 변환하는데 실패했습니다.");
      });
  }
};

const getters = {
  getStatus(state) {
    return state.isLoading;
  },
  getWeatherDate(state) {
    // 날씨 정보 데이터를 객체화하여 반환한다.
    const data = {
      location: state.location,
      temp: state.temp,
      humidity: state.humidity,
      feels_like: state.feels_like,
      description: state.description,
      iconId: state.iconId
    };
    return data;
  },
  getCoordsData(state) {
    const data = {
      latitude: state.latitude,
      longitude: state.longitude,
      addressName: state.addressName
    };
    return data;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};

<template>
  <div id="wrap-box">
    <h3 style="text-align: center;">환자 V/S 추가</h3>
    <form @submit.prevent="insertRecord">
    <table>
      <tr>
        <td>이름</td>
        <td>{{ patients.name }}</td>
      </tr>
      <tr>
        <td>생년월일</td>
        <td>{{ patients.birth_date  }}</td>
      </tr>
      <tr>
        <td>입력 시간</td>
        <td>{{ clickTime }}</td>
      </tr>
      <tr>
      <td>HR</td>
      <td><input type="text" v-model="HR" :style="HR ? 'border-color: green;' : ''" @input="preventInvalidInput($event, 'HR')"></td>
        </tr>
        <tr>
        <td>O2Sat</td>
      <td><input type="text" v-model="O2Sat" :style="O2Sat ? 'border-color: green;' : ''" @input="preventInvalidInput($event, 'O2Sat')"></td>
        </tr>
        <tr>
          <td>Temp</td>
          <td><input type="text" v-model="Temp" :style="Temp ? 'border-color: green;' : ''" @input="preventInvalidInput($event, 'Temp')"></td>
        </tr>
        <tr>
          <td>Resp</td>
          <td><input type="text" v-model="Resp" :style="Resp ? 'border-color: green;' : ''" @input="preventInvalidInput($event, 'Resp')"></td>
        </tr>
        <tr>
          <td>SBP</td>
          <td><input type="text" v-model="SBP" :style="SBP ? 'border-color: green;' : ''" @input="preventInvalidInput($event, 'SBP')"></td>
        </tr>
        <tr>
          <td>DBP</td>
          <td><input type="text" v-model="DBP" :style="DBP ? 'border-color: green;' : ''" @input="preventInvalidInput($event, 'DBP')"></td>
        </tr>
    </table>
    <input type="hidden" v-model="patients.pid">
    <input type="hidden" v-model="patients.birth_date">
    <input type="hidden" v-model="patients.Gender">

    <button type="submit" @click=insertRecord class="btn">저장</button>
    <button class="btn" @click="closeWindow">취소</button>
  </form>
  </div>
</template>
<script>
import { useRouter } from 'vue-router'
import axios from 'axios'
import moment from 'moment';

export default {
  components: {},
  data () {
    return {
      clickTime: moment().format('YYYY-MM-DDTHH:mm:ss'),
      patients: [],
      HR:null,
      O2Sat:null,
      Temp:null,
      Resp:null,
      SBP:null,
      DBP:null
    }
  },
  setup () {},
  created () {},
  mounted () {
    axios.get("http://127.0.0.1:8002/api/get_latest_all/" + this.$route.params.pid)
    .then(response =>{
        return response.data
      })
      .then(data => {
        console.log(data[0])
        this.patients=data[0];
        return data
      })
      .then(response => {
        // this.dbDate = moment(response.birth_date, 'YYYY-MM-DD')
      })
      .catch(error => {
        console.log(error)
      })

  },
    unmounted () {},
    methods: {
      closeWindow() {
        window.close();
    },
    async preventInvalidInput(event, field) {
  const inputVal = event.target.value;
  const valid = /^[\d.]*$/.test(inputVal); // 입력값이 숫자와 소수점으로만 이루어졌는지 확인

  if (valid) {
    // 유효한 값이 입력된 경우, 입력값을 Vue.js 인스턴스의 데이터에 반영
    this[field] = inputVal;
    event.target.style.borderColor = 'green';
  } else {
    // 유효하지 않은 값이 입력된 경우, 이전에 입력된 유효한 값을 사용하여 입력값을 대체
    event.target.value = this[field] || '';
    event.target.style.borderColor = 'red';
  }

  if (inputVal === '' && this[field] !== '') {
    this[field] = '';
    event.target.style.borderColor = 'green';
  }
  if (inputVal === '') {
  event.target.style.borderColor = 'red';
  return;
}
},
  async insertRecord() {

// 서버로 보낼 데이터 객체 생성
  const record_i = {
      pid : this.patients.pid,
      input_time: this.clickTime,
      birth_date: this.patients.birth_date,
      Gender: this.patients.Gender,
      HR: this.HR,
      O2Sat: this.O2Sat,
      Temp: this.Temp,
      Resp: this.Resp,
      SBP: this.SBP,
      DBP: this.DBP,
      sepsis_in_six: 0,
      sepsis_percent: 0
    };
    try {
      // API 호출
      const response1=await axios.post(`http://127.0.0.1:8002/api/vital_insert/${record_i.pid}`,record_i);
      await axios.get(`http://127.0.0.1:8002/api/predict_sepsis/${record_i.pid}`);
      // alert("입력 성공");
      window.close();
      // 응답 데이터 확인
      // 창 닫기
    }
    catch (error) {
      console.error(error);
      // alert("입력값을 확인해주세요.")
  }
},

  }
}
</script>
<style>
@import "../../assets/AddVital.css";
</style>

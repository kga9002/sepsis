<template>
  <div id="wrap-box">
    <h3 style="text-align: center;">새 환자 추가</h3>
    <table>
      <tr>
        <td>이름</td>
        <td><input type="text" v-model="name" :style="name ? 'border-color: green;' : 'border-color: red;'"></td>
      </tr>
      <tr>
        <td>생년월일</td>
        <td><input type="date" v-model="birth_date" :style="birth_date ? 'border-color: green;' : 'border-color: red;'"></td>
      </tr>
      <tr>
        <td>성별</td>
        <td>
          <input type="radio" name="Sex" value="M">M
          <input type="radio" name="Sex" value="F">F
        </td>
      </tr>
      <tr>
        <td>담당 의사 번호</td>
        <td><input type="text" v-model="emp_id" :style="emp_id ? 'border-color: green;' : ''" @input="preventInvalidInput($event,'emp_id')"></td>
      </tr>
      <tr>
        <td>HR</td>
        <td><input type="text" v-model="HR" :style="HR ? 'border-color: green;' : ''" @input="preventInvalidInput($event,'HR')"></td>
      </tr>
      <tr>
        <td>O2Sat</td>
        <td><input type="text" v-model="O2Sat" :style="O2Sat ? 'border-color: green;' : ''" @input="preventInvalidInput($event,'O2Sat')"></td>
      </tr>
      <tr>
        <td>Temp</td>
        <td><input type="text" v-model="Temp" :style="Temp ? 'border-color: green;' : ''" @input="preventInvalidInput($event,'Temp')"></td>
      </tr>
      <tr>
        <td>Resp</td>
        <td><input type="text" v-model="Resp" :style="Resp ? 'border-color: green;' : ''" @input="preventInvalidInput($event,'Resp')"></td>
      </tr>
      <tr>
        <td>SBP</td>
        <td><input type="text" v-model="SBP" :style="SBP ? 'border-color: green;' : ''" @input="preventInvalidInput($event,'SBP')"></td>
      </tr>
      <tr>
        <td>DBP</td>
        <td><input type="text" v-model="DBP" :style="DBP ? 'border-color: green;' : ''" @input="preventInvalidInput($event,'DBP')"></td>
      </tr>
    </table>
    <input type="hidden" v-model="admin_date">
    <button type="submit" class="btn">저장</button>
    <button class="btn" @click="closeWindow">취소</button>
  </div>
</template>
<script>
import moment from 'moment';
import axios from 'axios'
export default {
  components: {},
  data () {
    return {
      sampleData: '',
      name:'',
      birth_date:'',
      sex:'',
      admin_date:moment().format('YYYY-MM-DDTHH:mm:ss'),
      emp_id:'',
      HR:'',
      O2Sat:'',
      Temp:'',
      Resp:'',
      SBP:'',
      DBP:''

    }
  },
  setup () {},
  created () {},
  mounted () {},
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
  }
}
</script>
<style>
@import "../../assets/AddPatient.css";
</style>

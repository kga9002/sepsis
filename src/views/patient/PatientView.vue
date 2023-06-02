<template>
  <div id="wrap">
    <div id="table">
      <div id="right">
        <button @click="reRun" id="rerun-btn">새로고침</button>
        <button @click="AddLab" id="addmore">Lab 추가</button>
        <button @click="AddVital" id="addmore">정보추가</button>
        <input type="date" id="src-date" v-model="selectedDate" />
        <button id="submit" type="submit" @click="chooseDate">확인</button>
      </div>
      <div id="table-wrap">
        <table id="fulltable">
          <tr>
            <td style="font-weight: bold; background-color: #dff2f5">이름</td>
            <td>{{ patients.name }}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; background-color: #dff2f5">나이</td>
            <td>{{ patients.Age }}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; background-color: #dff2f5">성별</td>
            <td>{{ gender }}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; background-color: #dff2f5">
              환자번호
            </td>
            <td>{{ patients.pid }}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; background-color: #dff2f5">
              생년월일
            </td>
            <td>{{ patients.birth_date }}</td>
          </tr>
        </table>
      </div>
      <div id="score" :style="{ 'background-color': bgColor }">
        <div id="real-score">{{ patients.sepsis_percent }}</div>
        <div id="scoreup">
          <span v-show="isUp"><i class="fa-solid fa-caret-up"></i></span>
          <span v-show="!isUp"><i class="fa-solid fa-caret-down"></i></span>
          {{ Math.abs(this.scoreGap) }}
        </div>
      </div>
      <div id="graph">
        <Chart :pid="loadpid" style="width: 750px; height: 240px" />
      </div>
    </div>
    <div id="under">
      <div id="body">
        <div id="leftarrow">
          <button @click="changeDateBefore" class="date-btn">
            <i class="fa-solid fa-left-long fa-3x" style="color: #6c757D"></i>
          </button>
        </div>
        <div id="tablewrap">
          <Vital
            :patients="patients"
            :dbDate="dbDate"
            :selectedDate="selectedDate"
            :currentDate="currentDate"
            :loadpid="loadpid"
          ></Vital>
        </div>
        <div id="rightarrow">
          <button @click="changeDateAfter" class="date-btn">
            <i class="fa-solid fa-right-long fa-3x" style="color: #6c757D"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Chart from '../../components/Chart.vue'
import { useRouter } from 'vue-router'
import moment from 'moment'
import Vital from '../../components/Vital.vue'

export default {
  data() {
    return {
      patients: [],
      dbDate: null,
      selectedDate: this.$route.params.date,
      currentDate: this.$route.params.date,
      loadpid: this.$route.params.pid,
      scoreGap: 0,
      isOk: true
    }
  },
  components: {
    Chart,
    Vital
  },
  watch: {
    currentDate: function (newVal, oldVal) {
      this.selectedDate = newVal
      this.currentDate = newVal
    }
  },
  setup() {
    const router = useRouter()
    const updateParent = () => {
        window.opener.location.reload(); // 부모 창 새로고침
      };
    const AddVital = () => {
      window.open(
        router.resolve({ name: 'AddVital' }).href,
        'AddVital',
        'width=500,height=500'
      );
      window.addEventListener('beforeunload', updateParent); // 창이 닫히기 전에 업데이트 함수 호출
    }

    const AddLab = () => {
      window.open(
        router.resolve({ name: 'AddLab' }).href,
        'AddLab',
        'width=500,height=500'
      );
      window.addEventListener('beforeunload', updateParent); // 창이 닫히기 전에 업데이트 함수 호출
    }

    return {
      AddLab,
      AddVital
    }
  },
  computed: {
    gender() {
      return this.patients.Gender === 1 ? 'F' : 'M'
    },
    bgColor() {
      return this.patients.sepsis_percent >= 80 ? '#fab1a0' : '#85E9A7'
    },
    tomorrow() {
      return moment(this.currentDate).add(1, 'day').format('YYYY-MM-DD')
    },
    yesterday() {
      return moment(this.currentDate).subtract(1, 'day').format('YYYY-MM-DD')
    },
    isUp() {
      return this.scoreGap >= 0
    }
},
  methods: {
    getPatientName() {
      const result = this.patients.filter(
        (patient) => patient.pid === this.$route.params.pid
      )
    },
    chooseDate() {
      this.currentDate = this.selectedDate
    },
    changeDateBefore() {
      this.currentDate = this.yesterday
    },
    changeDateAfter() {
      this.currentDate = this.tomorrow
    },
    reRun() {
      window.location.reload()
    },

  },
  mounted() {
    // axios.get('http://127.0.0.1:8002/api/get_latest_all/' + this.$route.params.pid)
    axios.all([axios.get('http://127.0.0.1:8002/api/get_latest_all/'+ this.$route.params.pid),axios.get("http://127.0.0.1:8002/api/chart_records/" + this.$route.params.pid)])
      // this.route.params.date
      .then(
        axios.spread((res1, res2) => {
          console.log(res2.data);
          console.log(res2.data[0].sepsis_percent); 53
          console.log(res2.data[1].sepsis_percent); 74
          this.patients = res1.data[0];
          this.nowScore = res2.data[0].sepsis_percent;
          this.beforeScore = res2.data[1].sepsis_percent;

          this.scoreGap = parseFloat((this.nowScore - this.beforeScore).toFixed(2));
          console.log(this.scoreGap);
          console.log(this.scoreGapClass);
          return data();
        })
      )

      .then((response) => {
        return response.data
      })
      // .then((data) => {
      //   console.log(data[0])
      //   this.patients = data[0]
      //   return data
      // })
      .then((response) => {
        // this.dbDate = moment(response.birth_date, 'YYYY-MM-DD')
      })
      .catch((error) => {
        console.log(error)
      }),
      this.getPatientName()
  }
}
</script>

<style scoped>
@import '../../assets/PatientView.css';
</style>
<!-- this.patients = response.data.patients -->

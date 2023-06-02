<template>
  <div>
    <table id="realtable">
        <thead>
          <tr>
            <td style="width: 20%; font-weight: bold; background-color: #DFF2F5;">Time</td>
            <td style="width: 10%; font-weight: bold; background-color: #DFF2F5;">HR</td>
            <td style="width: 10%; font-weight: bold; background-color: #DFF2F5;">O2Sat</td>
            <td style="width: 10%; font-weight: bold; background-color: #DFF2F5;">Temp</td>
            <td style="width: 10%; font-weight: bold; background-color: #DFF2F5;">Resp</td>
            <td style="width: 10%; font-weight: bold; background-color: #DFF2F5;">SBP</td>
            <td style="width: 10%; font-weight: bold; background-color: #DFF2F5;">DBP</td>
            <td style="width: 10%; font-weight: bold; background-color: #DFF2F5;">Sepsis-Score</td>
          </tr>
        </thead>
        <tbody>
          <tr id="td-bold">
            <td style="cursor: pointer; font-weight: bold; padding: 5px;">RECENT<br>{{  patients.input_time }}</td>
            <td>{{ patients.HR }}</td>
            <td>{{ patients.O2Sat }}</td>
            <td>{{ patients.Temp }}</td>
            <td>{{ patients.Resp }}</td>
            <td>{{ patients.SBP }}</td>
            <td>{{ patients.DBP }}</td>
            <td>{{ patients.sepsis_percent }}</td>
          </tr>
          <tr v-for="(vs, index) in all" :key="index" :value="vs.input_time">
            <td @click="EditVital($event)" style="cursor: pointer; font-weight: bold; padding: 5px;" class="hover-gradient">{{ vs.input_time }}</td>
            <td>{{ vs.HR }}</td>
            <td>{{ vs.O2Sat }}</td>
            <td>{{ vs.Temp }}</td>
            <td>{{ vs.Resp }}</td>
            <td>{{ vs.SBP }}</td>
            <td>{{ vs.DBP}}</td>
            <td>{{ vs.sepsis_percent }}</td>
          </tr>
        </tbody>
      </table>
  </div>
</template>
<script>
import axios from 'axios'
import { useRouter } from 'vue-router'

export default {
  name: "Vital",
  props: {
    patients: Object,
    dbDate: null,
    selectedDate: String,
    currentDate: String,
    loadpid: String
  },
  components: {},
  data() {
    return {
      all: []
    }
  },
  setup() {
    const router = useRouter()
    const EditVital = (event) => {
      const targetValue = event.target
    window.open(router.resolve({ name: 'EditVital', params: { input: targetValue.innerHTML } }).href, 'EditVital', 'width=500,height=500')
    }

    return {
      EditVital
    }
  },
  created() {},
  watch: {
  currentDate(newVal, oldVal) {
    this.getDataFromServer();
  },
  
},
  mounted() {
    this.getDataFromServer();
  },
  unmounted() {},
  methods:{
    getDataFromServer() {
      axios.get("http://127.0.0.1:8002/api/get_select_date?pid=" + this.loadpid + "&date=" + this.currentDate)
    .then(data => {
        console.log(data['data'])
        this.all=data['data'];
        return data
      })
    }
  },
  computed: {
    tomorrow() {
      return moment(this.currentDate).add(1, "day").format("YYYY-MM-DD");
    },
    yesterday() {
      return moment(this.currentDate).subtract(1, "day").format("YYYY-MM-DD");
    }
  }
}
</script>
<style scoped>
* {
  font-family: 'Noto Sans KR', sans-serif;
}
#realtable{
  margin-top: 50px;
  /* display: inline-block; */
  width: 100%;
  border-collapse : collapse;
  margin-top: 30px;
  text-align: center;
}
#realtable tr td{
  border-bottom: 1px solid #ced6e0;
  height: 50px;
}

tbody tr#td-bold td{
  font-weight: bold;
}

.hover-gradient:hover {
   box-shadow: 4px 4px 3px #6c757D inset
}
</style>
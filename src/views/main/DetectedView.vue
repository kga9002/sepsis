<template>
  <div>
    <div id="top-wrap">
      <div id="addpatient">
        <button @click="AddPatient" class="btn">환자 추가</button>
      </div>
      <div id="rerun">
        <span>{{ clickTime }}</span>
        <button @click="reRun" id="rerun-btn" class="btn" >새로고침</button>
      </div>
    </div>
    <div>
      <table>
        <thead>
          <tr>
            <td style="width: 5%;"></td>
            <td style="width: 13%;">InputTime</td>
            <td style="width: 12%;">PID</td>
            <td style="width: 10%;">Name</td>
            <td style="width: 5%;">Age</td>
            <td style="width: 5%;">Sex</td>
            <td style="width: 5%;">HR</td>
            <td style="width: 5%;">O2Sat</td>
            <td style="width: 5%;">Temp</td>
            <td style="width: 5%;">Resp</td>
            <td style="width: 5%;">SBP</td>
            <td style="width: 5%;">DBP</td>
            <td style="width: 15%;">Sepsis-Score</td>
          </tr>
        </thead>

        <!-- tbody for문 돌리기 10명 -->
        <tbody v-for="(patient, index) in (searchData && searchData.length) ? searchData : patients" :key="index">
          <tr>
            <td><input type="checkbox" style="width: 20px; height: 20px; cursor: pointer;" @click="addOn(index)"/></td>
            <td>{{ patient.input_time }}</td>
            <td style="font-weight: bold; cursor: pointer;" class="hover-gradient" @click="navigateToRoute(patient)" >

          {{ patient.pid }}

            </td>
            <td>{{ patient.name }}</td>
            <td>{{ patient.Age }}</td>
            <td>{{  gender[index] }}</td>
            <td>{{ patient.HR }}</td>
            <td>{{ patient.O2Sat }}</td>
            <td>{{ patient.Temp }}</td>
            <td>{{ patient.Resp }}</td>
            <td>{{ patient.SBP }}</td>
            <td>{{ patient.DBP }}</td>
            <td>{{ patient.sepsis_percent }}</td>
          </tr>
          <tr v-if="patient.isAddOn">
            <td colspan="13">
              PID <input type="text" readonly v-model="patient.pid" @input="preventInvalidInput" :name="'fast_pid'+patient.pid">
              Name <input type="text" readonly v-model="patient.name" @input="preventInvalidInput" :name="'fast_name'+patient.pid">
              HR <input type="text" @input="preventInvalidInput" :name="'fast_HR'+patient.pid">
              O2Sat <input type="text" @input="preventInvalidInput" :name="'fast_O2Sat'+patient.pid">
              Temp <input type="text" @input="preventInvalidInput" :name="'fast_Temp'+patient.pid">
              Resp <input type="text" @input="preventInvalidInput" :name="'fast_Resp'+patient.pid">
              SBP <input type="text" @input="preventInvalidInput" :name="'fast_SBP'+patient.pid">
              DBP <input type="text" @input="preventInvalidInput" :name="'fast_DBP'+patient.pid">
              <input type="hidden" :name="'fast_birth_date'+patient.pid" :value="patient.birth_date">
              <input type="hidden" :name="'fast_Gender'+patient.pid" :value="patient.Gender">
              <button type="button" :id="'addbtn'+patient.pid" @click="insertRecord(patient.pid)"> 추가 </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pointer">
    <div class="pagination-container">
      <ul class="pagination">
        <li :class="{disabled: currentPage === 1}">
          <a @click="onchange(1)">〈〈</a>
        </li>
        <li :class="{disabled: currentPage === 1}">
          <a @click="onchange(currentPage - 1)" :style="{ pointerEvents: currentPage === 1 ? 'none' : 'auto', opacity: currentPage === 1 ? 0.5 : 1 }">〈</a>
        </li>
        <li v-for="n in pages" :key="n" :class="{active: n === currentPage}">
          <a @click="onchange(n)">{{ n }}</a>
        </li>
        <li :class="{disabled: currentPage === pageCount}">
          <a @click="onchange(currentPage + 1)" :style="{ pointerEvents: currentPage === pageCount ? 'none' : 'auto', opacity: currentPage === pageCount ? 0.5 : 1 }">〉</a>
        </li>
        <li :class="{disabled: currentPage === pageCount}">
          <a @click="onchange(pageCount)" :style="{cursor: currentPage === pageCount ? 'default' : 'pointer'}">〉〉</a>
        </li>
      </ul>
      <div class="page-search-container">
        <input type="text" v-model="pageSearchTerm" placeholder="Search page" id="page-src">
        <button @click="goToPage" id="page-btn">Go</button>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import axios from 'axios'
import { useRouter } from 'vue-router'

export default {
  components: {},
  data () {
    return {
      clickTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      isAddOn: false,
      patients: [],
      addOnIndex: -1,
      selectedPatients: [],
      selectedPatient: null,
      count: 0,
      perPage:10,
      pages:[],
      currentPage:1,
      page: {
                page: 0,
                limit: 10,
      },
      searchTerm: '',
      pageSearchTerm: '',
      currentDate: "",
      searchQuery:"",
      searchData: [], // 검색 결과 데이터
      path:""
    }
  },
  setup () {
    const router = useRouter()

    const AddPatient = () => {
      window.open(router.resolve({ name: 'AddPatient' }).href, 'AddPatient', 'width=500,height=500')
    }

    return {
      AddPatient
    }

  },
  created () {
    // use(VueToast, {
    //   position: 'top-right',
    // });
  },
  watch: {
    '$store.state.searchQuery'(newSearchQuery, oldSearchQuery) {
    this.searchQuery=this.$store.state.searchQuery
    if (newSearchQuery !== oldSearchQuery) {
      this.fetchData();
    }
    if (this.searchQuery === "") {
      this.searchQuery = '';
      this.currentPage = 1;
      this.fetchData();
    }
  },
  patients: function(newPatients, oldPatients) {
    const addedNames = newPatients.map(patient => patient.name);
    const deletedNames = oldPatients.filter(patient => !newPatients.some(p => p.name === patient.name));
    const message = `${addedNames.join(', ')} 환자가 추가되었고, ${deletedNames.join(', ')} 환자가 제거되었습니다.`;

    this.showToast(message);
    console.log(message);
    // this.$toast.success({
    //   message: message,
    //   duration: 3000, // 2초 동안 표시
    //   position: 'top', // 화면 상단에 표시
    //   className: 'custom-class', // 사용자 지정 CSS 클래스 적용
    //   onClose: () => {
    //     // console.log('토스트가 닫혔습니다.');
    //   }
    // });
      console.log(message);
  }
},
  mounted () {
    axios.get("http://127.0.0.1:8002/api/get_latest_sepsis_percent")
    .then(res => res.data)
    .then(data => {
      this.patients = data.data;
      this.count = data.count;
      this.page = data.page;
      return data;
    })
    .catch(error => {
      console.log(error);
    });

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    this.currentDate = `${year}-${month}-${day}`;
  },
  unmounted () {},
  methods: {
    reRun() {
      this.clickTime = moment().format('YYYY-MM-DD HH:mm:ss'),
      window.location.reload()
    },
    showToast(message) {
    this.$swal(message) // SweetAlert2를 사용하여 메시지를 표시합니다.
  },
    addOn(index) {
  const patient = this.patients[index];
  if (patient) {
    if (!patient.isAddOn) {
      this.selectedPatient = {}; // 추가 입력 행이 닫힌 경우, 선택한 환자 정보 초기화
    }
    patient.isAddOn = !patient.isAddOn;
    if (patient.isAddOn) {
      this.selectPatient(patient, index);
    }
  }
},
navigateToRoute(patient) {
      // 라우팅 동작을 수행합니다.
      this.$router.push({ name: 'PatientView', params: { pid: patient.pid, date: patient.input_time.slice(0, 10) } })
    },
  selectPatient(patient, index) {
    if (!patient) return;
    this.selectedPatient = {
      pid: patient.pid,
      name: patient.name,
      index: index // 선택된 환자의 인덱스도 함께 저장
    };
  },
  async fetchData() {
      let axiurl = 'http://127.0.0.1:8002/api/get_latest_sepsis_percent';
      let params = {
        limit: this.perPage,
        page: this.currentPage,
      };
      this.patients = [];
      this.searchData = [];

      if (this.searchQuery) { // 검색어가 있으면 url 바꿔줌
        console.log(this.searchQuery,this.$store.state.searchQuery);
        axiurl = 'http://127.0.0.1:8002/api/get_search_data';
        this.path=this.$route.path;
        params = {
          path: this.path,
          search_str: this.searchQuery,
          limit: this.perPage,
          page: this.currentPage,
        };
      }
      const response = await axios.get(axiurl, { params });
      if (this.searchQuery) { // 검색어가 있으면 저장하는 객체 이름 바꿔주고 v-if문으로 구분함
        this.searchData = response.data.data;
        this.count = response.data.count;
        this.page = response.data.page.page;
      }
      else {
        this.patients = response.data.data;
        this.count = response.data.count;
        this.page = response.data.page.page;

      }
      // 강제 업데이트!
      this.$forceUpdate();
      },
      // 검색어 변경
    onSearch(query) {
      this.searchQuery = query;
      this.currentPage = 1;
      this.fetchData();
    },
    onchange(page) {
      this.currentPage = page;
      this.fetchData();
    },
    goToPage() {
      if (this.pageSearchTerm === '') return;
      const pageNum = parseInt(this.pageSearchTerm);
      if (!isNaN(pageNum) && pageNum > 0 && pageNum <= this.pageCount) {
        this.currentPage = pageNum;
      }
      this.pageSearchTerm = '';
    },
    async preventInvalidInput(event) {
      const inputVal = event.target.value;
      const inputName = event.target.name;
      const isValidInput = /^[\d.]*$/.test(inputVal);

      if (!isValidInput) {
        event.target.value = '';
        event.target.classList.add('invalid-input');
        } else {
        event.target.classList.remove('invalid-input');
        }

      switch(inputName) {
        case "fast_HR{patient.pid}":
        this.HR = isValidInput ? inputVal : '';
        break;
        case "fast_O2Sat{patient.pid}":
        this.O2Sat = isValidInput ? inputVal : '';
        break;
        case "fast_Temp{patient.pid}":
        this.Temp = isValidInput ? inputVal : '';
        break;
        case "fast_Resp{patient.pid}":
        this.Resp = isValidInput ? inputVal : '';
        break;
        case "fast_SBP{patient.pid}":
        this.SBP = isValidInput ? inputVal : '';
        break;
        case "fast_DBP{patient.pid}":
        this.DBP = isValidInput ? inputVal : '';
        break;
      }
      if (!isValidInput || inputVal === '') {
      event.target.style.borderColor = 'red';
      } else {
      event.target.style.borderColor = 'green';
      }
      },
    async insertRecord(pid) {
      let fast_pid=document.querySelector("input[name=fast_pid"+pid+"]").value;
      let fast_birth_date=document.querySelector("input[name=fast_birth_date"+pid+"]").value;
      let fast_Gender=document.querySelector("input[name=fast_Gender"+pid+"]").value;
      let fast_HR=document.querySelector("input[name=fast_HR"+pid+"]").value;
      let fast_O2Sat=document.querySelector("input[name=fast_O2Sat"+pid+"]").value;
      let fast_Temp=document.querySelector("input[name=fast_Temp"+pid+"]").value;
      let fast_Resp=document.querySelector("input[name=fast_Resp"+pid+"]").value;
      let fast_SBP=document.querySelector("input[name=fast_SBP"+pid+"]").value;
      let fast_DBP=document.querySelector("input[name=fast_DBP"+pid+"]").value;


      const record_i = {
        pid: parseInt(pid),
        input_time: moment(Date.now()).format('YYYY-MM-DDTHH:mm:ss'),
        birth_date:fast_birth_date,
        Gender : parseInt(fast_Gender),
        HR: parseInt(fast_HR),
        O2Sat: parseInt(fast_O2Sat),
        Temp: parseFloat(fast_Temp),
        Resp: parseInt(fast_Resp),
        SBP: parseInt(fast_SBP),
        DBP: parseInt(fast_DBP),
      };
      try {
    console.log(record_i);
    // API 호출
    const response = await axios.post(`http://127.0.0.1:8002/api/vital_insert/${pid}`,record_i);
    await axios.get(`http://127.0.0.1:8002/api/predict_sepsis/${record_i.pid}`);
    // 응답 데이터 확인
    console.log(response.data);
    // 창 닫기
    const patient = this.patients.find(p => p.pid === parseInt(pid));
    if (patient) {
      patient.isAddOn = false;
    }
    await this.fetchData();
  }
  catch (error) {
    alert("입력값을 확인해주세요.")
    console.error(error);
  }
}
  },
    computed: {
      gender() {
    return this.patients.map(patient => patient.Gender === 1 ? 'F' : 'M');
  },
    pageCount() {
      const count = this.count;
      const perPage = this.perPage;
      return Math.ceil(count / perPage);
    },
    pages() {
      const pagesToShow = 10;
      const pages = [];
      const halfPagesToShow = Math.floor(pagesToShow / 2);
      let start = this.currentPage - halfPagesToShow;
      if (start < 1) {
        start = 1;
      }
      let end = start + pagesToShow - 1;
      if (end > this.pageCount) {
        end = this.pageCount;
        start = end - pagesToShow + 1;
        if (start < 1) {
          start = 1;
        }
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },
  }
}
</script>

<style scoped>
@import "../../assets/DetectedView.css";

</style>

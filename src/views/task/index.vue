<script setup lang="ts">
  import {reactive, provide} from 'vue'
  import { useRouter } from 'vue-router';
  import TaskList from '@/components/list/TaskList.vue'
  import FooterTabbar from '@/components/FooterTabbar.vue'
  import Banner from './components/Banner.vue'
  import CitySwitch from './components/CitySwitch.vue'
  import PositionType from './components/PositionType.vue'
  import Screen from './components/Screen.vue'
  // 引用接口
  import { taskStore } from '@/store/task'
  import { taskAllList } from '@/api/task'
  import { Toast } from 'vant';
  const router = useRouter()
  const store = taskStore()
  const state = reactive({
    citySwitchBool: false,
    positionTypeBool: false,
    screenBool: false,
    positionValue: '',
    serviceMode: '',
    taskCycle: '',
    pageNum: 0,
    pageSize: 10,
    finished: false,
    loading:false,
    taskList: []
  })
  const getTaskAllList = async () => {
      state.loading = true
      if(state.pageNum == 1) state.taskList = []
      const res:any = await taskAllList({
        "position_name": state.positionValue, 
        "service_mode": state.serviceMode,
        "task_cycle": state.taskCycle, 
        "pageNum": state.pageNum,
        "pageSize": state.pageSize,
        "city": store.cityValue, 
      })
      if(res){
        // 拼接数组
          state.taskList = state.taskList.concat(res.records)
          state.loading = false
          if (state.taskList.length>=res.total) {
            state.finished = true
          }else{
            state.finished = false
          }
      }else{
          Toast(res.msg)
          state.loading = false
      }
  }
  const gotoSearch = () => {
    router.push('/task/search')
  }
  // 加载更多
  const onLoad = () => {
    state.pageNum = state.pageNum + 1
    getTaskAllList()
  }
  // 下拉刷新
  const onRefresh = () => {
    state.pageNum = 1
    getTaskAllList()
  }
  const closeCitySwitch = (name:any) => {
    if (name) {
      store.setCityValue(name)
      onRefresh()
    }
    state.citySwitchBool = false
  }
  const closePositionType = (name:any) => {
    if(name){
      state.positionValue = name
      onRefresh()
    }
    state.positionTypeBool = false
  }
  const closeScreen = (obj:any) => {
    if(obj){
      state.serviceMode = obj.mode
      state.taskCycle = obj.cycle
      onRefresh()
    }
    state.screenBool = false
  }
  provide('popup',{
    closeCitySwitch,
    closePositionType,
    closeScreen
  })
</script>
<template>
  <div class="task-page">
    <div class="task-top">
      <div class="task-top-city" @click="state.citySwitchBool = true">
        <i></i>
        <strong>{{store.cityValue}}</strong>
        <span></span>
      </div>
      <input type="text" @click="gotoSearch" readonly placeholder="请输入想要搜素的内容" />
      <router-link to="/message/systemList" class="task-icon-message"></router-link>
    </div>
    <Banner :type="2"></Banner>
    <div class="task-title">
      <h3>最新任务</h3>
      <div class="task-positon-pop" @click="state.positionTypeBool = true">{{state.positionValue||'职位类型'}}<span></span></div>
      <div class="task-screen-pop" @click="state.screenBool = true">筛选<span></span></div>
    </div>
    <van-pull-refresh v-model="state.loading" @refresh="onRefresh">
      <!-- 下拉列表 -->
      <van-list
        v-model:loading="state.loading"
        :finished="state.finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <TaskList :taskList="state.taskList"></TaskList>
        <div class="wy-no-data" v-if="!state.loading && state.taskList.length==0">暂无数据</div>
      </van-list>
    </van-pull-refresh>
    <!--切换城市弹窗-->
    <van-popup v-model:show="state.citySwitchBool" position="top" duration="0" :style="{ width: '100%',height: '100%' }">
      <CitySwitch></CitySwitch>
    </van-popup>
    <!--职位类型弹窗-->
    <van-popup v-model:show="state.positionTypeBool" position="top" duration="0" :style="{ width: '100%',height: '100%' }">
      <PositionType></PositionType>
    </van-popup>
    <!--筛选弹窗-->
    <van-popup v-model:show="state.screenBool" position="top" duration="0" :style="{ width: '100%',height: '100%' }">
      <Screen></Screen>
    </van-popup>
  </div>
  <FooterTabbar></FooterTabbar>
</template>
<style scoped>
  .task-page{
    background: #f9f9f9;
    padding: 0 0.59rem 3rem;
    min-height: calc(100vh - 3rem);
  }
  .task-top{
    display: flex;
    align-items: center;
    padding: 0.5rem 0 0.91rem;
  }
  .task-top-city{
    display: flex;
    align-items: center;
  }
  .task-top-city i{
    width: 1.04rem;
    height: 1.01rem;
    background: url('@/assets/img/icon/icon-place.png') no-repeat;
    background-size: 100%;
  }
  .task-top-city strong{
    font-size: 0.8rem;
    font-weight: 500;
    color: #333333;
    margin-left: 0.1rem;
  }
  .task-top-city span{
    margin: 0 0.6rem 0 0.2rem;
    display: inline-block;
    border-left: 0.18rem solid transparent;
    border-right: 0.18rem solid transparent;
    border-top: 0.36rem solid #333333;
  }
  .task-top input{
    flex: 1;
    height: 1.71rem;
    background: #ffffff url('@/assets/img/icon/icon-search.png') 0.35rem 0.3rem no-repeat;
    background-size: 9%; 
    border: 0.03px solid #EDEDED;
    border-radius: 0.85rem;
    font-size: 0.69rem;
    font-weight: 300;
    color: #999999;
    padding-left: 1.7rem;
  }
  .task-icon-message{
    width: 1.31rem;
    height: 1.28rem;
    background: url('@/assets/img/icon/icon-remind.png') no-repeat;
    background-size: 100%;
    margin-left: 0.27rem;
  }
  .task-title{
    display: flex;
    align-items: center;
    margin-bottom: 0.67rem;
    margin-top: 1.44rem;
  }
  .task-title h3{
    flex: 1;
    font-size: 0.96rem;
    line-height: 0.96rem;
    font-weight: bold;
    color: #333333;
  }
  .task-positon-pop,.task-screen-pop{
    font-size: 0.75rem;
    line-height: 0.75rem;
    font-weight: 300;
    color: #666666;
    margin-left: 0.56rem;
  }
  .task-positon-pop span,.task-screen-pop span{
    display: inline-block;
    border-left: 0.18rem solid transparent;
    border-right: 0.18rem solid transparent;
    border-top: 0.36rem solid #333333;
    margin-left: 0.25rem;
  }
</style>
<script setup lang="ts">
    import { reactive } from 'vue';
    import { useRouter } from 'vue-router';
    import { taskStore } from '@/store/task';
    import { hotSearch,taskAllList } from '@/api/task';
    import TaskList from '@/components/list/TaskList.vue'
    import { Toast } from 'vant';
    const router = useRouter()
    const store:any = taskStore()
    const taskId = router.currentRoute.value.params.id
    const his = localStorage.getItem('searchHistory')
    const state:any = reactive({
        value: '',
        searchFlag: false,
        loading: false,
        finished: false,
        taskList: [],
        pageNum: 1,
        pageSize: 10,
        // 历史搜索
        searchHistory: his?his.split(','): []
    })
    const leftBack = () => history.back();
    const onSearch = (value:any) => {
        // 将结果插入到历史记录当中
        if(!value) return
        state.searchFlag = true
        if(!state.searchHistory.includes(value)){
            state.searchHistory.push(value)
            localStorage.setItem('searchHistory',state.searchHistory)
        }
        getTaskAllList()
    }
    const onCancel = () => {
        state.searchFlag = false
        state.value = ''
    }
    const gotoSearch = (item:any) => {
        state.value = item
        onSearch(item)
    }
    // 清除历史记录
    const clearHistory = () => {
        state.searchHistory = []
        localStorage.removeItem('searchHistory')
    }
    // 热门搜索
    const getHotSearch = async () => {
        const res:any = await hotSearch({
            type: 1
        })
        if(res){
            store.setHotSearchList(res.data)
        }else{
            Toast(res.msg)
        }
    }
    if(store.hotSearchList.length<=0) getHotSearch()
    
    const getTaskAllList = async () => {
        state.loading = true
        if(state.pageNum == 1) state.taskList = []
        const res:any = await taskAllList({
            "position_name": state.value,
            "pageNum": state.pageNum,
            "pageSize": state.pageSize
        })
        if(res){
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
    const onRefresh = () => {
        state.pageNum = 1
        getTaskAllList()
    }
    const onLoad = () => {
        state.pageNum = state.pageNum + 1
        getTaskAllList()
    }
</script>
<template>
<div :class="state.searchFlag?'search-page':''">
    <van-nav-bar title="搜索" left-arrow @click-left="leftBack"/>
    <div class="search-cont">
        <van-search
            v-model="state.value"
            show-action
            placeholder="请输入搜索的职位"
            @search="onSearch"
            @cancel="onCancel"
        />
        <!-- 历史搜索 -->
        <div class="search-item" v-if="!state.searchFlag">
            <h3>搜索历史<van-icon name="delete-o" @click="clearHistory" /></h3>
            <!-- 搜索内容 -->
            <dl>
                <dt v-for="(item, index) in state.searchHistory" :key="index" @click="gotoSearch(item)">{{item}}</dt>
            </dl>
            <h3>热门搜索</h3>
            <dl>
                <dt v-for="(item, index) in store.hotSearchList" :key="index" @click="gotoSearch(item.title)">{{item.title}}</dt>
            </dl>
        </div>
        <!-- 具体搜索内容 -->
        <div class="search-list" v-show="state.searchFlag">
            <van-pull-refresh v-model="state.loading" @refresh="onRefresh">
            <van-list
                v-model:loading="state.loading"
                :finished="state.finished"
                finished-text=""
                @load="onLoad"
            >
                <TaskList :taskList="state.taskList"></TaskList>
                <div class="wy-no-data" v-if="!state.loading && state.taskList.length==0">暂无数据</div>
            </van-list>
            </van-pull-refresh>
        </div>
    </div>
</div>
</template>
<style scoped>
.search-page{
    background: #F9F9F9;
    height: 100%;
    min-height: 100vh;
}
.search-page .van-nav-bar{
    background: none;
}
:deep(.van-search__content){
    background: #F2F2F2;
    border-radius: 0.85rem;
}
:deep(.van-search--show-action){
    padding-left: 0px;
    background: none;
}
:deep(.van-search__action){
    font-size: 0.85rem;
    font-weight: 400;
    color: #666666;
    padding-right: 0px;
}
.search-cont{
    padding:0 0.64rem;
}
h3{
    font-size: 0.8rem;
    line-height: 0.8rem;
    font-weight: 500;
    color: #000000;
    margin: 0.85rem 0 0.85rem;
    display: flex;
}
h3 i{
    flex: 1;
    text-align: right;
    font-size: 0.9rem;
}
dl dt{
    background: #F5F5F5;
    border-radius: 0.16rem;
    padding: 0.45rem;
    font-size: 0.64rem;
    line-height: 0.64rem;
    font-weight: 400;
    color: #333333;
    margin-right: 0.51rem;
    margin-bottom: 0.53rem;
    display: inline-block;
}
</style>
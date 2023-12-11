import { createApp } from 'vue'
import './assets/css/style.css'
// import 'vant/lib/index.vue'
import App from './App.vue'
import store from './store'
import router from './router'
import { Button,NavBar,Tabbar,TabbarItem,Checkbox,Toast,Icon,Popup,Swipe, SwipeItem,List,PullRefresh,ActionBarIcon,Search,
    Loading,Field,SwipeCell,Uploader,Form,ActionSheet,DatetimePicker,Picker,CheckboxGroup,Dialog,Switch,RadioGroup, Radio } from 'vant'
import './utils/rem'
const app = createApp(App)
app.use(Button)
app.use(NavBar)
app.use(Tabbar)
app.use(TabbarItem)
app.use(Checkbox)
app.use(Toast)
app.use(Icon)
app.use(Popup)
app.use(Swipe)
app.use(SwipeItem)
app.use(List)
app.use(PullRefresh)
app.use(ActionBarIcon)
app.use(Search)
app.use(Loading)
app.use(Field)
app.use(SwipeCell)
app.use(Uploader)
app.use(Form)
app.use(ActionSheet)
app.use(DatetimePicker)
app.use(Picker)
app.use(CheckboxGroup)
app.use(Dialog)
app.use(Switch)
app.use(RadioGroup)
app.use(Radio)
app.use(store)
app.use(router)
app.mount('#app')
// createApp(App).mount('#app')

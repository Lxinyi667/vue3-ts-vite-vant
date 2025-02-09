import { defineStore } from 'pinia'
export const userStore = defineStore({
    id: 'user',
    state: () => {
        return {
            //基于token鉴权解决方案
            // 获取token
            token: localStorage.getItem('token') || '',
            role: localStorage.getItem('role') || '3',
            userInfo: {}
        }
    },
    actions: {
        setRole(type: string){
            this.role = type
        },
        setUserInfo(data: any){
            this.userInfo = data.user_info
            this.token = data.token
            this.role = data.user_info.role || '1'
            localStorage.setItem('token',this.token)
            localStorage.setItem('role',this.role)
        },
        logout(){
            this.token = ''
            this.userInfo = {}
            localStorage.removeItem('token')
            localStorage.removeItem('role')
        }
    }
})
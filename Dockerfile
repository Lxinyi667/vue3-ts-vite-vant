# 使⽤官⽅的 Node.js镜像作为基础镜像
FROM node:18 as build-stage
# 设置⼯作⽬录
WORKDIR /app
# 拷⻉ package.json 和 package-lock.json ⽤于安装依赖
COPY package*.json ./
# 安装应⽤依赖
RUN npm install
# 拷⻉应⽤代码到⼯作⽬录
COPY . .
# 运⾏ Vue 应⽤的构建命令
RUN npm run build
# 使⽤ Nginx镜像作为⽣产镜像的基础镜像
FROM nginx:latest as production-stage
# 将构建⽣成的 dist ⽬录中的⽂件拷⻉到 Nginx 的默认静态⽂件⽬录
COPY --from=build-stage /app/dist /usr/share/nginx/html
# 可选：可以添加⼀些 Nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf
# 暴露 80端⼝
EXPOSE 80
# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
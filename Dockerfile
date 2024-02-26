# node镜像
FROM node:20.10.0 as build-stage
RUN echo "-------------------- start build --------------------"

RUN echo "-------------------- web environment configuration --------------------"

# # 指定接下来的工作路径为/app  - 类似于cd命令
WORKDIR /app

COPY package*.json ./
# # 拷贝前端项目 当前目录下的所有文件到app目录下(./指当前所有的代码路径 .指上一步cd到app的路径)
COPY . .

RUN echo "-------------------- start install --------------------"

# 设置淘宝npm镜像
RUN npm config set registry https://registry.npmmirror.com

# 设置腾讯镜像地址
# RUN cnpm set registry https://mirrors.cloud.tencent.com/npm
#
RUN npm install


RUN echo "-------------------- end install --------------------"

RUN echo "-------------------- build start  --------------------"

# # 打包 - 目的：丢到nginx下跑。后面这个参数要拉满。
RUN npm run build --max_old_space_size=29096

RUN echo "-------------------- build end  --------------------"


FROM nginx:1.20.2
EXPOSE 80 443
RUN rm /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/build/*.conf /etc/nginx/conf.d/

COPY --from=build-stage /app/build/dist /usr/share/nginx/html/

# 使用daemon off的方式将nginx运行在前台保证镜像不至于退出
CMD ["nginx", "-g", "daemon off;"]

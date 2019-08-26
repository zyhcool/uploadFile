## 断点续传

#### 实现需求

- 实现分片上传
- 实现断点续传

#### 缺陷
- 无进度显示
- 上传中可以再次进行上传
- 只支持单文件上传
- 后端占用内存
- 断点是预先划定，颗粒度较大（较难解决）

#### stage2 的目标

1. 进度条、禁止其他操作
2. 多文件上传
// 阿里云OSS配置
export const ossConfig = {
  // OSS区域节点，例如：oss-cn-hangzhou
  region: process.env.ALIYUN_OSS_REGION || 'oss-cn-hangzhou',
  // 阿里云账号AccessKey
  accessKeyId: process.env.ALIYUN_OSS_ACCESS_KEY_ID || 'your-access-key-id',
  // 阿里云账号AccessKey Secret
  accessKeySecret: process.env.ALIYUN_OSS_ACCESS_KEY_SECRET || 'your-access-key-secret',
  // OSS存储空间名称
  bucket: process.env.ALIYUN_OSS_BUCKET || 'your-bucket-name',
  // 存储路径前缀
  prefix: 'blog/',
  // 自定义域名（如果有）
  customDomain: process.env.ALIYUN_OSS_CUSTOM_DOMAIN || '',
  // 是否使用自定义域名
  useCname: process.env.ALIYUN_OSS_USE_CNAME === 'true',
  // 是否使用SSL
  secure: process.env.ALIYUN_OSS_SECURE !== 'false',
};

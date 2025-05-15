import OSS from 'ali-oss';
import { ossConfig } from './config';

// 创建OSS客户端实例
export function createOSSClient() {
  try {
    const client = new OSS({
      region: ossConfig.region,
      accessKeyId: ossConfig.accessKeyId,
      accessKeySecret: ossConfig.accessKeySecret,
      bucket: ossConfig.bucket,
      cname: ossConfig.useCname,
      endpoint: ossConfig.useCname ? ossConfig.customDomain : undefined,
      secure: ossConfig.secure,
    });
    
    return client;
  } catch (error) {
    console.error('创建OSS客户端失败:', error);
    throw error;
  }
}

// 上传文件到OSS
export async function uploadToOSS(file: File | Buffer, fileName: string): Promise<string> {
  try {
    const client = createOSSClient();
    const objectName = `${ossConfig.prefix}${fileName}`;
    
    // 上传文件
    const result = await client.put(objectName, file);
    
    // 返回文件URL
    if (ossConfig.useCname && ossConfig.customDomain) {
      return `${ossConfig.secure ? 'https' : 'http'}://${ossConfig.customDomain}/${objectName}`;
    }
    
    return result.url;
  } catch (error) {
    console.error('上传文件到OSS失败:', error);
    throw error;
  }
}

// 从OSS删除文件
export async function deleteFromOSS(fileName: string): Promise<void> {
  try {
    const client = createOSSClient();
    const objectName = `${ossConfig.prefix}${fileName}`;
    
    // 删除文件
    await client.delete(objectName);
  } catch (error) {
    console.error('从OSS删除文件失败:', error);
    throw error;
  }
}

// 获取OSS文件列表
export async function listOSSFiles(prefix?: string): Promise<OSS.ObjectMeta[]> {
  try {
    const client = createOSSClient();
    const fullPrefix = prefix ? `${ossConfig.prefix}${prefix}` : ossConfig.prefix;
    
    // 获取文件列表
    const result = await client.list({
      prefix: fullPrefix,
      'max-keys': 1000,
    });
    
    return result.objects || [];
  } catch (error) {
    console.error('获取OSS文件列表失败:', error);
    throw error;
  }
}

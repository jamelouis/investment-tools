import React from 'react';
import { Upload, message, Button } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { Dragger } = Upload;

interface FileUploaderProps {
  onFileLoad: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileLoad }) => {
  const handleFileChange: UploadProps['onChange'] = (info) => {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
      const file = info.file.originFileObj;
      if (file) {
        onFileLoad(file);
      }
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    accept: '.json,.csv',
    showUploadList: false,
    customRequest: ({ file, onSuccess }) => {
      setTimeout(() => {
        onSuccess("ok");
      }, 0);
    },
    onChange: handleFileChange,
  };

  return (
    <div className="max-w-3xl file-upload">
    <Dragger {...uploadProps}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">Click or drag file to this area to upload</p>
    <p className="ant-upload-hint">
      Support for a single or bulk upload. Strictly prohibited from uploading company data or other
      banned files.
    </p>
  </Dragger>
  </div>
  )
  return (
    <Upload {...uploadProps}>
      <Button icon={<UploadOutlined />}>Click to Upload</Button>
    </Upload>
  );
};

export default FileUploader;
import { useState } from 'react';

const useFileInputsState = (fileProperties) => {
  const seedState = fileProperties.map(file => ({ name: file.name, fileList: null }));
  const [fileLists, setFileLists] = useState(seedState);

  const changeFileList = (name) => (e) => {
    const arrayId = fileLists.findIndex(ifl => ifl.name === name);
    const item = fileLists[arrayId];
    const itemStateModel = {
      name: item.name,
      fileList: e.target.files,
    };
    const newFileList = [
      ...fileLists.slice(0, arrayId),
      itemStateModel,
      ...fileLists.slice(arrayId + 1)
    ];
    setFileLists(newFileList);
  };

  return [
    fileLists,
    changeFileList,
  ];
};

export default useFileInputsState;
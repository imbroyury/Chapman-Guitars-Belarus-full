import { useState } from 'react';

const useItemFormState = (mainProperties, additionalProperties = []) => {
  const seedState = [...mainProperties, ...additionalProperties]
    .reduce((state, property) => {
      state[property.name] = property.initial;
      return state;
    }, {});

  const [itemState, setItemState] = useState(seedState);

  const handleChangeProperty = (e) => {
    const { name, value } = e.target;
    setItemState({
      ...itemState,
      [name]: value,
    });
  };

  const isStateValid = [...mainProperties, ...additionalProperties]
    .every(property => {
      const value = itemState[property.name];
      if (property.type === 'string') return value !== '';
      if (property.type === 'select') return value !== '';
      if (property.type === 'number') return true;
      return true;
    });

  console.log('item form state: ', itemState);
  return [
    itemState,
    handleChangeProperty,
    isStateValid,
  ];
};

export default useItemFormState;
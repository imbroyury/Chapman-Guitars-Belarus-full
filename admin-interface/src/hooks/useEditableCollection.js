import { useState } from 'react';

const useEditableCollection = () => {
  const [collection, setCollection] = useState([]);

  const setInitialCollection = (collection) => {
    const toStateModel = item => ({
      id: item.id,
      isEditMode: false,
      initial: {
        ...item,
      },
      edited: {
        ...item,
      }
    });
    setCollection(collection.map(toStateModel));
  };

  const setEditedItemState = (itemId, newState) => {
    const arrayId = collection.findIndex(item => item.id === itemId);
    const item = collection[arrayId];
    const itemStateModel = {
      ...item,
      edited: newState,
    };
    const newItem = [
      ...collection.slice(0, arrayId),
      itemStateModel,
      ...collection.slice(arrayId + 1)
    ];
    setCollection(newItem);
  };

  const setItemEditModeOn = (id) => {
    setCollection(collection.map(item => ({
      ...item,
      ...(item.id === id ? { isEditMode: true } : {})
    })));
  };

  const setItemEditModeOff = (id) => {
    setCollection(collection.map(artist => ({
      ...artist,
      ...(artist.id === id ? { isEditMode: false } : {})
    })));
  };

  const editItemProperty = (id) => (name, value) => {
    const item = collection.find(item => item.id === id);
    const { edited } = item;
    const afterEdit = {
      ...edited,
      [name]: value,
    };
    setEditedItemState(id, afterEdit);
  };

  const getEditedItemPropertiesPayload = (id, mainProperties, additionalProperties = []) => {
    const properties = [...mainProperties, ...additionalProperties];
    const item = collection.find(item => item.id === id);
    const { edited } = item;
    return properties.reduce((acc, property) => {
      acc[property.name] = edited[property.name];
      return acc;
    }, {});
  };

  return [
    setInitialCollection,
    setItemEditModeOn,
    setItemEditModeOff,
    editItemProperty,
    collection,
    getEditedItemPropertiesPayload,
  ];
};

export default useEditableCollection;
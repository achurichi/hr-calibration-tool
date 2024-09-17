import rootStore from "stores/root.store";

const useDescriptionType = (descriptionMap) => {
  const { uiStore } = rootStore;
  const { uiDescriptionStore } = uiStore;
  const selectedItemTypeOption = uiDescriptionStore.getSelectedItemTypeOption();

  if (!selectedItemTypeOption?.value) {
    return null;
  }

  return descriptionMap[selectedItemTypeOption.value] || null;
};

export default useDescriptionType;

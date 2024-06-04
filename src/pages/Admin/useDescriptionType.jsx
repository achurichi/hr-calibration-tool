import rootStore from "stores/root.store";

const useDescriptionType = (descriptionMap) => {
  const { uiStore } = rootStore;
  const { uiDescriptionStore } = uiStore;
  const selectedConfiguration = uiDescriptionStore.getSelectedConfiguration();

  return descriptionMap[selectedConfiguration.value] || null;
};

export default useDescriptionType;

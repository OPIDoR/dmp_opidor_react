
const defaultConfirmConfig = (t) => ({
  title: t("Are you sure ?"),
  text: t("Are you sure you want to delete this item?"),
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#2c7dad",
  cancelButtonColor: "#c6503d",
  cancelButtonText: t("Cancel"),
  confirmButtonText: t("Yes"),
});

const defaultDeleteErrorConfig = (t, recordName) =>  ({
  title: t("Error while deleting"),
  message: t("A problem has occurred while deleting the {{record}}", { record: t(recordName) }),
  icon: 'error',
});

export default {
  defaultConfirmConfig,
  defaultDeleteErrorConfig
};

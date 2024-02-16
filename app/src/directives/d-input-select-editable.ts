const inputSelectEditable = {
  mounted: (el: any) => {
    el.addEventListener("focus", () => {
      el.value = " ";
      el.value = "";
    });
  },
};
export default inputSelectEditable;

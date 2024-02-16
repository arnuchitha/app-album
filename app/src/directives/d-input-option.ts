const inputOption = {
  mounted: (el: any) => {
    const myele = el.parentNode;
    el.clickOutsideEvent = (event: any) => {
      if (myele.contains(event.target) == false) {
        el.nextSibling.style.display = "none";
      }
    };
    el.focusOutsideEvent = (event: any) => {
      if (myele.contains(event.target) == false) {
        el.nextSibling.style.display = "none";
      }
    };
    el.nextSibling.style.display = "none";
    el.addEventListener("focus", () => {
      el.nextSibling.style.display = "block";
    });
    document.addEventListener("focus", el.focusOutsideEvent, true);
    document.body.addEventListener("click", el.clickOutsideEvent);
  },
};
export default inputOption;

const calendarClick = (el: any) => {
  //(event)
  el.addEventListener("click", () => {
    el.previousSibling.childNodes[0].focus();
  });
};
export default calendarClick;

const tableScrollable = {
  mounted: (el: HTMLElement) => {
    el.addEventListener("scroll", function () {
      const vScroll = Array.from(
        el.getElementsByClassName("v-scrollable")
      )[0] as HTMLElement;
      // console.log(vScroll.clientWidth);
      vScroll.style.width = `${el.clientWidth + el.scrollLeft}px`;
    });
  },
};
export default tableScrollable;

const inputmaxchars = {
  mounted: (el: any, binding: any) => {
    const maxChars = binding.value;
    el.addEventListener(
      "input",
      () => {
        if (el.value.length > maxChars) {
          el.value = el.value.substr(0, maxChars);
        }
      },
      { bubbles: true }
    );
  },
};
export default inputmaxchars;

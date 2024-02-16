const dropdownEnter = (el: any) => {
  const element = el.childNodes[0];
  element.onkeydown = (e: any) => {
    if (e.code === "NumpadEnter") {
      element.dispatchEvent(
        new KeyboardEvent("keydown", {
          altKey: false,
          bubbles: true,
          cancelable: true,
          code: "Enter",
          composed: true,
          ctrlKey: false,
          detail: 0,
          isComposing: false,
          key: "Enter",
          keyCode: 13,
          metaKey: false,
          shiftKey: false,
          which: 13,
        })
      );
    }
  };
};
export default dropdownEnter;

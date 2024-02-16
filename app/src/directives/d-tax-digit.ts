const inputTaxDigit = {
  mounted: (el: any, binding: any) => {
    const valOrigin = binding.value as string;
    const valArr = valOrigin ? valOrigin.split("") : [""];
    const inputs = el.querySelectorAll("input");
    const keylast = inputs.length - 1;
    inputs.forEach((input: any, key: any) => {
      input.value = valArr[key];
      input.maxLength = "1";
      input.min = "0";
      input.max = "9";
      // input.inputMode="numeric";
      input.pattern = "[0-9]*";

      input.addEventListener("input", function () {
        if (input.value == "") {
          if (key > 0) {
            inputs[key - 1].focus();
            inputs[key - 1].select();
          }
          input.value = null;
        }

        if (input.value.length > input.maxLength)
          input.value = input.value.slice(0, input.maxLength);

        if (input.value && key < keylast) {
          inputs[key + 1].focus();
          inputs[key + 1].select();
        }
        valArr[key] = input.value;
      });

      input.addEventListener("keydown", function (e: any) {
        if (e.keyCode === 38 || e.keyCode === 40) {
          e.preventDefault();
        }
      });

      input.addEventListener("keyup", function (e: any) {
        if (e.keyCode === 38 || e.keyCode === 40) {
          e.preventDefault();
        }
        if (e.keyCode === 37) {
          //left arrow
          if (key > 0) {
            inputs[key - 1].focus();
            inputs[key - 1].select();
          }
        }
        if (e.keyCode == 39) {
          //right arrow
          if (key < keylast) {
            inputs[key + 1].focus();
            inputs[key + 1].select();
          }
        }
      });

      input.addEventListener("click", function () {
        input.select();
      });
    });
  },
};
export default inputTaxDigit;

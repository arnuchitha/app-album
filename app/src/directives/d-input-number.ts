import type iInputNumber from "@/interfaces/input-is-number";

const inputIsNumber = {
  mounted: (el: any, binding: any) => {
    const format = binding.value as iInputNumber;
    const decimalCount = Math.abs(format.setDecimal);
    const digitNum = Math.abs(format.setDigit);
    const setNegative = format.setNegative;
    const setDefaultvalue = format.setDefaultvalue;
    const isValueDecimal = (num: any) => String(num).split(".")[1] || "";
    const isValueInteger = (num: any) => String(num).split(".")[0] || "0";
    const isNegative = (num: any) => String(num).substring(0, 1) == "-";
    const isOverdigit = (x: any, y: any) => x.length > y;
    const isOverDecimal = (x: any, y: any) => x.length > y;

    //กรณี focus ให้ปรับข้อมูลให้อยู่ในรูปแบบ number
    el.addEventListener("focus", () => {
      const setDefaultOnFocus =
        el.value == "-" || el.value == "" || el.value == ".";
      const isValueOnFocus = setDefaultOnFocus
        ? ""
        : el.value.trim().replace(/,/gi, "");
      el.value = isValueOnFocus;
      el.select();
    });

    el.addEventListener("blur", () => {
      const convertModel = el.value.trim().replace(/,/gi, "");
      const setDefaultOnBlur =
        convertModel == "-" ||
        convertModel == "" ||
        convertModel == "." ||
        isNaN(Number(convertModel));

      const afterModel = setDefaultOnBlur
        ? 0
        : Number(el.value.trim().replace(/,/gi, ""));

      el.value = setDefaultOnBlur
        ? setDefaultvalue
        : afterModel
        .toLocaleString(format.setLocal,{ minimumFractionDigits: format.setDecimal });
    });
    //กรณี keydown
    el.addEventListener("keydown", (e: any) => {
      if (
        (e.key == "." && decimalCount == 0) ||
        (e.key == "-" && setNegative != true)
      ) {
        e.preventDefault();
      }
    });
    //กรณี keydown
    el.addEventListener("input", () => {
      const cursorPosition = el.selectionStart;
      const isOverDigitInt = isValueInteger(el.value);
      isOverDigitInt.substring(isNegative(isOverDigitInt) ? 1 : 0);
      const isOverDigitDecimal = isValueDecimal(el.value);
      const ispassCharactor = el.value == "." || el.value == "-";
      if (!ispassCharactor) {
        if (isNaN(Number(el.value))) {
          el.value = "";
        } else if (
          isOverdigit(isOverDigitInt, digitNum) ||
          isOverDecimal(isOverDigitDecimal, decimalCount)
        ) {
          let iv = isValueInteger(el.value);
          let idc = isValueDecimal(el.value);

          if (isOverdigit(isOverDigitInt, digitNum)) {
            iv = iv.substring(0, digitNum);
          }
          if (isOverDecimal(isOverDigitDecimal, decimalCount)) {
            idc = idc.substring(0, decimalCount);
          }

          const ires = iv + (idc !== "" ? "." + idc : "");
          el.value = ires;

          el.setSelectionRange(cursorPosition, cursorPosition);
        }
      }
    });
  },
};
export default inputIsNumber;

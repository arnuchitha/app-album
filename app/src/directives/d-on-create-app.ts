const onCreateApp = {
    created() {
        localStorage.removeItem("userlogin");
        const _THEME_STORAGE = import.meta.env.VITE_THEME_STORAGE;
        const theme = localStorage.getItem(_THEME_STORAGE) ? 'light-mode' : '';
        const body = document.querySelector("body") as HTMLBodyElement;
        if(theme == 'light-mode'){
          body.classList.toggle(theme);
        }
    },
  };
  export default onCreateApp;
  
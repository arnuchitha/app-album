const sidebaranimate = {
    mounted: (el: any) => {
        const workdone = ()=>{
            let isclose = el.classList.contains("close");
            let _target = el.childNodes[0];
            // console.log(isclose);
            if (isclose) {
                if(el.offsetWidth<300) {
                    _target.style.display = "none";   
                }

            }else{
                if(el.offsetWidth>300) {
                    _target.style.display = "flex"; ;   
                }     
            }
        }
        new ResizeObserver(workdone).observe(el)
    },
  };
  export default sidebaranimate;
  
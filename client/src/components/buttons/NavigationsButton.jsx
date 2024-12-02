import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MobileSidebarContext } from "../../context/MobileSidebarContext";
import { useContext } from "react";

function NavigationsButton() {
  const { setExpanded } = useContext(MobileSidebarContext);

  return (
    <div
      className='fixed z-[9999] left-6 top-4 w-8 h-8 flex items-center justify-center shadow rounded-full bg-white cursor-pointer dark:bg-black dark:shadow-neutral-500 dark:text-slate-200'
      onClick={() => { setExpanded(curr => !curr); }}
    >
      <FontAwesomeIcon icon={faBars}/>
    </div>
  );
}

export default NavigationsButton;

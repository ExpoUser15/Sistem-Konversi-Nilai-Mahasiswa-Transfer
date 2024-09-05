import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { ModeContext } from '../../context/ModeContext';
import React, { useContext, useEffect, useState } from "react";

function ModeButtons() {
  const { theme, setTheme } = useContext(ModeContext);

  useEffect(() => {
    if (localStorage.theme == "dark") {
      localStorage.theme = 'light';
    } else {
      localStorage.theme = 'dark'
    }
  }, [theme]);

  const toggleDarkMode = () => {
    setTheme(theme => !theme);
  };

  return (
    <div
      className='fixed z-[9999] right-6 top-4 w-8 h-8 flex items-center justify-center shadow rounded-full bg-white cursor-pointer dark:bg-black dark:shadow-neutral-700 dark:text-slate-200'
      onClick={toggleDarkMode}
    >
      {
        localStorage.theme === 'dark' ? <FontAwesomeIcon icon={faSun} /> : <FontAwesomeIcon icon={faMoon} />
      }
    </div>
  );
}

export default ModeButtons;

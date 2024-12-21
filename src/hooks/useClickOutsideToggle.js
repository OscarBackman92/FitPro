import { useEffect, useRef, useState } from "react";

/**
 * Custom hook that manages a toggle state and listens for clicks outside a specified element to close it.
 *
 * @returns {Object} An object containing:
 * - {boolean} expanded - The current state of the toggle.
 * - {function} setExpanded - Function to set the state of the toggle.
 * - {Object} ref - A React ref object to be attached to the element to detect outside clicks.
 */
const useClickOutsideToggle = () => {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setExpanded(false);
      }
    };

    document.addEventListener('mouseup', handleClickOutside);
    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, [ref]);

  return { expanded, setExpanded, ref };
};

export default useClickOutsideToggle;
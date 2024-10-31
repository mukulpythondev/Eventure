"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";

const DarkModeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDarkMode = theme === "dark";

  // Toggle function to switch themes
  const toggleDarkMode = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  useEffect(() => setMounted(true), []);

  // Avoid rendering until mounted to prevent hydration issues
  if (!mounted) return null;

  return (
    <div>
      <DarkModeSwitch
        checked={isDarkMode}
        onChange={toggleDarkMode}
        size={24}
      />
    </div>
  );
};

export default DarkModeToggle;

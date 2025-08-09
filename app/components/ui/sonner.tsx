import { Toaster as Sonner } from "sonner";

import { useTheme } from "~/hooks/use-theme";

interface ToasterProps {
  theme?: "light" | "dark" | "system";
  className?: string;
  style?: React.CSSProperties;
}

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as "light" | "dark" | "system"}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };

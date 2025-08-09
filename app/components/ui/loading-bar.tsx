import { useEffect, useState } from "react";
import { useNavigation } from "react-router";

interface LoadingBarProps {
  color?: string;
  height?: number;
  className?: string;
}

export function LoadingBar({
  color = "bg-primary",
  height = 3,
  className = "",
}: LoadingBarProps) {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (navigation.state === "loading" || navigation.state === "submitting") {
      setIsVisible(true);
      setProgress(30);

      // Simular progresso gradual
      const timer = setTimeout(() => {
        setProgress(70);
      }, 200);

      return () => clearTimeout(timer);
    } else if (navigation.state === "idle") {
      if (isVisible) {
        setProgress(100);

        // Esconder após completar
        const hideTimer = setTimeout(() => {
          setIsVisible(false);
          setProgress(0);
        }, 200);

        return () => clearTimeout(hideTimer);
      }
    }
  }, [navigation.state, isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-0 right-0 left-0 z-50 ${className}`}
      style={{ height: `${height}px` }}
    >
      <div
        className={`h-full ${color} transition-all duration-300 ease-out`}
        style={{
          width: `${progress}%`,
          boxShadow: progress > 0 ? `0 0 10px currentColor` : "none",
        }}
      />
    </div>
  );
}

// Componente alternativo mais simples usando apenas CSS
export function SimpleLoadingBar() {
  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";

  if (!isLoading) return null;

  return (
    <div className="bg-muted fixed top-0 right-0 left-0 z-50 h-1">
      <div
        className="bg-primary h-full animate-pulse"
        style={{
          background:
            "linear-gradient(90deg, transparent, currentColor, transparent)",
          animation: "loading-bar-slide 1.5s ease-in-out infinite",
        }}
      />
      <style>{`
        @keyframes loading-bar-slide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

// Hook para usar o estado de loading em componentes
export function useLoadingState() {
  const navigation = useNavigation();

  return {
    isLoading: navigation.state !== "idle",
    isSubmitting: navigation.state === "submitting",
    isNavigating: navigation.state === "loading",
    state: navigation.state,
  };
}

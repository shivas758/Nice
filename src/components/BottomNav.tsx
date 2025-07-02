import { Home, User, Users, HeartHandshake, BookOpen, GamepadIcon, MessageSquare } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: User, label: "My NICE!", path: "/profile" },
  { icon: Users, label: "Network", path: "/network" },
  // { icon: HeartHandshake, label: "Support", path: "/support" },
  { icon: BookOpen, label: "Resources", path: "/resources" },
  // { icon: GamepadIcon, label: "Games", path: "/games" },
  { icon: MessageSquare, label: "Forums", path: "/forums" },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 py-2 px-4 z-50">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 min-w-[4rem] transition-all duration-200 ${
                isActive 
                  ? "text-primary scale-110" 
                  : "text-gray-600 hover:text-primary/80"
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 ${
                isActive ? "animate-bounce" : ""
              }`} />
              <span className="text-[0.65rem] mt-1 whitespace-nowrap font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

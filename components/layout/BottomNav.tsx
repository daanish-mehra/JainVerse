"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, BookOpen, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/chat", icon: MessageCircle, label: "Chat" },
  { href: "/learn", icon: BookOpen, label: "Learn" },
  { href: "/practice", icon: Heart, label: "Practice" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-saffron-100/50 shadow-2xl"
    >
      <div className="flex justify-around items-center h-18 max-w-md mx-auto px-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    "flex flex-col items-center justify-center flex-1 h-full py-3 px-2 transition-all duration-300 rounded-xl",
                    isActive
                      ? "text-saffron-600"
                      : "text-gray-400 hover:text-saffron-400"
                  )}
                >
                  <div className="relative">
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-saffron-50 rounded-lg -z-10"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Icon
                      className={cn(
                        "w-6 h-6 mb-1 transition-all duration-300",
                        isActive && "scale-110"
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium transition-all duration-300",
                      isActive && "font-semibold"
                    )}
                  >
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.nav>
  );
}

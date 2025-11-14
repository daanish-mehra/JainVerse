"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  onSelectDate: (date: Date) => void;
}

export function CalendarView({ onSelectDate }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const weeks: Date[][] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= monthEnd || weeks.length < 6) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(week);
    if (weeks.length >= 6) break;
  }

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <motion.button
          onClick={handlePrevMonth}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </motion.button>
        <h3 className="text-lg font-bold text-gray-900">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <motion.button
          onClick={handleNextMonth}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </motion.button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="space-y-1">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 gap-1">
            {week.map((date, dayIdx) => {
              const dateStr = date.toDateString();
              const isTodayDate = isToday(date);
              const isCurrentMonthDate = isCurrentMonth(date);

              return (
                <motion.button
                  key={dateStr}
                  onClick={() => onSelectDate(date)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    "aspect-square rounded-lg text-sm font-medium transition-all duration-200",
                    isTodayDate
                      ? "bg-gradient-to-br from-jainGreen-500 to-teal-500 text-white shadow-lg ring-2 ring-jainGreen-400"
                      : isCurrentMonthDate
                      ? "bg-white text-gray-900 hover:bg-jainGreen-50 border border-gray-200"
                      : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                  )}
                >
                  {date.getDate()}
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={() => {
            setCurrentMonth(new Date());
            onSelectDate(new Date());
          }}
          className="w-full bg-gradient-to-r from-jainGreen-500 to-teal-500 hover:from-jainGreen-600 hover:to-teal-600 text-white"
        >
          Go to Today
        </Button>
      </motion.div>
    </div>
  );
}


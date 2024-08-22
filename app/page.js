'use client'

import React, { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';  // 한국어 지원 추가

dayjs.locale('ko');  // 전역으로 한국어 설정

export default function Page() {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const startDay = currentDate.startOf('month').startOf('week');
  const endDay = currentDate.endOf('month').endOf('week');

  const daysArray = () => {
    const days = [];
    let day = startDay;

    while (day.isBefore(endDay)) {
      const isInCurrentMonth = currentDate.isSame(day, 'month');
      days.push(
        <button
          key={day.format('DD-MM-YYYY')}
          className={`rounded-lg p-2 text-center transition ease-in-out duration-300 ${
            isInCurrentMonth ? 'bg-white text-gray-800 hover:bg-gray-100' : 'text-gray-400'
          } shadow-md font-medium`}
        >
          {isInCurrentMonth ? day.date() : ''}  
        </button>
      );
      day = day.add(1, 'day');
    }
    return days;
  };

  return (
    <>
      <div className="p-5 bg-white shadow-xl rounded-lg font-sans">
        <div className="flex items-center justify-between text-gray-800">
          <button onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))} className="px-4 py-2 bg-gray-100 rounded-lg shadow hover:bg-gray-200">← 저번달</button>
          <span className="font-semibold text-lg">{currentDate.format('MMMM YYYY')}</span>
          <button onClick={() => setCurrentDate(currentDate.add(1, 'month'))} className="px-4 py-2 bg-gray-100 rounded-lg shadow hover:bg-gray-200">다음달 →</button>
        </div>
        <div className="grid grid-cols-7 gap-4 mt-5">
          {daysArray()}
        </div>
      </div>
    </>
  );
}

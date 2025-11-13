import React from 'react';
import { TIMELINE_EVENTS } from '../constants';
import { TimelineIcon } from './icons/TimelineIcon';

interface TimelineProps {
  activeCaseId: string;
}

const Timeline: React.FC<TimelineProps> = ({ activeCaseId }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4 h-48 border border-gray-700 overflow-hidden">
      <h3 className="text-md font-semibold mb-4 flex items-center gap-2 text-cyan-400">
        <TimelineIcon />
        Dava Zaman Çizelgesi
      </h3>
      <div className="relative overflow-x-auto pb-2 h-full">
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5 bg-gray-600"></div>
        <div className="flex justify-between items-start h-full text-xs text-center">
          {TIMELINE_EVENTS.filter(e => e.caseId === activeCaseId).map((event, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center w-1/4 px-2 pt-2">
              <div className="w-3 h-3 bg-cyan-400 rounded-full border-2 border-gray-800 mb-1"></div>
              <p className="font-bold text-gray-200">{event.title}</p>
              <p className="text-gray-400">{event.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
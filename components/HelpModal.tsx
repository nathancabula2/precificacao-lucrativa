
import React from 'react';
import { HELP_MAP } from '../constants';

interface HelpModalProps {
  routeKey: string;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ routeKey, onClose }) => {
  const helpContent = HELP_MAP[routeKey] || HELP_MAP['dashboard'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
        <div className="bg-brand-primary p-6 text-white flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">💡</span>
            <h3 className="text-xl font-bold font-display">{helpContent.title}</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl">&times;</button>
        </div>
        
        <div className="p-8">
          <ul className="space-y-6">
            {helpContent.steps.map((step, idx) => (
              <li key={idx} className="flex space-x-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-accent text-brand-primary flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </span>
                <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
              </li>
            ))}
          </ul>
          
          <button
            onClick={onClose}
            className="w-full mt-10 bg-brand-primary text-white font-bold py-4 rounded-2xl hover:bg-brand-secondary transition-all shadow-lg"
          >
            Entendi, vamos lá!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;

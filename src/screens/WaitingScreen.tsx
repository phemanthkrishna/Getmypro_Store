import { Clock, Home } from 'lucide-react';

interface Props {
  orderId: string;
  total: number;
  onGoHome: () => void;
}

export default function WaitingScreen({ orderId, total, onGoHome }: Props) {
  // Timer is managed in App.tsx — it persists even if user navigates away.
  // This screen auto-unmounts when App receives payment and switches to pack-goods.

  return (
    <div className="fade-in flex flex-col items-center justify-center min-h-screen px-6 text-center bg-white">
      {/* Pulsing circle with clock */}
      <div
        className="pulse-scale w-32 h-32 rounded-full flex items-center justify-center mb-8"
        style={{ background: 'linear-gradient(135deg, rgba(26,95,184,0.15), rgba(244,120,32,0.15))' }}
      >
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #1A5FB8, #F47820)' }}
        >
          <Clock size={44} className="text-white spin-slow" />
        </div>
      </div>

      <h2 className="text-[28px] font-black text-gray-900 leading-tight mb-3">
        ⏳ Waiting for<br />Customer Payment
      </h2>

      <div className="bg-gray-50 rounded-2xl px-6 py-4 mb-4 w-full max-w-xs">
        <p className="text-sm text-gray-400 font-bold">Order #{orderId}</p>
        <p className="text-base text-gray-500 font-bold mt-0.5">Quote sent</p>
        <p className="text-3xl font-black text-gray-900 mt-1">
          ₹{total.toLocaleString('en-IN')}
        </p>
      </div>

      <p className="text-base text-gray-500 max-w-xs">
        Customer will pay online now
      </p>

      <p className="text-sm text-gray-400 mt-3">
        You'll get a notification as soon as payment is done
      </p>

      <p className="text-sm text-gray-300 mt-2 italic">
        [Demo: Payment arriving in 4 seconds...]
      </p>

      {/* Back to home — payment notification will come as a toast */}
      <button
        onClick={onGoHome}
        className="mt-10 flex items-center gap-2 text-gray-500 font-black text-base bg-gray-100 rounded-2xl px-6 py-3 min-h-[52px] active:bg-gray-200"
      >
        <Home size={18} />
        Back to Home
      </button>
    </div>
  );
}

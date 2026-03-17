import { Clock, Home } from 'lucide-react';

interface Props {
  orderId: string;
  total: number;
  onGoHome: () => void;
}

export default function WaitingScreen({ orderId, total, onGoHome }: Props) {
  return (
    <div className="fade-in flex flex-col items-center justify-center min-h-screen px-6 text-center bg-ds-bg">
      {/* Pulsing circle with clock */}
      <div
        className="pulse-scale w-32 h-32 rounded-full flex items-center justify-center mb-8"
        style={{ background: 'rgba(99, 102, 241, 0.12)' }}
      >
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)' }}
        >
          <Clock size={44} className="text-white spin-slow" />
        </div>
      </div>

      <h2 className="text-[28px] font-black text-ds-text leading-tight mb-3">
        ⏳ Waiting for<br />Customer Payment
      </h2>

      <div className="bg-ds-surface border border-ds-border rounded-2xl px-6 py-4 mb-4 w-full max-w-xs">
        <p className="text-xs text-ds-muted font-bold">Order #{orderId}</p>
        <p className="text-xs text-ds-muted font-bold mt-0.5">Quote sent</p>
        <p className="text-3xl font-black text-ds-text mt-1">
          ₹{total.toLocaleString('en-IN')}
        </p>
      </div>

      <p className="text-sm text-ds-muted max-w-xs">
        Customer will pay online now
      </p>

      <p className="text-xs text-ds-muted mt-3 opacity-60">
        You'll get a notification as soon as payment is done
      </p>

      <p className="text-xs text-ds-muted mt-2 italic opacity-40">
        [Demo: Payment arriving in 4 seconds...]
      </p>

      <button
        onClick={onGoHome}
        className="mt-10 flex items-center gap-2 text-ds-muted font-black text-sm bg-ds-surface border border-ds-border rounded-2xl px-6 py-3 min-h-[52px] active:opacity-70 transition-opacity"
      >
        <Home size={18} />
        Back to Home
      </button>
    </div>
  );
}

import { CheckCircle2, Home } from 'lucide-react';
import { Order } from '../data/demoData';

interface Props {
  order: Order;
  total: number;
  onGoHome: () => void;
}

export default function PackGoodsScreen({ order, total, onGoHome }: Props) {
  return (
    <div className="fade-in flex flex-col min-h-screen bg-ds-bg px-4 pb-6">
      {/* Payment received */}
      <div className="flex flex-col items-center pt-10 pb-6">
        <div className="bounce-in mb-4">
          <CheckCircle2 size={80} className="text-ds-success" strokeWidth={1.5} />
        </div>
        <h2 className="text-[28px] font-black text-ds-text text-center leading-tight">
          ✅ PAYMENT RECEIVED!
        </h2>
        <div className="mt-3 bg-ds-success/10 border border-ds-success/25 rounded-2xl px-6 py-3 text-center">
          <p className="text-3xl font-black text-ds-success">
            ₹{total.toLocaleString('en-IN')} Paid
          </p>
        </div>
      </div>

      {/* Pack goods instruction */}
      <div className="rounded-2xl p-5 mb-6 flex-1 border-2 border-orange-brand bg-orange-brand/10">
        <p className="text-[18px] font-black text-orange-brand mb-1">📦 PACK THE GOODS NOW</p>
        <p className="text-xs text-ds-muted font-bold mb-4">
          Worker will come to pick up soon. Keep these items ready:
        </p>
        <ul className="space-y-2">
          {order.materials.map((m) => (
            <li key={m.name} className="flex items-center gap-2 text-sm font-bold text-ds-text">
              <span className="w-2 h-2 rounded-full bg-orange-brand flex-shrink-0" />
              {m.name} — {m.qty} {m.unit}
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom action */}
      <div>
        <p className="text-xs font-bold text-ds-muted text-center mb-3">
          When worker arrives, go to <strong className="text-ds-text">All Orders</strong> and tap "Enter OTP &amp; Deliver"
        </p>
        <button
          onClick={onGoHome}
          className="w-full flex items-center justify-center gap-2 text-white font-black text-base rounded-2xl py-4 min-h-[52px] active:opacity-80 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)' }}
        >
          <Home size={20} />
          GO TO HOME
        </button>
      </div>
    </div>
  );
}

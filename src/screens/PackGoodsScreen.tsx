import { CheckCircle2, Home } from 'lucide-react';
import { Order } from '../data/demoData';

interface Props {
  order: Order;
  total: number;
  onGoHome: () => void;
}

export default function PackGoodsScreen({ order, total, onGoHome }: Props) {
  return (
    <div className="fade-in flex flex-col min-h-screen bg-white px-4 pb-6">
      {/* Top section — payment received */}
      <div className="flex flex-col items-center pt-10 pb-6">
        <div className="bounce-in mb-4">
          <CheckCircle2 size={80} className="text-green-brand" strokeWidth={1.5} />
        </div>
        <h2 className="text-[28px] font-black text-gray-900 text-center leading-tight">
          ✅ PAYMENT RECEIVED!
        </h2>
        <div className="mt-3 bg-green-50 rounded-2xl px-6 py-3 text-center">
          <p className="text-3xl font-black text-green-brand">
            ₹{total.toLocaleString('en-IN')} Paid
          </p>
        </div>
      </div>

      {/* Pack goods instruction box */}
      <div
        className="rounded-2xl p-5 mb-6 flex-1"
        style={{ backgroundColor: 'rgba(244, 120, 32, 0.08)', border: '2px solid #F47820' }}
      >
        <p className="text-[20px] font-black text-orange-brand mb-1">📦 PACK THE GOODS NOW</p>
        <p className="text-base text-gray-700 font-bold mb-4">
          Worker will come to pick up soon. Keep these items ready:
        </p>
        <ul className="space-y-2">
          {order.materials.map((m) => (
            <li key={m.name} className="flex items-center gap-2 text-base font-bold text-gray-800">
              <span className="w-2 h-2 rounded-full bg-orange-brand flex-shrink-0" />
              {m.name} — {m.qty} {m.unit}
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom action */}
      <div>
        <p className="text-base font-bold text-gray-500 text-center mb-3">
          When worker arrives, go to <strong>All Orders</strong> and tap "Enter OTP &amp; Deliver"
        </p>
        <button
          onClick={onGoHome}
          className="w-full flex items-center justify-center gap-2 text-white font-black text-lg rounded-2xl py-4 min-h-[52px] active:opacity-80"
          style={{ background: 'linear-gradient(135deg, #1A5FB8, #F47820)' }}
        >
          <Home size={22} />
          GO TO HOME
        </button>
      </div>
    </div>
  );
}

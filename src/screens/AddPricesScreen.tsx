import { ArrowLeft, MapPin, Info } from 'lucide-react';
import { toast } from 'sonner';
import { OrderState } from '../App';

interface Props {
  orderState: OrderState;
  onPriceChange: (prices: Record<string, number>) => void;
  onBack: () => void;
  onSendQuote: () => void;
}

const COMMISSION_RATE = 0.15;

export default function AddPricesScreen({ orderState, onPriceChange, onBack, onSendQuote }: Props) {
  const { order, prices } = orderState;

  const gross = order.materials.reduce((sum, m) => sum + (prices[m.name] ?? 0), 0);
  const commission = Math.round(gross * COMMISSION_RATE);
  const netPayout = gross - commission;
  const allFilled = order.materials.every((m) => (prices[m.name] ?? 0) > 0);

  function handleSend() {
    toast.success(`Quote sent! ₹${gross.toLocaleString('en-IN')} — waiting for customer to pay`);
    onSendQuote();
  }

  function handlePriceInput(name: string, raw: string) {
    const val = parseFloat(raw);
    onPriceChange({ ...prices, [name]: isNaN(val) ? 0 : val });
  }

  return (
    <div className="fade-in flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 active:bg-gray-200 min-h-[48px] min-w-[48px]"
        >
          <ArrowLeft size={22} className="text-gray-700" />
        </button>
        <h1 className="text-xl font-black text-gray-900">Add Prices</h1>
      </div>

      {/* Order info card */}
      <div
        className="mx-4 mt-4 rounded-2xl p-4 text-white"
        style={{ background: 'linear-gradient(135deg, #1A5FB8, #F47820)' }}
      >
        <p className="text-lg font-black">Order #{order.id}</p>
        <p className="text-base font-bold mt-0.5 opacity-90">Worker: {order.workerName}</p>
        <div className="flex items-start gap-1 mt-1 opacity-80 text-base">
          <MapPin size={15} className="mt-0.5 flex-shrink-0" />
          <span>{order.jobType} — {order.jobAddress}</span>
        </div>
      </div>

      {/* Instruction */}
      <p className="mx-4 mt-4 text-lg font-black text-orange-brand">
        Enter your price for each item below 👇
      </p>

      {/* Material price cards */}
      <div className="flex-1 px-4 mt-3 space-y-3">
        {order.materials.map((m) => (
          <div key={m.name} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-lg font-black text-gray-900">{m.name}</p>
            <p className="text-base text-gray-500 font-bold mb-3">
              Qty: {m.qty} {m.unit}
            </p>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-400">₹</span>
              <input
                type="number"
                inputMode="numeric"
                placeholder="Enter amount"
                value={prices[m.name] ?? ''}
                onChange={(e) => handlePriceInput(m.name, e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-4 text-2xl font-black text-gray-900 focus:outline-none focus:border-blue-brand placeholder:text-gray-300 placeholder:text-lg"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Totals + commission breakdown + Send button */}
      <div className="px-4 pt-4 pb-6 mt-2 border-t border-gray-100 bg-white">
        {/* Breakdown */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-gray-600">Subtotal</span>
            <span className="text-lg font-black text-gray-900">₹{gross.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-base font-bold text-gray-500">Platform fee (15%)</span>
            </div>
            <span className="text-lg font-black text-red-500">−₹{commission.toLocaleString('en-IN')}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
            <span className="text-lg font-black text-gray-900">Your payout</span>
            <span className="text-2xl font-black text-green-brand">₹{netPayout.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Commission note */}
        <div className="flex items-start gap-2 bg-blue-50 rounded-xl px-3 py-2 mb-4">
          <Info size={16} className="text-blue-brand flex-shrink-0 mt-0.5" />
          <p className="text-sm font-bold text-blue-700">
            15% platform commission applies. This rate is negotiable — contact GetMyPro to discuss your terms.
          </p>
        </div>

        <button
          onClick={handleSend}
          disabled={!allFilled}
          className={`w-full text-white font-black text-lg rounded-2xl py-4 min-h-[52px] transition-all ${
            allFilled ? 'active:opacity-80' : 'opacity-50 cursor-not-allowed bg-gray-400'
          }`}
          style={allFilled ? { background: 'linear-gradient(135deg, #1A5FB8, #F47820)' } : {}}
        >
          SEND QUOTE TO CUSTOMER →
        </button>
      </div>
    </div>
  );
}

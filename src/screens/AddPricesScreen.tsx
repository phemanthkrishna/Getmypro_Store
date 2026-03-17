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
    <div className="fade-in flex flex-col min-h-screen bg-ds-bg">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-ds-border bg-ds-surface">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-ds-border/40 active:bg-ds-border min-h-[48px] min-w-[48px] transition-colors"
        >
          <ArrowLeft size={22} className="text-ds-text" />
        </button>
        <h1 className="text-xl font-black text-ds-text">Add Prices</h1>
      </div>

      {/* Order info card */}
      <div
        className="mx-4 mt-4 rounded-2xl p-4 text-white"
        style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)' }}
      >
        <p className="text-base font-black">Order #{order.id}</p>
        <p className="text-sm font-bold mt-0.5 opacity-90">Worker: {order.workerName}</p>
        <div className="flex items-start gap-1 mt-1 opacity-75 text-xs">
          <MapPin size={13} className="mt-0.5 flex-shrink-0" />
          <span>{order.jobType} — {order.jobAddress}</span>
        </div>
      </div>

      {/* Instruction */}
      <p className="mx-4 mt-4 text-sm font-black text-orange-brand">
        Enter your price for each item below 👇
      </p>

      {/* Material price cards */}
      <div className="flex-1 px-4 mt-3 space-y-3">
        {order.materials.map((m) => (
          <div key={m.name} className="bg-ds-surface rounded-2xl p-4 border border-ds-border">
            <p className="text-base font-black text-ds-text">{m.name}</p>
            <p className="text-xs text-ds-muted font-bold mb-3">
              Qty: {m.qty} {m.unit}
            </p>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-ds-muted">₹</span>
              <input
                type="number"
                inputMode="numeric"
                placeholder="Enter amount"
                value={prices[m.name] ?? ''}
                onChange={(e) => handlePriceInput(m.name, e.target.value)}
                className="w-full border-2 border-ds-border rounded-xl pl-10 pr-4 py-4 text-2xl font-black text-ds-text bg-ds-bg focus:outline-none focus:border-ds-brand placeholder:text-ds-border placeholder:text-base transition-colors"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Totals + Send button */}
      <div className="px-4 pt-4 pb-6 mt-2 border-t border-ds-border bg-ds-surface">
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ds-muted">Subtotal</span>
            <span className="text-sm font-black text-ds-text">₹{gross.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ds-muted">Platform fee (15%)</span>
            <span className="text-sm font-black text-ds-error">−₹{commission.toLocaleString('en-IN')}</span>
          </div>
          <div className="border-t border-ds-border pt-2 flex items-center justify-between">
            <span className="text-base font-black text-ds-text">Your payout</span>
            <span className="text-2xl font-black text-ds-success">₹{netPayout.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Commission note */}
        <div className="flex items-start gap-2 bg-ds-brand/10 border border-ds-brand/20 rounded-xl px-3 py-2 mb-4">
          <Info size={14} className="text-ds-brand-light flex-shrink-0 mt-0.5" />
          <p className="text-xs font-bold text-ds-brand-light opacity-90">
            15% platform commission applies. This rate is negotiable — contact GetMyPro to discuss your terms.
          </p>
        </div>

        <button
          onClick={handleSend}
          disabled={!allFilled}
          className={`w-full text-white font-black text-base rounded-2xl py-4 min-h-[52px] transition-all ${
            allFilled ? 'active:opacity-80' : 'opacity-40 cursor-not-allowed'
          }`}
          style={allFilled ? { background: 'linear-gradient(135deg, #4338CA, #6366F1)' } : { backgroundColor: '#27272A' }}
        >
          SEND QUOTE TO CUSTOMER →
        </button>
      </div>
    </div>
  );
}

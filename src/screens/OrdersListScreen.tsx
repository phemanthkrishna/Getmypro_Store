import { Home, List, MapPin, ChevronRight, IndianRupee } from 'lucide-react';
import { OrderState, OrderStatus } from '../App';

interface Props {
  orders: OrderState[];
  onGoHome: () => void;
  onGoPayments: () => void;
  onAddPrices: (orderId: string) => void;
  onCollect: (orderId: string) => void;
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; badgeBg: string; badgeText: string; priority: number }
> = {
  'new':               { label: 'New Order',        badgeBg: 'bg-orange-100', badgeText: 'text-orange-700',  priority: 1 },
  'payment-received':  { label: 'Ready to Deliver', badgeBg: 'bg-green-100',  badgeText: 'text-green-700',   priority: 2 },
  'quote-sent':        { label: 'Waiting Payment',  badgeBg: 'bg-blue-100',   badgeText: 'text-blue-700',    priority: 3 },
  'completed':         { label: 'Completed ✓',      badgeBg: 'bg-gray-100',   badgeText: 'text-gray-500',    priority: 4 },
};

function calcTotal(os: OrderState): number {
  return os.order.materials.reduce((sum, m) => sum + (os.prices[m.name] ?? 0), 0);
}

export default function OrdersListScreen({ orders, onGoHome, onGoPayments, onAddPrices, onCollect }: Props) {
  // Sort by priority: new → payment-received → quote-sent → completed
  const sorted = [...orders].sort(
    (a, b) => STATUS_CONFIG[a.status].priority - STATUS_CONFIG[b.status].priority,
  );

  const newCount = orders.filter((o) => o.status === 'new').length;
  const readyCount = orders.filter((o) => o.status === 'payment-received').length;

  return (
    <div className="fade-in flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className="px-4 pt-5 pb-4"
        style={{ background: 'linear-gradient(135deg, #1A5FB8, #F47820)' }}
      >
        <h1 className="text-2xl font-black text-white">All Orders</h1>
        <p className="text-base text-white opacity-80 mt-0.5">
          {orders.length} total · {newCount} new · {readyCount} ready to deliver
        </p>
      </div>

      {/* Summary chips */}
      {(newCount > 0 || readyCount > 0) && (
        <div className="flex gap-2 px-4 py-3 overflow-x-auto">
          {newCount > 0 && (
            <span className="flex-shrink-0 bg-orange-100 text-orange-700 font-black text-sm px-3 py-1 rounded-full">
              🔔 {newCount} need pricing
            </span>
          )}
          {readyCount > 0 && (
            <span className="flex-shrink-0 bg-green-100 text-green-700 font-black text-sm px-3 py-1 rounded-full">
              📦 {readyCount} ready to deliver
            </span>
          )}
        </div>
      )}

      {/* Orders list */}
      <div className="flex-1 px-4 py-2 space-y-3 pb-24">
        {sorted.map((os) => {
          const cfg = STATUS_CONFIG[os.status];
          const total = calcTotal(os);
          const isCompleted = os.status === 'completed';

          return (
            <div
              key={os.order.id}
              className={`bg-white rounded-2xl p-4 shadow-sm border ${
                isCompleted ? 'border-gray-100 opacity-70' : 'border-gray-200'
              }`}
            >
              {/* Top row: order ID + status badge */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="text-lg font-black text-gray-900">#{os.order.id}</p>
                  <p className="text-base font-bold text-gray-600">{os.order.workerName}</p>
                </div>
                <span
                  className={`flex-shrink-0 text-sm font-black px-3 py-1 rounded-full ${cfg.badgeBg} ${cfg.badgeText}`}
                >
                  {cfg.label}
                </span>
              </div>

              {/* Job info */}
              <div className="flex items-start gap-1 text-gray-500 text-base mb-2">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm">{os.order.jobType} · {os.order.jobAddress}</span>
              </div>

              {/* Materials summary */}
              <p className="text-sm text-gray-400 mb-3">
                {os.order.materials.map((m) => `${m.name} (${m.qty} ${m.unit})`).join(' · ')}
              </p>

              {/* Total (if priced) */}
              {total > 0 && (
                <p className="text-base font-black text-gray-800 mb-3">
                  Total: ₹{total.toLocaleString('en-IN')}
                </p>
              )}

              {/* Action buttons */}
              {os.status === 'new' && (
                <button
                  onClick={() => onAddPrices(os.order.id)}
                  className="w-full flex items-center justify-center gap-2 font-black text-base rounded-xl py-3 min-h-[48px] text-white active:opacity-80"
                  style={{ background: 'linear-gradient(135deg, #1A5FB8, #F47820)' }}
                >
                  Add Prices <ChevronRight size={18} />
                </button>
              )}

              {os.status === 'payment-received' && (
                <button
                  onClick={() => onCollect(os.order.id)}
                  className="w-full flex items-center justify-center gap-2 font-black text-base rounded-xl py-3 min-h-[48px] text-white active:opacity-80"
                  style={{ backgroundColor: '#10B981' }}
                >
                  Enter OTP &amp; Deliver <ChevronRight size={18} />
                </button>
              )}

              {os.status === 'quote-sent' && (
                <div className="w-full text-center text-sm font-bold text-blue-600 py-2">
                  ⏳ Waiting for customer payment...
                </div>
              )}

              {os.status === 'completed' && (
                <div className="w-full text-center text-sm font-bold text-gray-400 py-1">
                  ✓ Settled · ₹{total.toLocaleString('en-IN')}
                </div>
              )}
            </div>
          );
        })}

        {orders.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <List size={48} className="text-gray-200 mb-4" />
            <p className="text-xl font-black text-gray-400">No orders yet</p>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <BottomNav active="orders" onHome={onGoHome} onOrders={() => {}} onPayments={onGoPayments} />
    </div>
  );
}

// Shared bottom nav — 3 tabs
export function BottomNav({
  active,
  onHome,
  onOrders,
  onPayments,
}: {
  active: 'home' | 'orders' | 'payments';
  onHome: () => void;
  onOrders: () => void;
  onPayments: () => void;
}) {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-200 flex z-50">
      <button
        onClick={onHome}
        className={`flex-1 flex flex-col items-center py-3 min-h-[56px] gap-0.5 font-black text-sm transition-colors ${
          active === 'home' ? 'text-blue-brand' : 'text-gray-400'
        }`}
      >
        <Home size={22} />
        <span>Home</span>
      </button>
      <button
        onClick={onOrders}
        className={`flex-1 flex flex-col items-center py-3 min-h-[56px] gap-0.5 font-black text-sm transition-colors ${
          active === 'orders' ? 'text-blue-brand' : 'text-gray-400'
        }`}
      >
        <List size={22} />
        <span>Orders</span>
      </button>
      <button
        onClick={onPayments}
        className={`flex-1 flex flex-col items-center py-3 min-h-[56px] gap-0.5 font-black text-sm transition-colors ${
          active === 'payments' ? 'text-blue-brand' : 'text-gray-400'
        }`}
      >
        <IndianRupee size={22} />
        <span>Payments</span>
      </button>
    </div>
  );
}

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
  'new':              { label: 'New Order',        badgeBg: 'bg-orange-brand/15', badgeText: 'text-orange-brand',   priority: 1 },
  'payment-received': { label: 'Ready to Deliver', badgeBg: 'bg-ds-success/15',  badgeText: 'text-ds-success',     priority: 2 },
  'quote-sent':       { label: 'Waiting Payment',  badgeBg: 'bg-ds-brand/15',    badgeText: 'text-ds-brand-light', priority: 3 },
  'completed':        { label: 'Completed ✓',      badgeBg: 'bg-ds-border/50',   badgeText: 'text-ds-muted',       priority: 4 },
};

function calcTotal(os: OrderState): number {
  return os.order.materials.reduce((sum, m) => sum + (os.prices[m.name] ?? 0), 0);
}

export default function OrdersListScreen({ orders, onGoHome, onGoPayments, onAddPrices, onCollect }: Props) {
  const sorted = [...orders].sort(
    (a, b) => STATUS_CONFIG[a.status].priority - STATUS_CONFIG[b.status].priority,
  );

  const newCount = orders.filter((o) => o.status === 'new').length;
  const readyCount = orders.filter((o) => o.status === 'payment-received').length;

  return (
    <div className="fade-in flex flex-col min-h-screen bg-ds-bg">
      {/* Header */}
      <div
        className="px-4 pt-5 pb-4"
        style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)' }}
      >
        <h1 className="text-2xl font-black text-white">All Orders</h1>
        <p className="text-xs text-white opacity-75 mt-0.5">
          {orders.length} total · {newCount} new · {readyCount} ready to deliver
        </p>
      </div>

      {/* Summary chips */}
      {(newCount > 0 || readyCount > 0) && (
        <div className="flex gap-2 px-4 py-3 overflow-x-auto">
          {newCount > 0 && (
            <span className="flex-shrink-0 bg-orange-brand/15 text-orange-brand font-black text-xs px-3 py-1 rounded-full">
              🔔 {newCount} need pricing
            </span>
          )}
          {readyCount > 0 && (
            <span className="flex-shrink-0 bg-ds-success/15 text-ds-success font-black text-xs px-3 py-1 rounded-full">
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
              className={`bg-ds-surface rounded-2xl p-4 border border-ds-border transition-opacity ${
                isCompleted ? 'opacity-50' : ''
              }`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="text-base font-black text-ds-text">#{os.order.id}</p>
                  <p className="text-xs font-bold text-ds-muted">{os.order.workerName}</p>
                </div>
                <span className={`flex-shrink-0 text-xs font-black px-3 py-1 rounded-full ${cfg.badgeBg} ${cfg.badgeText}`}>
                  {cfg.label}
                </span>
              </div>

              {/* Job info */}
              <div className="flex items-start gap-1 text-ds-muted text-xs mb-2">
                <MapPin size={12} className="mt-0.5 flex-shrink-0" />
                <span>{os.order.jobType} · {os.order.jobAddress}</span>
              </div>

              {/* Materials */}
              <p className="text-xs text-ds-muted opacity-70 mb-3">
                {os.order.materials.map((m) => `${m.name} (${m.qty} ${m.unit})`).join(' · ')}
              </p>

              {/* Total */}
              {total > 0 && (
                <p className="text-sm font-black text-ds-text mb-3">
                  Total: ₹{total.toLocaleString('en-IN')}
                </p>
              )}

              {/* Actions */}
              {os.status === 'new' && (
                <button
                  onClick={() => onAddPrices(os.order.id)}
                  className="w-full flex items-center justify-center gap-2 font-black text-sm rounded-xl py-3 min-h-[48px] text-white active:opacity-80 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)' }}
                >
                  Add Prices <ChevronRight size={16} />
                </button>
              )}

              {os.status === 'payment-received' && (
                <button
                  onClick={() => onCollect(os.order.id)}
                  className="w-full flex items-center justify-center gap-2 font-black text-sm rounded-xl py-3 min-h-[48px] text-white active:opacity-80 transition-opacity"
                  style={{ backgroundColor: '#22C55E' }}
                >
                  Enter OTP &amp; Deliver <ChevronRight size={16} />
                </button>
              )}

              {os.status === 'quote-sent' && (
                <div className="w-full text-center text-xs font-bold text-ds-brand-light py-2">
                  ⏳ Waiting for customer payment...
                </div>
              )}

              {os.status === 'completed' && (
                <div className="w-full text-center text-xs font-bold text-ds-muted py-1">
                  ✓ Settled · ₹{total.toLocaleString('en-IN')}
                </div>
              )}
            </div>
          );
        })}

        {orders.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <List size={40} className="text-ds-border mb-4" />
            <p className="text-lg font-black text-ds-muted">No orders yet</p>
          </div>
        )}
      </div>

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
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-ds-surface border-t border-ds-border flex z-50">
      <button
        onClick={onHome}
        className={`flex-1 flex flex-col items-center py-3 min-h-[56px] gap-0.5 font-black text-xs transition-colors ${
          active === 'home' ? 'text-ds-brand' : 'text-ds-muted'
        }`}
      >
        <Home size={22} />
        <span>Home</span>
      </button>
      <button
        onClick={onOrders}
        className={`flex-1 flex flex-col items-center py-3 min-h-[56px] gap-0.5 font-black text-xs transition-colors ${
          active === 'orders' ? 'text-ds-brand' : 'text-ds-muted'
        }`}
      >
        <List size={22} />
        <span>Orders</span>
      </button>
      <button
        onClick={onPayments}
        className={`flex-1 flex flex-col items-center py-3 min-h-[56px] gap-0.5 font-black text-xs transition-colors ${
          active === 'payments' ? 'text-ds-brand' : 'text-ds-muted'
        }`}
      >
        <IndianRupee size={22} />
        <span>Payments</span>
      </button>
    </div>
  );
}

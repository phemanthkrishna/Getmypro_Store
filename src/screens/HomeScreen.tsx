import { Bell, MapPin, CheckCircle, Plus, TrendingUp } from 'lucide-react';
import { OrderState, calcTotal } from '../App';
import { STORE } from '../data/demoData';
import { BottomNav } from './OrdersListScreen';

interface Props {
  orders: OrderState[];
  onViewOrder: (orderId: string) => void;
  onAddRandomOrder: () => void;
  onGoToOrdersList: () => void;
  onGoToPayments: () => void;
}

function AppHeader() {
  return (
    <div className="flex items-center gap-3 px-4 py-4 border-b border-ds-border bg-ds-surface">
      <img
        src="/logo.png"
        alt="GetMyPro"
        className="w-8 h-8 rounded-lg object-cover"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          const sib = e.currentTarget.nextElementSibling as HTMLElement | null;
          if (sib) sib.style.display = 'flex';
        }}
      />
      <div
        className="w-8 h-8 rounded-lg items-center justify-center text-white text-xs font-black"
        style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)', display: 'none' }}
      >
        G
      </div>
      <span className="text-xl font-black gradient-text">GetMyPro</span>
      <span className="ml-auto bg-ds-brand/15 text-ds-brand-light text-sm font-bold px-3 py-1 rounded-full">
        Store Partner
      </span>
    </div>
  );
}

export { AppHeader };

export default function HomeScreen({ orders, onViewOrder, onAddRandomOrder, onGoToOrdersList, onGoToPayments }: Props) {
  const newOrders = orders.filter((o) => o.status === 'new');
  const completedOrders = orders.filter((o) => o.status === 'completed');
  const readyOrders = orders.filter((o) => o.status === 'payment-received');

  const todayEarnings = completedOrders.reduce((sum, os) => sum + calcTotal(os), 0);
  const totalEarnings = todayEarnings;

  return (
    <div className="fade-in flex flex-col min-h-screen pb-20 bg-ds-bg">
      <AppHeader />

      {/* Store info + Add Demo Order */}
      <div className="px-4 pt-5 pb-3 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[26px] font-black text-ds-text">{STORE.name}</h1>
          <div className="flex items-center gap-1 text-ds-muted mt-1 text-sm">
            <MapPin size={15} className="text-ds-brand flex-shrink-0" />
            <span>{STORE.location}</span>
          </div>
        </div>
        <button
          onClick={onAddRandomOrder}
          title="Add demo order"
          className="flex-shrink-0 flex items-center gap-1.5 bg-ds-surface hover:bg-ds-border/50 active:opacity-70 text-ds-muted font-black text-sm px-3 py-2 rounded-xl min-h-[40px] border border-ds-border transition-all mt-1"
        >
          <Plus size={16} />
          Demo Order
        </button>
      </div>

      {/* Earnings card */}
      <div className="mx-4 mb-3 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)' }}>
        <div className="px-4 py-3 flex items-center gap-2">
          <TrendingUp size={18} className="text-white opacity-80" />
          <span className="text-white font-black text-xs opacity-90 uppercase tracking-widest">Earnings</span>
        </div>
        <div className="bg-white bg-opacity-10 mx-3 mb-3 rounded-xl px-4 py-3 flex">
          <div className="flex-1 text-center border-r border-white border-opacity-20 pr-4">
            <p className="text-white text-xs font-bold opacity-75 mb-0.5">Today</p>
            <p className="text-white text-2xl font-black">₹{todayEarnings.toLocaleString('en-IN')}</p>
          </div>
          <div className="flex-1 text-center pl-4">
            <p className="text-white text-xs font-bold opacity-75 mb-0.5">Total</p>
            <p className="text-white text-2xl font-black">₹{totalEarnings.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-ds-border mx-4" />

      {/* Alert: ready to deliver */}
      {readyOrders.length > 0 && (
        <div className="mx-4 mt-4 bg-ds-success/10 border border-ds-success/25 rounded-2xl px-4 py-3">
          <p className="text-sm font-black text-ds-success">
            📦 {readyOrders.length} order{readyOrders.length > 1 ? 's' : ''} paid — ready to deliver!
          </p>
          <button onClick={onGoToOrdersList} className="text-xs font-bold text-ds-success underline mt-0.5 opacity-80">
            View in All Orders →
          </button>
        </div>
      )}

      {/* New order cards */}
      <div className="flex-1 px-4 pt-4 space-y-4">
        {newOrders.length > 0 ? (
          <>
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-orange-brand" />
              <span className="text-sm font-black text-orange-brand uppercase tracking-widest">
                New Orders ({newOrders.length})
              </span>
            </div>

            {newOrders.map((os) => (
              <div key={os.order.id} className="pulse-border rounded-2xl p-5 bg-ds-surface">
                <div className="mb-3">
                  <p className="text-[20px] font-black text-ds-text">Order #{os.order.id}</p>
                  <p className="text-sm font-bold text-ds-muted mt-0.5">
                    {os.order.workerName}'s Job — {os.order.jobType} work
                  </p>
                  <div className="flex items-start gap-1 mt-0.5 text-ds-muted text-xs">
                    <MapPin size={12} className="mt-0.5 flex-shrink-0" />
                    <span>{os.order.jobAddress}</span>
                  </div>
                </div>

                <div className="border-t border-ds-border pt-3 mb-4">
                  <p className="text-xs font-black uppercase tracking-widest text-ds-muted mb-1.5">
                    Materials Needed
                  </p>
                  <ul className="space-y-1.5">
                    {os.order.materials.map((m) => (
                      <li key={m.name} className="text-sm text-ds-text flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-ds-brand flex-shrink-0" />
                        {m.name} — {m.qty} {m.unit}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onViewOrder(os.order.id)}
                  className="w-full text-white font-black text-base rounded-2xl py-4 min-h-[52px] active:opacity-80 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)' }}
                >
                  VIEW ORDER →
                </button>
              </div>
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 rounded-full bg-ds-surface flex items-center justify-center mb-5 border border-ds-border">
              <Bell size={32} className="text-ds-border" />
            </div>
            <p className="text-[18px] font-black text-ds-muted mb-2">No new orders right now</p>
            <p className="text-sm text-ds-muted max-w-xs opacity-70">
              New orders will appear here automatically
            </p>
            <button
              onClick={onAddRandomOrder}
              className="mt-6 flex items-center gap-2 bg-ds-surface text-ds-muted font-black text-sm px-5 py-3 rounded-xl min-h-[48px] border border-ds-border active:opacity-70 transition-opacity"
            >
              <Plus size={16} />
              Add Demo Order
            </button>
          </div>
        )}

        {/* Completed today */}
        {completedOrders.length > 0 && (
          <div className="mt-4 bg-ds-success/10 border border-ds-success/20 rounded-2xl px-5 py-4">
            <p className="text-xs font-black text-ds-success uppercase tracking-widest mb-2">
              Completed Today
            </p>
            {completedOrders.map((os) => (
              <div key={os.order.id} className="flex items-center justify-between py-0.5">
                <div className="flex items-center gap-2 text-sm text-ds-success font-bold">
                  <CheckCircle size={14} />
                  Order #{os.order.id}
                </div>
                <span className="text-sm font-black text-ds-success">
                  ₹{calcTotal(os).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Connected strip */}
      <div className="border-t border-ds-border px-4 py-3 flex items-center gap-2 mb-14">
        <div className="w-2 h-2 rounded-full bg-ds-success" />
        <span className="text-xs text-ds-muted font-bold">Connected to GetMyPro</span>
      </div>

      <BottomNav active="home" onHome={() => {}} onOrders={onGoToOrdersList} onPayments={onGoToPayments} />
    </div>
  );
}

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
    <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
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
        style={{ background: 'linear-gradient(135deg, #1A5FB8, #F47820)', display: 'none' }}
      >
        G
      </div>
      <span className="text-xl font-black gradient-text">GetMyPro</span>
      <span className="ml-auto bg-orange-brand text-white text-sm font-bold px-3 py-1 rounded-full">
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

  // Earnings — all completed orders count as today in the demo
  const todayEarnings = completedOrders.reduce((sum, os) => sum + calcTotal(os), 0);
  const totalEarnings = todayEarnings; // same in demo; extend with historical data in real app

  return (
    <div className="fade-in flex flex-col min-h-screen pb-20">
      <AppHeader />

      {/* Store info + Add Demo Order button */}
      <div className="px-4 pt-5 pb-3 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[26px] font-black text-gray-900">{STORE.name}</h1>
          <div className="flex items-center gap-1 text-gray-500 mt-1 text-base">
            <MapPin size={15} className="text-orange-brand flex-shrink-0" />
            <span>{STORE.location}</span>
          </div>
        </div>
        <button
          onClick={onAddRandomOrder}
          title="Add demo order"
          className="flex-shrink-0 flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-600 font-black text-sm px-3 py-2 rounded-xl min-h-[40px] transition-colors mt-1"
        >
          <Plus size={16} />
          Demo Order
        </button>
      </div>

      {/* Earnings card */}
      <div className="mx-4 mb-3 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A5FB8, #F47820)' }}>
        <div className="px-4 py-3 flex items-center gap-2">
          <TrendingUp size={18} className="text-white opacity-80" />
          <span className="text-white font-black text-sm opacity-90 uppercase tracking-wide">Earnings</span>
        </div>
        <div className="bg-white bg-opacity-10 mx-3 mb-3 rounded-xl px-4 py-3 flex gap-0">
          <div className="flex-1 text-center border-r border-white border-opacity-20 pr-4">
            <p className="text-white text-sm font-bold opacity-75 mb-0.5">Today</p>
            <p className="text-white text-2xl font-black">
              ₹{todayEarnings.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="flex-1 text-center pl-4">
            <p className="text-white text-sm font-bold opacity-75 mb-0.5">Total</p>
            <p className="text-white text-2xl font-black">
              ₹{totalEarnings.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 mx-4" />

      {/* Alert for ready-to-deliver orders */}
      {readyOrders.length > 0 && (
        <div className="mx-4 mt-4 bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
          <p className="text-base font-black text-green-700">
            📦 {readyOrders.length} order{readyOrders.length > 1 ? 's' : ''} paid — ready to deliver!
          </p>
          <button onClick={onGoToOrdersList} className="text-sm font-bold text-green-600 underline mt-0.5">
            View in All Orders →
          </button>
        </div>
      )}

      {/* New order cards */}
      <div className="flex-1 px-4 pt-4 space-y-4">
        {newOrders.length > 0 ? (
          <>
            <div className="flex items-center gap-2">
              <Bell size={20} className="text-orange-brand" />
              <span className="text-base font-black text-orange-brand uppercase tracking-wide">
                New Orders ({newOrders.length})
              </span>
            </div>

            {newOrders.map((os) => (
              <div key={os.order.id} className="pulse-border rounded-2xl p-5 bg-white shadow-sm">
                <div className="mb-3">
                  <p className="text-[20px] font-black text-gray-900">Order #{os.order.id}</p>
                  <p className="text-base font-bold text-gray-700 mt-0.5">
                    {os.order.workerName}'s Job — {os.order.jobType} work
                  </p>
                  <div className="flex items-start gap-1 mt-0.5 text-gray-500 text-sm">
                    <MapPin size={13} className="mt-0.5 flex-shrink-0 text-gray-400" />
                    <span>{os.order.jobAddress}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 mb-4">
                  <p className="text-xs font-black uppercase tracking-wide text-gray-400 mb-1.5">
                    Materials Needed
                  </p>
                  <ul className="space-y-1">
                    {os.order.materials.map((m) => (
                      <li key={m.name} className="text-base text-gray-800 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-brand flex-shrink-0" />
                        {m.name} — {m.qty} {m.unit}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onViewOrder(os.order.id)}
                  className="w-full text-white font-black text-lg rounded-2xl py-4 min-h-[52px] active:opacity-80"
                  style={{ background: 'linear-gradient(135deg, #1A5FB8, #F47820)' }}
                >
                  VIEW ORDER →
                </button>
              </div>
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
              <Bell size={36} className="text-gray-300" />
            </div>
            <p className="text-[20px] font-black text-gray-400 mb-2">No new orders right now</p>
            <p className="text-base text-gray-400 max-w-xs">
              New orders will appear here automatically
            </p>
            <button
              onClick={onAddRandomOrder}
              className="mt-6 flex items-center gap-2 bg-gray-100 text-gray-600 font-black text-base px-5 py-3 rounded-xl min-h-[48px] active:bg-gray-200"
            >
              <Plus size={18} />
              Add Demo Order
            </button>
          </div>
        )}

        {/* Completed today */}
        {completedOrders.length > 0 && (
          <div className="mt-4 bg-green-50 rounded-2xl px-5 py-4">
            <p className="text-sm font-black text-green-700 uppercase tracking-wide mb-2">
              Completed Today
            </p>
            {completedOrders.map((os) => (
              <div key={os.order.id} className="flex items-center justify-between py-0.5">
                <div className="flex items-center gap-2 text-base text-green-700 font-bold">
                  <CheckCircle size={16} />
                  Order #{os.order.id}
                </div>
                <span className="text-base font-black text-green-800">
                  ₹{calcTotal(os).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Connected strip */}
      <div className="border-t border-gray-100 px-4 py-3 flex items-center gap-2 mb-14">
        <div className="w-2.5 h-2.5 rounded-full bg-green-brand" />
        <span className="text-base text-gray-500 font-bold">Connected to GetMyPro</span>
      </div>

      <BottomNav active="home" onHome={() => {}} onOrders={onGoToOrdersList} onPayments={onGoToPayments} />
    </div>
  );
}

import { IndianRupee, Clock, CheckCircle2, TrendingUp, Info } from 'lucide-react';
import { OrderState, calcTotal } from '../App';
import { BottomNav } from './OrdersListScreen';

interface Props {
  orders: OrderState[];
  onGoHome: () => void;
  onGoToOrdersList: () => void;
}

const COMMISSION_RATE = 0.15;

// Mock previous weekly settlements for demo realism
const PAST_SETTLEMENTS = [
  { week: 'Week Mar 3 – Mar 9, 2025', gross: 6400, net: 5440 },
  { week: 'Week Feb 24 – Mar 2, 2025', gross: 4850, net: 4122 },
  { week: 'Week Feb 17 – Feb 23, 2025', gross: 7200, net: 6120 },
];

function fmt(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function PaymentsScreen({ orders, onGoHome, onGoToOrdersList }: Props) {
  const completed = orders.filter((o) => o.status === 'completed');

  // Gross = what customer paid; net = after 15% commission
  const pendingGross = completed.reduce((s, o) => s + calcTotal(o), 0);
  const pendingCommission = Math.round(pendingGross * COMMISSION_RATE);
  const pendingNet = pendingGross - pendingCommission;

  const settledNet = PAST_SETTLEMENTS.reduce((s, p) => s + p.net, 0);
  const totalNet = pendingNet + settledNet;

  return (
    <div className="fade-in flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div
        className="px-4 pt-5 pb-5"
        style={{ background: 'linear-gradient(135deg, #1A5FB8, #F47820)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <IndianRupee size={22} className="text-white opacity-80" />
          <h1 className="text-2xl font-black text-white">Payments & Earnings</h1>
        </div>

        {/* Top summary row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white bg-opacity-15 rounded-xl px-3 py-3 text-center">
            <p className="text-white text-xs font-bold opacity-75 mb-1">Total Earned</p>
            <p className="text-white text-lg font-black">{fmt(totalNet)}</p>
          </div>
          <div className="bg-white bg-opacity-15 rounded-xl px-3 py-3 text-center">
            <p className="text-white text-xs font-bold opacity-75 mb-1">Settled</p>
            <p className="text-white text-lg font-black">{fmt(settledNet)}</p>
          </div>
          <div className="bg-white bg-opacity-15 rounded-xl px-3 py-3 text-center">
            <p className="text-white text-xs font-bold opacity-75 mb-1">Pending</p>
            <p className="text-white text-lg font-black">{fmt(pendingNet)}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-5">

        {/* Pending settlement block */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock size={18} className="text-orange-brand" />
            <h2 className="text-lg font-black text-gray-900">Pending Settlement</h2>
          </div>

          {completed.length === 0 ? (
            <div className="bg-white rounded-2xl px-4 py-5 text-center border border-gray-100">
              <p className="text-base font-bold text-gray-400">No completed orders yet</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-orange-100 overflow-hidden shadow-sm">
              {/* Settlement cycle note */}
              <div className="bg-orange-50 px-4 py-3 flex items-start gap-2 border-b border-orange-100">
                <Info size={15} className="text-orange-brand flex-shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-orange-700">
                  GetMyPro settles payments every Monday. Your earnings below will be transferred next Monday.
                </p>
              </div>

              {/* Per-order rows */}
              {completed.map((os) => {
                const gross = calcTotal(os);
                const comm = Math.round(gross * COMMISSION_RATE);
                const net = gross - comm;
                return (
                  <div key={os.order.id} className="px-4 py-4 border-b border-gray-100 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-base font-black text-gray-900">Order #{os.order.id}</p>
                      <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                        Pending
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 font-bold mb-2">
                      {os.order.workerName} · {os.order.jobType}
                    </p>
                    <div className="flex gap-4 text-sm">
                      <div>
                        <p className="text-gray-400 font-bold">Gross</p>
                        <p className="font-black text-gray-800">{fmt(gross)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-bold">Fee (15%)</p>
                        <p className="font-black text-red-500">−{fmt(comm)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-bold">Your cut</p>
                        <p className="font-black text-green-brand">{fmt(net)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Pending total */}
              {completed.length > 0 && (
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                  <span className="text-base font-black text-gray-700">Total pending payout</span>
                  <span className="text-xl font-black text-green-brand">{fmt(pendingNet)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Commission info */}
        <div className="bg-blue-50 rounded-2xl px-4 py-4 flex items-start gap-3">
          <Info size={18} className="text-blue-brand flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-base font-black text-blue-800 mb-0.5">Platform Commission — 15%</p>
            <p className="text-sm font-bold text-blue-700">
              GetMyPro deducts 15% from each order to cover platform, payment, and customer support costs.
              This rate is <span className="underline">negotiable</span> — contact us to discuss your partner terms.
            </p>
          </div>
        </div>

        {/* Past settlements */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={18} className="text-green-brand" />
            <h2 className="text-lg font-black text-gray-900">Past Settlements</h2>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            {PAST_SETTLEMENTS.map((ps, i) => (
              <div key={i} className="px-4 py-4 border-b border-gray-100 last:border-0 flex items-center justify-between">
                <div>
                  <p className="text-base font-black text-gray-900">{fmt(ps.net)}</p>
                  <p className="text-sm font-bold text-gray-400 mt-0.5">{ps.week}</p>
                  <p className="text-xs text-gray-400">Gross {fmt(ps.gross)} · Fee −{fmt(ps.gross - ps.net)}</p>
                </div>
                <span className="text-xs font-black bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  Settled ✓
                </span>
              </div>
            ))}

            {/* Settled total */}
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
              <span className="text-base font-black text-gray-700">All-time settled</span>
              <span className="text-xl font-black text-gray-900">{fmt(settledNet)}</span>
            </div>
          </div>
        </div>

        {/* Lifetime summary */}
        <div
          className="rounded-2xl px-4 py-4 flex items-center gap-4"
          style={{ background: 'linear-gradient(135deg, #1A5FB8, #F47820)' }}
        >
          <TrendingUp size={32} className="text-white opacity-80 flex-shrink-0" />
          <div>
            <p className="text-white text-sm font-bold opacity-80">Total lifetime earnings (net)</p>
            <p className="text-white text-3xl font-black">{fmt(totalNet)}</p>
          </div>
        </div>

      </div>

      <BottomNav active="payments" onHome={onGoHome} onOrders={onGoToOrdersList} onPayments={() => {}} />
    </div>
  );
}

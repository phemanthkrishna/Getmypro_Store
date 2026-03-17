import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { DEMO_ORDERS, generateRandomOrder, Order } from './data/demoData';
import HomeScreen from './screens/HomeScreen';
import AddPricesScreen from './screens/AddPricesScreen';
import WaitingScreen from './screens/WaitingScreen';
import PackGoodsScreen from './screens/PackGoodsScreen';
import OTPScreen from './screens/OTPScreen';
import OrdersListScreen from './screens/OrdersListScreen';
import PaymentsScreen from './screens/PaymentsScreen';

export type OrderStatus = 'new' | 'quote-sent' | 'payment-received' | 'completed';

export interface OrderState {
  order: Order;
  status: OrderStatus;
  prices: Record<string, number>;
}

export type Screen =
  | 'home'
  | 'orders-list'
  | 'payments'
  | 'add-prices'
  | 'waiting-payment'
  | 'pack-goods'
  | 'otp-entry';

export function calcTotal(orderState: OrderState): number {
  return orderState.order.materials.reduce(
    (sum, m) => sum + (orderState.prices[m.name] ?? 0),
    0,
  );
}

function App() {
  const [orders, setOrders] = useState<OrderState[]>(
    DEMO_ORDERS.map((o) => ({ order: o, status: 'new', prices: {} })),
  );
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [screen, setScreen] = useState<Screen>('home');

  // Refs so timer callbacks always read fresh values
  const activeOrderIdRef = useRef(activeOrderId);
  activeOrderIdRef.current = activeOrderId;
  const screenRef = useRef(screen);
  screenRef.current = screen;

  // Timers keyed by order ID — simulate customer payment after 4s
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const activeOrderState = orders.find((o) => o.order.id === activeOrderId) ?? null;

  // Watch for newly quote-sent orders and start their payment timers
  useEffect(() => {
    orders.forEach((os) => {
      const id = os.order.id;
      if (os.status === 'quote-sent' && !timersRef.current[id]) {
        timersRef.current[id] = setTimeout(() => {
          // Mark as payment-received
          setOrders((prev) =>
            prev.map((o) => (o.order.id === id ? { ...o, status: 'payment-received' } : o)),
          );
          // Toast notification wherever user is
          toast.success(`💳 Payment received for Order #${id}!`, { duration: 5000 });
          // If watching this order's waiting screen, auto-advance
          if (screenRef.current === 'waiting-payment' && activeOrderIdRef.current === id) {
            setScreen('pack-goods');
          }
          delete timersRef.current[id];
        }, 4000);
      }
      // Cancel timer if order was manually moved out of quote-sent
      if (os.status !== 'quote-sent' && timersRef.current[id]) {
        clearTimeout(timersRef.current[id]);
        delete timersRef.current[id];
      }
    });
  }, [orders]);

  function updateStatus(id: string, status: OrderStatus) {
    setOrders((prev) =>
      prev.map((o) => (o.order.id === id ? { ...o, status } : o)),
    );
  }

  function updatePrices(id: string, prices: Record<string, number>) {
    setOrders((prev) =>
      prev.map((o) => (o.order.id === id ? { ...o, prices } : o)),
    );
  }

  function handleViewOrder(orderId: string) {
    setActiveOrderId(orderId);
    setScreen('add-prices');
  }

  function handleSendQuote() {
    if (!activeOrderId) return;
    updateStatus(activeOrderId, 'quote-sent');
    setScreen('waiting-payment');
  }

  function handleOrderComplete() {
    if (!activeOrderId) return;
    updateStatus(activeOrderId, 'completed');
    setActiveOrderId(null);
    setScreen('home');
  }

  function handleAddRandomOrder() {
    const newOrder = generateRandomOrder();
    setOrders((prev) => [...prev, { order: newOrder, status: 'new', prices: {} }]);
  }

  function handleDeliverFromList(orderId: string) {
    setActiveOrderId(orderId);
    setScreen('otp-entry');
  }

  function handleAddPricesFromList(orderId: string) {
    setActiveOrderId(orderId);
    setScreen('add-prices');
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-white relative overflow-x-hidden">
        {screen === 'home' && (
          <HomeScreen
            orders={orders}
            onViewOrder={handleViewOrder}
            onAddRandomOrder={handleAddRandomOrder}
            onGoToOrdersList={() => setScreen('orders-list')}
            onGoToPayments={() => setScreen('payments')}
          />
        )}
        {screen === 'orders-list' && (
          <OrdersListScreen
            orders={orders}
            onGoHome={() => setScreen('home')}
            onGoPayments={() => setScreen('payments')}
            onAddPrices={handleAddPricesFromList}
            onCollect={handleDeliverFromList}
          />
        )}
        {screen === 'payments' && (
          <PaymentsScreen
            orders={orders}
            onGoHome={() => setScreen('home')}
            onGoToOrdersList={() => setScreen('orders-list')}
          />
        )}
        {screen === 'add-prices' && activeOrderState && (
          <AddPricesScreen
            orderState={activeOrderState}
            onPriceChange={(prices) => updatePrices(activeOrderState.order.id, prices)}
            onBack={() => setScreen('home')}
            onSendQuote={handleSendQuote}
          />
        )}
        {screen === 'waiting-payment' && activeOrderState && (
          <WaitingScreen
            orderId={activeOrderState.order.id}
            total={calcTotal(activeOrderState)}
            onGoHome={() => { setActiveOrderId(null); setScreen('home'); }}
          />
        )}
        {screen === 'pack-goods' && activeOrderState && (
          <PackGoodsScreen
            order={activeOrderState.order}
            total={calcTotal(activeOrderState)}
            onGoHome={() => { setActiveOrderId(null); setScreen('home'); }}
          />
        )}
        {screen === 'otp-entry' && activeOrderState && (
          <OTPScreen
            order={activeOrderState.order}
            total={calcTotal(activeOrderState)}
            onComplete={handleOrderComplete}
          />
        )}
      </div>
    </div>
  );
}

export default App;

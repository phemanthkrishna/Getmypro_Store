import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { CheckCircle2 } from 'lucide-react';
import { Order } from '../data/demoData';

interface Props {
  order: Order;
  total: number;
  onComplete: () => void;
}

export default function OTPScreen({ order, total, onComplete }: Props) {
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [shaking, setShaking] = useState(false);
  const [success, setSuccess] = useState(false);
  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    refs[0].current?.focus();
  }, []);

  const otp = digits.join('');
  const allFilled = otp.length === 4;

  function handleChange(index: number, value: string) {
    const char = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    if (char && index < 3) {
      refs[index + 1].current?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  }

  function handleConfirm() {
    if (otp === order.compOtp) {
      setSuccess(true);
      setTimeout(() => {
        onComplete();
      }, 3000);
    } else {
      setShaking(true);
      toast.error('Wrong OTP — ask worker again');
      setTimeout(() => setShaking(false), 600);
      setDigits(['', '', '', '']);
      setTimeout(() => refs[0].current?.focus(), 50);
    }
  }

  if (success) {
    return (
      <div className="fade-in flex flex-col items-center justify-center min-h-screen bg-ds-bg px-6 text-center">
        <div className="bounce-in mb-5">
          <CheckCircle2 size={96} className="text-ds-success" strokeWidth={1.5} />
        </div>
        <h2 className="text-[32px] font-black text-ds-text mb-3">✅ Material Supplied!</h2>
        <p className="text-lg font-bold text-ds-muted mb-2">Order #{order.id} Complete</p>
        <div className="bg-ds-success/10 border border-ds-success/25 rounded-2xl px-6 py-4 mt-2">
          <p className="text-sm font-bold text-ds-success">
            ₹{total.toLocaleString('en-IN')} will be settled to your account
          </p>
        </div>
        <p className="text-xs text-ds-muted mt-8 italic opacity-50">[Returning to home in 3 seconds...]</p>
      </div>
    );
  }

  return (
    <div className="fade-in flex flex-col min-h-screen bg-ds-bg">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-ds-border bg-ds-surface">
        <div className="w-10 h-10" />
        <h1 className="text-xl font-black text-ds-text flex-1 text-center pr-10">
          Confirm Delivery
        </h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-6">
        <p className="text-[20px] font-black text-ds-text text-center leading-snug mb-8">
          Ask the worker for their<br />4-digit OTP and enter below
        </p>

        {/* OTP boxes */}
        <div className={`flex gap-3 mb-4 ${shaking ? 'shake' : ''}`}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={refs[i]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-16 h-[72px] text-center text-[32px] font-black border-2 rounded-xl focus:outline-none transition-colors"
              style={{
                borderColor: d ? '#6366F1' : '#27272A',
                backgroundColor: d ? 'rgba(99,102,241,0.12)' : '#131316',
                color: '#FAFAFA',
              }}
            />
          ))}
        </div>

        <p className="text-xs text-ds-muted mb-10 italic opacity-50">
          Demo OTP: {order.compOtp}
        </p>

        <button
          onClick={handleConfirm}
          disabled={!allFilled}
          className={`w-full text-white font-black text-base rounded-2xl py-4 min-h-[52px] transition-all ${
            allFilled ? 'active:opacity-80' : 'opacity-40 cursor-not-allowed'
          }`}
          style={allFilled ? { backgroundColor: '#22C55E' } : { backgroundColor: '#27272A' }}
        >
          CONFIRM &amp; MARK SUPPLIED ✓
        </button>
      </div>
    </div>
  );
}

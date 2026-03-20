import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { API_BASE_URL, apiFetch, getCurrentShop, getToken } from '../lib/clientApi';

const fallbackPlans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 999,
    priceId: 'starter',
    interval: 'month',
    maxChats: 500,
    maxAgents: 1,
    description: 'เหมาะกับร้านที่เพิ่งเริ่มใช้ AI ช่วยตอบแชต',
    features: [
      'ใช้งานได้ 1 Agent',
      '500 ข้อความ/เดือน',
      'รองรับ LINE Bot',
      'สถิติพื้นฐาน',
      'สนับสนุนทาง Email',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 2999,
    priceId: 'pro',
    interval: 'month',
    maxChats: 5000,
    maxAgents: 5,
    popular: true,
    description: 'เหมาะกับร้านที่เริ่มโตและต้องการ automation มากขึ้น',
    features: [
      'ใช้งานได้ 5 Agents',
      '5,000 ข้อความ/เดือน',
      'รองรับ LINE Bot',
      'สถิติขั้นสูง',
      'AI Auto Reply',
      'สนับสนุนทาง Email & Chat',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 9999,
    priceId: 'enterprise',
    interval: 'month',
    maxChats: -1,
    maxAgents: -1,
    description: 'สำหรับทีมที่ต้องการใช้งานเต็มรูปแบบหลายช่องทาง',
    features: [
      'ใช้งานได้ไม่จำกัด Agents',
      'ข้อความไม่จำกัด',
      'รองรับ LINE Bot & Multi-channel',
      'สถิติขั้นสูง & Analytics',
      'AI Auto Reply',
      'API Access',
      'ลำดับชั้นผู้ใช้งาน',
      'สนับสนุน 24/7',
    ],
  },
];

const subscriptionTone = {
  active: 'bg-green-50 text-green-700 border-green-200',
  trialing: 'bg-blue-50 text-blue-700 border-blue-200',
  past_due: 'bg-amber-50 text-amber-700 border-amber-200',
  unpaid: 'bg-red-50 text-red-700 border-red-200',
  canceled: 'bg-gray-100 text-gray-700 border-gray-200',
  inactive: 'bg-gray-100 text-gray-700 border-gray-200',
};

function normalizePlan(plan, index = 0) {
  const fallback = fallbackPlans[index] || fallbackPlans[0];
  const backendPlanId = plan?.id || plan?.planId || '';
  const backendPriceId = plan?.priceId || plan?.stripe_price_id || plan?.stripePriceId || '';
  const name = plan?.name || fallback.name;

  return {
    ...fallback,
    ...plan,
    id: backendPlanId || fallback.id,
    priceId: backendPriceId || fallback.priceId,
    backendPlanId,
    backendPriceId,
    hasValidCheckoutIds: Boolean(backendPlanId && backendPriceId),
    name,
    price: Number(plan?.price ?? plan?.amount ?? fallback.price),
    interval: plan?.interval || fallback.interval,
    maxChats: Number(plan?.max_chats ?? plan?.maxChats ?? fallback.maxChats),
    maxAgents: Number(plan?.max_agents ?? plan?.maxAgents ?? fallback.maxAgents),
    description: plan?.description || fallback.description,
    features: Array.isArray(plan?.features) ? plan.features : fallback.features,
    popular: Boolean(plan?.popular ?? fallback.popular),
  };
}

function formatCurrency(value) {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium' }).format(date);
}

function getSubscriptionLabel(status) {
  const map = {
    active: 'ใช้งานอยู่',
    trialing: 'ช่วงทดลองใช้',
    past_due: 'ค้างชำระ',
    unpaid: 'ยังไม่ได้ชำระ',
    canceled: 'ยกเลิกแล้ว',
    inactive: 'ยังไม่มี subscription',
  };
  return map[status] || status || 'ไม่ทราบสถานะ';
}

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState(fallbackPlans);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansAvailable, setPlansAvailable] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [billingError, setBillingError] = useState('');
  const [checkoutLoadingPlan, setCheckoutLoadingPlan] = useState('');
  const [shop, setShop] = useState(null);

  useEffect(() => {
    const currentShop = getCurrentShop();
    setShop(currentShop);
    loadPlans();
    loadSubscription(currentShop);
  }, []);

  const currentPlanName = useMemo(() => {
    return (
      subscription?.planName ||
      subscription?.plan ||
      shop?.plan_name ||
      shop?.plan ||
      ''
    );
  }, [shop, subscription]);

  const normalizedStatus = useMemo(() => {
    return String(subscription?.status || (currentPlanName ? 'active' : 'inactive')).toLowerCase();
  }, [subscription, currentPlanName]);

  const loadPlans = async () => {
    try {
      const data = await apiFetch('/plans');
      const plansData = data?.data;
      const rawPlans = Array.isArray(plansData)
        ? plansData
        : Array.isArray(plansData?.plans)
          ? plansData.plans
          : Array.isArray(data)
            ? data
            : Array.isArray(data?.plans)
              ? data.plans
              : [];

      if (rawPlans.length > 0) {
        setPlans(rawPlans.map((plan, index) => normalizePlan(plan, index)));
        setPlansAvailable(true);
      } else {
        setPlansAvailable(false);
      }
    } catch (error) {
      console.error('โหลด plans ไม่สำเร็จ:', error);
      setPlansAvailable(false);
    } finally {
      setPlansLoading(false);
    }
  };

  const loadSubscription = async (currentShop) => {
    const token = getToken();
    if (!token) {
      setSubscription({
        status: currentShop?.plan_name ? 'active' : 'inactive',
        planName: currentShop?.plan_name || currentShop?.plan || '',
      });
      setSubscriptionLoading(false);
      return;
    }

    const candidates = [
      '/billing/subscription',
      currentShop?.id ? `/billing/subscription/${currentShop.id}` : '',
      currentShop?.id ? `/shops/${currentShop.id}/subscription` : '',
      '/billing/me',
    ].filter(Boolean);

    try {
      let data = null;
      for (const path of candidates) {
        try {
          data = await apiFetch(path);
          if (data) break;
        } catch {
          // ลอง endpoint ถัดไป
        }
      }

      if (data) {
        const sub = data.subscription || data.data || data;
        setSubscription({
          status: String(sub?.status || (sub?.planName || sub?.plan ? 'active' : 'inactive')).toLowerCase(),
          planName: sub?.planName || sub?.plan_name || sub?.plan || '',
          currentPeriodEnd: sub?.currentPeriodEnd || sub?.current_period_end || sub?.renewAt || sub?.renew_at || '',
          cancelAtPeriodEnd: Boolean(sub?.cancelAtPeriodEnd || sub?.cancel_at_period_end),
          customerPortalUrl: sub?.customerPortalUrl || sub?.portalUrl || sub?.portal_url || '',
        });
      } else {
        setSubscription({
          status: currentShop?.plan_name ? 'active' : 'inactive',
          planName: currentShop?.plan_name || currentShop?.plan || '',
        });
      }
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const startCheckout = async (plan) => {
    const token = getToken();
    setBillingError('');

    if (!plansAvailable) {
      setBillingError('ยังโหลดข้อมูลแพ็กเกจจากระบบไม่สำเร็จ จึงยังไม่สามารถเริ่ม checkout ได้ค่ะ กรุณาลองใหม่อีกครั้ง');
      return;
    }

    if (!plan?.hasValidCheckoutIds) {
      setBillingError('แพ็กเกจนี้ยังไม่มี id หรือ priceId ที่ backend ส่งมาครบ จึงยังไม่สามารถเริ่ม checkout ได้ค่ะ');
      return;
    }

    if (!token) {
      router.push('/login');
      return;
    }

    setCheckoutLoadingPlan(plan.id);

    try {
      const payload = {
        planId: plan.backendPlanId,
        priceId: plan.backendPriceId,
        planName: plan.name,
        billingInterval: plan.interval,
        successUrl: `${window.location.origin}/pricing?checkout=success`,
        cancelUrl: `${window.location.origin}/pricing?checkout=cancelled`,
        shopId: shop?.id,
      };

      const candidates = [
        '/billing/checkout',
        '/billing/create-checkout-session',
        '/stripe/checkout',
      ];

      let checkoutResponse = null;
      let lastError = null;

      for (const path of candidates) {
        try {
          checkoutResponse = await apiFetch(path, {
            method: 'POST',
            body: JSON.stringify(payload),
          });
          if (checkoutResponse) break;
        } catch (error) {
          lastError = error;
        }
      }

      const redirectUrl =
        checkoutResponse?.data?.checkoutUrl ||
        checkoutResponse?.url ||
        checkoutResponse?.checkoutUrl ||
        checkoutResponse?.checkout_url ||
        checkoutResponse?.sessionUrl ||
        checkoutResponse?.session_url;

      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }

      throw lastError || new Error('ระบบยังไม่ส่งลิงก์ Stripe Checkout กลับมา');
    } catch (error) {
      console.error('Stripe checkout error:', error);
      setBillingError(error.message || 'เริ่มการชำระเงินไม่สำเร็จ กรุณาตรวจ endpoint Stripe ฝั่ง backend');
    } finally {
      setCheckoutLoadingPlan('');
    }
  };

  const openCustomerPortal = () => {
    if (subscription?.customerPortalUrl) {
      window.location.href = subscription.customerPortalUrl;
      return;
    }
    setBillingError(`ยังไม่พบ customer portal URL จาก backend ค่ะ สามารถเพิ่ม field customerPortalUrl จาก ${API_BASE_URL}/billing/subscription ได้เลย`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="text-2xl">🐱</span>
            <div>
              <div className="text-lg font-bold">MeowChat Billing</div>
              <div className="text-xs text-slate-400">Stripe subscription checkout</div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm text-slate-300 hover:text-white">
              กลับไป Dashboard
            </Link>
            {!getToken() && (
              <Link href="/login" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-medium">
                เข้าสู่ระบบ
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <section className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-start mb-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-200 mb-5">
              <span>💳</span>
              <span>Stripe Checkout พร้อมต่อ backend ได้ทันที</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              เลือกแพ็กเกจให้เหมาะกับร้าน แล้วกด <span className="text-indigo-300">จ่ายด้วยบัตร</span> ได้เลยค่ะ
            </h1>
            <p className="text-slate-300 text-lg mt-5 max-w-2xl">
              หน้านี้รวม 3 อย่างใน flow เดียว: เลือกแพลน Starter / Pro / Enterprise, ส่งผู้ใช้ไป Stripe Checkout,
              และดูสถานะ subscription ปัจจุบันได้ทันที
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              {[
                { label: 'เริ่มได้เร็ว', value: '3 แพ็กเกจหลัก' },
                { label: 'ช่องทางจ่ายเงิน', value: 'บัตรผ่าน Stripe' },
                { label: 'สถานะสมาชิก', value: 'ดูแพลน/วันต่ออายุได้' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-slate-400 text-sm">{item.label}</div>
                  <div className="text-xl font-semibold mt-2">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white p-6 text-slate-900 shadow-2xl shadow-indigo-950/20">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-sm text-slate-500">สถานะ subscription</p>
                <h2 className="text-2xl font-bold mt-1">{subscriptionLoading ? 'กำลังโหลด...' : (currentPlanName || 'ยังไม่มีแพลน')}</h2>
              </div>
              <span className={`px-3 py-1.5 rounded-full border text-sm font-medium ${subscriptionTone[normalizedStatus] || subscriptionTone.inactive}`}>
                {subscriptionLoading ? 'Loading' : getSubscriptionLabel(normalizedStatus)}
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                <span className="text-slate-500">ร้านที่เลือก</span>
                <span className="font-medium text-right">{shop?.name || 'ยังไม่ได้เลือกร้าน'}</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                <span className="text-slate-500">แพลนปัจจุบัน</span>
                <span className="font-medium text-right">{currentPlanName || '-'}</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                <span className="text-slate-500">ต่ออายุ / สิ้นสุดรอบ</span>
                <span className="font-medium text-right">{formatDate(subscription?.currentPeriodEnd)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">สิ้นสุดรอบปัจจุบันแล้วไม่ต่อ</span>
                <span className="font-medium text-right">{subscription?.cancelAtPeriodEnd ? 'ใช่' : 'ไม่ใช่'}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={openCustomerPortal}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium hover:bg-slate-50"
              >
                จัดการ subscription
              </button>
              <button
                onClick={() => loadSubscription(getCurrentShop())}
                className="flex-1 rounded-xl bg-slate-900 text-white px-4 py-3 text-sm font-medium hover:bg-slate-800"
              >
                รีเฟรชสถานะ
              </button>
            </div>
          </div>
        </section>

        {billingError && (
          <div className="mb-6 rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-red-100">
            {billingError}
          </div>
        )}

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {(plansLoading ? fallbackPlans : plans).map((plan) => {
            const isCurrent = currentPlanName && currentPlanName.toLowerCase() === String(plan.name).toLowerCase();
            const isLoadingCheckout = checkoutLoadingPlan === plan.id;
            const hasValidCheckoutIds = Boolean(plan?.hasValidCheckoutIds);
            const isCheckoutDisabled = !plansAvailable || !hasValidCheckoutIds || isLoadingCheckout;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl border p-7 ${plan.popular ? 'border-indigo-400 bg-gradient-to-b from-indigo-500/20 to-slate-900' : 'border-white/10 bg-white/5'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-6 rounded-full bg-indigo-400 text-slate-950 px-4 py-1 text-sm font-bold">
                    Recommended
                  </div>
                )}

                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <p className="text-slate-300 mt-2 min-h-[48px]">{plan.description}</p>
                  </div>
                  {isCurrent && (
                    <span className="rounded-full bg-green-400/15 text-green-200 border border-green-400/20 px-3 py-1 text-xs font-semibold">
                      แพลนปัจจุบัน
                    </span>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold">{formatCurrency(plan.price)}</span>
                    <span className="text-slate-400 mb-1">/{plan.interval === 'year' ? 'ปี' : 'เดือน'}</span>
                  </div>
                  <div className="text-sm text-slate-400 mt-2">
                    {plan.maxChats === -1 ? 'ข้อความไม่จำกัด' : `${plan.maxChats.toLocaleString()} ข้อความ/เดือน`} · {' '}
                    {plan.maxAgents === -1 ? 'Agents ไม่จำกัด' : `${plan.maxAgents} Agents`}
                  </div>
                </div>

                <ul className="space-y-3 text-slate-200 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={`${plan.id}-${index}`} className="flex items-start gap-3">
                      <span className="mt-0.5 text-emerald-300">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => startCheckout(plan)}
                  disabled={isCheckoutDisabled}
                  className={`w-full rounded-2xl px-5 py-3.5 font-semibold transition ${plan.popular ? 'bg-indigo-500 text-white hover:bg-indigo-400' : 'bg-white text-slate-950 hover:bg-slate-100'} disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {isLoadingCheckout
                    ? 'กำลังพาไป Stripe Checkout...'
                    : !plansAvailable
                      ? 'ยังไม่พร้อมสำหรับ checkout'
                      : !hasValidCheckoutIds
                        ? 'แพ็กเกจนี้ยัง checkout ไม่ได้'
                        : 'จ่ายด้วยบัตร'}
                </button>

                <p className="text-xs text-slate-400 mt-3">
                  {!plansAvailable
                    ? 'ยังโหลดข้อมูลแพ็กเกจจาก backend ไม่สำเร็จ จึงปิดปุ่ม checkout ชั่วคราวเพื่อป้องกันการส่ง plan ID ที่ไม่ถูกต้องค่ะ'
                    : !hasValidCheckoutIds
                      ? 'backend ส่งข้อมูลแพ็กเกจมาไม่ครบ id หรือ priceId จึงปิด checkout ไว้ก่อนเพื่อกัน fallback string IDs หลุดไปค่ะ'
                      : 'ปุ่มนี้จะเรียก backend เพื่อสร้าง Stripe Checkout Session แล้ว redirect ผู้ใช้ไปหน้าชำระเงินค่ะ'}
                </p>
              </div>
            );
          })}
        </section>

        <section className="mt-12 grid lg:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold mb-4">สิ่งที่หน้า UI นี้รองรับแล้ว</h2>
            <ul className="space-y-3 text-slate-300">
              <li className="flex gap-3"><span className="text-emerald-300">✓</span><span>เลือกแพ็กเกจ Starter / Pro / Enterprise</span></li>
              <li className="flex gap-3"><span className="text-emerald-300">✓</span><span>ปุ่มจ่ายด้วยบัตรเพื่อไป Stripe Checkout</span></li>
              <li className="flex gap-3"><span className="text-emerald-300">✓</span><span>การ์ดแสดงสถานะ subscription ปัจจุบัน</span></li>
              <li className="flex gap-3"><span className="text-emerald-300">✓</span><span>รองรับ fallback เมื่อ backend ยังไม่ครบทุก endpoint</span></li>
            </ul>
          </div>

          <div className="rounded-3xl border border-amber-300/20 bg-amber-500/10 p-6 text-amber-50">
            <h2 className="text-xl font-bold mb-4">Backend ที่ควรมีประกบ</h2>
            <ul className="space-y-3 text-sm">
              <li>• <code className="font-mono">POST {API_BASE_URL}/billing/checkout</code> หรือ endpoint ที่เทียบเท่า เพื่อคืน <code>url</code></li>
              <li>• <code className="font-mono">GET {API_BASE_URL}/billing/subscription</code> เพื่อคืนสถานะ subscription ปัจจุบัน</li>
              <li>• ถ้ามี customer portal ให้คืน <code>customerPortalUrl</code> ใน subscription response</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

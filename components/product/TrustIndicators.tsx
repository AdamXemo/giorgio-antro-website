import { Truck, Shield, RotateCcw } from 'lucide-react'

// Hoisted outside component — static, never changes
const TRUST_ITEMS = [
  { Icon: Truck,      label: 'FREE SHIPPING'    },
  { Icon: Shield,     label: 'SECURE CHECKOUT'  },
  { Icon: RotateCcw,  label: 'EASY RETURNS'     },
] as const

export default function TrustIndicators() {
  return (
    <div className="flex items-center justify-between py-5 border-t border-b border-black/[0.08]">
      {TRUST_ITEMS.map(({ Icon, label }) => (
        <div key={label} className="flex flex-col items-center gap-2">
          <Icon size={16} strokeWidth={1.5} />
          <p className="text-[9px] tracking-[0.15em] text-black/40">{label}</p>
        </div>
      ))}
    </div>
  )
}

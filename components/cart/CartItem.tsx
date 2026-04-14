import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import type { CartItem as CartItemType } from '@/types/cart'
import QuantitySelector from '@/components/ui/QuantitySelector'

interface CartItemProps {
  item: CartItemType
  index: number
  onUpdateQuantity: (id: string, size: string, qty: number) => void
  onRemove: (id: string, size: string) => void
}

export default function CartItem({ item, index, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div
      className="flex gap-6 py-8 border-b border-black/10 dark:border-white/10 animate-fade-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-[#f2f2f2] dark:bg-[#1c1c1c] overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(min-width: 768px) 96px, 80px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div className="flex justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium truncate">{item.name}</h3>
            <p className="text-[10px] tracking-[0.15em] text-black/35 dark:text-white/35 mt-1.5">
              SIZE {item.size}
            </p>
          </div>
          <p className="text-sm font-light tabular-nums flex-shrink-0">
            €{(item.price * item.quantity).toFixed(2)}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <QuantitySelector
            value={item.quantity}
            onDecrement={() => onUpdateQuantity(item.id, item.size, item.quantity - 1)}
            onIncrement={() => onUpdateQuantity(item.id, item.size, item.quantity + 1)}
            size="sm"
          />
          <button
            type="button"
            onClick={() => onRemove(item.id, item.size)}
            className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.15em] text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors"
            aria-label="Remove item"
          >
            <Trash2 size={11} strokeWidth={1.5} />
            REMOVE
          </button>
        </div>
      </div>
    </div>
  )
}

interface FeaturesListProps {
  features: string[]
}

export default function FeaturesList({ features }: FeaturesListProps) {
  return (
    <div>
      {features.map((feature, idx) => (
        <div
          key={idx}
          className="flex items-center gap-5 py-3.5 border-b border-black/[0.07] dark:border-white/[0.07]"
        >
          <span className="text-[10px] text-black/25 dark:text-white/25 tabular-nums w-5 flex-shrink-0">
            {String(idx + 1).padStart(2, '0')}
          </span>
          <span className="text-sm text-black/65 dark:text-white/65">{feature}</span>
        </div>
      ))}
    </div>
  )
}

import Eyebrow from './Eyebrow'

interface SectionHeaderProps {
  eyebrow: string
  heading: string
  as?: 'h1' | 'h2' | 'h3'
  headingClassName?: string
  className?: string
}

export default function SectionHeader({
  eyebrow,
  heading,
  as: Tag = 'h2',
  headingClassName = '',
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={className}>
      <Eyebrow label={eyebrow} className="mb-5" />
      <Tag className={`font-display font-light ${headingClassName}`}>{heading}</Tag>
    </div>
  )
}

import { LucideIcon } from 'lucide-react';

interface CategoryChipProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  icon?: LucideIcon;
}

export function CategoryChip({ label, isSelected, onClick, icon: Icon }: CategoryChipProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0
        ${
          isSelected
            ? 'bg-gray-900 text-white shadow-md'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }
      `}
    >
      {Icon && <Icon className="size-4" />}
      <span>{label}</span>
    </button>
  );
}




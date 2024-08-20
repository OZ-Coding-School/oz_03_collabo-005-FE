import { IoMdCheckmark } from 'react-icons/io';

interface SelectionItemProps {
  item: string;
  isSelected: boolean;
  onClick: () => void;
}

const SelectionItem = ({ item, isSelected, onClick }: SelectionItemProps) => {
  return (
    <div
      className={`flex w-full cursor-pointer items-center justify-between ${isSelected ? 'font-bold text-primary' : ''}`}
      onClick={onClick}>
      {item}
      {isSelected && <IoMdCheckmark className="text-2xl font-bold" />}
    </div>
  );
};

export default SelectionItem;

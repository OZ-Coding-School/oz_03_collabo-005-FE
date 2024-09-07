import { useRef, useEffect } from 'react';

interface List {
  list: string[];
  setSelectedItem: (index: number) => void;
  selectedIndex: number; // Add this prop
}

const PostNav: React.FC<List> = ({ list, setSelectedItem, selectedIndex }) => {
  const indicatorRef = useRef<HTMLSpanElement | null>(null);
  const buttonRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    document.getElementById('root')?.scrollTo(0, 0);
    const currentButton = buttonRefs.current[selectedIndex];
    if (indicatorRef.current && currentButton) {
      const buttonTextWidth = currentButton.offsetWidth;
      indicatorRef.current.style.width = `${buttonTextWidth}px`;
      indicatorRef.current.style.left = `${currentButton.offsetLeft}px`;
      indicatorRef.current.style.backgroundColor = '#000000';
    }
  }, [selectedIndex]);

  const handleClick = (index: number) => {
    setSelectedItem(index);
  };

  return (
    <div className="sticky top-[72px] z-10 flex justify-evenly border-b-[1px] border-solid border-[#DBDBDB] bg-white xs:top-[52px]">
      {list.map((item, index) => (
        <span
          key={item}
          ref={(el) => (buttonRefs.current[index] = el)}
          className={`relative flex h-[63px] w-[130px] grow cursor-pointer items-center justify-center text-[18px] duration-300 xs:h-[53px] xs:w-[120px] xs:text-[16px] ${
            selectedIndex === index ? 'font-bold text-black' : 'text-gray-600'
          } `}
          onClick={() => handleClick(index)}>
          {item}
        </span>
      ))}
      <span ref={indicatorRef} className="absolute bottom-0 h-[3px] transition-all duration-500 ease-in-out" />
    </div>
  );
};

export default PostNav;

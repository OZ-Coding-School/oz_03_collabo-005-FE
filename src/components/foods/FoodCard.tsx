import { PropsWithChildren } from 'react';
import Tag from '../common/Tag';
import { Link } from 'react-router-dom';

interface FoodCardProps extends PropsWithChildren {
  id: number;
  name: string;
  tag: string[];
  img: string | undefined;
}

const FoodCard = ({ id, name, tag, img }: FoodCardProps) => {
  return (
    <Link
      to={`/foods/${id}`}
      state={{ name }} // 음식 이름을 state로 전달
      className="flex aspect-square w-full flex-col">
      <img src={`/${img}`} alt={name} className="grow rounded-[8px]" />
      <div className="mt-[10px]">
        <h1 className="text-[14px] font-medium">{name}</h1>
        <div className="mt-[10px] flex gap-[10px]">
          {tag.map((item) => (
            <Tag key={item} height="sm" rounded="sm" padding="sm" className="text-[12px] text-gray-66">
              {item}
            </Tag>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default FoodCard;

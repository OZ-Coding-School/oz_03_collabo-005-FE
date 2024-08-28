import { PropsWithChildren } from 'react';
import Tag from '../common/Tag';
import { Link } from 'react-router-dom';

interface FoodCardProps extends PropsWithChildren {
  id: string;
  info: string;
  name: string;
  tag: string[];
  img: string;
}

const FoodCard = ({ id, info, name, tag, img, ...props }: FoodCardProps) => {
  return (
    <Link to={`/foods/${id}`} className="flex aspect-square w-full flex-col">
      <img src="/images/kimchi.png" alt="" className="grow rounded-[8px]" />
      <div className="mt-[10px]">
        <h1 className="text-[14px] font-medium">
          {info}
          &nbsp;
          {`"${name}"`}
        </h1>
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

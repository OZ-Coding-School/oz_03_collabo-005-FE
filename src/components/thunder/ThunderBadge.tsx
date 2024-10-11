import { FaMapMarkerAlt } from 'react-icons/fa';
import { IoWalletOutline } from 'react-icons/io5';
import { GoPeople } from 'react-icons/go';
import { PiSpinnerGap } from 'react-icons/pi';

interface ThunderBadgeProps {
  label: string;
  type: string;
}

const ThunderBadge: React.FC<ThunderBadgeProps> = ({ label, type }) => {
  const getStyle = () => {
    switch (type) {
      case 'location':
        return 'bg-white';
      case 'payment':
        return '';
      case 'gender':
        return '';
      case 'age':
        return '';
      default:
        return '';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'location':
        return <FaMapMarkerAlt className="mr-1" />;
      case 'payment':
        return <IoWalletOutline className="mr-1" />;
      case 'gender':
        return <GoPeople className="mr-1" />;
      case 'age':
        return <PiSpinnerGap className="mr-1" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`${getStyle()} flex items-center rounded-md border-2 border-gray-200 bg-slate-100 px-2 py-1 text-sm text-black`}>
      {getIcon()}
      {label}
    </span>
  );
};

export default ThunderBadge;

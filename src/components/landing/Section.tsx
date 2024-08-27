import { Link } from 'react-router-dom';
import { RiArrowRightSLine } from 'react-icons/ri';
import ContentLoader from 'react-content-loader';
import React from 'react';

interface SectionProps {
  title: string;
  subtitle: React.ReactNode;
  description: string;
  linkTo: string;
  buttonText: string;
  isImageLoaded: boolean;
  setIsImageLoaded: (loaded: boolean) => void;
}

const Section: React.FC<SectionProps> = ({
  title,
  subtitle,
  description,
  linkTo,
  buttonText,
  isImageLoaded,
  setIsImageLoaded,
}) => (
  <div className="w-full max-w-[800px] bg-slate-100 bg-gradient-to-r from-gray-100 to-gray-200 p-4 text-center">
    <h2 className="mt-20 text-2xl font-semibold text-orange-500 xs:text-xl">{title}</h2>
    <p className="mt-10 text-3xl font-bold xs:text-2xl">{subtitle}</p>
    <p className="mt-10 text-[16px] text-gray-500 xs:text-[16px]">{description}</p>
    <div className="flex justify-center">
      <Link
        to={linkTo}
        className="gray-400 mt-4 flex h-12 w-32 items-center justify-center rounded-[20px] bg-white px-4 py-2 font-bold hover:bg-orange-600 hover:text-white xs:h-11 xs:w-28">
        {buttonText} <RiArrowRightSLine size={20} />
      </Link>
    </div>
    {!isImageLoaded && (
      <ContentLoader
        height={200}
        width={200}
        speed={2}
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        className="mx-auto mb-20 mt-20">
        <circle cx="100" cy="100" r="100" />
      </ContentLoader>
    )}
    <img
      src="/images/HomeExample.svg"
      alt="example"
      className={`mx-auto mb-20 mt-20 ${isImageLoaded ? 'block' : 'hidden'}`}
      onLoad={() => setIsImageLoaded(true)}
    />
  </div>
);

export default Section;

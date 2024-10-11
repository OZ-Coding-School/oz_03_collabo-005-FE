import { useState, useEffect } from 'react';
import UpdateCard from '../../components/updatenote/UpdateCard';
import Loading from '../../components/common/Loading';
import { PiNotebookLight } from 'react-icons/pi';
import { GoCommandPalette } from 'react-icons/go';
import { UpdateNotes } from '../../data/UpdateNotes';

interface Note {
  uuid: string;
  category_name: string;
  title: string;
  content: string;
  description: string;
  created_at: string;
  image_url: string;
}

const UpdateNote = () => {
  const [selectedBoard, setSelectedBoard] = useState<string>('전체');
  const [boardList, setBoardList] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categories] = useState<{ category: string }[]>([
    { category: '전체' },
    { category: '개선사항' },
    { category: '업데이트' },
  ]);

  useEffect(() => {
    const loadNotes = async () => {
      setIsLoading(true);
      const notes = await UpdateNotes();
      setBoardList(notes);
      setIsLoading(false);
    };
    loadNotes();
  }, []);

  const filteredBoardList =
    selectedBoard === '전체'
      ? boardList
      : boardList.filter((item) => {
          if (!item) return false;
          return item.category_name === selectedBoard;
        });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="relative mr-2 p-4 pt-0">
      <div className="fixed top-[72px] z-20 justify-center rounded-xl border bg-slate-300 p-4 backdrop-blur-md xs:top-[52px] xs:w-[400px] xs:max-w-[380px]">
        <div className="flex items-center">
          <h1 className="my-[12px] ml-4 text-2xl font-bold text-gray-800 xs:text-xl">
            <PiNotebookLight size={25} className="mr-2 inline-block" />
            개발자 노트
          </h1>
        </div>
        <p className="my-[12px] ml-4 text-xl font-light text-gray-600 xs:text-lg">
          <GoCommandPalette size={25} className="mr-2 inline-block" />
          노트 작성: jinyeong jang.
        </p>

        <div className="my-2 flex w-full max-w-[600px] items-center justify-between" />
        <div className="flex gap-2">
          <div className="mb-2 ml-2 flex flex-wrap items-center">
            {categories.map((category, index) => (
              <button
                key={index}
                type="button"
                className={`mr-2 h-[35px] rounded-2xl px-4 text-white transition-transform duration-200 ease-in-out xs:px-3 ${selectedBoard === category.category ? 'bg-[#273e55]' : 'bg-[#7190aa]'} hover:scale-105 hover:bg-[#3759a3] hover:underline active:scale-90 active:bg-[#22436e]`}
                onClick={() => setSelectedBoard(category.category)}>
                {category.category}
              </button>
            ))}
          </div>
        </div>
        <div className="w-max-full mt-[10px] flex flex-col items-center justify-center overflow-auto rounded-xl">
          {filteredBoardList.map((item) => {
            if (!item) return null;
            return (
              <UpdateCard
                key={item.uuid}
                id={item.uuid}
                category={item.category_name}
                title={item.title}
                content={item.content}
                description={item.description}
                createdAt={item.created_at}
                image_url={item.image_url}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UpdateNote;

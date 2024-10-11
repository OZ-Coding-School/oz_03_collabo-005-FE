interface ThunderMessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const ThunderMessageInput = ({ message, setMessage, handleSendMessage, handleKeyPress }: ThunderMessageInputProps) => {
  return (
    <div className="flex w-full max-w-[1000px] items-center bg-white p-4">
      <div className="flex flex-1 items-center rounded-md border border-gray-300">
        <input
          type="text"
          placeholder="메시지를 입력해주세요"
          className="flex-1 rounded-l-md px-3 py-2 xs:w-[150px]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button className="mr-2 p-2" onClick={handleSendMessage}>
          <img src="/images/ThunderChatSend.svg" alt="Send" width={24} height={24} />
        </button>
      </div>
    </div>
  );
};

export default ThunderMessageInput;

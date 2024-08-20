import React, { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop, convertToPixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ModalProps {
  preview: string;
  modalClose: () => void;
  handleCroppedImageToWebp: (file: File) => void;
  originalFileName: string;
}

const ProfileModal: React.FC<ModalProps> = ({ preview, modalClose, handleCroppedImageToWebp, originalFileName }) => {
  // 자르기 영역 (퍼센트)
  const [crop, setCrop] = useState<Crop>();
  // 자르기 완료했을 때 최종 영역 (픽셀)
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  // 이미지가 로드 됐을 때 실행 될 함수. 화면에 crop 영역을 표기함.
  const onImageLoadToCrop = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // 이미지의 크기 담기 -> 자르기 계산할 때 사용
    const { width, height } = e.currentTarget;
    // 이미지의 중앙에서 시작함
    const crop = centerCrop(
      // 특정 비율로 자르기 실행 -> 아래에서 1임으로 정사각형으로 자르는데, width, height를 기준으로 계산된 정사각형이 만들어 질 것
      makeAspectCrop(
        // 이 객체는 첫 영역을 설정함. 이미지 너비의 90%를 차지하도록 시작함. 그런데 너비가 길이보다 더 길면 그냥 꽉 차버림. (정사각형을 유지해야해서 너비를 넘길 수 없기 때문에)
        {
          unit: '%',
          width: 90,
        },
        //makeAspecrCrop이 계산하는데 사용 될 너비와 높이
        1,
        width,
        height,
      ),
      // centerCrop이 중앙에 배치되기 위해 사용할 너비와 높이
      width,
      height,
    );
    // ReactCrop 컴포넌트에 전달해야 화면상에 crop의 변동 내역이 표기될 것.
    setCrop(crop);
    // crop의 정보를 기준으로 픽셀단위로 변환하여 최종 자르기 설정을 완료함.
    setCompletedCrop(convertToPixelCrop(crop, width, height));
  };

  // 비율과 픽셀로 계산된 이미지를 실제로 자르는 함수, 이미지와 crop된 픽셀 정보를 받아서, formData로 전송하기 위한 blob형태로 반환
  const executeImageCrop = (image: HTMLImageElement, completedCrop: PixelCrop): Promise<Blob> => {
    // canvus는 애니메이션, 게임그래픽, 데이터 시각화, 사진 조작 및 실시간 비디오 처리를 위해 사용되는 엘리먼트
    const canvas = document.createElement('canvas');
    // 이미지의 원본 크기와 화면에 렌더링된 크기의 비율을 계산하여 자르기 영역을 원본 이미지 크기에 맞게 조정하는데 사용
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    // 캔버스 크기 설정. 자르기 영역에 따라서 캔버스의 높이와 너비를 설정하는데, 원본 이미지의 크기 비율을 고려함.(이거 안하면 이미지 화질 깨짐)
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    // 캔버스에는 2d가 그려질 것. 느낌표는 type 검사는 생략한다! 복잡함!
    const context = canvas.getContext('2d')!;
    // 캔버스에 그릴 이미지
    // 2,3 -> 원본 이미지에서 그리기 시작할 부분. 스케일을 반영하여 원본 이미지에서의 정확한 위치부터 시작.
    // 4,5 -> 시작점부터 그려질 이미지의 크기
    // 6,7 -> 캔버스 자체에서는 0,0 즉 왼쪽 위 끝부터 그리기 시작함
    // 8,9 -> 자른 이미지를 캔버스에 그릴 때 사용할 크기
    context.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height,
    );
    // 캔버스에 그려진 이미지를 Bolb으로 전환하여 반환함.
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob!));
    });
  };

  const handleUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (imgRef.current && completedCrop) {
      const croppedImageBlob = await executeImageCrop(imgRef.current, completedCrop);
      // 원본 파일의 타입을 그대로 사용
      const originalFileType = imgRef.current.src.split(';')[0].split(':')[1];
      const newFileName = `cropped-${originalFileName}`;
      const croppedImageFile = new File([croppedImageBlob], newFileName, {
        type: originalFileType, // 원본 파일의 타입을 사용
      });
      handleCroppedImageToWebp(croppedImageFile);
      modalClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-[1rem]">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold">프로필 이미지 편집</h2>
        <div className="mb-4 flex w-full items-center justify-center">
          <ReactCrop
            // 초기 crop 영역을 설정하는 상태값
            crop={crop}
            // 사용자가 자르기 영역을 변경할 때마다 호출되는 함수.
            // 'c'는 새로 계산된 픽셀 단위 자르기 영역, 'percentCrop'은 퍼센트 단위 자르기 영역입니다.
            onChange={(c, percentCrop) => {
              // 퍼센트 단위의 자르기 영역을 상태로 업데이트
              setCrop(percentCrop);
              // 픽셀 단위의 자르기 영역을 상태로 업데이트
              setCompletedCrop(c);
            }}
            // 사용자가 자르기를 완료했을 때 호출되는 함수.
            // 완료된 자르기 영역을 픽셀 단위로 상태에 저장
            onComplete={(c) => setCompletedCrop(c)}
            // 자르기 영역의 비율을 정사각형(1:1)으로 고정
            aspect={1}
            // 자르기 영역을 원형으로 변경 (하지만 결과물은 네모임 )
            circularCrop>
            {/* 자르기 대상이 되는 이미지. 이미지가 로드될 때 'onImageLoadToCrop' 함수 호출 */}
            <img
              ref={imgRef}
              src={preview}
              alt="profile preview"
              onLoad={onImageLoadToCrop}
              className="mx-auto block max-h-[400px] max-w-full"
            />
          </ReactCrop>
        </div>
        <div className="flex justify-end space-x-2">
          <button onClick={modalClose} className="rounded bg-[#F5E3DB] px-4 py-2 font-bold text-gray-800">
            취소
          </button>
          <button onClick={handleUpload} className="rounded bg-primary px-4 py-2 font-bold text-white">
            적용
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;

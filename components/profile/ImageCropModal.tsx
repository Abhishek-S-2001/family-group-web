'use client';

import Cropper from 'react-easy-crop';
import { useState } from 'react';
import { getCroppedImg } from '@/lib/cropImage';
import type { Area } from 'react-easy-crop';

interface ImageCropModalProps {
  image: string;
  type: 'avatar' | 'cover';
  onDone: (croppedBase64: string, type: 'avatar' | 'cover') => void;
  onCancel: () => void;
}

export default function ImageCropModal({ image, type, onDone, onCancel }: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    const cropped = await getCroppedImg(image, croppedAreaPixels);
    onDone(cropped, type);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-2xl h-[400px] bg-[#191c1e] rounded-3xl overflow-hidden shadow-2xl">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={type === 'avatar' ? 1 : 16 / 6}
          cropShape={type === 'avatar' ? 'round' : 'rect'}
          showGrid={false}
          onCropChange={setCrop}
          onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
          onZoomChange={setZoom}
        />
      </div>
      <div className="mt-8 flex gap-4">
        <button
          onClick={onCancel}
          className="px-8 py-3 rounded-full bg-white/10 text-white font-bold hover:bg-white/20 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-8 py-3 rounded-full bg-[#0434c6] text-white font-bold hover:bg-[#3050de] shadow-lg transition-all"
        >
          Save Crop
        </button>
      </div>
    </div>
  );
}
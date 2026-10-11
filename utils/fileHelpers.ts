export interface ProcessedImage {
  file: File;
  previewUrl: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

// export function handleFileInputChange(
//   e: React.ChangeEvent<HTMLInputElement>
// ): ProcessedImage | null {
//   const file = e.target.files?.[0];
//   if (!file) return null;

//   return {
//     file,
//     previewUrl: URL.createObjectURL(file),
//   };
// }

export function getCurrentPositionAsync(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error("Geolocation is not supported by your browser."));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
}
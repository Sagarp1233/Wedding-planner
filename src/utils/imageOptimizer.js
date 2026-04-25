/**
 * Pure HTML5 built-in image optimizer using Canvas API.
 * Resizes and converts images to lightweight WebP format before uploading.
 * This saves monumental amounts of bandwidth and storage on Supabase!
 */

export async function optimizeImage(file, { maxWidth = 1200, maxHeight = 1200, quality = 0.8, type = 'image/webp' } = {}) {
  // If the file is a GIF or SVG, don't attempt to compress/resize it on canvas (it'll break animations/vectors)
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') {
    return file; 
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio keeping max bounds
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round(Math.max((height *= maxWidth / width), 1));
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round(Math.max((width *= maxHeight / height), 1));
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Draw image over standard white background (removes transparent artifacts in JPEG)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob conversion failed'));
              return;
            }
            // Return the optimized Blob, retaining original file name context (though it'll be renamed on S3/Supabase)
            const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
              type: type,
              lastModified: Date.now(),
            });
            resolve(newFile);
          },
          type,
          quality
        );
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
}

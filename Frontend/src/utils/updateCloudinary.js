const upload_preset = import.meta.env.VITE_UPLOAD_PRESET;
const cloud_name = import.meta.env.VITE_CLOUD_NAME;

const uploadImageToCloudinary = async (file) => {
  const UploadData = new FormData();

  UploadData.append("file", file);
  UploadData.append("upload_preset", upload_preset); // Correct key (lowercase)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, // Ensure this is using https
    {
      method: "POST", // Correct method case
      body: UploadData,
    }
  );

  const data = await res.json();
  return data;
};

export default uploadImageToCloudinary;

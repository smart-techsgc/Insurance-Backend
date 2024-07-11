import QRCode from "qrcode";
import uploadFile from "./upload";

export const generateQR = async (text: any) => {
  try {
    let data = await QRCode.toDataURL(text);
    return await uploadFile(data, "mfa/qrcodes");
  } catch (err) {
    return err;
  }
};

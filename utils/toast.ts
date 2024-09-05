import { CircleDot } from "lucide-react";
import toast from "react-hot-toast";

const toastConfig = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

export const normalToast = (msg: string) => {
  toast(msg);
};

export const errorToast = (msg: string) => {
  toast.error(msg);
};

export const successToast = (msg: string) => {
  toast.success(msg);
};

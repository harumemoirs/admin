import axiosNewsLetter from "../../api/newsletter";


export interface AddNewsletterData {
  title: string;
  subject: string;
  body: string;
}

export const broadcastNewsletter = async (
  data: AddNewsletterData,
  image?: File
) => {
  try {
    const form = new FormData();

    form.append("title", data.title);
    form.append("subject", data.subject);
    form.append("body", data.body);

    if (image) {
      form.append("image", image);
    }

    const res = await axiosNewsLetter.post("/broadcast", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.status === 200) {
      return {
        success: true,
        message: "Newsletter queued successfully",
        queued: res.data?.queued,
      };
    }

    return {
      success: false,
      message: `Unexpected status code: ${res.status}`,
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const status = err?.response?.status;
    const msg = err?.response?.data?.message;

    if (status === 401) {
      return {
        success: false,
        message: "Session expired. Please login again.",
      };
    }

    return {
      success: false,
      message: msg || "Failed to broadcast newsletter",
    };
  }
};
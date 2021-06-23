import Swal from "sweetalert2";

export const handleError = (error) => {
  console.log(error.response);
  if (error.response) {
    if (error.response.status === 401) {
      Swal.fire({
        title: "Sorry 😞",
        text: "Your session has expired. ",
        type: "error",
      });
    } else {
      Swal.fire({
        title: "Sorry 😞",
        text: error.response.data.message,
        type: "error",
      });
    }
  } else {
    Swal.fire({
      title: "Sorry 😞",
      text:
        "Error. Please check your internet connection and make sure you correctly fill each field, and try again, thank you!.",
      type: "error",
    });
    // toast.error(`Network error. Please check your internet`, {
    //   position: toast.POSITION.TOP_RIGHT
    // });
  }

  return Promise.reject(error.response);
};

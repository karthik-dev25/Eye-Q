export const API_URL:string = "https://eye-doc-api.onrender.com/api"
// export const API_URL:string="http://10.0.2.2:8080/api"

export const pdfImages = [
  require('../assets/pdf_images/page_1.png'),
  require('../assets/pdf_images/page_2.png'),
  require('../assets/pdf_images/page_3.png'),
  require('../assets/pdf_images/page_4.png'),
  require('../assets/pdf_images/page_5.png'),
  require('../assets/pdf_images/page_6.png'),
  require('../assets/pdf_images/page_7.png'),
  require('../assets/pdf_images/page_8.png'),
  require('../assets/pdf_images/page_9.png'),
  require('../assets/pdf_images/page_10.png'),
  require('../assets/pdf_images/page_11.png'),
  require('../assets/pdf_images/page_12.png'),
  require('../assets/pdf_images/page_13.png'),
  require('../assets/pdf_images/page_14.png'),
  require('../assets/pdf_images/page_15.png'),
  require('../assets/pdf_images/page_16.png'),
  require('../assets/pdf_images/page_17.png'),
];

export const nvImages = {
  English: [
    require("../assets/nv_english/image_1.png"),
    require("../assets/nv_english/image_2.png"),
    require("../assets/nv_english/image_3.png"),
    require("../assets/nv_english/image_4.png"),
    require("../assets/nv_english/image_5.png"),
    require("../assets/nv_english/image_6.png"),
  ],
  Tamil: [
    require("../assets/nv_tamil/image_1.png"),
    require("../assets/nv_tamil/image_2.png"),
    require("../assets/nv_tamil/image_3.png"),
    require("../assets/nv_tamil/image_4.png"),
    require("../assets/nv_tamil/image_5.png"),
    require("../assets/nv_tamil/image_6.png"),
  ],
  Hindi: [
    require("../assets/nv_hindi/image_1.png"),
    require("../assets/nv_hindi/image_2.png"),
    require("../assets/nv_hindi/image_3.png"),
    require("../assets/nv_hindi/image_4.png"),
    require("../assets/nv_hindi/image_5.png"),
    require("../assets/nv_hindi/image_6.png"),
  ],
  Telugu: [
    require("../assets/nv_telugu/image_1.png"),
    require("../assets/nv_telugu/image_2.png"),
    require("../assets/nv_telugu/image_3.png"),
    require("../assets/nv_telugu/image_4.png"),
    require("../assets/nv_telugu/image_5.png"),
    require("../assets/nv_telugu/image_6.png"),
  ],
};


export const shuffleArray = (arr: string[]) => {
  let array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};


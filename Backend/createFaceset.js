const axios = require("axios");

const FACE_API_KEY = "_wg8ZGOjjpIcS19VkGVSlUccTfj-jzAy";
const FACE_API_SECRET = "YWcPxgq1-SHaZVHy-JkbtHgwOwLIX3-g";

axios.post("https://api-us.faceplusplus.com/facepp/v3/faceset/create", null, {
  params: {
    api_key: FACE_API_KEY,
    api_secret: FACE_API_SECRET,
    display_name: "TeaFactoryFaces"
  }
})
.then(res => console.log("FaceSet created:", res.data))
.catch(err => console.error(err.response?.data || err));

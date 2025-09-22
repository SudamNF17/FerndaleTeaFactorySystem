const Attendance = require("../Model/AttendanceModel");
const axios = require("axios");
const qs = require("qs"); // install with `npm install qs`


// Face++ credentials
const FACE_API_KEY = "_wg8ZGOjjpIcS19VkGVSlUccTfj-jzAy";
const FACE_API_SECRET = "YWcPxgq1-SHaZVHy-JkbtHgwOwLIX3-g";
const FACESET_TOKEN = "3b1ea42df1f0927670744a127d1a8ac7"; // create once via Face++ console

// Register employee face
exports.registerFace = async (req, res) => {
  try {
    const { empId, name, image } = req.body;
    if (!empId || !name || !image) return res.status(400).json({ message: "empId, name, image required" });

   const detectRes = await axios.post(
  "https://api-us.faceplusplus.com/facepp/v3/detect",
  qs.stringify({
    api_key: FACE_API_KEY,
    api_secret: FACE_API_SECRET,
    image_base64: image
  }),
  { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
);


    if (!detectRes.data.faces || detectRes.data.faces.length === 0)
      return res.status(400).json({ message: "No face detected" });

    const faceToken = detectRes.data.faces[0].face_token;

    await axios.post(
  "https://api-us.faceplusplus.com/facepp/v3/faceset/addface",
  qs.stringify({
    api_key: FACE_API_KEY,
    api_secret: FACE_API_SECRET,
    faceset_token: FACESET_TOKEN,
    face_tokens: faceToken
  }),
  { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
);


    // Save employee
    const newEmployee = new Attendance({ empId, name, faceToken });
    await newEmployee.save();

    res.json({ message: `Employee ${name} registered successfully with face.` });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ message: "Error registering employee face" });
  }
};

// Mark attendance via face
exports.markAttendance = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ message: "Image required" });

    const searchRes = await axios.post(
  "https://api-us.faceplusplus.com/facepp/v3/search",
  qs.stringify({
    api_key: FACE_API_KEY,
    api_secret: FACE_API_SECRET,
    image_base64: image,
    faceset_token: FACESET_TOKEN
  }),
  { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
);


    if (!searchRes.data.results || searchRes.data.results.length === 0)
      return res.status(400).json({ message: "No matching face found" });

    const bestMatch = searchRes.data.results[0];
    if (bestMatch.confidence < 70) return res.status(400).json({ message: "Face not recognized" });

    // Find employee
    const employee = await Attendance.findOne({ faceToken: bestMatch.face_token });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    // Add attendance log
    employee.logs.push({ status: "Present" });
    await employee.save();

    res.json({ message: `Attendance marked for ${employee.name} (ID: ${employee.empId})` });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ message: "Error marking attendance" });
  }
};

// Get all attendance logs
exports.getAttendance = async (req, res) => {
  try {
    const employees = await Attendance.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

// ===== Logging Helper =====
function log(message) {
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] ${message}`);
}

// ===== Multer Storage Config =====
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const fileName = Date.now() + ".png";
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

// ===== Upload API =====
app.post("/upload", upload.single("photo"), (req, res) => {

    if (!req.file) {
        log("No file received");
        return res.status(400).json({ message: "No photo uploaded" });
    }

    log(`Photo received → ${req.file.filename}`);

    res.json({
        status: "success",
        file: req.file.filename
    });
});

// ===== Health API =====
app.get("/", (req, res) => {
    res.send("Cyber Demo Server Running");
});

// ===== Start Server =====
const PORT = 5000;
// ===== Get All Uploaded Photos =====
app.get("/photos", (req, res) => {

    const dir = "uploads";

    fs.readdir(dir, (err, files) => {

        if (err) {
            log("Error reading uploads folder");
            return res.status(500).json({ error: "Cannot read folder" });
        }

        // latest first
        files.sort().reverse();

        res.json(files);
    });

});

// ===== Static Folder Access =====
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
    log(`Server started on port ${PORT}`);
});
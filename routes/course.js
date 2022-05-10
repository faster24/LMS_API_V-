require("dotenv").config();
const path = require("path");
const fs = require("fs");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const ScormCloud = require("@rusticisoftware/scormcloud-api-v2-client-javascript");
const Registration = require("../models/Registration");
const User = require("../models/User");

const APP_NORMAL = ScormCloud.ApiClient.instance.authentications["APP_NORMAL"];
APP_NORMAL.username = process.env.APP_ID;
APP_NORMAL.password = process.env.APP_PASSWORD;

const DIR = path.resolve(__dirname, "../upload");
const courseApi = new ScormCloud.CourseApi();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname;
    cb(null, fileName);
  },
});

var upload = multer({
  storage: storage,
});

router.post(
  "/create",
  upload.single("courseFile"),
  async (req, res, callback) => {
    const courseId = req.body.courseId;
    console.log(req.body.courseId);

    const filePath = DIR + "/" + req.file.filename;

    const courseFile = fs.createReadStream(filePath);

    try {
      const createCourse = courseApi.createUploadAndImportCourseJob(
        courseId,
        {
          file: courseFile,
        },
        (error, data) => {
          if (error) {
            res.status(409).json({ error: error.response.text });
          } else {
            const deleteFile = fs.unlinkSync(filePath);
            res.status(201).json({ message: "Successfully Created" });
          }
        }
      );
    } catch (e) {
      res.status(500).json(e.message);
    }
  }
);

router.get("/all", async (req, res) => {
  try {
    const getCourses = courseApi.getCourses( {more: null} , (error, data) => {
      if (error) {
        res.status(409).json(error.response.text);
      }

      res.status(200).json({ data: data });
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/course/:id", async (req, res) => {
  const courseId = req.params.id;

  try {
    const course = courseApi.getCourse(
      courseId,
      { more: null },
      (error, data) => {
        if (error) {
          res.status(409).json(error);
        }

        res.status(200).json({ data: data });
      }
    );
  } catch (error) {
    console.log(error);
  }
});

router.post("/register", async (req, res) => {
  const registrationApi = new ScormCloud.RegistrationApi();

  const newRegistration = new Registration({
    courseId: req.body.courseId,
    learnerId: req.body.learnerId,
  });

  try {
    const savedRegistration = await newRegistration.save();

    const learner = await User.findOne({ _id: savedRegistration.learnerId });

    const learnerId = {
      id: learner._id,
      firstname: learner.firstname,
      lastname: learner.lastname,
      email: learner.email,
    };

    const registration = {
      courseId: savedRegistration.courseId,
      registrationId: savedRegistration._id,
      learner: learnerId,
    };

    registrationApi.createRegistration(registration, {}, (error) => {
      if (error) {
        return res.json(error);
      }

      const settings = { redirectOnExitUrl: "Message" };
      registrationApi.buildRegistrationLaunchLink(
        registration.registrationId,
        settings,
        (error, data) => {
          if (error) {
            res.json(error);
          }

          return res.json(data.launchLink);
        }
      );
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;

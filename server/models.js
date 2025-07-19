const mongoose = require("mongoose");

const JDModel = mongoose.model("JD", new mongoose.Schema({
  name: String,
  filePath: String,
  content: String,
}), 'jds'); // ✅ explicit collection name

const CVModel = mongoose.model("CV", new mongoose.Schema({
  name: String,
  filePath: String,
  content: String,
}), 'cvs'); // ✅ explicit collection name

const HRAnswerSchema = new mongoose.Schema({
  cvId: { type: mongoose.Schema.Types.ObjectId, ref: "CV", required: true },
  relocate: String,
  workHours: String,
  salaryExpectation: String,
  noticePeriod: String,
  remotePreference: String,
  employmentType: String,
  expectedJoining: String,
  workFromOffice: String,
  preferredLocation: String,
  careerGoal: String,
  certifications: String,
  teamOrSolo: String,
  strengths: String,
  weaknesses: String,
  longTermAvailability: String,
}, { timestamps: true });

const HRAnswerModel = mongoose.model("HRAnswer", HRAnswerSchema, 'hranswers'); // ✅ force correct collection


const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const UserModel = mongoose.model("User", UserSchema, "users");

module.exports = {
  JDModel,
  CVModel,
  HRAnswerModel,
  UserModel
};

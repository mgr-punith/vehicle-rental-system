import pkg from "jsonwebtoken";
const { sign } = pkg;

const generateToken = (id) => {
  return sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export default generateToken;

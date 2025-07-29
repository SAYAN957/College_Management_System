import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    console.log("Auth middleware called");
    console.log("Headers:", req.headers);
    
    // Check if Authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log("No Authorization header found");
      return res.status(401).json({ message: "No authentication token, authorization denied" });
    }
    
    console.log("Authorization header:", authHeader);
    
    // Safely extract the token
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      console.log("Invalid Authorization header format");
      return res.status(401).json({ message: "Authorization format should be 'Bearer [token]'" });
    }
    
    const token = parts[1];
    if (!token) {
      console.log("No token found in Authorization header");
      return res.status(401).json({ message: "No authentication token, authorization denied" });
    }
    
    // Verify the token
    const decodedData = jwt.verify(token, "sEcReT");
    console.log("Decoded token:", decodedData);
    
    req.userId = decodedData.id;
    next();
  } catch (error) {
    console.log("Auth middleware error:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default auth;
import { NextRequest } from "next/server";
import { FirebaseConfiguration } from "../../db/firebase-configuration";
import { doc, query, where } from "firebase/firestore";

export async function POST(request: NextRequest) {
    const { user_id } = await request.json();
    doc(FirebaseConfiguration.USER, user_id);

    // const { firebaseToken } = await request.json();

    // if (!firebaseToken) {
    //     return makeErrorResponse("Missing Firebase token", 400);
    // }
  
    // try {
    //   // Verify Firebase Auth token
    //   const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    //   const userId = decodedToken.uid;
  
    //   // Get user role (assuming stored in custom claims or database)
    //   const userRecord = await admin.auth().getUser(userId);
    //   const role = userRecord.customClaims?.role || "customer"; // Default to "customer"
  
    //   // Generate custom JWT
    //   const jwtToken = jwt.sign(
    //     { userId, role },
    //     process.env.JWT_SECRET, // Your secret key
    //     { expiresIn: "1d" }
    //   );
  
    //   res.json({ jwtToken });
    // } catch (error) {
    //   res.status(401).json({ error: "Invalid token", details: error.message });
    // }
}
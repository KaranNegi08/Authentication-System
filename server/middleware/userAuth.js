import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const  token  = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized not found....' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.id) {
            req.user = { id: decoded.id }; 
           
        } else {
            return res.status(401).json({ message: 'Unauthorized. Login again' });
        }
        next();
    } catch (error) {
        console.error("JWT verify failed:", error);
    return res.status(401).json({ 
        message: 'Unauthorized after token verification', 
        error: error.message 
    });
    }
}

export default userAuth;

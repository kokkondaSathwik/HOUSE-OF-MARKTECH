import jwt from "jsonwebtoken"
import type { NextRequest } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"

interface DecodedToken {
  id: string
  isAdmin: boolean
  iat: number
  exp: number
}

export async function verifyToken(req: NextRequest | Request) {
  try {
    const authHeader = req.headers.get("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken

    return decoded
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

export function isAdmin(user: DecodedToken | null) {
  return user && user.isAdmin === true
}


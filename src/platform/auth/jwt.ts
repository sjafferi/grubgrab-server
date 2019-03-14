import Error from "@platform/common/errors";
import fs from "fs";
import jwt from "jsonwebtoken";

class Jwt {
  private PUBLIC_KEY: Buffer;
  private PRIVATE_KEY: Buffer;

  private JWT_TTL = 7;
  constructor() {
    this.PUBLIC_KEY = fs.readFileSync(".keys/grubgrab.pub");
    this.PRIVATE_KEY = fs.readFileSync(".keys/grubgrab");

    if (!this.PUBLIC_KEY || !this.PRIVATE_KEY) {
      throw new Error.UnauthorizedAccessError(
        "Make sure you have public and private keys"
      );
    }
  }

  sign = (decodedJwt: any) => {
    return new Promise((resolve, reject) =>
      jwt.sign(
        decodedJwt,
        this.PRIVATE_KEY,
        {
          algorithm: "RS256",
          expiresIn: `${this.JWT_TTL} days`
        },
        (err, encodedJwt) => {
          if (err) {
            reject(new Error.UnauthorizedAccessError(err.message));
          } else {
            resolve(encodedJwt);
          }
        }
      )
    );
  };

  verify = (token: any) => {
    const encodedJwt = this.decodeKey(token);
    return new Promise((resolve, reject) =>
      jwt.verify(
        encodedJwt,
        this.PUBLIC_KEY,
        {
          algorithms: ["RS256"]
        },
        (err, decodedJwt) => {
          if (err) {
            reject(new Error.UnauthorizedAccessError(err.message));
          } else {
            resolve(decodedJwt);
          }
        }
      )
    );
  };

  generate = async (payload: any) => {
    const buff = await this.sign(payload);
    return this.encodeKey(buff as any);
  };

  private encodeKey = (key: ArrayBuffer) => {
    return Buffer.from(key).toString();
  };

  private decodeKey = (key: Buffer) => {
    return Buffer.from(key).toString("ascii");
  };

  get publicKey() {
    return this.PUBLIC_KEY;
  }
}

const instance = new Jwt();
Object.freeze(instance);

export default instance;

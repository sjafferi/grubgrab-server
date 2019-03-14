import { IUser } from "@platform/data";

interface IParams {
  user: IUser;
}

export default class Context {
  user: IUser;

  constructor(params: IParams) {
    this.user = params.user;
  }
}

import { IUser } from "@platform/data";

interface IParams {
  user: IUser;
}

export default class Context {
  _user: IUser;

  constructor(params: IParams) {
    this._user = params.user;
  }
}

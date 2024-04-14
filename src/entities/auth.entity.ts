
export type AuthProps = {
    _id?: number;
    email: string;
    password: string;
  };
  
  export class Auth {
    public _id?: number;
    public email: string;
    public password: string;
  
    constructor({ _id, email, password }: AuthProps) {
      this._id = _id;
      this.email = email;
      this.password = password;
    }
  }
  
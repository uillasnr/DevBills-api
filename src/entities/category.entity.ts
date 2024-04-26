type CategoryProps = {
  _id?: string;
  userId: string;
  title: string;
  Icon: string;
  color: string;
};

export class Category {
  public _id?: string;
  public userId: string;
  public title: string;
  public Icon: string;
  public color: string;

  constructor({ _id, userId, title, Icon, color }: CategoryProps) {
    this._id = _id;
    this.userId = userId;
    this.title = title;
    this.Icon = Icon;
    this.color = color.toUpperCase();
  }
}

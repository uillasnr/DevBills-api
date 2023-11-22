type CategoryProps = {
  _id?: string;
  title: string;
  Icon: string;
  color: string;
};

export class Category {
  public _id?: string;
  public title: string;
  public Icon: string;
  public color: string;

  constructor({ _id, title, Icon, color }: CategoryProps) {
    this._id = _id;
    this.title = title;
    this.Icon = Icon;
    this.color = color.toUpperCase();
  }
}

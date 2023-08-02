class errHelper extends Error {
  public name: string;
  public message: string;
  constructor(type:string, message:string) {
    super(message);
    this.name = type;
    this.message = message;
  }
}

export default errHelper;
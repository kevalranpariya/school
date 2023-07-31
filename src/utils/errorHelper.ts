class errHelper extends Error {
  constructor(type:string, message:string) {
    super(message);
    this.name = type;
    this.message = message;
  }
}

export default errHelper;
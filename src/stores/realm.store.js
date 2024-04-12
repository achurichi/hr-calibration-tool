import { makeAutoObservable } from "mobx";

import * as Realm from "realm-web";

class RealmStore {
  rootStore;
  authenticated = false;
  app;
  mongoDB;

  constructor(root) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.rootStore = root;
  }

  async init(user, password) {
    try {
      const app = new Realm.App({ id: process.env.REACT_APP_REALM_APP_ID });
      if (user && password) {
        const credentials = Realm.Credentials.emailPassword(user, password);
        await app.logIn(credentials);
      }
      const mongoDB = app.currentUser
        .mongoClient(process.env.REACT_APP_REALM_CLUSTER_NAME)
        .db(process.env.REACT_APP_MONGO_DB);
      this.setApp(app);
      this.setMongoDB(mongoDB);
      this.setAuthenticated(true);
    } catch (e) {
      console.log("Error connecting to database: ", e);
    }
  }

  setAuthenticated(authenticated) {
    this.authenticated = authenticated;
  }

  getAuthenticated() {
    return this.authenticated;
  }

  setApp(app) {
    this.app = app;
  }

  getApp() {
    return this.app;
  }

  setMongoDB(mongoDB) {
    this.mongoDB = mongoDB;
  }

  getMongoDB() {
    return this.mongoDB;
  }

  async callFunction(functionName, ...args) {
    const { result, error } = await this.app.currentUser.callFunction(
      functionName,
      ...args,
    );
    if (error) {
      console.error(error);
      return null;
    }
    return JSON.parse(JSON.stringify(result));
  }
}

export default RealmStore;

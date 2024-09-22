import { makeAutoObservable } from "mobx";

import * as Realm from "realm-web";

import { STATUS_TYPES } from "constants/status";

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
    const requestStore = this.rootStore.requestStore;

    requestStore.setStatus(functionName, STATUS_TYPES.IN_PROGRESS);

    let response;
    try {
      response = await this.app.currentUser.callFunction(functionName, ...args);
    } catch (error) {
      requestStore.setStatus(functionName, STATUS_TYPES.ERROR, "API error");
      return null;
    }

    if (response?.error) {
      requestStore.setStatus(functionName, STATUS_TYPES.ERROR, response.error);
      return null;
    }

    requestStore.setStatus(functionName, STATUS_TYPES.SUCCESS);
    return response?.result
      ? JSON.parse(JSON.stringify(response.result))
      : null;
  }
}

export default RealmStore;

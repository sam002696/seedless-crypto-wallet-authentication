import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import sagas from "../sagas";
import ApiReducer from "./apiSlice";
import ToastAlertReducer from "./toastAlertSlice";
import ErrorMessageReducer from "./errorMessageSlice";
import NetworkReducer from "./networkSlice";

const sagaMiddleware = createSagaMiddleware();

export default configureStore({
  reducer: {
    api: ApiReducer,
    toastAlert: ToastAlertReducer,
    errorMessage: ErrorMessageReducer,
    network: NetworkReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(sagas);
